import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/about';
import Documentation from './Pages/documentation';
import Tools from './Pages/tools';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="navbar-left">
            {/* <img src={logo} className="lظogo" alt="logo" /> */}
          </div>
          <div className="navbar-right">
            <Link to="/Home">Home</Link>
            <Link to="/tools">Tools</Link>
            <Link to="/documentation">Documentation</Link>
            <Link to="/about">About Us</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/tools" element={<Tools />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
