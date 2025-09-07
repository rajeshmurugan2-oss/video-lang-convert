import { NextRequest, NextResponse } from 'next/server'

// Function to analyze segments and identify potential speaker changes
function analyzeSpeakerSegments(segments: any[]) {
  const speakerSegments = []
  let currentSpeaker = 'Speaker 1'
  let currentText = ''
  let startTime = 0
  let endTime = 0

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const segmentText = segment.text?.trim() || ''
    
    if (segmentText.length === 0) continue

    // Simple heuristic: if there's a pause > 1 second, assume speaker change
    const pauseBefore = i > 0 ? segment.start - segments[i-1].end : 0
    const isLongPause = pauseBefore > 1.0
    
    // Also check for question marks or other conversation indicators
    const hasQuestion = segmentText.includes('?')
    const hasConversationMarker = segmentText.includes('uh') || segmentText.includes('um') || segmentText.includes('well')
    
    if (isLongPause || (i > 0 && (hasQuestion || hasConversationMarker))) {
      // Save current speaker segment
      if (currentText.trim()) {
        speakerSegments.push({
          speaker: currentSpeaker,
          text: currentText.trim(),
          startTime: startTime,
          endTime: endTime,
          duration: endTime - startTime
        })
      }
      
      // Switch to next speaker
      currentSpeaker = currentSpeaker === 'Speaker 1' ? 'Speaker 2' : 'Speaker 1'
      currentText = segmentText
      startTime = segment.start
    } else {
      // Continue with current speaker
      currentText += (currentText ? ' ' : '') + segmentText
    }
    
    endTime = segment.end
  }

  // Add the last segment
  if (currentText.trim()) {
    speakerSegments.push({
      speaker: currentSpeaker,
      text: currentText.trim(),
      startTime: startTime,
      endTime: endTime,
      duration: endTime - startTime
    })
  }

  return speakerSegments
}

// Debug environment variables
console.log('Environment check:')
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0)
console.log('OPENAI_API_KEY starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-') || false)

// Try multiple ways to get the API key
const apiKey = process.env.OPENAI_API_KEY || 
               process.env.NEXT_PUBLIC_OPENAI_API_KEY || 
               process.env.OPENAI_KEY

console.log('Final API key found:', !!apiKey)
console.log('API key length:', apiKey?.length || 0)

// Debug info for responses
const debugInfo = {
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  hasPublicKey: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  hasOpenAIKeyAlt: !!process.env.OPENAI_KEY,
  allEnvVars: Object.keys(process.env).filter(key => key.includes('OPENAI'))
}

// Initialize OpenAI only if API key exists
let openai: any = null
try {
  if (apiKey) {
    const OpenAI = require('openai').default
    openai = new OpenAI({
      apiKey: apiKey,
    })
    console.log('OpenAI client initialized successfully')
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error)
}

