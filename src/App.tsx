import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import ContactManagement from './pages/ContactManagement'
import Dashboard from './pages/Dashboard'
import Footer from './components/Footer'
import './styles/App.css'

function App() {
  useEffect(() => {
    // Inicializar AOS (Animate On Scroll)
    const AOS = (window as any).AOS;
    if (AOS) {
      AOS.init({
        duration: 1000,
        once: true,
        offset: 100
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/projetos" element={<Projects />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/admin/contatos" element={<ContactManagement />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
