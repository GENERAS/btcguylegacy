import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'
import { useTheme } from '../../context/ThemeContext'

export default function BlogManager() {
  const { isDark } = useTheme()
  const [posts, setPosts] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', slug: '', content: '', excerpt: '', category: 'trading', status: 'published' })
  const [loading, setLoading] = useState(true)

  const bg = isDark ? 'bg-gray-800' : 'bg-white'
  const bgSub = isDark ? 'bg-gray-700/50' : 'bg-gray-50'
  const border = isDark ? 'border-gray-700' : 'border-gray-200'
  const text = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-300' : 'text-gray-600'
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500'
  const inputBg = isDark ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  const focusRing = 'focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500'

  useEffect(() => { loadPosts() }, [])

  const loadPosts = async () => {
    try {
      const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
      setPosts(data || [])
    } catch (err) {
      console.error('Error loading blog posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const data = { ...form, slug, updated_at: new Date() }
    if (editing) {
      await supabase.from('blog_posts').update(data).eq('id', editing)
      alert('Post updated')
    } else {
      await supabase.from('blog_posts').insert([data])
      alert('Post created')
    }
    resetForm()
    loadPosts()
  }

  const handleEdit = (post) => { setEditing(post.id); setForm(post) }
  const handleDelete = async (id) => { if (confirm('Delete?')) { await supabase.from('blog_posts').delete().eq('id', id); loadPosts() } }
  const resetForm = () => { setEditing(null); setForm({ title: '', slug: '', content: '', excerpt: '', category: 'trading', status: 'published' }) }

  if (loading) return <div className={text}>Loading...</div>

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-4 ${text}`}>Blog Posts</h2>
      <form onSubmit={handleSubmit} className={`${bg} ${border} border p-4 rounded-lg mb-6 space-y-3`}>
        <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={`w-full ${inputBg} ${focusRing} border rounded px-3 py-2`} required />
        <input type="text" placeholder="Slug (auto from title)" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className={`w-full ${inputBg} ${focusRing} border rounded px-3 py-2`} />
        <textarea placeholder="Excerpt" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className={`w-full ${inputBg} ${focusRing} border rounded px-3 py-2`} rows="2"></textarea>
        <textarea placeholder="Content (HTML supported)" value={form.content} onChange={e => setForm({...form, content: e.target.value})} className={`w-full ${inputBg} ${focusRing} border rounded px-3 py-2`} rows="6"></textarea>
        <div className="flex gap-3">
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={`${inputBg} ${focusRing} border rounded px-3 py-2`}>
            <option value="trading">Trading</option><option value="coding">Coding</option><option value="personal">Personal</option><option value="business">Business</option>
          </select>
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={`${inputBg} ${focusRing} border rounded px-3 py-2`}>
            <option value="draft">Draft</option><option value="published">Published</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"><FaSave /> {editing ? 'Update' : 'Create'}</button>
          {editing && <button type="button" onClick={resetForm} className={`${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400 text-gray-900'} px-4 py-2 rounded transition-colors`}>Cancel</button>}
        </div>
      </form>

      <div className="space-y-2">
        {posts.map(post => (
          <div key={post.id} className={`${bgSub} ${border} border rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0`}>
            <div className={`min-w-0 ${textSub}`}><span className={`font-bold ${text}`}>{post.title}</span> – {post.status} <span className={`text-xs ${textMuted}`}>{new Date(post.created_at).toLocaleDateString()}</span></div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(post)} className={isDark ? 'text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-500'}><FaEdit /></button>
              <button onClick={() => handleDelete(post.id)} className={isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'}><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
