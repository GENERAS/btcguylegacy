import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { getAnalyticsSummary } from '../../utils/analytics'
import { useTheme } from '../../context/ThemeContext'
import { Eye, TrendingUp, Calendar, BarChart3 } from 'lucide-react'

export default function AnalyticsAdmin() {
  const { isDark } = useTheme()
  const [analytics, setAnalytics] = useState(null)
  const [dbCounts, setDbCounts] = useState({})
  const [loading, setLoading] = useState(true)

  const bg = isDark ? 'bg-gray-800' : 'bg-white'
  const bgSub = isDark ? 'bg-gray-700/50' : 'bg-gray-50'
  const border = isDark ? 'border-gray-700' : 'border-gray-200'
  const text = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-300' : 'text-gray-600'
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const local = getAnalyticsSummary()

    try {
      const [projects, inquiries, mentorship, aiLeads, contactMsgs] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('project_inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('mentorship_applications').select('*', { count: 'exact', head: true }),
        supabase.from('ai_leads').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
      ])

      setDbCounts({
        projects: projects.count || 0,
        inquiries: inquiries.count || 0,
        mentorship: mentorship.count || 0,
        aiLeads: aiLeads.count || 0,
        contactMsgs: contactMsgs.count || 0,
      })
    } catch (err) {
      console.error('Analytics DB error:', err)
    }

    setAnalytics(local)
    setLoading(false)
  }

  if (loading) {
    return <div className={`text-center py-12 ${textMuted}`}>Loading analytics...</div>
  }

  const maxViews = Math.max(...(analytics?.last7Days?.map(d => d.views) || [1]), 1)

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${bg} rounded-xl p-4 border ${border} border-l-4 border-l-blue-500 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${textMuted} text-sm`}>Total Page Views</p>
              <p className={`text-2xl font-bold ${text}`}>{analytics.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        <div className={`${bg} rounded-xl p-4 border ${border} border-l-4 border-l-green-500 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${textMuted} text-sm`}>Today</p>
              <p className={`text-2xl font-bold ${text}`}>{analytics.todayViews}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className={`${bg} rounded-xl p-4 border ${border} border-l-4 border-l-purple-500 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${textMuted} text-sm`}>First Visit</p>
              <p className={`text-sm font-bold ${text}`}>{analytics.firstVisit || 'N/A'}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className={`${bg} rounded-xl p-4 border ${border} border-l-4 border-l-amber-500 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${textMuted} text-sm`}>Last Visit</p>
              <p className={`text-sm font-bold ${text}`}>{analytics.lastVisit || 'N/A'}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Last 7 days chart */}
      <div className={`${bg} rounded-xl p-6 shadow-sm border ${border}`}>
        <h3 className={`font-semibold mb-4 ${text}`}>Page Views (Last 7 Days)</h3>
        <div className="flex items-end gap-3 h-40">
          {analytics.last7Days.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <span className={`text-xs mb-1 ${textMuted}`}>{day.views}</span>
              <div
                className="w-full bg-blue-500 rounded-t-md transition-all duration-500"
                style={{ height: `${(day.views / maxViews) * 100}%`, minHeight: day.views > 0 ? '4px' : '0' }}
              />
              <span className={`text-xs mt-2 ${textMuted}`}>{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top pages */}
      <div className={`${bg} rounded-xl p-6 shadow-sm border ${border}`}>
        <h3 className={`font-semibold mb-4 ${text}`}>Top Pages</h3>
        {analytics.topPages.length === 0 ? (
          <p className={`${textMuted} text-sm`}>No page views tracked yet</p>
        ) : (
          <div className="space-y-2">
            {analytics.topPages.map((page, i) => (
              <div key={i} className={`flex items-center justify-between py-2 border-b ${border} last:border-0`}>
                <span className={`text-sm font-mono ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{page.path}</span>
                <span className={`text-sm font-semibold ${text}`}>{page.total} views</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DB counts */}
      <div className={`${bg} rounded-xl p-6 shadow-sm border ${border}`}>
        <h3 className={`font-semibold mb-4 ${text}`}>Database Records</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(dbCounts).map(([key, val]) => (
            <div key={key} className={`text-center p-3 rounded-lg ${bgSub}`}>
              <p className={`text-xl font-bold ${text}`}>{val}</p>
              <p className={`text-xs capitalize ${textMuted}`}>{key.replace(/([A-Z])/g, ' $1')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
