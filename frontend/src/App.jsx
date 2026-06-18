import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackgroundFX from './components/BackgroundFX'
import Home from './pages/Home'
import UrlScanner from './pages/UrlScanner'
import EmailScanner from './pages/EmailScanner'

function App() {
  return (
    <div className="min-h-screen bg-cyber-darker text-white font-tech overflow-x-hidden">
      <BackgroundFX />
      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/url-scanner" element={<UrlScanner />} />
          <Route path="/email-scanner" element={<EmailScanner />} />
        </Routes>
      </AnimatePresence>
      
      <Footer />
    </div>
  )
}

export default App
