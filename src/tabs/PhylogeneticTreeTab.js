import React, { useState } from 'react';
import '../style/phylogeneticTreeTab.css';

const PhylogeneticTreeTab = () => {
  const [dataType, setDataType] = useState('DNA');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [treeImage, setTreeImage] = useState(null);
  const [newickFile, setNewickFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const RAILWAY_URL = process.env.REACT_APP_BACKEND_URL;


  const handleDataTypeChange = (e) => setDataType(e.target.value);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerateTree = async () => {
    if (!file) {
      alert('Please upload your MSA file first!');
      return;
    }

    setLoading(true);
    setTreeImage(null);
    setNewickFile(null);

    try {
      const formData = new FormData();
      formData.append('msa', file);
      formData.append('type', dataType);
      const response = await fetch(`${RAILWAY_URL}/api/phylogeneticTree`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        alert('Error: ' + result.error);
        console.error(result.error);
        setLoading(false);
        return;
      }

      console.log('Server response:', result);

      // Set tree image and Newick file for download
      setTreeImage(result.image || null);
      setNewickFile(result.tree || null);
    } catch (err) {
  if (err instanceof TypeError) {
    // usually network error
    console.error("Network error:", err);
    alert("Network error: Check if the backend is running and the URL is correct.");
  } else {
    console.error("Unexpected error:", err);
    alert(`Unexpected error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadNewick = async () => {
    if (!newickFile) return;

    try {
      const response = await fetch(newickFile);
      if (!response.ok) throw new Error('Failed to fetch Newick file');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tree.newick';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to download Newick file.');
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="phylo-tab">
      <h2>Phylogenetic Tree Construction</h2>

      <div className="data-type-selection">
        <label>
          <input
            type="radio"
            name="dataType"
            value="DNA"
            checked={dataType === 'DNA'}
            onChange={handleDataTypeChange}
          />
          DNA
        </label>

        <label>
          <input
            type="radio"
            name="dataType"
            value="Protein"
            checked={dataType === 'Protein'}
            onChange={handleDataTypeChange}
          />
          Protein
        </label>
      </div>

      {/* Upload / Drag & Drop */}
      <label
        htmlFor="fileInput"
        className={`drop-zone ${dragActive ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>
          Drag & drop your <strong>MSA file</strong> here <br />
          or <span className="browse-files">browse files</span>
        </p>

        <input
          id="fileInput"
          type="file"
          accept=".fasta,.aln,.msa,.aln-fasta"
          onChange={handleFileChange}
          hidden
        />
      </label>

      {file && <p>Selected file: {file.name}</p>}

      <button onClick={handleGenerateTree} disabled={!file || loading}>
        {loading ? 'Generating...' : 'Generate Tree'}
      </button>

      {/* Display tree image */}
      {treeImage && (
        <div className="tree-result">
          <h3>Generated Tree:</h3>
          <img src={treeImage} alt="Phylogenetic Tree" style={{ maxWidth: '100%', marginTop: '10px' }} />
        </div>
      )}

      {/* Download Newick file */}
      {newickFile && (
        <div className="newick-download">
          <button onClick={handleDownloadNewick} className="download-button">
            Download Newick File
          </button>
        </div>
      )}
    </div>
  );
};

export default PhylogeneticTreeTab;
