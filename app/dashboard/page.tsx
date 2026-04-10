'use client'

import { useState, useEffect } from 'react'

interface Lead {
  id: string
  name: string
  phone: string
  location: string | null
  message: string | null
  source: string | null
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    const response = await fetch('/api/leads')
    const data = await response.json()
    setLeads(data)
    setLoading(false)
  }

  async function seedDatabase() {
    if (!confirm('This will delete all existing leads and add 5 fake ones. Continue?')) return

    await fetch('/dev/seed', { method: 'POST' })
    fetchLeads()
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = search === '' ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      (lead.location && lead.location.toLowerCase().includes(search.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <div style={{ padding: 48 }}>Loading leads...</div>
  }

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 34, margin: 0 }}>Lead Dashboard</h1>
        <button
          onClick={seedDatabase}
          style={{ padding: '8px 16px', borderRadius: 8, background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Seed Database
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name, phone, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db', minWidth: 300 }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="quoted">Quoted</option>
          <option value="booked">Booked</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        Showing {filteredLeads.length} of {leads.length} leads
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '2px solid #333' }}>Name</th>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '2px solid #333' }}>Phone</th>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '2px solid #333' }}>Location</th>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '2px solid #333' }}>Message</th>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '2px solid #333' }}>Status</th>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '2px solid #333' }}>Created</th>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '2px solid #333' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{lead.name}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{lead.phone}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{lead.location || ''}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb', maxWidth: 200 }}>
                  {lead.message ? lead.message.substring(0, 50) + (lead.message.length > 50 ? '...' : '') : ''}
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    backgroundColor: lead.status === 'new' ? '#fef3c7' : lead.status === 'contacted' ? '#dbeafe' : lead.status === 'booked' ? '#d1fae5' : '#f3f4f6',
                    color: lead.status === 'new' ? '#92400e' : lead.status === 'contacted' ? '#1e40af' : lead.status === 'booked' ? '#065f46' : '#374151'
                  }}>
                    {lead.status}
                  </span>
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                  {new Date(lead.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {lead.status === 'new' && (
                      <button
                        onClick={() => updateStatus(lead.id, 'contacted')}
                        style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #3b82f6', background: 'white', color: '#3b82f6', cursor: 'pointer', fontSize: 12 }}
                      >
                        Mark Contacted
                      </button>
                    )}
                    {lead.status === 'contacted' && (
                      <button
                        onClick={() => updateStatus(lead.id, 'quoted')}
                        style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #10b981', background: 'white', color: '#10b981', cursor: 'pointer', fontSize: 12 }}
                      >
                        Mark Quoted
                      </button>
                    )}
                    {lead.status !== 'booked' && lead.status !== 'lost' && (
                      <button
                        onClick={() => updateStatus(lead.id, 'booked')}
                        style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #059669', background: 'white', color: '#059669', cursor: 'pointer', fontSize: 12 }}
                      >
                        Mark Booked
                      </button>
                    )}
                    {lead.status !== 'lost' && (
                      <button
                        onClick={() => updateStatus(lead.id, 'lost')}
                        style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #dc2626', background: 'white', color: '#dc2626', cursor: 'pointer', fontSize: 12 }}
                      >
                        Mark Lost
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLeads.length === 0 && leads.length > 0 && (
        <p style={{ marginTop: 24, textAlign: 'center', color: '#6b7280' }}>
          No leads match your search criteria.
        </p>
      )}

      {leads.length === 0 && (
        <p style={{ marginTop: 24, textAlign: 'center', color: '#6b7280' }}>
          No leads yet. Submit a form at <a href="/estimate" style={{ color: '#3b82f6' }}>/estimate</a> to get started.
        </p>
      )}
    </main>
  )
}
