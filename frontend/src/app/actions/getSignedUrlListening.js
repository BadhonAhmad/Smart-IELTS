// app/actions/getSignedUrlListening.js
'use server'

export async function getSignedUrlListening() {
  try {
    // Log environment variables (without exposing the full API key)
    console.log('Listening Agent ID:', process.env.NEXT_PUBLIC_AGENT_ID_2)
    console.log('API Key present:', !!process.env.ELEVEN_LABS_API_KEY)
    console.log('API Key length:', process.env.ELEVEN_LABS_API_KEY?.length)

    const url = `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${process.env.NEXT_PUBLIC_AGENT_ID_2}`
    console.log('Listening Request URL:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const data = await response.json()
    console.log('Response data:', data)

    return { signedUrl: data.signed_url }
  } catch (error) {
    console.error('Error getting signed URL for listening agent:', error)
    throw error
  }
}