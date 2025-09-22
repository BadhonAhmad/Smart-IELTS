// app/actions/getSignedUrl.js
'use server'

export async function getSignedUrl() {
  try {
    // Log environment variables (without exposing the full API key)
    console.log('Agent ID:', process.env.NEXT_PUBLIC_AGENT_ID)
    console.log('API Key present:', !!process.env.ELEVEN_LABS_API_KEY)
    console.log('API Key length:', process.env.ELEVEN_LABS_API_KEY?.length)

    const url = `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${process.env.NEXT_PUBLIC_AGENT_ID}`
    console.log('Request URL:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`Failed to get signed URL: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Success! Received data:', data)
    return { signedUrl: data.signed_url }
  } catch (error) {
    console.error('Server Action Error:', error)
    throw new Error(`Failed to get signed URL: ${error.message}`)
  }
}
