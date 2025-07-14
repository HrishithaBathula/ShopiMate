import { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../assets/styles/chatwidget.css'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const recognitionRef = useRef(null)

  const sendMessage = async (msg = input) => {
    if (!msg.trim()) return
    const userMessage = { sender: 'user', text: msg }
    let botReply = "Sorry, I couldn't find that."

    try {
      const lowerInput = msg.toLowerCase()
      const categoryMatch = lowerInput.match(/category\s+(\w+)|under\s+(\w+)/)
      const category = categoryMatch?.[1] || categoryMatch?.[2]

      if (
        (lowerInput.includes('products') || lowerInput.includes('items')) &&
        (lowerInput.includes('category') || lowerInput.includes('under')) &&
        category
      ) {
        const { data, error } = await supabase
          .from('products')
          .select('name')
          .ilike('category', `%${category}%`)
        botReply = error || !data.length
          ? `No products found in category "${category}".`
          : `Here are some products in "${category}": ${data.map(p => `"${p.name}"`).join(', ')}`
      } else if (
        lowerInput.includes('how many') || lowerInput.includes('number of') ||
        lowerInput.includes('count of') || lowerInput.includes('total products')
      ) {
        const { count, error } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
        botReply = error
          ? 'Error fetching product count.'
          : `There are ${count} product(s) in our database.`
      } else if (
        lowerInput.includes('what products') || lowerInput.includes('which products') ||
        lowerInput.includes('available products') || lowerInput.includes('list products')
      ) {
        const { data, error } = await supabase.from('products').select('name').limit(5)
        botReply = error || !data.length
          ? 'No products found.'
          : `Here are some available products: ${data.map(p => `"${p.name}"`).join(', ')}`
      } else if (
        lowerInput.includes('price of') || lowerInput.includes('cost of') ||
        lowerInput.includes('how much is') || lowerInput.includes('rate of')
      ) {
        const nameMatch = lowerInput.match(/price of (.+)|cost of (.+)|how much is (.+)|rate of (.+)/)
        const name = nameMatch?.[1] || nameMatch?.[2] || nameMatch?.[3] || nameMatch?.[4]
        if (name) {
          const { data, error } = await supabase
            .from('products')
            .select('name, price')
            .ilike('name', `%${name.trim()}%`)
            .limit(1)
          botReply = error || !data.length
            ? `No product found matching "${name}".`
            : `The price of "${data[0].name}" is ₹${data[0].price}.`
        } else {
          botReply = 'Please provide a product name to get the price.'
        }
      } else {
        botReply = `I can help with:\n- ✅ Product count\n- ✅ Product names\n- ✅ Product prices\n- ✅ Products by category\nTry asking:\n- "What products are in category electronics?"`
      }
    } catch (err) {
      console.error(err)
      botReply = 'Something went wrong while accessing the database.'
    }

    setMessages(prev => [...prev, userMessage, { sender: 'bot', text: botReply }])
    setInput('')
  }

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return alert('Voice input not supported in this browser.')

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-IN'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        sendMessage(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
      }
    }

    recognitionRef.current.start()
  }

  const closePair = (index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index && i !== index + 1))
  }

  return (
    <div className="chatbot-container full-width">
      {open ? (
        <div className="chat-box">
          <div className="chat-header">
            <span className="chat-title">WalMate 🛍️</span>
            <button onClick={() => setOpen(false)} className="chat-close">✖</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => {
              if (msg.sender !== 'user') return null
              const botReply = messages[i + 1]?.sender === 'bot' ? messages[i + 1].text : ''
              return (
                <div key={i} className="chat-message-wrapper">
                  <button className="chat-message-close" onClick={() => closePair(i)}>✖</button>
                  <div className="chat-message-user">{msg.text}</div>
                  <div className="chat-message-bot">{botReply}</div>
                </div>
              )
            })}
          </div>

          <div className="chat-input-box">
            <input
              className="chat-input"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="chat-mic" onClick={startListening}>🎤</button>
            <button className="chat-send" onClick={() => sendMessage()}>➤</button>
          </div>
        </div>
      ) : (
        <button className="chat-toggle-button" onClick={() => setOpen(true)}>💬 Ask WalMate</button>
      )}
    </div>
  )
}
