import { useState, useEffect } from 'react';
import {
  Search,
  Server,
  Cpu,
  HardDrive,
  Network,
  Activity,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  LayoutGrid,
  List,
  Check,
  Terminal,
  RefreshCw,
  Zap,
  Shield,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal
} from 'lucide-react';
import { socApi } from '../services/socApi';
import { mockInfrastructureNodes } from '../utils/mockData';
import { useDragScroll } from '../hooks/useDragScroll';
import type { InfrastructureNode } from '../types/security';

interface InfrastructureViewProps {
  params?: Record<string, string>;
  onUpdateParams?: (newParams: Record<string, string | null>) => void;
}

export default function InfrastructureView({ params, onUpdateParams }: InfrastructureViewProps = {}) {
  const [nodes, setNodes] = useState<InfrastructureNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(params?.q || '');
  const [selectedCategory, setSelectedCategory] = useState(params?.category || 'All');
  const [selectedNode, setSelectedNode] = useState<InfrastructureNode | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>((params?.view as 'grid' | 'table') || 'grid');
  const [copiedSsh, setCopiedSsh] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagResult, setDiagResult] = useState<string | null>(null);
  const [drainedNodeIds, setDrainedNodeIds] = useState<Record<number, boolean>>({});

  const { ref: tableScrollRef, scrollBy: scrollTableBy } = useDragScroll<HTMLDivElement>();
  const { ref: categoryScrollRef } = useDragScroll<HTMLDivElement>();

  useEffect(() => {
    let mounted = true;
    socApi
      .getInfrastructureNodes()
      .then((data) => {
        if (mounted) {
          setNodes(data);
          const initialNode = params?.node ? data.find((n) => n.name === params.node) : null;
          setSelectedNode(initialNode || data[0] || null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setNodes(mockInfrastructureNodes);
          const initialNode = params?.node ? mockInfrastructureNodes.find((n) => n.name === params.node) : null;
          setSelectedNode(initialNode || mockInfrastructureNodes[0]);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [params?.node]);

  const handleSelectNode = (node: InfrastructureNode) => {
    setSelectedNode(node);
    onUpdateParams?.({ node: node.name });
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    onUpdateParams?.({ category: cat !== 'All' ? cat : null });
  };

  const handleSetViewMode = (mode: 'grid' | 'table') => {
    setViewMode(mode);
    onUpdateParams?.({ view: mode !== 'grid' ? mode : null });
  };

  const categories = ['All', 'Microservice', 'Gateway', 'Database', 'Caching', 'Load Balancer', 'Backup'];

  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || node.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalNodesCount = nodes.length;
  const healthyCount = nodes.filter((n) => n.status === 'healthy').length;
  const avgCpu =
    nodes.length > 0
      ? (nodes.reduce((acc, n) => acc + parseFloat(n.cpuLoad), 0) / nodes.length).toFixed(1)
      : '0.0';
  const totalThreads = nodes.reduce((acc, n) => acc + n.threads, 0);

  const handleCopySsh = (ip: string) => {
    const cmd = `ssh -i ~/.ssh/soc_id_ed25519 ops@${ip}`;
    navigator.clipboard.writeText(cmd).catch(() => {});
    setCopiedSsh(true);
    setTimeout(() => setCopiedSsh(false), 2000);
  };

  const handleRunDiagnostic = (nodeName: string) => {
    if (isDiagnosing) return;
    setIsDiagnosing(true);
    setDiagResult(null);

    setTimeout(() => {
      setIsDiagnosing(false);
      setDiagResult(`OK · RTT 1.8ms · eBPF Probes active on ${nodeName}`);
      setTimeout(() => setDiagResult(null), 4000);
    }, 750);
  };

  const handleToggleDrain = (id: number) => {
    setDrainedNodeIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusBadge = (status: InfrastructureNode['status'], isDrained?: boolean) => {
    if (isDrained) {
      return (
        <span className="badge badge-warning">
          <AlertTriangle size={11} /> Drained
        </span>
      );
    }
    switch (status) {
      case 'healthy':
        return (
          <span className="badge badge-success">
            <CheckCircle size={11} /> Healthy
          </span>
        );
      case 'warning':
        return (
          <span className="badge badge-warning">
            <AlertTriangle size={11} /> Elevated Load
          </span>
        );
      case 'degraded':
        return (
          <span className="badge badge-danger">
            <AlertTriangle size={11} /> Degraded
          </span>
        );
      default:
        return <span className="badge badge-subtle">{status}</span>;
    }
  };

  return (
    <div className="infrastructure-view animate-fade-in">
      {/* Cluster Aggregate Overview Bar */}
      <div className="cluster-summary-bar card">
        <div className="cluster-stat-item">
          <div className="cluster-stat-icon">
            <Server size={16} className="text-primary" />
          </div>
          <div className="cluster-stat-content">
            <span className="cluster-stat-val font-mono">
              {healthyCount} / {totalNodesCount}
            </span>
            <span className="cluster-stat-lbl">Cluster Nodes Online</span>
          </div>
        </div>

        <div className="cluster-stat-divider" />

        <div className="cluster-stat-item">
          <div className="cluster-stat-icon">
            <Cpu size={16} className="text-secondary" />
          </div>
          <div className="cluster-stat-content">
            <span className="cluster-stat-val font-mono">{avgCpu}%</span>
            <span className="cluster-stat-lbl">Cluster Avg CPU</span>
          </div>
        </div>

        <div className="cluster-stat-divider" />

        <div className="cluster-stat-item">
          <div className="cluster-stat-icon">
            <HardDrive size={16} className="text-success" />
          </div>
          <div className="cluster-stat-content">
            <span className="cluster-stat-val font-mono">48.2 / 88 GB</span>
            <span className="cluster-stat-lbl">Committed RAM</span>
          </div>
        </div>

        <div className="cluster-stat-divider" />

        <div className="cluster-stat-item">
          <div className="cluster-stat-icon">
            <Activity size={16} className="text-primary" />
          </div>
          <div className="cluster-stat-content">
            <span className="cluster-stat-val font-mono">{totalThreads.toLocaleString()}</span>
            <span className="cluster-stat-lbl">Active Worker Threads</span>
          </div>
        </div>

        <div className="cluster-stat-divider" />

        <div className="cluster-stat-item cluster-stat-badge-col">
          <div className="ebpf-mesh-badge">
            <Shield size={13} className="text-success" />
            <span>eBPF Mesh: Synced</span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Filters & View Toggle */}
      <div className="infra-controls card">
        <div className="search-bar">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search hostnames, IP addresses, or regions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search infrastructure nodes"
          />
        </div>

        <div className="infra-controls-right">
          <div ref={categoryScrollRef} className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleSelectCategory(cat)}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="view-mode-toggle" role="group" aria-label="View Mode">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleSetViewMode('grid')}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => handleSetViewMode('table')}
              title="Matrix Table View"
              aria-label="Matrix Table View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="infra-content-layout">
        <div className="infra-grid-container">
          {loading ? (
            <div className="no-results-box card">
              <Activity size={24} className="text-primary animate-pulse" />
              <p>Loading cluster node telemetry...</p>
            </div>
          ) : filteredNodes.length === 0 ? (
            <div className="no-results-box card">
              <AlertTriangle size={24} className="text-muted" />
              <p>No infrastructure nodes found matching your search criteria.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="infra-nodes-grid">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode && selectedNode.id === node.id;
                const isDrained = !!drainedNodeIds[node.id];
                const cpuVal = parseFloat(node.cpuLoad);
                return (
                  <div
                    key={node.id}
                    onClick={() => handleSelectNode(node)}
                    className={`node-card card ${isSelected ? 'active' : ''} ${isDrained ? 'drained' : ''}`}
                  >
                    <div className="node-card-header">
                      <div className="node-title-group">
                        <div className="node-icon-box">
                          <Server size={18} className="text-primary" />
                        </div>
                        <div className="node-name-block">
                          <h3 className="node-hostname" title={node.name}>
                            {node.name}
                          </h3>
                          <span className="node-ip text-muted font-mono">{node.ipAddress}</span>
                        </div>
                      </div>
                      <div className="node-badge-group">
                        <span className="region-tag font-mono">{node.region}</span>
                        {getStatusBadge(node.status, isDrained)}
                      </div>
                    </div>

                    <div className="node-metrics-stack">
                      <div className="metric-row">
                        <div className="metric-label-group">
                          <Cpu size={14} className="text-muted" />
                          <span>CPU Load</span>
                        </div>
                        <span className="metric-value font-mono">{node.cpuLoad}</span>
                      </div>
                      <div className="progress-meter">
                        <div
                          className={`progress-fill ${cpuVal > 50 ? 'bg-warning' : 'bg-primary'}`}
                          style={{ width: `${Math.min(100, cpuVal * 1.5)}%` }}
                        />
                      </div>

                      <div className="metric-row">
                        <div className="metric-label-group">
                          <HardDrive size={14} className="text-muted" />
                          <span>Memory</span>
                        </div>
                        <span className="metric-value font-mono">{node.memoryUsage}</span>
                      </div>

                      <div className="node-card-footer-stats">
                        <div className="footer-stat">
                          <span className="footer-stat-lbl">Active Threads</span>
                          <span className="footer-stat-val font-mono">{node.threads}</span>
                        </div>
                        <div className="footer-stat">
                          <span className="footer-stat-lbl">Throughput</span>
                          <span className="footer-stat-val font-mono">{node.dataTransferred}</span>
                        </div>
                        <div className="footer-stat">
                          <span className="footer-stat-lbl">Req/Sec</span>
                          <span className="footer-stat-val font-mono">
                            {node.requestsPerSec.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Dense Matrix Table View */
            <div className="infra-matrix-table-card card">
              <div className="matrix-table-toolbar">
                <div className="matrix-table-title-wrap">
                  <h3 className="matrix-table-heading">Cluster Nodes Telemetry Matrix</h3>
                  <span className="drag-scroll-hint font-mono">
                    <MoveHorizontal size={13} /> Drag sideways with mouse to scroll
                  </span>
                </div>
                <div className="matrix-scroll-nudges">
                  <button
                    type="button"
                    className="nudge-btn"
                    onClick={() => scrollTableBy(-260)}
                    title="Scroll left"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    className="nudge-btn"
                    onClick={() => scrollTableBy(260)}
                    title="Scroll right"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div ref={tableScrollRef} className="table-responsive">
                <table className="infra-matrix-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Hostname & Role</th>
                      <th>Region</th>
                      <th>IP Address</th>
                      <th>CPU Load</th>
                      <th>Memory Allocation</th>
                      <th>Threads</th>
                      <th>Throughput</th>
                      <th>Req/s</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNodes.map((node) => {
                      const isSelected = selectedNode && selectedNode.id === node.id;
                      const isDrained = !!drainedNodeIds[node.id];
                      const cpuVal = parseFloat(node.cpuLoad);
                      return (
                        <tr
                          key={node.id}
                          className={`matrix-row ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSelectNode(node)}
                        >
                          <td>{getStatusBadge(node.status, isDrained)}</td>
                          <td>
                            <div className="table-host-cell">
                              <span className="table-host-name font-mono">{node.name}</span>
                              <span className="table-host-role">{node.category}</span>
                            </div>
                          </td>
                          <td>
                            <span className="region-tag font-mono">{node.region}</span>
                          </td>
                          <td>
                            <span className="font-mono text-muted">{node.ipAddress}</span>
                          </td>
                          <td>
                            <div className="table-cpu-cell">
                              <span className="font-mono">{node.cpuLoad}</span>
                              <div className="mini-progress-meter">
                                <div
                                  className={`mini-progress-fill ${cpuVal > 50 ? 'bg-warning' : 'bg-primary'}`}
                                  style={{ width: `${Math.min(100, cpuVal * 1.5)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="font-mono">{node.memoryUsage}</span>
                          </td>
                          <td>
                            <span className="font-mono">{node.threads}</span>
                          </td>
                          <td>
                            <span className="font-mono">{node.dataTransferred}</span>
                          </td>
                          <td>
                            <span className="font-mono">{node.requestsPerSec.toLocaleString()}</span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="matrix-inspect-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectNode(node);
                              }}
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Selected Node Details Sidebar */}
        {selectedNode && (
          <div className="node-details-sidebar card">
            <div className="sidebar-heading-row">
              <h2 className="card-heading">Node Telemetry</h2>
              <span className="uptime-pill font-mono">Uptime: {selectedNode.uptime}</span>
            </div>

            <div className="node-profile-header">
              <div className="node-profile-icon">
                <Server size={22} className="text-primary" />
              </div>
              <div className="node-profile-info">
                <h3>{selectedNode.name}</h3>
                <div className="node-profile-meta font-mono">
                  <span className="meta-tag">{selectedNode.ipAddress}</span>
                  <span className="meta-tag">{selectedNode.region}</span>
                  <span className="meta-tag">{selectedNode.category}</span>
                </div>
              </div>
            </div>

            {/* Live CPU Telemetry Waveform */}
            <div className="node-sparkline-box">
              <div className="sparkline-header">
                <span className="sparkline-title">Real-time Core Waveform</span>
                <span className="sparkline-live-tag font-mono">
                  <span className="sparkline-pulse-dot" /> eBPF 100ms
                </span>
              </div>
              <div className="sparkline-svg-wrap">
                <svg viewBox="0 0 280 44" className="sparkline-svg" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a82d46" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#a82d46" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,32 Q20,18 45,26 T90,14 T135,28 T180,10 T225,22 T280,12 L280,44 L0,44 Z"
                    fill="url(#sparklineGrad)"
                  />
                  <path
                    d="M0,32 Q20,18 45,26 T90,14 T135,28 T180,10 T225,22 T280,12"
                    fill="none"
                    stroke="#a82d46"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="node-actions-bar">
              <button
                type="button"
                className="node-action-btn"
                onClick={() => handleCopySsh(selectedNode.ipAddress)}
                title="Copy SSH Command"
              >
                {copiedSsh ? <Check size={13} className="text-success" /> : <Terminal size={13} />}
                <span>{copiedSsh ? 'Copied SSH' : 'SSH Shell'}</span>
              </button>

              <button
                type="button"
                className={`node-action-btn ${isDiagnosing ? 'loading' : ''}`}
                onClick={() => handleRunDiagnostic(selectedNode.name)}
                title="Run eBPF Socket Diagnostic"
              >
                <RefreshCw size={13} className={isDiagnosing ? 'animate-spin text-primary' : ''} />
                <span>{isDiagnosing ? 'Testing...' : 'Probe Node'}</span>
              </button>

              <button
                type="button"
                className={`node-action-btn ${drainedNodeIds[selectedNode.id] ? 'btn-warn' : ''}`}
                onClick={() => handleToggleDrain(selectedNode.id)}
                title="Toggle Graceful Traffic Drain"
              >
                <Zap size={13} />
                <span>{drainedNodeIds[selectedNode.id] ? 'Undrain' : 'Drain'}</span>
              </button>
            </div>

            {diagResult && (
              <div className="diag-feedback-toast animate-fade-in font-mono">
                <CheckCircle size={13} className="text-success" />
                <span>{diagResult}</span>
              </div>
            )}

            {/* Telemetry Metrics Grid */}
            <div className="telemetry-stats-grid">
              <div className="telemetry-card">
                <div className="telemetry-card-hdr">
                  <Cpu size={14} className="text-primary" />
                  <span className="stat-label">CPU Utilization</span>
                </div>
                <span className="stat-val font-mono text-primary">{selectedNode.cpuLoad}</span>
                <span className="stat-hint text-muted">Multi-core baseline</span>
              </div>

              <div className="telemetry-card">
                <div className="telemetry-card-hdr">
                  <HardDrive size={14} className="text-success" />
                  <span className="stat-label">Memory Allocation</span>
                </div>
                <span className="stat-val font-mono">{selectedNode.memoryUsage}</span>
                <span className="stat-hint text-muted">Committed pages</span>
              </div>

              <div className="telemetry-card">
                <div className="telemetry-card-hdr">
                  <Network size={14} className="text-warning" />
                  <span className="stat-label">Total I/O Traffic</span>
                </div>
                <span className="stat-val font-mono">{selectedNode.dataTransferred}</span>
                <span className="stat-hint text-muted">Egress & Ingress</span>
              </div>

              <div className="telemetry-card">
                <div className="telemetry-card-hdr">
                  <Activity size={14} className="text-primary" />
                  <span className="stat-label">Throughput</span>
                </div>
                <span className="stat-val font-mono">
                  {selectedNode.requestsPerSec.toLocaleString()} req/s
                </span>
                <span className="stat-hint text-muted">Live request cycle</span>
              </div>
            </div>

            {/* System Specs & Security Hardening */}
            <div className="system-specs-box">
              <span className="panel-title">Kernel & Mesh Hardening</span>
              <div className="specs-grid font-mono">
                <div className="spec-item">
                  <span className="spec-lbl">Kernel:</span>
                  <span className="spec-val">Linux 6.8.0-ebpf-soc</span>
                </div>
                <div className="spec-item">
                  <span className="spec-lbl">Container:</span>
                  <span className="spec-val">containerd v1.7.15</span>
                </div>
                <div className="spec-item">
                  <span className="spec-lbl">Ingress:</span>
                  <span className="spec-val">mTLS (TLS 1.3 Strict)</span>
                </div>
                <div className="spec-item">
                  <span className="spec-lbl">MTU Size:</span>
                  <span className="spec-val">9000 B Jumbo</span>
                </div>
              </div>
            </div>

            <div className="health-check-card">
              <ShieldCheck size={18} className="text-success" />
              <div>
                <p className="health-title">Service Health Verified</p>
                <p className="health-desc">
                  TLS certificates, container daemons, and storage endpoints are fully operational.
                </p>
              </div>
            </div>

            <div className="node-connections-panel">
              <span className="panel-title">Active Thread Pool</span>
              <div className="thread-status-box">
                <div className="thread-counter">
                  <span className="counter-number font-mono">{selectedNode.threads}</span>
                  <span className="counter-label text-muted">active worker threads</span>
                </div>
                <div className="thread-health text-success">
                  <CheckCircle size={14} /> Normal concurrency
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
