import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCoffee } from 'react-icons/fa'
import { useTheme } from '../../context/ThemeContext'

export default function CoffeeManager() {
  const { isDark } = useTheme()
  const [supporters, setSupporters] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    cups: 1, 
    message: '', 
    show_in_hall: true 
  })
  const [loading, setLoading] = useState(true)

  const bg = isDark ? 'bg-gray-800' : 'bg-white'
  const bgSub = isDark ? 'bg-gray-700/50' : 'bg-gray-50'
  const border = isDark ? 'border-gray-700' : 'border-gray-200'
  const text = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-300' : 'text-gray-600'
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500'
  const inputBg = isDark ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  const focusRing = 'focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500'

  useEffect(() => { 
    loadSupporters()
  }, [])

  const loadSupporters = async () => {
    try {
      const { data, error } = await supabase
        .from('coffee_supporters')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setSupporters(data || [])
    } catch (err) {
      console.error('Error loading supporters:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editing && editing !== 'new') {
        const { error } = await supabase
          .from('coffee_supporters')
          .update(form)
          .eq('id', editing)
        if (error) throw error
        alert('Supporter updated!')
      } else {
        const { error } = await supabase
          .from('coffee_supporters')
          .insert([{ ...form, created_at: new Date().toISOString() }])
        if (error) throw error
        alert('Supporter added!')
      }
      resetForm()
      loadSupporters()
    } catch (error) {
      console.error('Submit error:', error)
      alert('Error: ' + error.message)
    }
  }

  const handleEdit = (supporter) => {
    setEditing(supporter.id)
    setForm(supporter)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this supporter?')) return
    
    try {
      const { error } = await supabase
        .from('coffee_supporters')
        .delete()
        .eq('id', id)
      if (error) throw error
      loadSupporters()
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const resetForm = () => {
    setEditing(null)
    setForm({ name: '', email: '', cups: 1, message: '', show_in_hall: true })
  }

  if (loading) return <div className={text}>Loading supporters...</div>

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-4 ${text}`}>Coffee Supporters Manager</h2>

      <button 
        onClick={() => setEditing('new')} 
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center gap-2 mb-4 transition-colors"
      >
        <FaPlus /> Add Supporter
      </button>

      {/* Form */}
      {(editing === 'new' || editing) && (
        <form onSubmit={handleSubmit} className={`${bg} ${border} border p-6 rounded-lg mb-6 space-y-4`}>
          <h3 className={`text-xl font-bold ${text}`}>
            {editing === 'new' ? 'Add New Supporter' : 'Edit Supporter'}
          </h3>
          
          <div>
            <label className={`block text-sm ${textMuted} mb-1`}>Name</label>
            <input 
              type="text" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              className={`w-full ${inputBg} ${focusRing} border rounded px-4 py-2`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm ${textMuted} mb-1`}>Email</label>
            <input 
              type="email" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              className={`w-full ${inputBg} ${focusRing} border rounded px-4 py-2`}
            />
          </div>

          <div>
            <label className={`block text-sm ${textMuted} mb-1`}>Cups of Coffee</label>
            <input 
              type="number" 
              min="1"
              value={form.cups} 
              onChange={e => setForm({...form, cups: parseInt(e.target.value)})} 
              className={`w-full ${inputBg} ${focusRing} border rounded px-4 py-2`}
            />
          </div>

          <div>
            <label className={`block text-sm ${textMuted} mb-1`}>Message</label>
            <textarea 
              value={form.message} 
              onChange={e => setForm({...form, message: e.target.value})} 
              className={`w-full ${inputBg} ${focusRing} border rounded px-4 py-2`}
              rows="2"
            />
          </div>

          <label className={`flex items-center gap-2 ${textSub}`}>
            <input 
              type="checkbox" 
              checked={form.show_in_hall} 
              onChange={e => setForm({...form, show_in_hall: e.target.checked})}
              className="accent-yellow-600"
            />
            Show in Supporters Hall
          </label>

          <div className="flex gap-2">
            <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors">
              <FaSave /> {editing === 'new' ? 'Add' : 'Update'}
            </button>
            <button type="button" onClick={resetForm} className={`${isDark ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-900'} px-4 py-2 rounded transition-colors`}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="grid gap-4">
        {supporters.map(supporter => (
          <div key={supporter.id} className={`${bg} ${border} border p-4 rounded-lg flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <FaCoffee className="text-amber-500 text-2xl" />
              <div>
                <h3 className={`font-bold ${text}`}>{supporter.name}</h3>
                <p className={`text-sm ${textMuted}`}>{supporter.cups} cups • {supporter.email || 'No email'}</p>
                {supporter.message && <p className={`text-sm italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>"{supporter.message}"</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(supporter)} className={`${isDark ? 'bg-blue-600 hover:bg-yellow-500' : 'bg-blue-500 hover:bg-yellow-600'} text-white p-2 rounded transition-colors`}>
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(supporter.id)} className={`${isDark ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-600'} text-white p-2 rounded transition-colors`}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {supporters.length === 0 && (
          <p className={`${textMuted} text-center py-8`}>No supporters yet</p>
        )}
      </div>
    </div>
  )
}
