import React, { useState } from 'react';
import '../style/databaseRetrievalTab.css';

const DatabaseRetrievalTab = () => {
  const [source, setSource] = useState('1'); // default NCBI Gene
  const [keyword, setKeyword] = useState('');
  const [fastaText, setFastaText] = useState('');
  const [loading, setLoading] = useState(false);
  const RAILWAY_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSourceChange = (e) => setSource(e.target.value);
  const handleKeywordChange = (e) => setKeyword(e.target.value);

  const handleRetrieve = async () => {
    if (!source || !keyword) {
      alert('Please fill out both Source and Keyword fields.');
      return;
    }

    setLoading(true);
    setFastaText('');

    try {
      // Step 1: Request FASTA generation
      const response = await fetch(`${RAILWAY_URL}/api/dbRetrieval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: source, keyword })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Something went wrong during retrieval.');
        setLoading(false);
        return;
      }

      // Step 2: Fetch the actual content of the FASTA file
      const fastaResponse = await fetch(data.fasta);
      if (!fastaResponse.ok) {
        alert('Failed to fetch FASTA content.');
        setLoading(false);
        return;
      }

      const fastaContent = await fastaResponse.text();
      setFastaText(fastaContent);

    } catch (err) {
      console.error(err);
      alert('An error occurred while contacting the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="db-tab">
      <h2>Database Retrieval</h2>

      <div className="input-container">
        <div className="input-row">
          <div className="input-group">
            <label htmlFor="source">Source</label>
            <select id="source" value={source} onChange={handleSourceChange}>
              <option value="1">NCBI Gene</option>
              <option value="2">NCBI Protein</option>
              <option value="3">Uniprot Protein</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="keyword">Keyword / Gene ID / Accession Number</label>
            <input
              type="text"
              id="keyword"
              value={keyword}
              onChange={handleKeywordChange}
              placeholder="Enter keyword..."
            />
          </div>
        </div>

        <div className="button-row">
          <button onClick={handleRetrieve} disabled={loading}>
            {loading ? 'Retrieving...' : 'Retrieve FASTA'}
          </button>
        </div>
      </div>

      {fastaText && (
        <div className="fasta-result">
          <h3>FASTA Output:</h3>
          <pre>{fastaText}</pre>
          <div className="download-container">
            <a
              href={`${RAILWAY_URL}/outputs/${keyword}.fasta`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button>Download</button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseRetrievalTab;
