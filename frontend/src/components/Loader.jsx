import { motion } from 'framer-motion'

export default function Loader({ message = 'Scanning...' }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Spinning rings */}
      <div className="relative w-24 h-24">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-transparent rounded-full"
            style={{
              borderTopColor: i === 0 ? '#00ff88' : i === 1 ? '#0088ff' : '#aa00ff',
              borderRightColor: i === 0 ? '#00ff88' : i === 1 ? '#0088ff' : '#aa00ff',
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1 + i * 0.2,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
        
        {/* Center pulse */}
        <motion.div
          className="absolute inset-4 bg-gradient-to-r from-cyber-primary to-neon-blue rounded-full"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
      
      {/* Loading text */}
      <motion.div
        className="text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <p className="text-cyber-primary font-cyber font-bold text-lg">{message}</p>
        <div className="flex justify-center space-x-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-cyber-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
