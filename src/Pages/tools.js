import React, { useState } from 'react';
import '../style/tools.css';
import DatabaseRetrievalTab from '../tabs/DatabaseRetrievalTab';
import SingleSequenceAlignmentTab from '../tabs/SingleSequenceAlignmentTab';
import MultipleSequenceAlignmentTab from '../tabs/MultipleSequenceAlignmentTab';
import PhylogeneticTreeTab from '../tabs/PhylogeneticTreeTab';
const Tools = () => {
  const [activeTab, setActiveTab] = useState('database');

  const tabs = [
    { id: 'database', label: 'Database Retrieval' },
    { id: 'single', label: 'Single Sequence Alignment' },
    { id: 'multiple', label: 'Multiple Sequence Alignment' },
    { id: 'phylo', label: 'Phylogenetic Tree Construction' },
  ];

  const renderContent = () => {
  switch (activeTab) {
    case 'database':
      return <DatabaseRetrievalTab />;
    case 'single':
      return <SingleSequenceAlignmentTab />;
    case 'multiple':
      return <MultipleSequenceAlignmentTab />;
    case 'phylo':
      return <PhylogeneticTreeTab />;
    default:
      return null;
  }
};

  return (
    <div className="tools-page">
      <h1>Our Tools</h1>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Tools;
