import { useRef, useEffect, useCallback } from 'react';

interface DragScrollOptions {
  active?: boolean;
}

export function useDragScroll<T extends HTMLElement = HTMLDivElement>(
  options: DragScrollOptions = {}
) {
  const { active = true } = options;
  const ref = useRef<T | null>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;

    el.classList.add('drag-scroll-enabled');

    const handleMouseDown = (e: MouseEvent) => {
      // Only drag on primary (left) mouse button
      if (e.button !== 0) return;

      // Do not initiate drag when interacting directly with form inputs, selects, or elements explicitly marked .no-drag
      const target = e.target as HTMLElement | null;
      if (target && target.closest('input, select, textarea, [contenteditable="true"], .no-drag')) {
        return;
      }

      isDownRef.current = true;
      hasDraggedRef.current = false;
      startXRef.current = e.clientX;
      scrollLeftRef.current = el.scrollLeft;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDownRef.current) return;

      const dx = e.clientX - startXRef.current;
      if (Math.abs(dx) > 3) {
        hasDraggedRef.current = true;
        el.scrollLeft = scrollLeftRef.current - dx;
        el.classList.add('is-dragging');
      }
    };

    const handleMouseUp = () => {
      if (!isDownRef.current) return;
      isDownRef.current = false;
      el.classList.remove('is-dragging');

      // Keep hasDraggedRef true for a short tick so the capture-phase click handler suppresses accidental clicks on dragged buttons
      if (hasDraggedRef.current) {
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 120);
      }
    };

    const handleClickCapture = (e: MouseEvent) => {
      if (hasDraggedRef.current) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    // Prevent HTML5 native ghost drag image from interrupting mousemove
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // Wheel event: map standard vertical mouse wheel to horizontal scroll when container is purely horizontal
    const handleWheel = (e: WheelEvent) => {
      if (e.shiftKey) return;
      const canScrollHorizontally = el.scrollWidth > el.clientWidth;
      const canScrollVertically = el.scrollHeight > el.clientHeight;

      if (canScrollHorizontally && !canScrollVertically && Math.abs(e.deltaY) > 0) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        el.scrollLeft += e.deltaX;
      }
    };

    el.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('click', handleClickCapture, true);
    el.addEventListener('dragstart', handleDragStart);
    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.classList.remove('drag-scroll-enabled', 'is-dragging');
      el.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('click', handleClickCapture, true);
      el.removeEventListener('dragstart', handleDragStart);
      el.removeEventListener('wheel', handleWheel);
    };
  }, [active]);

  const scrollBy = useCallback((distance: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  }, []);

  return { ref, scrollBy };
}
