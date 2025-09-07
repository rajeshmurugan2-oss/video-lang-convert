'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import JSZip from 'jszip'
import VideoUpload from './video-upload'
import LanguageSelector from './language-selector'
import ConversionResults from './conversion-results'

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

export default function VideoLanguageInterface() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [inputMethod, setInputMethod] = useState<'file' | 'youtube'>('file')
  const [targetLanguage, setTargetLanguage] = useState('es') // Spanish by default
  const [voiceType, setVoiceType] = useState('male') // 'male' or 'female'
  const [isConverting, setIsConverting] = useState(false)
  const [result, setResult] = useState<ConversionResult | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setYoutubeUrl('') // Clear YouTube URL
    setResult(null) // Clear previous results
    toast.success(`Video file selected: ${file.name}`)
  }

  const handleYoutubeUrlChange = (url: string) => {
    setYoutubeUrl(url)
    setSelectedFile(null) // Clear file selection
    setResult(null) // Clear previous results
    if (url) {
      toast.info('YouTube URL entered')
    }
  }

  const handleInputMethodChange = (method: 'file' | 'youtube') => {
    setInputMethod(method)
    setSelectedFile(null)
    setYoutubeUrl('')
    setResult(null)
    toast.info(`Switched to ${method === 'file' ? 'File Upload' : 'YouTube URL'}`)
  }

  const handleLanguageChange = (language: string) => {
    setTargetLanguage(language)
    setResult(null) // Clear previous results
    toast.info(`Target language changed to: ${language}`)
  }

  const handleConversion = async () => {
    if (inputMethod === 'file' && !selectedFile) {
      toast.error('Please select a video file first')
      return
    }

    if (inputMethod === 'youtube' && !youtubeUrl) {
      toast.error('Please enter a YouTube URL first')
      return
    }

    setIsConverting(true)
    toast.info('Starting video language conversion...')

    try {
      const formData = new FormData()
      
      if (inputMethod === 'file' && selectedFile) {
        formData.append('video', selectedFile)
        formData.append('inputType', 'file')
      } else if (inputMethod === 'youtube' && youtubeUrl) {
        formData.append('youtubeUrl', youtubeUrl)
        formData.append('inputType', 'youtube')
      }
      
      formData.append('targetLanguage', targetLanguage)
      formData.append('voiceType', voiceType)

      const response = await fetch('/api/convert-video', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Conversion failed')
      }

      setResult(data)
      toast.success('Video language conversion completed!')
    } catch (error) {
      console.error('Conversion error:', error)
      toast.error(error instanceof Error ? error.message : 'Conversion failed')
    } finally {
      setIsConverting(false)
    }
  }

  const handleNewConversion = () => {
    setSelectedFile(null)
    setYoutubeUrl('')
    setResult(null)
    setTargetLanguage('es')
    setInputMethod('file')
    toast.info('Ready for new conversion')
  }

  const handleDownload = () => {
    if (!result) return
    
    const content = `Video Language Conversion Result\n\n` +
      `Original Language: ${result.originalLanguage}\n` +
      `Target Language: ${result.language}\n` +
      `Duration: ${result.duration}s\n` +
      `Word Count: ${result.wordCount}\n` +
      `File: ${result.fileName}\n` +
      `Converted at: ${new Date(result.timestamp).toLocaleString()}\n\n` +
      `Processing Steps:\n${result.processingSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n` +
      `Original Text:\n${result.originalText}\n\n` +
      `Converted Text:\n${result.text}`
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted-${result.fileName.replace(/\.[^/.]+$/, '')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Conversion result downloaded!')
  }

  const handleDownloadAudio = () => {
    if (!result || !result.audioData) return
    
    try {
      // Convert base64 to blob
      const audioBytes = atob(result.audioData)
      const audioArray = new Uint8Array(audioBytes.length)
      for (let i = 0; i < audioBytes.length; i++) {
        audioArray[i] = audioBytes.charCodeAt(i)
      }
      
      const audioBlob = new Blob([audioArray], { type: `audio/${result.audioFormat}` })
      const url = URL.createObjectURL(audioBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `converted-audio-${result.fileName.replace(/\.[^/.]+$/, '')}.${result.audioFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Converted audio downloaded!')
    } catch (error) {
      console.error('Audio download error:', error)
      toast.error('Failed to download audio')
    }
  }

  const handleDownloadSpeakerAudio = (segment: SpeakerSegment) => {
    if (!segment.audioData) return
    
    try {
      // Convert base64 to blob
      const audioBytes = atob(segment.audioData)
      const audioArray = new Uint8Array(audioBytes.length)
      for (let i = 0; i < audioBytes.length; i++) {
        audioArray[i] = audioBytes.charCodeAt(i)
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/mp3' })
      const url = URL.createObjectURL(audioBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${segment.speaker.replace(' ', '-')}-${result?.fileName.replace(/\.[^/.]+$/, '') || 'audio'}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success(`${segment.speaker} audio downloaded!`)
    } catch (error) {
      console.error('Speaker audio download error:', error)
      toast.error('Failed to download speaker audio')
    }
  }

  const handleDownloadExcel = () => {
    if (!result || !result.speakerSegments) return
    
    try {
      // Create CSV content (Excel can open CSV files)
      const headers = ['Speaker', 'Start Time', 'End Time', 'Duration (s)', 'Original Text', 'Translated Text', 'Voice']
      const rows = result.speakerSegments.map(segment => [
        segment.speaker,
        formatDuration(segment.startTime),
        formatDuration(segment.endTime),
        segment.duration.toFixed(2),
        `"${segment.text.replace(/"/g, '""')}"`, // Escape quotes for CSV
        `"${segment.translatedText.replace(/"/g, '""')}"`,
        segment.voice
      ])
      
      const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `speaker-breakdown-${result.fileName.replace(/\.[^/.]+$/, '')}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Speaker breakdown downloaded as Excel file!')
    } catch (error) {
      console.error('Excel download error:', error)
      toast.error('Failed to download Excel file')
    }
  }

  const handleDownloadAllAudio = async () => {
    if (!result || !result.speakerSegments) return
    
    try {
      toast.info('Creating ZIP file with all speaker audio...')
      
      const zip = new JSZip()
      const audioFolder = zip.folder('speaker-audio')
      
      if (!audioFolder) {
        throw new Error('Failed to create audio folder in ZIP')
      }
      
      // Add each speaker audio to the ZIP with smart naming
      for (let i = 0; i < result.speakerSegments.length; i++) {
        const segment = result.speakerSegments[i]
        if (!segment.audioData) continue
        
        // Create smart filename: "Speaker 1_0:10 - 0:37_(0:26)"
        const startTime = formatDuration(segment.startTime)
        const endTime = formatDuration(segment.endTime)
        const duration = formatDuration(segment.duration)
        const smartName = `${segment.speaker}_${startTime} - ${endTime}_(${duration})`
        
        // Convert base64 to binary
        const audioBytes = atob(segment.audioData)
        const audioArray = new Uint8Array(audioBytes.length)
        for (let j = 0; j < audioBytes.length; j++) {
          audioArray[j] = audioBytes.charCodeAt(j)
        }
        
        // Add to ZIP
        audioFolder.file(`${smartName}.mp3`, audioArray)
      }
      
      // Add a README file to the ZIP
      const readmeContent = `Speaker Audio Files
