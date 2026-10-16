import { useState } from 'react';
import { Search, Server, Cpu, HardDrive, Network, Activity, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { mockInfrastructureNodes } from '../utils/mockData';
import type { InfrastructureNode } from '../types/security';

export default function InfrastructureView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedNode, setSelectedNode] = useState<InfrastructureNode>(mockInfrastructureNodes[0]);

  const categories = ['All', 'Microservice', 'Gateway', 'Database', 'Caching', 'Load Balancer', 'Backup'];

  const filteredNodes = mockInfrastructureNodes.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      node.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || node.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: InfrastructureNode['status']) => {
    switch (status) {
      case 'healthy':
        return <span className="badge badge-success"><CheckCircle size={12} /> Healthy</span>;
      case 'warning':
        return <span className="badge badge-warning"><AlertTriangle size={12} /> Elevated Load</span>;
      case 'degraded':
        return <span className="badge badge-danger"><AlertTriangle size={12} /> Degraded</span>;
      default:
        return <span className="badge badge-subtle">{status}</span>;
    }
  };

  return (
    <div className="infrastructure-view animate-fade-in">
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

        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="infra-content-layout">
        <div className="infra-grid-container">
          <div className="infra-nodes-grid">
            {filteredNodes.length > 0 ? (
              filteredNodes.map((node) => {
                const isSelected = selectedNode && selectedNode.id === node.id;
                const cpuVal = parseFloat(node.cpuLoad);
                return (
                  <div 
                    key={node.id} 
                    onClick={() => setSelectedNode(node)}
                    className={`node-card card ${isSelected ? 'active' : ''}`}
                  >
                    <div className="node-card-header">
                      <div className="node-title-group">
                        <div className="node-icon-box">
                          <Server size={18} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="node-hostname">{node.name}</h3>
                          <span className="node-ip text-muted font-mono">{node.ipAddress}</span>
                        </div>
                      </div>
                      <div className="node-badge-group">
                        <span className="region-tag font-mono">{node.region}</span>
                        {getStatusBadge(node.status)}
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
                          <span className="footer-stat-val font-mono">{node.requestsPerSec.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-results-box card">
                <AlertTriangle size={24} className="text-muted" />
                <p>No infrastructure nodes found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>

        {selectedNode && (
          <div className="node-details-sidebar card">
            <div className="sidebar-heading-row">
              <h2 className="card-heading">Node Telemetry</h2>
              <span className="uptime-pill font-mono">Uptime: {selectedNode.uptime}</span>
            </div>

            <div className="node-profile-header">
              <div className="node-profile-icon">
                <Server size={24} className="text-primary" />
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
                <span className="stat-val font-mono">{selectedNode.requestsPerSec.toLocaleString()} req/s</span>
                <span className="stat-hint text-muted">Live request cycle</span>
              </div>
            </div>

            <div className="health-check-card">
              <ShieldCheck size={18} className="text-success" />
              <div>
                <p className="health-title">Service Health Verified</p>
                <p className="health-desc">TLS certificates, container daemons, and storage endpoints are fully operational.</p>
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
