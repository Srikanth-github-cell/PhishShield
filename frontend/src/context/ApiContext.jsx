import { createContext, useContext, useState } from 'react'

const ApiContext = createContext()

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  return context
}

export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const BASE_URL = 'http://localhost:5000'
  
  const apiCall = async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  const scanUrl = async (url) => {
    return await apiCall('/scan_url', {
      method: 'POST',
      body: JSON.stringify({ url })
    })
  }
  
  const scanEmail = async (emailData) => {
    return await apiCall('/scan_email', {
      method: 'POST',
      body: JSON.stringify(emailData)
    })
  }
  
  const healthCheck = async () => {
    return await apiCall('/health')
  }
  
  const value = {
    loading,
    error,
    scanUrl,
    scanEmail,
    healthCheck
  }
  
  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  )
}

