import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Scan, Mail, BarChart3 } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Home', icon: Shield },
    { path: '/url-scanner', label: 'URL Scanner', icon: Scan },
    { path: '/email-scanner', label: 'Email Scanner', icon: Mail }
  ]
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-effect rounded-2xl px-6 py-3 neon-border border-cyber-primary">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-gradient-to-r from-cyber-primary to-neon-blue rounded-lg"
            >
              <Shield className="w-6 h-6 text-black" />
            </motion.div>
            <span className="font-cyber font-bold text-xl text-glow text-cyber-primary">
              PhishGuard
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/50' 
                        : 'hover:bg-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-tech font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
          
          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 text-cyber-primary hover:bg-white/10 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}