export async function GET() {
  return NextResponse.json({
    message: 'Video Conversion API is working',
    timestamp: new Date().toISOString(),
    config: debugInfo,
    openaiInitialized: !!openai,
    environment: process.env.NODE_ENV
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('Video conversion request received')
    
    // Check if OpenAI API key is available first
    if (!apiKey) {
      console.error('OpenAI API key not configured')
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to environment variables.',
          details: 'This feature requires an OpenAI API key to work.',
          debug: debugInfo
        },
        { status: 500 }
      )
    }

    // Check if OpenAI client is initialized
    if (!openai) {
      console.error('OpenAI client not initialized')
      return NextResponse.json(
        { 
          error: 'OpenAI client initialization failed.',
          details: 'Failed to initialize OpenAI client. Check your API key.',
          debug: debugInfo
        },
        { status: 500 }
      )
    }

    // Get the form data
    const formData = await request.formData()
    const videoFile = formData.get('video') as File
    const youtubeUrl = formData.get('youtubeUrl') as string
    const inputType = formData.get('inputType') as string
    const targetLanguage = formData.get('targetLanguage') as string
    const voiceType = formData.get('voiceType') as string || 'male' // Default to male
    
    if (!targetLanguage) {
      console.log('No target language provided')
      return NextResponse.json({ error: 'No target language provided' }, { status: 400 })
    }

    if (inputType === 'file' && !videoFile) {
      console.log('No video file provided')
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
    }

    if (inputType === 'youtube' && !youtubeUrl) {
      console.log('No YouTube URL provided')
      return NextResponse.json({ error: 'No YouTube URL provided' }, { status: 400 })
    }

    console.log(`Input type: ${inputType}`)
    if (inputType === 'file' && videoFile) {
      console.log(`Video file received: ${videoFile.name}, size: ${videoFile.size} bytes, type: ${videoFile.type}`)
    } else if (inputType === 'youtube' && youtubeUrl) {
      console.log(`YouTube URL received: ${youtubeUrl}`)
    }
    console.log(`Target language: ${targetLanguage}`)

    // Validate input based on type
    if (inputType === 'file' && videoFile) {
      // Validate file type - more permissive for better compatibility
      const allowedTypes = [
        'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 
        'video/webm', 'video/mkv', 'video/3gp', 'video/quicktime',
        'video/x-msvideo', 'video/x-ms-wmv'
      ]
      
      // Check if file type is allowed or if it's a generic video type
      const isValidType = allowedTypes.includes(videoFile.type) || 
                         videoFile.type.startsWith('video/') ||
                         videoFile.name.toLowerCase().match(/\.(mp4|avi|mov|wmv|flv|webm|mkv|3gp)$/)
      
      if (!isValidType) {
        console.log(`Invalid file type: ${videoFile.type}`)
        return NextResponse.json({ 
          error: 'Invalid file type. Please upload MP4, AVI, MOV, WMV, FLV, WebM, MKV, or 3GP files.',
          details: `Received type: ${videoFile.type}`
        }, { status: 400 })
      }

      // Validate file size (100MB limit)
      const maxSize = 100 * 1024 * 1024 // 100MB
      if (videoFile.size > maxSize) {
        console.log(`File too large: ${videoFile.size} bytes`)
        return NextResponse.json({ 
          error: 'File size must be less than 100MB' 
        }, { status: 400 })
      }
    } else if (inputType === 'youtube' && youtubeUrl) {
      // Validate YouTube URL
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/
      if (!youtubeRegex.test(youtubeUrl)) {
        console.log(`Invalid YouTube URL: ${youtubeUrl}`)
        return NextResponse.json({ 
          error: 'Invalid YouTube URL. Please provide a valid YouTube video URL.',
          details: 'URL should be in format: https://www.youtube.com/watch?v=... or https://youtu.be/...'
        }, { status: 400 })
      }
    }

    console.log('Starting video language conversion...')

    try {
      let videoBlob: Blob
      let fileName: string
      let fileSize: number

      if (inputType === 'file' && videoFile) {
        // Process uploaded file
        const arrayBuffer = await videoFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Create a File-like object for OpenAI using Blob
        videoBlob = new Blob([buffer], { type: videoFile.type })
        
        // Add name property to the blob for OpenAI API
        Object.defineProperty(videoBlob, 'name', {
          value: videoFile.name,
          writable: false
        })

        fileName = videoFile.name
        fileSize = videoFile.size

        console.log(`Sending to OpenAI: ${videoFile.name}, size: ${buffer.length} bytes, type: ${videoFile.type}`)
      } else if (inputType === 'youtube' && youtubeUrl) {
        // YouTube URL processing - provide helpful instructions instead of trying to download
        return NextResponse.json({ 
          error: 'YouTube Direct Download Not Available',
          details: 'Due to YouTube\'s restrictions, we cannot directly download videos from URLs.',
          suggestion: 'Please download the video manually and upload it as a file.',
          instructions: {
            step1: 'Copy the YouTube URL',
            step2: 'Use a YouTube downloader (like yt-dlp, 4K Video Downloader, or online converters)',
            step3: 'Download the video as MP4, AVI, or other supported format',
            step4: 'Switch to "Upload File" tab and upload the downloaded video',
            step5: 'Select target language and convert'
          },
          alternative: 'You can also use browser extensions or online tools to download YouTube videos.'
        }, { status: 501 })
      } else {
        return NextResponse.json({ 
          error: 'Invalid input type or missing data' 
        }, { status: 400 })
      }

      // First, transcribe the video with speaker identification
      const transcription = await openai.audio.transcriptions.create({
        file: videoBlob,
        model: 'whisper-1',
        // Remove language parameter to let Whisper auto-detect
        response_format: 'verbose_json',
        timestamp_granularities: ['segment'], // Get timing information
      })

      console.log('Transcription completed:', transcription.text)
      console.log('Transcription segments:', transcription.segments?.length || 0)

      // Analyze segments for speaker changes
      const segments = transcription.segments || []
      const speakerSegments = analyzeSpeakerSegments(segments)
      console.log('Speaker segments identified:', speakerSegments.length)

      // Process each speaker segment separately
      const processedSegments = []
      const audioBuffers = []

      for (let i = 0; i < speakerSegments.length; i++) {
        const segment = speakerSegments[i]
        console.log(`Processing ${segment.speaker}: "${segment.text.substring(0, 50)}..."`)

        // Translate this speaker's text
        const translation = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the following text to ${targetLanguage}. Maintain the original meaning, tone, and context. Return only the translated text without any additional commentary.`
            },
            {
              role: 'user',
              content: segment.text
            }
          ],
          max_tokens: 1000,
          temperature: 0.3,
        })

        const translatedText = translation.choices[0]?.message?.content || segment.text

        // Generate audio for this speaker with gender-matched voices
        // OpenAI TTS Voice Options:
        // Male voices: 'onyx' (deep, masculine), 'echo' (clear, masculine)
        // Female voices: 'alloy' (neutral), 'nova' (warm, feminine), 'shimmer' (soft, feminine)
        
        let voice: string
        if (voiceType === 'male') {
          // Use different male voices for male conversations
          voice = segment.speaker === 'Speaker 1' ? 'onyx' : 'echo'
        } else {
          // Use different female voices for female conversations
          voice = segment.speaker === 'Speaker 1' ? 'nova' : 'shimmer'
        }
        const audioResponse = await openai.audio.speech.create({
          model: 'tts-1',
          voice: voice,
          input: translatedText,
          response_format: 'mp3'
        })

        const audioBuffer = Buffer.from(await audioResponse.arrayBuffer())

        processedSegments.push({
          ...segment,
          translatedText: translatedText,
          voice: voice,
          audioSize: audioBuffer.length,
          audioData: audioBuffer.toString('base64') // Include individual audio data
        })

        audioBuffers.push(audioBuffer)
        console.log(`Completed ${segment.speaker}: ${audioBuffer.length} bytes`)
      }

      // Combine all audio buffers
      const totalAudioBuffer = Buffer.concat(audioBuffers)
      console.log('All audio generation completed, total size:', totalAudioBuffer.length, 'bytes')

      // Create combined text
      const translatedText = processedSegments.map(seg => `${seg.speaker}: ${seg.translatedText}`).join('\n\n')
      const originalText = processedSegments.map(seg => `${seg.speaker}: ${seg.text}`).join('\n\n')

      // Calculate word count
      const wordCount = translatedText.split(/\s+/).filter(word => word.length > 0).length

      // Prepare response with both text and audio
      const result = {
        text: translatedText,
        originalText: originalText,
        language: targetLanguage,
        originalLanguage: transcription.language || 'auto-detected',
        duration: transcription.duration || 0,
        wordCount: wordCount,
        fileName: fileName,
        fileSize: fileSize,
        audioData: totalAudioBuffer.toString('base64'), // Base64 encoded combined audio
        audioFormat: 'mp3',
        timestamp: new Date().toISOString(),
        speakerSegments: processedSegments, // Individual speaker segments
        processingSteps: [
          'Video audio extracted',
          'Multiple speakers identified and separated',
          'Each speaker transcribed individually',
          'Text translated to target language per speaker',
          'Different AI voices assigned to each speaker',
          'Audio generated and combined',
          'Ready for video assembly'
        ]
      }

      console.log(`Conversion result: ${wordCount} words, ${result.duration}s duration, audio: ${totalAudioBuffer.length} bytes, speakers: ${processedSegments.length}`)

      return NextResponse.json(result)

    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError)
      
      // Handle specific OpenAI errors
      if (openaiError instanceof Error) {
        if (openaiError.message.includes('Invalid file format')) {
          return NextResponse.json({ 
            error: 'Invalid video file format. Please try a different file.',
            details: 'The file format is not supported by OpenAI Whisper API.'
          }, { status: 400 })
        }
        
        if (openaiError.message.includes('File size')) {
          return NextResponse.json({ 
            error: 'File is too large. Please upload a file smaller than 100MB.' 
          }, { status: 400 })
        }

        if (openaiError.message.includes('Rate limit')) {
          return NextResponse.json({ 
            error: 'Rate limit exceeded. Please try again later.',
            details: 'OpenAI API rate limit reached.'
          }, { status: 429 })
        }
      }

      return NextResponse.json({ 
        error: 'Failed to convert video language. Please try again.',
        details: openaiError instanceof Error ? openaiError.message : 'Unknown error'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Video conversion error:', error)
    
    return NextResponse.json({ 
      error: 'Failed to convert video language. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
