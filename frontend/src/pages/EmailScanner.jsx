import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Send, User, FileText, Shield, Eye, Cpu, Scan } from 'lucide-react'
import { useApi } from '../context/ApiContext'
import ScanCard from '../components/ScanCard'
import ResultCard from '../components/ResultCard'
import Loader from '../components/Loader'

export default function EmailScanner() {
  const [emailData, setEmailData] = useState({
    subject: '',
    sender: '',
    body: ''
  })
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState(null)
  const { scanEmail } = useApi()

  const floatingIcons = [
    { Icon: Shield, delay: 0, position: { top: '20%', left: '10%' } },
    { Icon: Eye, delay: 1, position: { top: '60%', right: '15%' } },
    { Icon: Cpu, delay: 2, position: { top: '40%', left: '85%' } },
    { Icon: Scan, delay: 0.5, position: { top: '80%', left: '20%' } }
  ]
  
  const handleInputChange = (field, value) => {
    setEmailData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleScan = async (e) => {
    e.preventDefault()
    if (!emailData.subject.trim() && !emailData.body.trim()) return
    
    setIsScanning(true)
    setResult(null)
    
    try {
      const scanResult = await scanEmail(emailData)
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
            <item.Icon className="w-12 h-12 text-neon-purple" />
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
              linear-gradient(90deg, rgba(170,0,255,0.1) 1px, transparent 1px),
              linear-gradient(rgba(170,0,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
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
              className="p-4 bg-gradient-to-r from-neon-purple to-neon-pink rounded-2xl relative"
            >
              <Mail className="w-12 h-12 text-black" />
              {/* Pulse Ring Animation */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-neon-purple"
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
            className="text-4xl md:text-6xl font-cyber font-bold text-neon-purple mb-4"
            animate={{ 
              textShadow: [
                '0 0 20px rgba(170,0,255,0.5)',
                '0 0 30px rgba(170,0,255,0.8)',
                '0 0 20px rgba(170,0,255,0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Email Scanner
          </motion.h1>
          <p className="text-xl text-gray-300 font-tech max-w-2xl mx-auto">
            Comprehensive email threat analysis. Detect phishing attempts, 
            malicious attachments, and social engineering attacks.
          </p>
        </motion.div>
        
        {/* Scanner Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ 
            y: -5, 
            boxShadow: '0 20px 40px rgba(170,0,255,0.2)'
          }}
          className="mb-8"
        >
          <ScanCard title="Email Analysis Console" className="relative overflow-hidden">
            {/* Animated Background Effect for Card */}
            <motion.div
              className="absolute inset-0 opacity-5"
              animate={{ 
                background: [
                  'linear-gradient(45deg, transparent, rgba(170,0,255,0.2), transparent)',
                  'linear-gradient(225deg, transparent, rgba(170,0,255,0.2), transparent)',
                  'linear-gradient(45deg, transparent, rgba(170,0,255,0.2), transparent)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <form onSubmit={handleScan} className="space-y-6 relative">
              {/* Sender */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="flex items-center space-x-2 text-sm font-tech text-gray-400">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <User className="w-4 h-4" />
                  </motion.div>
                  <span>Sender Email Address</span>
                </label>
                <motion.input
                  type="email"
                  value={emailData.sender}
                  onChange={(e) => handleInputChange('sender', e.target.value)}
                  placeholder="suspicious@phisher.com"
                  className="w-full px-6 py-4 bg-cyber-darker/50 glass-effect neon-border border-neon-purple/30 rounded-xl text-white placeholder-gray-500 font-tech focus:border-neon-purple focus:outline-none transition-all"
                  disabled={isScanning}
                  whileFocus={{ 
                    boxShadow: '0 0 20px rgba(170,0,255,0.3)',
                    borderColor: 'rgba(170,0,255,0.6)'
                  }}
                />
              </motion.div>
              
              {/* Subject */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="flex items-center space-x-2 text-sm font-tech text-gray-400">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                  <span>Email Subject</span>
                </label>
                <motion.input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Urgent: Verify your account immediately"
                  className="w-full px-6 py-4 bg-cyber-darker/50 glass-effect neon-border border-neon-purple/30 rounded-xl text-white placeholder-gray-500 font-tech focus:border-neon-purple focus:outline-none transition-all"
                  disabled={isScanning}
                  whileFocus={{ 
                    boxShadow: '0 0 20px rgba(170,0,255,0.3)',
                    borderColor: 'rgba(170,0,255,0.6)'
                  }}
                />
              </motion.div>
              
              {/* Body */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="flex items-center space-x-2 text-sm font-tech text-gray-400">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                  >
                    <FileText className="w-4 h-4" />
                  </motion.div>
                  <span>Email Content</span>
                </label>
                <motion.textarea
                  value={emailData.body}
                  onChange={(e) => handleInputChange('body', e.target.value)}
                  placeholder="Dear customer, we have detected suspicious activity on your account. Click here to verify your identity..."
                  rows={8}
                  className="w-full px-6 py-4 bg-cyber-darker/50 glass-effect neon-border border-neon-purple/30 rounded-xl text-white placeholder-gray-500 font-tech focus:border-neon-purple focus:outline-none transition-all resize-none"
                  disabled={isScanning}
                  whileFocus={{ 
                    boxShadow: '0 0 20px rgba(170,0,255,0.3)',
                    borderColor: 'rgba(170,0,255,0.6)'
                  }}
                />
              </motion.div>
              
              <motion.button
                type="submit"
                disabled={(!emailData.subject.trim() && !emailData.body.trim()) || isScanning}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: '0 0 30px rgba(170, 0, 255, 0.5)',
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-pink text-black font-cyber font-bold text-lg rounded-xl neon-border border-neon-purple disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
              >
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
                    <Mail className="w-6 h-6" />
                  </motion.div>
                  <span>{isScanning ? 'ANALYZING...' : 'ANALYZE EMAIL'}</span>
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
                  className="mt-8 hologram relative overflow-hidden"
                >
                  <motion.div
                    className="p-8 bg-neon-purple/10 rounded-xl border border-neon-purple/30 relative"
                    animate={{ 
                      borderColor: [
                        'rgba(170,0,255,0.3)',
                        'rgba(170,0,255,0.6)',
                        'rgba(170,0,255,0.3)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {/* Animated Background Effect for Scanning */}
                    <motion.div
                      className="absolute inset-0 rounded-xl opacity-20"
                      animate={{ 
                        background: [
                          'linear-gradient(90deg, transparent, rgba(170,0,255,0.3), transparent)',
                          'linear-gradient(270deg, transparent, rgba(170,0,255,0.3), transparent)',
                          'linear-gradient(90deg, transparent, rgba(170,0,255,0.3), transparent)'
                        ]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <Loader message="Processing email content and threat patterns..." />
                  </motion.div>
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
              transition={{ duration: 0.5 }}
              whileHover={{ 
                y: -5, 
                boxShadow: '0 20px 40px rgba(170,0,255,0.2)'
              }}
            >
              <ResultCard result={result} type="email" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Security Status Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="fixed bottom-6 right-6"
      >
        <motion.div
          className="px-4 py-2 glass-effect neon-border border-neon-purple/50 rounded-full"
          animate={{ 
            borderColor: [
              'rgba(170,0,255,0.5)',
              'rgba(255,20,147,0.5)',
              'rgba(170,0,255,0.5)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.span 
            className="text-neon-purple font-cyber font-bold text-sm"
            animate={{ 
              textShadow: [
                '0 0 10px rgba(170,0,255,0.5)',
                '0 0 20px rgba(170,0,255,0.8)',
                '0 0 10px rgba(170,0,255,0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🛡️ Email Protection Active
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  )
}