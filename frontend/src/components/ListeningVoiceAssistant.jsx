// components/ListeningVoiceAssistant.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Square, Volume2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Conversation } from '@11labs/client'
import { getSignedUrlListening } from '@/app/actions/getSignedUrlListening'

export default function ListeningVoiceAssistant({ onAudioStart, onAudioEnd, onAudioProgress }) {
  const [conversation, setConversation] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [audioStatus, setAudioStatus] = useState('🔊 Ready to play')
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  
  const timeIntervalRef = useRef(null)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (conversation) {
        conversation.endSession()
      }
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current)
      }
    }
  }, [conversation])

  // Timer for tracking audio progress
  const startTimer = (estimatedDuration = 90) => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current)
    }

    setCurrentTime(0)
    setDuration(estimatedDuration)
    
    timeIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + 1
        if (onAudioProgress) {
          onAudioProgress(newTime, estimatedDuration)
        }
        
        if (newTime >= estimatedDuration) {
          if (timeIntervalRef.current) {
            clearInterval(timeIntervalRef.current)
          }
          return estimatedDuration
        }
        return newTime
      })
    }, 1000)
  }

  const stopTimer = () => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current)
    }
  }

  const startListening = async () => {
    try {
      setConnectionStatus('connecting')
      setAudioStatus('🎤 Connecting to voice service...')
      
      // Get signed URL using server action for listening agent
      const { signedUrl } = await getSignedUrlListening()
      console.log('Listening signedUrl', signedUrl)
      
      if (!signedUrl) {
        throw new Error('Failed to get signed URL for listening agent')
      }

      const conv = await Conversation.startSession({
        signedUrl,
        onMessage: (message) => {
          console.log('Listening audio message:', message)
          // For listening tests, we only care about agent messages (one-way audio)
          if (message.source === 'agent') {
            // This is the agent speaking - the listening content
          }
        },
        onError: (error) => {
          console.error('Listening conversation error:', error)
          setConnectionStatus('disconnected')
          setAudioStatus('❌ Connection error')
          setIsPlaying(false)
          stopTimer()
          if (onAudioEnd) onAudioEnd()
        },
        onStatusChange: (status) => {
          console.log('Listening connection status:', status)
          setConnectionStatus(status.status === 'connected' ? 'connected' : 'disconnected')
        },
        onModeChange: (mode) => {
          console.log('Listening mode:', mode)
          const isSpeaking = mode.mode === 'speaking'
          setIsPlaying(isSpeaking)
          
          if (isSpeaking) {
            setAudioStatus('🔊 Playing listening content...')
            startTimer()
            if (onAudioStart) onAudioStart()
          } else {
            setAudioStatus('⏸️ Audio paused')
            stopTimer()
          }
        },
      })
      
      setConversation(conv)
      setConnectionStatus('connected')
      setAudioStatus('✅ Connected - Ready to play')
      
    } catch (error) {
      console.error('Failed to start listening session:', error)
      setConnectionStatus('disconnected')
      setAudioStatus('❌ Failed to connect')
    }
  }

  const stopListening = async () => {
    if (conversation) {
      await conversation.endSession()
      setConversation(null)
      setIsPlaying(false)
      setConnectionStatus('disconnected')
      setAudioStatus('⏹️ Audio stopped')
      stopTimer()
      setCurrentTime(0)
      if (onAudioEnd) onAudioEnd()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-700">
      <div className="flex flex-col items-center space-y-4">
        {/* Status Badge */}
        <Badge
          variant="outline"
          className={`
            ${
              connectionStatus === 'connected'
                ? 'bg-green-500/20 text-green-500 border-green-500/50'
                : connectionStatus === 'connecting'
                ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
                : 'bg-red-500/20 text-red-500 border-red-500/50'
            }
            font-medium capitalize mb-2
          `}
        >
          {connectionStatus}
        </Badge>

        {/* Audio Visualization */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-24 h-24 mx-auto mb-4"
        >
          <div className="relative w-full h-full">
            <div
              className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                isPlaying ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            />
            <div className="absolute inset-[10%] rounded-full bg-gray-900" />
            
            {/* Pulse Effects when playing */}
            {isPlaying && (
              <div className="absolute inset-[15%]">
                <div className="absolute inset-0 rounded-full bg-blue-600 opacity-20 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-blue-600 opacity-15 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            )}
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Audio Status */}
        <p className="text-sm text-gray-300 text-center">{audioStatus}</p>

        {/* Time Display */}
        {(duration > 0 || currentTime > 0) && (
          <div className="text-center">
            <div className="text-lg font-mono text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <div className="w-64 bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex space-x-3">
          {!conversation ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startListening}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>Start Audio</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopListening}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <Square className="w-5 h-5" />
              <span>Stop Audio</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}