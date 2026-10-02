'use client'

import React, { useState, useEffect } from 'react'
import { Users, Shield, Ban, VolumeX, CheckCircle } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleUpdateUser = async (id: string, updates: { role?: string; status?: string }) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) fetchUsers()
    } catch (err) {}
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900">User & Reader Management</h1>
        <p className="text-xs text-slate-500">Manage user roles (Reader, Editor, Admin) and moderation status</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-xs text-slate-500">Loading user accounts...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Email / Account</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">{u.name}</td>
                  <td className="p-3 text-slate-600">{u.email || (u.facebookId ? 'Facebook Account' : '—')}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateUser(u.id, { role: e.target.value })}
                      className="p-1 bg-white border border-slate-300 rounded font-bold text-xs"
                    >
                      <option value="READER">READER</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.status === 'MUTED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {u.status !== 'ACTIVE' && (
                      <button
                        onClick={() => handleUpdateUser(u.id, { status: 'ACTIVE' })}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px]"
                      >
                        Activate
                      </button>
                    )}
                    {u.status !== 'MUTED' && (
                      <button
                        onClick={() => handleUpdateUser(u.id, { status: 'MUTED' })}
                        className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[10px]"
                        title="Mute user from commenting"
                      >
                        Mute
                      </button>
                    )}
                    {u.status !== 'BANNED' && (
                      <button
                        onClick={() => handleUpdateUser(u.id, { status: 'BANNED' })}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[10px]"
                        title="Ban user account"
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
