import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../context/ThemeContext'
import { FaSync, FaCoffee, FaComments, FaNewspaper, FaVideo, FaImages, FaUsers, FaBriefcase, FaRobot, FaEnvelope } from 'react-icons/fa'

const statCards = [
  { key: 'supporters', label: 'Supporters', icon: FaCoffee, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { key: 'comments', label: 'Total Comments', icon: FaComments, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-blue-500/10' },
  { key: 'blogs', label: 'Blog Posts', icon: FaNewspaper, color: 'text-green-500', bg: 'bg-green-500/10' },
  { key: 'videos', label: 'Videos', icon: FaVideo, color: 'text-red-500', bg: 'bg-red-500/10' },
  { key: 'photos', label: 'Photos', icon: FaImages, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { key: 'mentorshipApps', label: 'Mentorship Apps', icon: FaUsers, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { key: 'projectInquiries', label: 'Project Inquiries', icon: FaBriefcase, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { key: 'aiLeads', label: 'AI Leads', icon: FaRobot, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { key: 'contactMessages', label: 'Unread Messages', icon: FaEnvelope, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
]

export default function AdminDashboard() {
  const { isDark } = useTheme()
  const [stats, setStats] = useState({
    supporters: 0,
    comments: 0,
    pendingComments: 0,
    blogs: 0,
    videos: 0,
    photos: 0,
    mentorshipApps: 0,
    projectInquiries: 0,
    aiLeads: 0,
    contactMessages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [coffeeSupporters, comments, pending, blogs, videos, photos, mentorship, projects, aiLeads, contactMsgs] = await Promise.all([
        supabase.from('coffee_supporters').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('videos').select('*', { count: 'exact', head: true }),
        supabase.from('photos').select('*', { count: 'exact', head: true }),
        supabase.from('mentorship_applications').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('project_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('ai_leads').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false),
      ])

      setStats({
        supporters: coffeeSupporters.count || 0,
        comments: comments.count || 0,
        pendingComments: pending.count || 0,
        blogs: blogs.count || 0,
        videos: videos.count || 0,
        photos: photos.count || 0,
        mentorshipApps: mentorship.count || 0,
        projectInquiries: projects.count || 0,
        aiLeads: aiLeads.count || 0,
        contactMessages: contactMsgs.count || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard Overview</h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Quick summary of your platform</p>
        </div>
        <button
          onClick={() => { setLoading(true); loadStats() }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <FaSync className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
        {statCards.map(({ key, label, icon: Icon, color, bg }) => (
          <div
            key={key}
            className={`rounded-xl p-5 border transition-colors ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-lg ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
            </div>
            <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats[key]}</div>
            {key === 'comments' && stats.pendingComments > 0 && (
              <p className="text-xs text-amber-500 mt-1">{stats.pendingComments} pending approval</p>
            )}
            {key === 'contactMessages' && stats.contactMessages > 0 && (
              <p className="text-xs text-yellow-500 mt-1">{stats.contactMessages} unread</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
