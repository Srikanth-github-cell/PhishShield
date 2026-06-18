import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Zap, Clock, Globe } from 'lucide-react'

export default function ResultCard({ result, type = 'url' }) {
  if (!result) return null
  
  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-red-400 border-red-400'
      case 'medium': return 'text-yellow-400 border-yellow-400'
      case 'low': return 'text-green-400 border-green-400'
      default: return 'text-gray-400 border-gray-400'
    }
  }
  
  const getRiskIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return <AlertTriangle className="w-8 h-8" />
      case 'medium': return <Zap className="w-8 h-8" />
      case 'low': return <Shield className="w-8 h-8" />
      default: return <Globe className="w-8 h-8" />
    }
  }
  
  // Helper function to format values for display
  const formatValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : 'None'
      }
      
      // For objects, display key information or stringify
      if (value.status) {
        return value.status
      }
      
      if (value.threats !== undefined) {
        return Array.isArray(value.threats) ? 
          (value.threats.length > 0 ? `${value.threats.length} threats` : 'No threats') :
          value.threats
      }
      
      if (value.suspicious_patterns !== undefined) {
        return Array.isArray(value.suspicious_patterns) ? 
          (value.suspicious_patterns.length > 0 ? `${value.suspicious_patterns.length} patterns` : 'No patterns') :
          value.suspicious_patterns
      }
      
      if (value.malware !== undefined) {
        return value.malware ? 'Detected' : 'Not detected'
      }
      
      if (value.positives !== undefined && value.total !== undefined) {
        return `${value.positives}/${value.total} detections`
      }
      
      // Fallback: show key-value pairs or stringify
      const keys = Object.keys(value)
      if (keys.length <= 3) {
        return keys.map(key => `${key}: ${value[key]}`).join(', ')
      }
      
      return JSON.stringify(value, null, 0).substring(0, 50) + '...'
    }
    
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value)
    }
    
    return 'N/A'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.8, ease: 'backOut' }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass-effect neon-border border-cyber-primary/30 rounded-2xl p-8 hologram">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className={`p-3 rounded-xl neon-border ${getRiskColor(result.risk_level)}`}
            >
              {getRiskIcon(result.risk_level)}
            </motion.div>
            <div>
              <h3 className="text-2xl font-cyber font-bold text-cyber-primary">
                Scan Complete
              </h3>
              <p className="text-gray-400 font-tech">Analysis Results</p>
            </div>
          </div>
          
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`px-4 py-2 rounded-full neon-border ${getRiskColor(result.risk_level)} font-cyber font-bold`}
          >
            {result.risk_level?.toUpperCase() || 'UNKNOWN'}
          </motion.div>
        </div>
        
        {/* Threat Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <label className="text-sm font-tech text-gray-400">Threat Detection</label>
            <div className={`flex items-center space-x-2 ${result.is_phishing ? 'text-red-400' : 'text-green-400'}`}>
              {result.is_phishing ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
              <span className="font-cyber font-bold">
                {result.is_phishing ? 'THREAT DETECTED' : 'SECURE'}
              </span>
            </div>
          </div>
          </div>
        
        {/* Details */}
        {result.details && (
          <div className="space-y-4">
            <h4 className="font-cyber font-bold text-lg text-cyber-primary">Analysis Details</h4>
            <div className="grid gap-3">
              {Object.entries(result.details).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-cyber-darker/50 rounded-lg">
                  <span className="font-tech text-gray-300 capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="font-cyber text-cyber-primary">
                    {formatValue(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Timestamp */}
        <div className="mt-6 pt-4 border-t border-cyber-primary/20 flex items-center justify-center space-x-2 text-gray-400">
          <Clock className="w-4 h-4" />
          <span className="font-tech text-sm">
            Scanned at {new Date().toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  )
}