'use client'

import { useState } from 'react'

interface SpeakerSegment {
  speaker: string
  text: string
  translatedText: string
  startTime: number
  endTime: number
  duration: number
  voice: string
  audioSize: number
  audioData: string
}

interface ConversionResult {
  text: string
  originalText: string
  language: string
  originalLanguage: string
  duration: number
  wordCount: number
  fileName: string
  fileSize: number
  audioData: string
  audioFormat: string
  timestamp: string
  processingSteps: string[]
  speakerSegments: SpeakerSegment[]
}

interface ConversionResultsProps {
  result: ConversionResult
  onDownload: () => void
  onDownloadAudio: () => void
  onDownloadSpeakerAudio: (segment: SpeakerSegment) => void
  onDownloadAllAudio: () => void
  onDownloadExcel: () => void
  onNewConversion: () => void
}

export default function ConversionResults({ result, onDownload, onDownloadAudio, onDownloadSpeakerAudio, onDownloadAllAudio, onDownloadExcel, onNewConversion }: ConversionResultsProps) {
  const [copied, setCopied] = useState(false)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const playAudio = (segment: SpeakerSegment) => {
    if (!segment.audioData) return
    
    try {
      // Convert base64 to blob
      const audioBytes = atob(segment.audioData)
      const audioArray = new Uint8Array(audioBytes.length)
      for (let i = 0; i < audioBytes.length; i++) {
        audioArray[i] = audioBytes.charCodeAt(i)
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/mp3' })
      const audioUrl = URL.createObjectURL(audioBlob)
      
      // Stop any currently playing audio
      if (playingAudio) {
        const currentAudio = document.getElementById(`audio-${playingAudio}`) as HTMLAudioElement
        if (currentAudio) {
          currentAudio.pause()
          currentAudio.currentTime = 0
        }
      }
      
      // Play new audio
      const audio = new Audio(audioUrl)
      audio.id = `audio-${segment.speaker}`
      audio.onended = () => {
        setPlayingAudio(null)
        URL.revokeObjectURL(audioUrl)
      }
      audio.onerror = () => {
        setPlayingAudio(null)
        URL.revokeObjectURL(audioUrl)
      }
      
      setPlayingAudio(segment.speaker)
      audio.play()
    } catch (error) {
      console.error('Audio playback error:', error)
      setPlayingAudio(null)
    }
  }

  const stopAudio = () => {
    if (playingAudio) {
      const audio = document.getElementById(`audio-${playingAudio}`) as HTMLAudioElement
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
      setPlayingAudio(null)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Success Header */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              ✅ Video Language Conversion Complete!
            </h3>
            <div className="mt-1 text-sm text-green-700">
              <p>Your video has been converted to {result.language.toUpperCase()}. The converted text is displayed below.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-3">🔄 Processing Steps Completed</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {result.processingSteps.map((step, index) => (
            <div key={index} className="flex items-center text-sm text-blue-800">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* File Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">📁 File Details</h4>
          <p className="text-sm text-gray-600">Name: {result.fileName}</p>
          <p className="text-sm text-gray-600">Size: {formatFileSize(result.fileSize)}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">⏱️ Duration</h4>
          <p className="text-sm text-gray-600">Length: {formatDuration(result.duration)}</p>
          <p className="text-sm text-gray-600">Words: {result.wordCount.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">🌐 Language</h4>
          <p className="text-sm text-gray-600">From: {result.originalLanguage.toUpperCase()}</p>
          <p className="text-sm text-gray-600">To: {result.language.toUpperCase()}</p>
        </div>
      </div>

      {/* Speaker Segments */}
      {result.speakerSegments && result.speakerSegments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">👥 Speaker Breakdown</h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={onDownloadAllAudio}
                className="flex items-center text-sm bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                📦 Download All as ZIP
              </button>
              <button
                onClick={onDownloadExcel}
                className="flex items-center text-sm bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                📊 Download Excel
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {result.speakerSegments.map((segment, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      segment.speaker === 'Speaker 1' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {segment.speaker}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDuration(segment.startTime)} - {formatDuration(segment.endTime)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({formatDuration(segment.duration)})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                      Voice: {segment.voice}
                    </span>
                    <button
                      onClick={() => onDownloadSpeakerAudio(segment)}
                      className="flex items-center text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 font-medium"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      🎵 Audio
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Original:</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {segment.text}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Translated:</h5>
                    <p className="text-sm text-gray-900 bg-blue-50 p-2 rounded">
                      {segment.translatedText}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Audio:</h5>
                    <div className="bg-purple-50 p-2 rounded">
                      <p className="text-xs text-gray-600 mb-2">
                        Voice: {segment.voice}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        Size: {(segment.audioSize / 1024).toFixed(1)} KB
                      </p>
                      <div className="flex space-x-1 mb-2">
                        <button
                          onClick={() => playAudio(segment)}
                          disabled={playingAudio === segment.speaker}
                          className="flex-1 flex items-center justify-center text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 font-medium disabled:opacity-50"
                        >
                          {playingAudio === segment.speaker ? (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Playing...
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-7a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              ▶️ Play
                            </>
                          )}
                        </button>
                        {playingAudio === segment.speaker && (
                          <button
                            onClick={stopAudio}
                            className="flex-1 flex items-center justify-center text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 font-medium"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                            </svg>
                            ⏹️ Stop
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => onDownloadSpeakerAudio(segment)}
                        className="w-full flex items-center justify-center text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 font-medium"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                        </svg>
                        📥 Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Converted Text */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">📝 Complete Conversation</h4>
          <button
            onClick={copyToClipboard}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Text
              </>
            )}
          </button>
        </div>
        
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="max-h-96 overflow-y-auto">
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap text-base">
              {result.text}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={copyToClipboard}
          className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          📋 Copy Text
        </button>
        
        <button
          onClick={onDownload}
          className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          💾 Download Text
        </button>
        
        <button
          onClick={onDownloadAudio}
          className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          🎵 Download Audio
        </button>
        
        <button
          onClick={onNewConversion}
          className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          🆕 New Conversion
        </button>
      </div>
    </div>
  )
}
