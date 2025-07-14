const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_KEY

export async function askShopiMate(message) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://shopimate.vercel.app', // your domain
        'X-Title': 'ShopiMate-AI'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct', // lightweight + fast
        messages: [
          { role: 'system', content: 'You are WalMate, an AI shopping assistant that helps users find products from our database based on their needs, tags, and filters like price, brand, category. Keep responses short and helpful.' },
          { role: 'user', content: message }
        ]
      })
    })
  
    const data = await res.json()
    return data.choices?.[0]?.message?.content || 'Sorry, I didn’t get that.'
  }
  