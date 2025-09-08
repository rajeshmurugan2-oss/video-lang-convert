import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      hasClerkPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      hasClerkSecretKey: !!process.env.CLERK_SECRET_KEY,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      clerkKeyLength: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.length || 0,
      openAIKeyLength: process.env.OPENAI_API_KEY?.length || 0,
      nodeEnv: process.env.NODE_ENV,
      allEnvVars: Object.keys(process.env).filter(key => 
        key.includes('CLERK') || key.includes('OPENAI') || key.includes('NEXT_PUBLIC')
      )
    }

    return NextResponse.json({
      status: 'success',
      message: 'Debug endpoint working',
      environment: envCheck,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Debug endpoint failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
