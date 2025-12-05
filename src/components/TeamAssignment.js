import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './TeamAssignment.css';
import {
  validateOptionName,
  validateExcelFile,
  validateNamesList,
  validateNumber,
  sanitizeTextInput,
  SECURITY_LIMITS
} from '../utils/security';

function TeamAssignment({ theme }) {
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState('');
  const [numTeams, setNumTeams] = useState(2);
  const [teams, setTeams] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  // Add name manually with validation
  const handleAddName = () => {
    setError('');

    const validation = validateOptionName(newName);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    if (names.length >= SECURITY_LIMITS.MAX_OPTIONS_COUNT) {
      setError(`Maximum ${SECURITY_LIMITS.MAX_OPTIONS_COUNT} names allowed`);
      return;
    }

    // Check for duplicates
    if (names.includes(validation.sanitized)) {
      setError('This name already exists');
      return;
    }

    setNames([...names, validation.sanitized]);
    setNewName('');
  };

  // Remove a name
  const handleRemoveName = (index) => {
    setNames(names.filter((_, i) => i !== index));
  };

  // Handle bulk add with validation
  const handleBulkAdd = () => {
    setError('');

    if (bulkInput.trim() === '') return;

    // Split by newlines, commas, or semicolons and filter empty strings
    const items = bulkInput
      .split(/[\n,;]+/)
      .map(item => item.trim())
      .filter(item => item !== '');

    // Validate all names
    const validation = validateNamesList(items, SECURITY_LIMITS.MAX_OPTIONS_COUNT);

    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    // Combine with existing names and remove duplicates
    const combinedNames = [...names, ...validation.sanitized];
    const uniqueNames = [...new Set(combinedNames)];

    if (uniqueNames.length > SECURITY_LIMITS.MAX_OPTIONS_COUNT) {
      setError(`Maximum ${SECURITY_LIMITS.MAX_OPTIONS_COUNT} names allowed`);
      return;
    }

    setNames(uniqueNames);
    setBulkInput('');
    setShowBulkInput(false);
  };

  // Handle file upload (Excel) with security validation
  const handleFileUpload = (e) => {
    setError('');
    const file = e.target.files[0];

    if (!file) return;

    // Validate file
    const fileValidation = validateExcelFile(file);
    if (!fileValidation.valid) {
      setError(fileValidation.error);
      e.target.value = ''; // Reset file input
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      setError('Error reading file. Please try again.');
      e.target.value = '';
    };

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // Extract names from first column, skip empty rows
        const extractedNames = jsonData
          .map(row => row[0])
          .filter(name => name && String(name).trim())
          .map(name => String(name).trim());

        // Validate all names
        const validation = validateNamesList(extractedNames, SECURITY_LIMITS.MAX_OPTIONS_COUNT);

        if (!validation.valid) {
          setError(validation.errors.join(', '));
          e.target.value = '';
          return;
        }

        setNames(validation.sanitized);

        // Show warnings if any
        if (validation.errors && validation.errors.length > 0) {
          console.warn('Some rows had issues:', validation.errors);
        }
      } catch (error) {
        setError('Error reading file. Please make sure it\'s a valid Excel file.');
        console.error('File read error:', error);
      }

      e.target.value = ''; // Reset file input
    };

    reader.readAsArrayBuffer(file);
  };

  // Download Excel template
  const downloadTemplate = () => {
    const template = [
      ['Name'],
      ['John Doe'],
      ['Jane Smith'],
      ['Mike Johnson'],
      ['Sarah Williams']
    ];

    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Names');
    XLSX.writeFile(wb, 'team_assignment_template.xlsx');
  };

  // Shuffle array helper
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Assign teams with validation
  const assignTeams = () => {
    setError('');

    if (names.length === 0) {
      setError('Please add names first!');
      return;
    }

    const teamValidation = validateNumber(numTeams, 1, Math.min(names.length, SECURITY_LIMITS.MAX_TEAMS_COUNT));
    if (!teamValidation.valid) {
      setError(teamValidation.error);
      return;
    }

    setIsAnimating(true);

    setTimeout(() => {
      const shuffled = shuffleArray(names);
      const teamSize = Math.floor(shuffled.length / numTeams);
      const remainder = shuffled.length % numTeams;

      const newTeams = [];
      let currentIndex = 0;

      for (let i = 0; i < numTeams; i++) {
        const extraMember = i < remainder ? 1 : 0;
        const membersCount = teamSize + extraMember;
        newTeams.push(shuffled.slice(currentIndex, currentIndex + membersCount));
        currentIndex += membersCount;
      }

      setTeams(newTeams);
      setIsAnimating(false);
    }, 1000);
  };

  // Clear all
  const clearAll = () => {
    setNames([]);
    setTeams([]);
    setNewName('');
  };

  return (
    <div className={`component-page ${theme}-theme`}>
      <div className="page-header">
        <h1>👥 Team Assignment</h1>
        <p className="page-description">Randomly assign people to teams</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Two Column Layout */}
      <div className="team-assignment-layout">
        {/* Left Column - Input Controls */}
        <div className="left-column">
          {/* Upload/Download Section */}
          <div className="team-section">
            <h3>📁 Import Names</h3>
            <div className="file-actions">
              <button onClick={downloadTemplate} className="btn-template">
                📥 Download Template
              </button>
              <label className="btn-upload">
                📤 Upload Excel File
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Manual Entry */}
          <div className="team-section">
            <h3>✍️ Add Names Manually</h3>
            <div className="add-name-container">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddName()}
                placeholder="Enter a name..."
                className="name-input"
              />
              <button onClick={handleAddName} className="btn-add">
                Add Name
              </button>
            </div>

            {/* Bulk Add Toggle Button */}
            <button
              onClick={() => setShowBulkInput(!showBulkInput)}
              className="bulk-input-toggle"
            >
              📋 {showBulkInput ? 'Hide' : 'Bulk Add (Paste List)'}
            </button>

            {/* Bulk Input Area */}
            {showBulkInput && (
              <div className="bulk-input-container">
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Paste your list here (one name per line, or comma-separated)&#10;Example:&#10;John Doe&#10;Jane Smith&#10;Mike Johnson"
                  className="bulk-input-textarea"
                  rows="6"
                />
                <div className="bulk-input-actions">
                  <button onClick={handleBulkAdd} className="btn-bulk-add">
                    ✅ Add All Names
                  </button>
                  <button
                    onClick={() => {
                      setBulkInput('');
                      setShowBulkInput(false);
                    }}
                    className="btn-bulk-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Team Configuration */}
          <div className="team-section">
            <h3>⚙️ Configure Teams</h3>
            <div className="team-config">
              <label>
                Number of Teams:
                <input
                  type="number"
                  min="0"
                  max={names.length || 10}
                  value={numTeams}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 0 || e.target.value === '') {
                      setNumTeams(value || 0);
                    }
                  }}
                  className="team-number-input"
                />
              </label>
              <button
                onClick={assignTeams}
                disabled={isAnimating || names.length === 0}
                className="btn-assign"
              >
                {isAnimating ? '🔄 Assigning...' : '🎲 Assign Teams'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Names Display */}
        <div className="right-column">
          <div className="team-section names-display-section">
            <div className="names-header">
              <h3>📝 Names List</h3>
              {names.length > 0 && (
                <button onClick={clearAll} className="btn-clear-all">
                  Clear All
                </button>
              )}
            </div>

            {names.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p className="empty-text">No names added yet</p>
                <p className="empty-hint">Upload an Excel file or add names manually</p>
              </div>
            ) : (
              <div className="names-list">
                <div className="names-count-badge">
                  {names.length} {names.length === 1 ? 'person' : 'people'}
                </div>
                <div className="names-grid">
                  {names.map((name, index) => (
                    <div key={index} className="name-chip">
                      <span>{name}</span>
                      <button
                        onClick={() => handleRemoveName(index)}
                        className="btn-remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results - Full Width */}
      {teams.length > 0 && (
        <div className="teams-result">
          <h3>📋 Team Assignments</h3>
          <div className="teams-grid">
            {teams.map((team, index) => (
              <div key={index} className="team-card">
                <div className="team-header">
                  <h4>Team {index + 1}</h4>
                  <span className="team-count">{team.length} members</span>
                </div>
                <ul className="team-members">
                  {team.map((member, memberIndex) => (
                    <li key={memberIndex}>{member}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamAssignment;
