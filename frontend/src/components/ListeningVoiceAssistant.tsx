'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Conversation } from '@11labs/client'
import { getSignedUrlListening } from '@/app/actions/getSignedUrlListening'

interface ListeningVoiceAssistantProps {
  onAudioStart: () => void
  onAudioEnd: () => void
  onAudioProgress: (current: number, total: number) => void
}

export default function ListeningVoiceAssistant({ 
  onAudioStart, 
  onAudioEnd, 
  onAudioProgress 
}: ListeningVoiceAssistantProps) {
  const [conversation, setConversation] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [audioStarted, setAudioStarted] = useState(false)

  const startListening = async () => {
    try {
      setConnectionStatus('connecting')
      console.log('🎧 Starting listening session...')
      
      // Get signed URL using server action for listening agent
      const result = await getSignedUrlListening()
      console.log('🔗 Listening URL result:', result)
      
      const { signedUrl } = result
      console.log('🎯 Listening signedUrl:', signedUrl)
      
      if (!signedUrl) {
        console.error('❌ No signed URL received')
        throw new Error('Failed to get signed URL for listening')
      }

      const conv = await Conversation.startSession({
        signedUrl,
        onMessage: (message) => {
          console.log('🎧 Listening message received:', message)
          console.log('🎧 Message source:', message.source)
          console.log('🎧 Message content:', message.message)
          
          // For listening tests, trigger on any message from the agent
          if (message.source !== 'user' && !audioStarted) {
            console.log('🎯 Agent started speaking, triggering audio start')
            setAudioStarted(true)
            onAudioStart()
          }
        },
        onError: (error) => {
          console.error('Listening conversation error:', error)
          setConnectionStatus('disconnected')
          setIsPlaying(false)
        },
        onStatusChange: (status) => {
          console.log('Listening connection status:', status)
          setConnectionStatus(
            status.status === 'connected' ? 'connected' : 'disconnected'
          )
        },
        onModeChange: (mode) => {
          console.log('🎧 Listening mode change:', mode)
          console.log('🎧 Mode details:', mode.mode)
          const speaking = mode.mode === 'speaking'
          setIsPlaying(speaking)
          
          if (speaking) {
            console.log('🔊 Agent is now speaking!')
            if (!audioStarted) {
              console.log('🎯 First time agent speaking, triggering audio start')
              setAudioStarted(true)
              onAudioStart()
            }
          } else if (!speaking && audioStarted) {
            console.log('🔇 Agent stopped speaking')
            onAudioEnd()
          }
        },
      })
      
      setConversation(conv)
      setConnectionStatus('connected')
      
      // Try multiple trigger approaches to get the agent speaking
      console.log('🚀 Connection established, attempting multiple triggers...')
      
      // Log all available methods on the conversation object
      console.log('🔍 Available conversation methods:', Object.getOwnPropertyNames(conv.__proto__))
      
      // Approach 1: Send a message after 1 second
      setTimeout(() => {
        if (conv) {
          console.log('🎯 Trigger 1: Sending "Start"...')
          try {
            conv.sendUserMessage('Start')
            console.log('✅ Message "Start" sent successfully')
          } catch (error) {
            console.error('❌ Failed to send "Start":', error)
          }
        }
      }, 1000)
      
      // Approach 2: Send different message after 3 seconds
      setTimeout(() => {
        if (conv) {
          console.log('🎯 Trigger 2: Sending "Begin listening test"...')
          try {
            conv.sendUserMessage('Begin listening test')
            console.log('✅ Message "Begin listening test" sent successfully')
          } catch (error) {
            console.error('❌ Failed to send "Begin listening test":', error)
          }
        }
      }, 3000)
      
      // Approach 3: Try empty message after 5 seconds
      setTimeout(() => {
        if (conv) {
          console.log('🎯 Trigger 3: Sending empty message...')
          try {
            conv.sendUserMessage(' ')
            console.log('✅ Empty message sent successfully')
          } catch (error) {
            console.error('❌ Failed to send empty message:', error)
          }
        }
      }, 5000)
    } catch (error) {
      console.error('Failed to start listening session:', error)
      setConnectionStatus('disconnected')
      setIsPlaying(false)
    }
  }

  const stopListening = async () => {
    if (conversation) {
      await conversation.endSession()
      setConversation(null)
      setIsPlaying(false)
      setConnectionStatus('disconnected')
      setAudioStarted(false)
      onAudioEnd()
    }
  }

  // Simulate audio progress for UI feedback
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      let currentTime = 0
      const totalTime = 120 // Assume 2 minutes for demo
      
      interval = setInterval(() => {
        currentTime += 1
        onAudioProgress(currentTime, totalTime)
        
        if (currentTime >= totalTime) {
          clearInterval(interval)
          onAudioEnd()
          setIsPlaying(false)
        }
      }, 1000)
    }
    
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPlaying, onAudioProgress, onAudioEnd])

  return (
    <div className="flex flex-col items-center space-y-6">
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
          font-medium capitalize
        `}
      >
        {connectionStatus}
      </Badge>

      {/* Audio Visualization */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-32 h-32"
      >
        {/* Base Circle */}
        <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${
          isPlaying ? 'bg-blue-600' : 'bg-gray-600'
        }`} />
        <div className="absolute inset-[10%] rounded-full bg-gray-800" />
        
        {/* Pulse Effects when playing */}
        {isPlaying && (
          <div className="absolute inset-[15%]">
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-15 animate-pulse animation-delay-200" />
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-10 animate-pulse animation-delay-400" />
          </div>
        )}
        
        {/* Volume Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isPlaying ? (
            <Volume2 className="w-8 h-8 text-white" />
          ) : (
            <VolumeX className="w-8 h-8 text-gray-400" />
          )}
        </div>
      </motion.div>

      {/* Control Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={conversation ? stopListening : startListening}
        disabled={connectionStatus === 'connecting'}
        className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-colors ${
          conversation
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } disabled:bg-gray-400 disabled:cursor-not-allowed`}
      >
        {connectionStatus === 'connecting' ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Connecting...</span>
          </>
        ) : conversation ? (
          <>
            <Pause className="w-4 h-4" />
            <span>Stop Listening</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Start Listening Test</span>
          </>
        )}
      </motion.button>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-400 max-w-md">
        <p>
          Click &quot;Start Listening Test&quot; to begin the audio content. 
          The test will automatically proceed through the listening material.
        </p>
      </div>
    </div>
  )
}