import { motion } from 'framer-motion'

// Page transition variants
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
}

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
}

// Stagger animation for lists
export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

// Hologram effect
export const hologramVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  },
  hover: {
    scale: 1.02,
    rotateY: 5,
    transition: { duration: 0.3 }
  }
}

// Scanning animation
export const scanAnimation = {
  animate: {
    x: ['-100%', '100%'],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'linear'
    }
  }
}

// Glow pulse animation
export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 5px currentColor',
      '0 0 20px currentColor, 0 0 30px currentColor',
      '0 0 5px currentColor'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// Matrix rain effect
export const matrixRain = {
  animate: {
    y: ['0vh', '100vh'],
    opacity: [0, 1, 0],
    transition: {
      duration: Math.random() * 3 + 2,
      repeat: Infinity,
      ease: 'linear',
      delay: Math.random() * 2
    }
  }
}

// Cyber grid animation
export const cyberGrid = {
  animate: {
    backgroundPosition: ['0px 0px', '40px 40px'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

// 3D card rotation
export const card3D = {
  initial: { rotateY: -90, opacity: 0 },
  animate: { rotateY: 0, opacity: 1 },
  hover: { 
    rotateY: 10,
    scale: 1.05,
    transition: { duration: 0.3 }
  },
  tap: { scale: 0.95 }
}

// Floating animation
export const floating = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// Cyber text typing effect
export const typeWriter = {
  hidden: { width: 0 },
  visible: {
    width: 'auto',
    transition: {
      duration: 2,
      ease: 'steps(10)'
    }
  }
}

// Neon border animation
export const neonBorder = {
  animate: {
    borderColor: [
      '#00ff88',
      '#0088ff', 
      '#aa00ff',
      '#ff0088',
      '#00ff88'
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

// Data stream animation
export const dataStream = {
  animate: {
    backgroundPosition: ['0% 0%', '100% 100%'],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}