==================

This ZIP contains individual audio files for each speaker segment from your video language conversion.

File Naming Format:
- Speaker Name_Start Time - End Time_(Duration).mp3
- Example: Speaker 1_0:10 - 0:37_(0:26).mp3

Total Files: ${result.speakerSegments.length}
Original Video: ${result.fileName}
Target Language: ${result.language}
Generated: ${new Date().toLocaleString()}

You can use these individual audio files for:
- Video editing software
- Audio mixing
- Creating custom video versions
- Quality control and review

Each file contains the translated speech for that specific speaker segment.
`
      
      zip.file('README.txt', readmeContent)
      
      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      
      // Download ZIP file
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `speaker-audio-${result.fileName.replace(/\.[^/.]+$/, '')}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success(`Downloaded ZIP with ${result.speakerSegments.length} speaker audio files!`)
    } catch (error) {
      console.error('ZIP download error:', error)
      toast.error('Failed to create ZIP file')
    }
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Video Language Conversion</h3>
        
        <div className="space-y-6">
          {/* Input Method Tabs */}
          <div>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => handleInputMethodChange('file')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  inputMethod === 'file'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📁 Upload File
              </button>
              <button
                type="button"
                onClick={() => handleInputMethodChange('youtube')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  inputMethod === 'youtube'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🎥 YouTube URL
              </button>
            </div>
          </div>

          {/* Video Input */}
          {inputMethod === 'file' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Video File
              </label>
              <VideoUpload 
                onFileSelect={handleFileSelect}
                disabled={isConverting}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  disabled={isConverting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-sm text-gray-500">
                  Paste any YouTube video URL to convert its language
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 How to Use YouTube Videos:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Copy the YouTube URL above</li>
                    <li>Use a YouTube downloader (yt-dlp, 4K Video Downloader, or online converters)</li>
                    <li>Download the video as MP4, AVI, or other supported format</li>
                    <li>Switch to "📁 Upload File" tab and upload the downloaded video</li>
                    <li>Select target language and convert</li>
                  </ol>
                  <p className="text-xs text-blue-700 mt-2">
                    <strong>Why?</strong> YouTube blocks direct downloads due to their terms of service.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Language
            </label>
            <LanguageSelector 
              selectedLanguage={targetLanguage}
              onLanguageChange={handleLanguageChange}
              disabled={isConverting}
            />
          </div>

          {/* Voice Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="voiceType"
                  value="male"
                  checked={voiceType === 'male'}
                  onChange={(e) => setVoiceType(e.target.value)}
                  disabled={isConverting}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">👨 Male Voices</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="voiceType"
                  value="female"
                  checked={voiceType === 'female'}
                  onChange={(e) => setVoiceType(e.target.value)}
                  disabled={isConverting}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">👩 Female Voices</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {voiceType === 'male' 
                ? 'Uses deep male voices (Onyx & Echo) for masculine conversations'
                : 'Uses warm female voices (Nova & Shimmer) for feminine conversations'
              }
            </p>
          </div>

          {/* Convert Button */}
          <div className="flex justify-center">
            <button
              onClick={handleConversion}
              disabled={isConverting || (inputMethod === 'file' && !selectedFile) || (inputMethod === 'youtube' && !youtubeUrl)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
            >
              {isConverting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
                  </svg>
                  <span>Convert Video Language</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
          <ConversionResults
            result={result}
            onDownload={handleDownload}
            onDownloadAudio={handleDownloadAudio}
            onDownloadSpeakerAudio={handleDownloadSpeakerAudio}
            onDownloadAllAudio={handleDownloadAllAudio}
            onDownloadExcel={handleDownloadExcel}
            onNewConversion={handleNewConversion}
          />
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h4>
        <ul className="space-y-2 text-blue-800">
          <li>• <strong>Upload File:</strong> Drag & drop or select a video file (MP4, AVI, MOV, etc.)</li>
          <li>• <strong>Select Language:</strong> Choose target language for translation</li>
          <li>• <strong>AI Processing:</strong> Transcribe → Translate → Generate new audio</li>
          <li>• <strong>Download Results:</strong> Get translated text and new audio file</li>
          <li>• <strong>Video Assembly:</strong> Use video editing software to combine original video with new audio</li>
        </ul>
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h5 className="font-semibold text-yellow-900 mb-2">🎬 For Complete Video Conversion:</h5>
          <p className="text-sm text-yellow-800">
            This app provides the translated audio. To create the final video, use video editing software 
            (like DaVinci Resolve, Adobe Premiere, or free tools like OpenShot) to replace the original 
            audio with the generated audio file.
          </p>
        </div>
      </div>
    </div>
  )
}
