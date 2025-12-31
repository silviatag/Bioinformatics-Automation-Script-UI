import React, { useState } from 'react';
import '../style/singleSequenceAlignmentTab.css';

const SingleSequenceAlignmentTab = () => {
  const [files, setFiles] = useState([]);
  const [tool, setTool] = useState('blast'); // default tool
  const [alignmentOutput, setAlignmentOutput] = useState('');
  const [alignmentFile, setAlignmentFile] = useState(null);
  const [alignmentTable, setAlignmentTable] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const RAILWAY_URL = process.env.REACT_APP_BACKEND_URL;

  const handleFilesChange = (e) => {
    if (e.target.files.length > 0) {
      setFiles(Array.from(e.target.files).slice(0, 2)); // Only allow first 2 files
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files).slice(0, 2));
    }
  };

  const handleAlign = async () => {
    if (files.length < 2) {
      alert('Please upload both FASTA files.');
      return;
    }

    setLoading(true);
    setAlignmentOutput('');
    setAlignmentFile(null);
    setAlignmentTable(null);

    try {
      const formData = new FormData();
      formData.append('seq1', files[0]);
      formData.append('seq2', files[1]);
      formData.append('tool', tool); // send selected tool to API

      const response = await fetch(`${RAILWAY_URL}/api/sequenceAlignment`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        alert('Error: ' + result.error);
        console.error(result.error);
        return;
      }

      setAlignmentOutput(result.rawOutput || '');
      setAlignmentFile(result.alignmentFile || null);
      setAlignmentTable(result.alignmentTable || null);

    } catch (err) {
      console.error(err);
      alert(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="single-align-tab">
      <h2>Pairwise Sequence Alignment</h2>

      {/* Tool Selection */}
      <div className="tool-selection">
        <label htmlFor="tool">Select Tool:</label>
        <select
          id="tool"
          value={tool}
          onChange={(e) => setTool(e.target.value)}
        >
          <option value="blast">BLAST</option>
          <option value="needle">NEEDLE</option>
        </select>
      </div>

      {/* Drag & Drop Upload */}
      <label
        className={`drop-zone ${dragActive ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>
          Drag & drop your <strong>2 FASTA files</strong> here <br />
          or <span className="browse-files">browse files</span>
        </p>
        <input
          type="file"
          accept=".fasta,.fa"
          multiple
          onChange={handleFilesChange}
          hidden
        />
      </label>

      {files.length > 0 && (
        <p>Selected files: {files.map(f => f.name).join(', ')}</p>
      )}

      {/* Align button */}
      <button onClick={handleAlign} disabled={loading || files.length < 2}>
        {loading ? 'Aligning...' : 'Align Sequences'}
      </button>

      {/* Alignment Output */}
      {alignmentOutput && (
        <div className="alignment-result">
          <h3>Alignment Result</h3>
          <pre>{alignmentOutput}</pre>
        </div>
      )}

      {/* Download buttons */}
      {(alignmentFile || alignmentTable) && (
        <div className="download-buttons">
          {alignmentFile && (
            <a
              href={alignmentFile}
              download={`${tool.toLowerCase()}_alignment.txt`}
              className="download-button"
            >
              Download Alignment
            </a>
          )}

          {alignmentTable && (
            <a
              href={alignmentTable}
              download={`${tool.toLowerCase()}_table.txt`}
              className="download-button"
            >
              Download Alignment Table
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleSequenceAlignmentTab;
