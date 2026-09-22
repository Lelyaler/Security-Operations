import React, { useState } from 'react';
import { Search, Info, Users, AlertCircle } from 'lucide-react';
import { mockGamesList } from '../utils/mockData';

export default function GamesView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState(mockGamesList[0]);

  const categories = ['All', 'Microservice', 'Gateway', 'Database', 'Caching', 'Backup', 'Load Balancer'];

  const filteredGames = mockGamesList.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          game.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="games-view animate-fade-in">
      <div className="games-controls glass-card">
        <div className="search-bar">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            placeholder="Search nodes or regions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map(cat => (
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

      <div className="games-content-layout">
        {/* Visual Cards Grid */}
        <div className="games-grid-container">
          <div className="games-cards-grid">
            {filteredGames.length > 0 ? (
              filteredGames.map(game => (
                <div 
                  key={game.id} 
                  onClick={() => setSelectedGame(game)}
                  className={`game-item-card glass-card ${selectedGame && selectedGame.id === game.id ? 'active' : ''}`}
                >
                  <div className="game-card-image-wrapper">
                    <img src={game.image} alt={game.name} className="game-card-img" loading="lazy" />
                    <span className="game-card-badge-floating">{game.category}</span>
                  </div>
                  
                  <div className="game-card-info">
                    <div className="game-card-header-row">
                      <h3 className="game-card-title">{game.name}</h3>
                      <span className="game-card-provider">{game.provider}</span>
                    </div>

                    <div className="game-card-stats-row">
                      <div className="card-stat">
                        <span className="card-stat-lbl">CPU Load</span>
                        <span className="card-stat-val text-primary">{game.rtp}</span>
                      </div>
                      <div className="card-stat">
                        <span className="card-stat-lbl">Threads</span>
                        <span className="card-stat-val text-accent" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <span className="status-dot bg-success" style={{ width: '6px', height: '6px', margin: 0 }}></span>
                          {game.activePlayers}
                        </span>
                      </div>
                      <div className="card-stat">
                        <span className="card-stat-lbl">Data Sent</span>
                        <span className="card-stat-val text-success">{game.ggr.toLocaleString()} GB</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results-box glass-card">
                <AlertCircle size={24} className="text-muted" />
                <p>No infrastructure nodes found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Game Sidebar details */}
        {selectedGame && (
          <div className="game-details-sidebar glass-card animate-slide-left">
            <h2 className="card-heading">Server Node Profile</h2>
            <div className="detail-hero-card">
              <img src={selectedGame.image} alt={selectedGame.name} className="detail-hero-img" loading="lazy" />
              <div className="detail-hero-info">
                <h3>{selectedGame.name}</h3>
                <span className="badge badge-success">{selectedGame.provider}</span>
              </div>
            </div>

            <div className="detail-stats-grid">
              <div className="detail-stat-card">
                <span className="stat-label">CPU Load</span>
                <span className="stat-val text-primary">{selectedGame.rtp}</span>
              </div>
              <div className="detail-stat-card">
                <span className="stat-label">Total Traffic</span>
                <span className="stat-val text-success">{selectedGame.ggr.toLocaleString()} GB</span>
              </div>
              <div className="detail-stat-card">
                <span className="stat-label">HTTP/TCP Requests</span>
                <span className="stat-val">{selectedGame.spins.toLocaleString()}</span>
              </div>
              <div className="detail-stat-card">
                <span className="stat-label">Avg Payload Size</span>
                <span className="stat-val">4.2 KB</span>
              </div>
            </div>

            <div className="detail-alert-box">
              <Info size={16} className="text-accent" />
              <p>Server load and error rates are within normal operational limits (+0.12% deviation).</p>
            </div>

            <div className="detail-charts-panel">
              <span className="panel-title">Active Threads (24h)</span>
              <div className="dummy-chart-placeholder">
                <Users size={24} className="text-primary animate-pulse" />
                <span className="text-muted">High connection density registered: {selectedGame.activePlayers} threads processing.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
