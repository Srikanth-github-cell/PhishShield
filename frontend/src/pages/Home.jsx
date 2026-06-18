import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Scan, Mail, BarChart3, Zap, Globe, Eye, Cpu } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Scan,
      title: 'URL Analysis',
      description: 'Advanced URL scanning with machine learning detection algorithms and real-time threat intelligence',
      link: '/url-scanner',
      color: 'from-cyber-primary to-neon-blue'
    },
    {
      icon: Mail,
      title: 'Email Protection',
      description: 'Comprehensive email threat analysis and phishing detection with behavioral pattern recognition',
      link: '/email-scanner',
      color: 'from-neon-purple to-neon-pink'
    }
  ]
  
  const stats = [
    { label: 'Threats Blocked', value: '10M+', icon: Shield },
    { label: 'URLs Scanned', value: '50M+', icon: Globe },
    { label: 'Detection Rate', value: '99.9%', icon: Zap },
    { label: 'Response Time', value: '<100ms', icon: BarChart3 }
  ]

  const floatingIcons = [
    { Icon: Shield, delay: 0, position: { top: '20%', left: '10%' } },
    { Icon: Eye, delay: 1, position: { top: '60%', right: '15%' } },
    { Icon: Cpu, delay: 2, position: { top: '40%', left: '85%' } },
    { Icon: Scan, delay: 0.5, position: { top: '80%', left: '20%' } }
  ]
  
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
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block p-4 bg-gradient-to-r from-cyber-primary to-neon-blue rounded-2xl mb-6 relative"
              >
                <Shield className="w-16 h-16 text-black" />
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
              
              <motion.h1 
                className="text-6xl md:text-8xl font-cyber font-black"
                animate={{ textShadow: [
                  '0 0 20px rgba(0,255,136,0.5)',
                  '0 0 30px rgba(0,255,136,0.8)',
                  '0 0 20px rgba(0,255,136,0.5)'
                ]}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span 
                  className="text-cyber-primary"
                  animate={{ 
                    color: ['#00ff88', '#00ccff', '#00ff88']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Phish
                </motion.span>
                <span className="text-white">Guard</span>
              </motion.h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 font-tech max-w-3xl mx-auto leading-relaxed"
            >
              Advanced AI-powered phishing detection system. Protecting your digital world 
              from cyber threats with cutting-edge machine learning technology.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link to="/url-scanner">
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
                    y: -2
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyber-primary to-neon-blue text-black font-cyber font-bold text-lg rounded-xl neon-border border-cyber-primary transition-all relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="relative">Start Scanning</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="text-center space-y-3"
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      boxShadow: '0 10px 25px rgba(0,255,136,0.2)'
                    }}
                    className="inline-block p-4 glass-effect neon-border border-cyber-primary/30 rounded-xl relative"
                  >
                    <Icon className="w-8 h-8 text-cyber-primary" />
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{ 
                        background: [
                          'rgba(0,255,136,0.1)',
                          'rgba(0,255,136,0.2)',
                          'rgba(0,255,136,0.1)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <div>
                    <motion.div 
                      className="text-3xl font-cyber font-bold text-cyber-primary"
                      animate={{ 
                        textShadow: [
                          '0 0 10px rgba(0,255,136,0.5)',
                          '0 0 20px rgba(0,255,136,0.8)',
                          '0 0 10px rgba(0,255,136,0.5)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-gray-400 font-tech">{stat.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-cyber font-bold text-cyber-primary mb-6"
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(0,255,136,0.5)',
                  '0 0 30px rgba(0,255,136,0.8)',
                  '0 0 20px rgba(0,255,136,0.5)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Advanced Protection Suite
            </motion.h2>
            <p className="text-xl text-gray-300 font-tech max-w-2xl mx-auto">
              Comprehensive cybersecurity tools powered by artificial intelligence
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.02,
                    boxShadow: '0 20px 40px rgba(0,255,136,0.2)'
                  }}
                  className="group h-full"
                >
                  <Link to={feature.link} className="block h-full">
                    <div className="glass-effect neon-border border-cyber-primary/30 rounded-2xl p-8 h-full hover:border-cyber-primary/60 transition-all hologram relative overflow-hidden">
                      {/* Animated Background Effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-10"
                        animate={{ 
                          background: [
                            'linear-gradient(45deg, transparent, rgba(0,255,136,0.2), transparent)',
                            'linear-gradient(225deg, transparent, rgba(0,255,136,0.2), transparent)',
                            'linear-gradient(45deg, transparent, rgba(0,255,136,0.2), transparent)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      <div className="space-y-6 relative">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className={`inline-block p-4 bg-gradient-to-r ${feature.color} rounded-xl relative`}
                        >
                          <Icon className="w-8 h-8 text-black" />
                          {/* Icon Glow Effect */}
                          <motion.div
                            className="absolute inset-0 rounded-xl"
                            animate={{ 
                              boxShadow: [
                                '0 0 10px rgba(0,255,136,0.3)',
                                '0 0 20px rgba(0,255,136,0.6)',
                                '0 0 10px rgba(0,255,136,0.3)'
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                          />
                        </motion.div>
                        
                        <div>
                          <h3 className="text-2xl font-cyber font-bold text-white mb-3">
                            {feature.title}
                          </h3>
                          <p className="text-gray-400 font-tech leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                        
                        <motion.div
                          className="flex items-center text-cyber-primary group-hover:text-neon-blue transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <span className="font-tech font-bold">Launch Tool</span>
                          <motion.svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </motion.svg>
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Animated Section - Security Metrics */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <motion.div
              className="inline-block px-8 py-4 glass-effect neon-border border-cyber-primary/50 rounded-full"
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
                className="text-cyber-primary font-cyber font-bold text-lg"
                animate={{ 
                  textShadow: [
                    '0 0 10px rgba(0,255,136,0.5)',
                    '0 0 20px rgba(0,255,136,0.8)',
                    '0 0 10px rgba(0,255,136,0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🛡️ Real-time Protection Active
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}