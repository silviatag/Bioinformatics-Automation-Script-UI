import React, { useState } from 'react';
import '../style/multipleSequenceAlignmentTab.css';

const MultipleSequenceAlignmentTab = () => {
  const [sequenceType, setSequenceType] = useState('DNA'); // default DNA
  const [tool, setTool] = useState('clustal'); // default tool
  const [accessions, setAccessions] = useState('');
  const [loading, setLoading] = useState(false);
  const [msaText, setMsaText] = useState('');
  const [jobId, setJobId] = useState(null);
  const RAILWAY_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSequenceTypeChange = (e) => setSequenceType(e.target.value);
  const handleToolChange = (e) => setTool(e.target.value);
  const handleAccessionsChange = (e) => setAccessions(e.target.value);

  const handleAlign = async () => {
    if (!accessions.trim()) {
      alert('Please enter at least two accession numbers.');
      return;
    }

    setLoading(true);
    setMsaText('');
    setJobId(null);

    try {
      const response = await fetch(`${RAILWAY_URL}/api/msa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dbType: sequenceType,
          tool,
          accessions: accessions.trim().split(/\s+/)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Something went wrong during alignment.');
      } else {
        setMsaText(data.rawOutput); // display the MSA output
        setJobId(data.jobId);
      }

    } catch (err) {
      console.error(err);
      alert('An error occurred while contacting the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="msa-tab">
      <h2>Multiple Sequence Alignment</h2>

      <div className="input-container">
        <div className="radio-row">
          <label>
            <input
              type="radio"
              value="DNA"
              checked={sequenceType === 'DNA'}
              onChange={handleSequenceTypeChange}
            />
            DNA
          </label>
          <label>
            <input
              type="radio"
              value="Protein"
              checked={sequenceType === 'Protein'}
              onChange={handleSequenceTypeChange}
            />
            Protein
          </label>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label htmlFor="tool">Tool</label>
            <select id="tool" value={tool} onChange={handleToolChange}>
              <option value="clustal">Clustal Omega</option>
              <option value="mafft">MAFFT</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="accessions">Accession Numbers</label>
            <input
              type="text"
              id="accessions"
              value={accessions}
              onChange={handleAccessionsChange}
              placeholder="Enter space-separated accession numbers"
            />
          </div>
        </div>

        <div className="button-row">
          <button onClick={handleAlign} disabled={loading}>
            {loading ? 'Aligning...' : 'Align'}
          </button>
        </div>
      </div>

      {msaText && (
        <div className="msa-result">
          <h3>MSA Output:</h3>
          <pre>{msaText}</pre>
          {jobId && (
            <div className="download-container">
              <a
                href={`${RAILWAY_URL}/outputs/${jobId}/msa_result.fasta`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button>Download MSA</button>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultipleSequenceAlignmentTab;
