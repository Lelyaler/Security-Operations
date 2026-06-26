import React, { useState } from 'react';
import { Search, Filter, Info, Users, Sparkles, AlertCircle } from 'lucide-react';
import { mockGamesList } from '../utils/mockData';

export default function GamesView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState(mockGamesList[0]);

  const categories = ['All', 'Slots', 'Live Casino', 'Table Games', 'Crash Games'];

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
            placeholder="Search games or providers..."
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
                    <img src={game.image} alt={game.name} className="game-card-img" />
                    <span className="game-card-badge-floating">{game.category}</span>
                  </div>
                  
                  <div className="game-card-info">
                    <div className="game-card-header-row">
                      <h4 className="game-card-title">{game.name}</h4>
                      <span className="game-card-provider">{game.provider}</span>
                    </div>

                    <div className="game-card-stats-row">
                      <div className="card-stat">
                        <span className="card-stat-lbl">RTP</span>
                        <span className="card-stat-val text-primary">{game.rtp}</span>
                      </div>
                      <div className="card-stat">
                        <span className="card-stat-lbl">Players</span>
                        <span className="card-stat-val text-accent" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <span className="status-dot bg-success" style={{ width: '6px', height: '6px', margin: 0 }}></span>
                          {game.activePlayers}
                        </span>
                      </div>
                      <div className="card-stat">
                        <span className="card-stat-lbl">GGR</span>
                        <span className="card-stat-val text-success">${game.ggr.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results-box glass-card">
                <AlertCircle size={24} className="text-muted" />
                <p>No games found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Game Sidebar details */}
        {selectedGame && (
          <div className="game-details-sidebar glass-card animate-slide-left">
            <h3 className="card-heading">Game Performance Profile</h3>
            <div className="detail-hero-card">
              <img src={selectedGame.image} alt={selectedGame.name} className="detail-hero-img" />
              <div className="detail-hero-info">
                <h4>{selectedGame.name}</h4>
                <span className="badge badge-success">{selectedGame.provider}</span>
              </div>
            </div>

            <div className="detail-stats-grid">
              <div className="detail-stat-card">
                <span className="stat-label">Theoretical RTP</span>
                <span className="stat-val text-primary">{selectedGame.rtp}</span>
              </div>
              <div className="detail-stat-card">
                <span className="stat-label">Total Revenue (GGR)</span>
                <span className="stat-val text-success">${selectedGame.ggr.toLocaleString()}</span>
              </div>
              <div className="detail-stat-card">
                <span className="stat-label">Total Game Spins</span>
                <span className="stat-val">{selectedGame.spins.toLocaleString()}</span>
              </div>
              <div className="detail-stat-card">
                <span className="stat-label">Avg. Bet Size</span>
                <span className="stat-val">$2.40</span>
              </div>
            </div>

            <div className="detail-alert-box">
              <Info size={16} className="text-accent" />
              <p>RTP variance is within regular parameters (+0.12% deviation from theoretical profile).</p>
            </div>

            <div className="detail-charts-panel">
              <span className="panel-title">Active Play Sessions (24h)</span>
              <div className="dummy-chart-placeholder">
                <Users size={24} className="text-primary animate-pulse" />
                <span className="text-muted">High player demand registered: {selectedGame.activePlayers} sessions online.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
