import React, { useState, useEffect } from 'react';
import { getAnalytics, getVisits, getUserStats } from './firebase';
import './AdminPanel.css';

function AdminPanel({ user, onClose }) {
  const [analytics, setAnalytics] = useState([]);
  const [visits, setVisits] = useState([]);
  const [userStats, setUserStats] = useState({ totalUsers: 0, users: [] });
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);

  // List of admin email addresses (CHANGE THESE TO YOUR ADMIN EMAILS)
  const ADMIN_EMAILS = [
    'your-admin-email@gmail.com',
    // Add more admin emails here
  ];

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsData, visitsData, statsData] = await Promise.all([
        getAnalytics(),
        getVisits(),
        getUserStats()
      ]);
      
      setAnalytics(analyticsData);
      setVisits(visitsData);
      setUserStats(statsData);
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
    setLoading(false);
  };

  if (!isAdmin) {
    return (
      <div className="admin-panel">
        <div className="admin-content">
          <h2>❌ Access Denied</h2>
          <p>You do not have permission to view this page.</p>
          <button onClick={onClose} className="close-button">Close</button>
        </div>
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="admin-panel">
      <div className="admin-content">
        <div className="admin-header">
          <h2>📊 Admin Dashboard</h2>
          <button onClick={onClose} className="close-button">✕</button>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 User Activity
          </button>
          <button
            className={`admin-tab ${activeTab === 'visits' ? 'active' : ''}`}
            onClick={() => setActiveTab('visits')}
          >
            👁️ Visits
          </button>
          <button
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users ({userStats.totalUsers})
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading data...</div>
        ) : (
          <>
            {activeTab === 'analytics' && (
              <div className="admin-section">
                <h3>User Activity Log</h3>
                <div className="activity-list">
                  {analytics.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-type">{activity.activityType}</div>
                      <div className="activity-details">
                        <p><strong>User ID:</strong> {activity.userId}</p>
                        {activity.email && <p><strong>Email:</strong> {activity.email}</p>}
                        {activity.displayName && <p><strong>Name:</strong> {activity.displayName}</p>}
                        <p><strong>Time:</strong> {formatTimestamp(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'visits' && (
              <div className="admin-section">
                <h3>Page Visits</h3>
                <div className="stats-summary">
                  <div className="stat-card">
                    <h4>Total Visits</h4>
                    <p className="stat-number">{visits.length}</p>
                  </div>
                </div>
                <div className="activity-list">
                  {visits.map((visit) => (
                    <div key={visit.id} className="activity-item">
                      <div className="activity-details">
                        <p><strong>User:</strong> {visit.userId}</p>
                        <p><strong>Time:</strong> {formatTimestamp(visit.timestamp)}</p>
                        <p className="user-agent"><strong>Browser:</strong> {visit.userAgent}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="admin-section">
                <h3>Registered Users</h3>
                <div className="stats-summary">
                  <div className="stat-card">
                    <h4>Total Users</h4>
                    <p className="stat-number">{userStats.totalUsers}</p>
                  </div>
                </div>
                <div className="users-list">
                  {userStats.users.map((userData) => (
                    <div key={userData.id} className="user-item">
                      <p><strong>User ID:</strong> {userData.id}</p>
                      <p><strong>Configurations:</strong> {userData.wheels ? Object.keys(userData.wheels).length : 0}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <button onClick={loadData} className="refresh-button">
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;