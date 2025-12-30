import React from 'react'
import { Link } from 'react-router-dom';
import '../style/home.css';

const Home = () => {
  return (
      <div className='home'>
          <section className="hero">
        <h1>Welcome to SeqFlow!</h1>
        <p>
          Streamline your bioinformatics workflow: retrieve databases, align sequences, 
          perform multiple sequence alignments, and generate phylogenetic trees — all in one place.
        </p>
        <Link to="/tools">
          <button className="cta-button">Go to Tools</button>
        </Link>
      </section>

      <section className="features">
        <h2>What You Can Do</h2>
        <ul>
          <li>Retrieve sequences from bioinformatics databases like NCBI.</li>
          <li>Align single or multiple sequences easily.</li>
          <li>Generate phylogenetic trees visually and efficiently.</li>
        </ul>
      </section>
      </div>
  )
}

export default Home