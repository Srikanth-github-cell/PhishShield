import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function ScanCard({ children, title, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-effect neon-border border-cyber-primary/30 rounded-2xl p-8 ${className}`}
    >
      {title && (
        <div className="flex items-center space-x-3 mb-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="p-2 bg-gradient-to-r from-cyber-primary to-neon-blue rounded-lg"
          >
            <Zap className="w-5 h-5 text-black" />
          </motion.div>
          <h2 className="text-2xl font-cyber font-bold text-cyber-primary text-glow">
            {title}
          </h2>
        </div>
      )}
      {children}
    </motion.div>
  )
}
