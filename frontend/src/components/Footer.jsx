import { motion } from 'framer-motion'
import { Github, Twitter, Globe, Shield } from 'lucide-react'

export default function Footer() {
  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub', color: 'hover:text-white' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Globe, href: '#', label: 'Website', color: 'hover:text-cyber-primary' },
  ]
  
  return (
    <footer className="relative mt-20 border-t border-cyber-primary/20 overflow-hidden">
      {/* Animated Top Border */}
      <motion.div 
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent"
        animate={{ 
          background: [
            'linear-gradient(90deg, transparent, rgba(0,255,136,0.8), transparent)',
            'linear-gradient(90deg, transparent, rgba(0,204,255,0.8), transparent)',
            'linear-gradient(90deg, transparent, rgba(0,255,136,0.8), transparent)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,255,136,0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="p-3 bg-gradient-to-r from-cyber-primary to-neon-blue rounded-xl"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(0,255,136,0.3)',
                    '0 0 30px rgba(0,255,136,0.5)',
                    '0 0 20px rgba(0,255,136,0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-6 h-6 text-black" />
              </motion.div>
              <motion.span 
                className="font-cyber font-bold text-2xl text-cyber-primary"
                animate={{ 
                  textShadow: [
                    '0 0 10px rgba(0,255,136,0.5)',
                    '0 0 20px rgba(0,255,136,0.8)',
                    '0 0 10px rgba(0,255,136,0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                PhishGuard
              </motion.span>
            </motion.div>
            
            <p className="text-gray-400 font-tech leading-relaxed max-w-md">
              Advanced phishing detection powered by AI. Protecting your digital world 
              from cyber threats with cutting-edge machine learning technology.
            </p>
          
          </motion.div>

          
        </div>
        
        {/* Bottom Bar */}
        <motion.div 
          className="mt-12 pt-8 border-t border-cyber-primary/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p 
              className="text-gray-400 font-tech text-sm"
              animate={{ 
                color: [
                  'rgba(156,163,175,1)',
                  'rgba(0,255,136,0.7)',
                  'rgba(156,163,175,1)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              © 2024 PhishGuard. All rights reserved. Powered by advanced AI.
            </motion.p>
            
            <div className="flex items-center space-x-6">
              {['Privacy', 'Terms', 'Security', 'Status'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ 
                    scale: 1.05,
                    color: '#00ff88'
                  }}
                  className="text-gray-400 hover:text-cyber-primary text-sm font-tech transition-all relative group"
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-cyber-primary"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Security Badge */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 px-4 py-2 glass-effect neon-border border-cyber-primary/30 rounded-full"
              animate={{ 
                borderColor: [
                  'rgba(0,255,136,0.3)',
                  'rgba(0,255,136,0.6)',
                  'rgba(0,255,136,0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="w-4 h-4 text-cyber-primary" />
              </motion.div>
              <span className="text-xs font-tech text-cyber-primary">
                Secured by PhishGuard Technology
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}