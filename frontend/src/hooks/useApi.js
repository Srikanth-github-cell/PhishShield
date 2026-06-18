import { useState, useCallback } from 'react'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const BASE_URL = 'http://localhost:5000'
  
  const apiCall = useCallback(async (endpoint, options = {}) => {
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
  }, [])
  
  const scanUrl = useCallback(async (url) => {
    return await apiCall('/scan_url', {
      method: 'POST',
      body: JSON.stringify({ url })
    })
  }, [apiCall])
  
  const scanEmail = useCallback(async (emailData) => {
    return await apiCall('/scan_email', {
      method: 'POST',
      body: JSON.stringify(emailData)
    })
  }, [apiCall])
  
  const healthCheck = useCallback(async () => {
    return await apiCall('/health')
  }, [apiCall])
  
  return {
    loading,
    error,
    scanUrl,
    scanEmail,
    healthCheck
  }
}

