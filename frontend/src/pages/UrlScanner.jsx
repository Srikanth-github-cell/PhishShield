import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scan, Globe, AlertTriangle, Shield, Eye, Cpu, Zap } from 'lucide-react'
import { useApi } from '../context/ApiContext'
import ScanCard from '../components/ScanCard'
import ResultCard from '../components/ResultCard'
import Loader from '../components/Loader'

export default function UrlScanner() {
  const [url, setUrl] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState(null)
  const { scanUrl } = useApi()
  
  const floatingIcons = [
    { Icon: Shield, delay: 0, position: { top: '15%', left: '5%' } },
    { Icon: Eye, delay: 1, position: { top: '70%', right: '10%' } },
    { Icon: Cpu, delay: 2, position: { top: '30%', left: '90%' } },
    { Icon: Scan, delay: 0.5, position: { top: '85%', left: '15%' } },
    { Icon: Globe, delay: 1.5, position: { top: '50%', right: '85%' } },
    { Icon: Zap, delay: 0.8, position: { top: '20%', right: '25%' } }
  ]
  
  const handleScan = async (e) => {
    e.preventDefault()
    if (!url.trim()) return
    
    setIsScanning(true)
    setResult(null)
    
    try {
      const scanResult = await scanUrl(url)
      setResult(scanResult)
    } catch (error) {
      setResult({
        is_phishing: false,
        risk_level: 'error',
        confidence: 0,
        details: { error: error.message }
      })
    } finally {
      setIsScanning(false)
    }
  }
  
  return (
    <div className="pt-24 pb-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute opacity-10"
            style={item.position}
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 4 + item.delay,
              repeat: Infinity,
              delay: item.delay
            }}
          >
            <item.Icon className="w-12 h-12 text-cyber-primary" />
          </motion.div>
        ))}

        {/* Animated Grid Lines */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px),
              linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-primary rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-4 bg-gradient-to-r from-cyber-primary to-neon-blue rounded-2xl relative"
            >
              <Globe className="w-12 h-12 text-black" />
              {/* Pulse Ring Animation */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-cyber-primary"
                animate={{ 
                  scale: [1, 1.5],
                  opacity: [1, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            </motion.div>
          </div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-cyber font-bold text-cyber-primary mb-4"
            animate={{ 
              textShadow: [
                '0 0 20px rgba(0,255,136,0.5)',
                '0 0 30px rgba(0,255,136,0.8)',
                '0 0 20px rgba(0,255,136,0.5)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            URL Scanner
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 font-tech max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Advanced URL analysis powered by machine learning algorithms. 
            Detect phishing attempts and malicious websites instantly.
          </motion.p>
        </motion.div>
        
        {/* Scanner Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ScanCard title="URL Analysis Terminal" className="mb-8 relative">
            {/* Card Background Animation */}
            <motion.div
              className="absolute inset-0 opacity-5 rounded-2xl"
              animate={{ 
                background: [
                  'linear-gradient(45deg, transparent, rgba(0,255,136,0.1), transparent)',
                  'linear-gradient(225deg, transparent, rgba(0,255,136,0.1), transparent)',
                  'linear-gradient(45deg, transparent, rgba(0,255,136,0.1), transparent)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <form onSubmit={handleScan} className="space-y-6 relative">
              <div className="space-y-3">
                <label className="block text-sm font-tech text-gray-400">
                  Enter URL to analyze
                </label>
                <div className="relative">
                  <motion.input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://suspicious-website.com"
                    className="w-full px-6 py-4 bg-cyber-darker/50 glass-effect neon-border border-cyber-primary/30 rounded-xl text-white placeholder-gray-500 font-tech focus:border-cyber-primary focus:outline-none transition-all"
                    disabled={isScanning}
                    whileFocus={{ 
                      boxShadow: '0 0 20px rgba(0,255,136,0.3)',
                      borderColor: 'rgba(0,255,136,0.8)'
                    }}
                  />
                  <motion.div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Globe className="w-5 h-5 text-cyber-primary" />
                  </motion.div>
                </div>
              </div>
              
              <motion.button
                type="submit"
                disabled={!url.trim() || isScanning}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyber-primary to-neon-blue text-black font-cyber font-bold text-lg rounded-xl neon-border border-cyber-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
              >
                {/* Button Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <div className="flex items-center justify-center space-x-3 relative">
                  <motion.div
                    animate={isScanning ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: isScanning ? Infinity : 0, ease: 'linear' }}
                  >
                    <Scan className="w-6 h-6" />
                  </motion.div>
                  <span>{isScanning ? 'SCANNING...' : 'INITIATE SCAN'}</span>
                </div>
              </motion.button>
            </form>
            
            {/* Scanning Animation */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 scan-line relative"
                >
                  <div className="p-8 bg-cyber-darker/30 rounded-xl border border-cyber-primary/20 relative overflow-hidden">
                    {/* Scanning Line Effect */}
                    <motion.div
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-primary to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                    
                    <Loader message="Analyzing URL patterns and threat signatures..." />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ScanCard>
        </motion.div>
        
        {/* Results */}
        <AnimatePresence>
          {result && !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <ResultCard result={result} type="url" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 glass-effect neon-border border-neon-purple/30 rounded-2xl p-6 relative overflow-hidden"
        >
          {/* Background Animation */}
          <motion.div
            className="absolute inset-0 opacity-5"
            animate={{ 
              background: [
                'linear-gradient(45deg, transparent, rgba(170,0,255,0.1), transparent)',
                'linear-gradient(225deg, transparent, rgba(170,0,255,0.1), transparent)',
                'linear-gradient(45deg, transparent, rgba(170,0,255,0.1), transparent)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <div className="flex items-center space-x-3 mb-4 relative">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <AlertTriangle className="w-6 h-6 text-neon-purple" />
            </motion.div>
            <motion.h3 
              className="font-cyber font-bold text-neon-purple"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(170,0,255,0.5)',
                  '0 0 20px rgba(170,0,255,0.8)',
                  '0 0 10px rgba(170,0,255,0.5)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Security Guidelines
            </motion.h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-tech text-gray-400 relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              • Always verify URLs before clicking suspicious links
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              • Check for HTTPS encryption on sensitive websites
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              • Look for spelling errors in domain names
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              • Be cautious of shortened URLs from unknown sources
            </motion.div>
          </div>
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 text-center"
        >
          <motion.div
            className="inline-block px-6 py-3 glass-effect neon-border border-cyber-primary/50 rounded-full"
            animate={{ 
              borderColor: [
                'rgba(0,255,136,0.5)',
                'rgba(0,204,255,0.5)',
                'rgba(0,255,136,0.5)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.span 
              className="text-cyber-primary font-cyber font-bold text-sm"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(0,255,136,0.5)',
                  '0 0 20px rgba(0,255,136,0.8)',
                  '0 0 10px rgba(0,255,136,0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔍 URL Analysis Engine Online
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}