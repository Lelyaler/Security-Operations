import React, { useState } from 'react';
import { Search, Filter, HelpCircle, TrendingUp, Info } from 'lucide-react';
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
        {/* Table List */}
        <div className="games-list-container glass-card">
          <table className="games-table">
            <thead>
              <tr>
                <th>Game Name</th>
                <th>Category</th>
                <th>Provider</th>
                <th>RTP</th>
                <th>Total Spins</th>
                <th>Total GGR</th>
                <th>Popularity</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.length > 0 ? (
                filteredGames.map(game => (
                  <tr 
                    key={game.id} 
                    onClick={() => setSelectedGame(game)}
                    className={`game-row ${selectedGame && selectedGame.id === game.id ? 'selected' : ''}`}
                  >
                    <td>
                      <div className="game-name-cell">
                        <span className="game-title">{game.name}</span>
                      </div>
                    </td>
                    <td><span className="game-cat-badge">{game.category}</span></td>
                    <td className="text-muted">{game.provider}</td>
                    <td><strong className="text-primary">{game.rtp}</strong></td>
                    <td>{game.spins.toLocaleString()}</td>
                    <td>${game.ggr.toLocaleString()}</td>
                    <td>
                      <div className="popularity-bar-container">
                        <div className="popularity-bar" style={{ width: `${game.popularity}%` }}></div>
                        <span className="popularity-label">{game.popularity}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">No games found matching your search criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Game Sidebar details */}
        {selectedGame && (
          <div className="game-details-sidebar glass-card animate-slide-left">
            <h3 className="card-heading">Game Performance Profile</h3>
            <div className="detail-hero">
              <h4>{selectedGame.name}</h4>
              <span className="badge badge-success">{selectedGame.provider}</span>
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
                <TrendingUp size={24} className="text-primary animate-pulse" />
                <span className="text-muted">High player demand registered between 20:00 - 23:00.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
