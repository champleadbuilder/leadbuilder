'use client'

import { useState } from 'react'

export default function EstimatePage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [message, setMessage] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setCompleted(false)
    setFeedback('')

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        location,
        message,
        source: 'website',
      }),
    })

    const data = await response.json()
    setLoading(false)
    setCompleted(true)

    if (!response.ok) {
      setFeedback(data.error || 'Something went wrong')
      setCompleted(false)
      return
    }

    setFeedback('Lead saved successfully!')
    setName('')
    setPhone('')
    setLocation('')
    setMessage('')
  }

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontSize: 36, marginBottom: 24 }}>Test Lead Form</h1>
      <p style={{ marginBottom: 24 }}>
        This form posts a new lead to Supabase through the Prisma API route.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
        <label style={{ display: 'grid', gap: 8 }}>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
          />
        </label>

        <label style={{ display: 'grid', gap: 8 }}>
          Phone
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
          />
        </label>

        <label style={{ display: 'grid', gap: 8 }}>
          Location
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
          />
        </label>

        <label style={{ display: 'grid', gap: 8 }}>
          Message
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '12px 16px', borderRadius: 10, background: completed ? '#059669' : '#111827', color: 'white', border: 'none' }}
        >
          {loading ? 'Saving…' : completed ? 'Completed' : 'Save Lead'}
        </button>
      </form>

      {feedback ? <p style={{ marginTop: 20 }}>{feedback}</p> : null}
    </main>
  )
}
