import { useEffect, useState, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import LivingHero from '../components/hero/LivingHero'
import AboutSection from '../components/common/AboutSection'

// Lazy load heavy below-fold components
const SkillsMatrix = lazy(() => import('../components/skills/SkillsMatrix'))
const BlogsSection = lazy(() => import('../components/blogs/BlogsSection'))
const ContactForm = lazy(() => import('../components/contact/ContactForm'))

// Inline SVG icons - no external library imports
const IconGraduationCap = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
)

const IconCode = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

const IconTrendingUp = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const IconCoffee = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 1v3M10 1v3M14 1v3" />
  </svg>
)

const IconUsers = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const IconCalendar = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const IconWhatsapp = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.13 1.56 5.929L0 24l6.335-1.652c1.725.94 3.652 1.427 5.511 1.428h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.35-8.413" />
  </svg>
)

const IconSparkles = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

const IconClose = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

// Map icons for stat cards
const iconComponents = {
  GraduationCap: IconGraduationCap,
  Code: IconCode,
  TrendingUp: IconTrendingUp,
  Coffee: IconCoffee,
  Users: IconUsers,
  Calendar: IconCalendar
}

export default function HomePage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    academic_levels: 0,
    projects: 0,
    trades: 0,
    supporters: 0,
    followers: 0,
    days_active: 365
  })
  const [loading, setLoading] = useState(true)
  const [showAnnouncement, setShowAnnouncement] = useState(true)

  useEffect(() => {
    // Check if user has dismissed the announcement
    const dismissed = localStorage.getItem('announcement_dismissed')
    if (dismissed) {
      setShowAnnouncement(false)
    }
  }, [])

  const dismissAnnouncement = () => {
    setShowAnnouncement(false)
    localStorage.setItem('announcement_dismissed', 'true')
  }

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [academic, projects, trades, supporters, followers] = await Promise.all([
        supabase.from('academic_levels').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('trades').select('*', { count: 'exact', head: true }),
        supabase.from('coffee_supporters').select('*', { count: 'exact', head: true }),
        supabase.from('followers').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        academic_levels: academic.count || 0,
        projects: projects.count || 0,
        trades: trades.count || 0,
        supporters: supporters.count || 0,
        followers: followers.count || 0,
        days_active: 365
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { value: stats.academic_levels, label: t('stats.academic'), icon: 'GraduationCap', color: 'text-blue-500', desc: t('stats.academicDesc') },
    { value: stats.projects, label: t('stats.projects'), icon: 'Code', color: 'text-green-500', desc: t('stats.projectsDesc') },
    { value: stats.trades, label: t('stats.trades'), icon: 'TrendingUp', color: 'text-purple-500', desc: t('stats.tradesDesc') },
    { value: stats.supporters, label: t('stats.supporters'), icon: 'Coffee', color: 'text-amber-500', desc: t('stats.supportersDesc') },
    { value: stats.followers, label: t('stats.followers'), icon: 'Users', color: 'text-cyan-500', desc: t('stats.followersDesc') },
    { value: stats.days_active + '+', label: t('stats.daysActive'), icon: 'Calendar', color: 'text-white', desc: t('stats.daysActiveDesc') }
  ]

  const NewAnnouncement = () => {
    if (!showAnnouncement) return null

    return (
      <div className="relative mx-4 md:mx-0">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-1 shadow-lg shadow-orange-500/20">
          <div className="bg-slate-900 rounded-xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {/* NEW Badge */}
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                    <IconSparkles />
                    {t('announcement.new')}
                  </span>
                </div>
                
                {/* Message */}
                <div className="flex-1">
                  <p className="text-white font-medium text-sm md:text-base">
                    {t('announcement.message')}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {t('announcement.submessage')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  to="/service"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-orange-500/25"
                >
                  {t('announcement.getMentorship')}
                  <IconArrowRight />
                </Link>
                <Link
                  to="/hire-me"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition border border-slate-700"
                >
                  {t('announcement.hireMe')}
                </Link>
                <button
                  onClick={dismissAnnouncement}
                  className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title={t('announcement.dismiss')}
                >
                  <IconClose />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Living Hero Section */}
      <LivingHero />

      {/* NEW Training Announcement Banner */}
      <NewAnnouncement />

      {/* About Me Section with Your Image */}
      <AboutSection />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, index) => {
          const IconComponent = iconComponents[card.icon]
          return (
            <div key={index} className="bg-slate-800/30 rounded-xl p-4 text-center hover:bg-slate-800/50 transition border border-slate-700/50">
              <div className={`mx-auto mb-2 ${card.color}`}><IconComponent /></div>
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <div className="text-xs text-gray-400 mt-1">{card.label}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{card.desc}</div>
            </div>
          )
        })}
      </div>

      {/* SKILLS MATRIX - Lazy loaded */}
      <Suspense fallback={<div className="h-32 flex items-center justify-center text-gray-400 text-sm">{t('common.loading')}...</div>}>
        <div className="mt-8">
          <SkillsMatrix />
        </div>
      </Suspense>

      {/* Coming Soon Sections (Optional - you can remove these if you want) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <IconGraduationCap />
            </div>
            <h2 className="text-2xl font-bold">{t('sections.academic.title')}</h2>
          </div>
          <p className="text-gray-400 mb-4">
            {t('sections.academic.description')}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">{stats.academic_levels} {t('sections.academic.levels')}</span>
            <Link to="/academic" className="bg-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-700">{t('common.view')} →</Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
              <IconCode />
            </div>
            <h2 className="text-2xl font-bold">{t('sections.projects.title')}</h2>
          </div>
          <p className="text-gray-400 mb-4">
            {t('sections.projects.description')}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">{stats.projects} {t('sections.projects.projects')}</span>
            <Link to="/projects" className="bg-green-600 px-3 py-1 rounded-full text-sm hover:bg-green-700">{t('common.view')} →</Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
              <IconTrendingUp />
            </div>
            <h2 className="text-2xl font-bold">{t('sections.trading.title')}</h2>
          </div>
          <p className="text-gray-400 mb-4">
            {t('sections.trading.description', { count: stats.trades })}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">{stats.trades} {t('sections.trading.trades')}</span>
            <Link to="/trading" className="bg-purple-600 px-3 py-1 rounded-full text-sm hover:bg-purple-700">{t('common.view')} →</Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white">
              <IconUsers />
            </div>
            <h2 className="text-2xl font-bold">{t('sections.community.title')}</h2>
          </div>
          <p className="text-gray-400 mb-4">
            {t('sections.community.description')}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">{stats.supporters} {t('sections.community.supporters')}</span>
            <Link to="/community" className="bg-amber-600 px-3 py-1 rounded-full text-sm hover:bg-amber-700">{t('common.visit')} →</Link>
          </div>
        </div>
      </div>

      {/* Latest Blogs Section - Lazy loaded */}
      <Suspense fallback={<div className="h-32 flex items-center justify-center text-gray-400 text-sm">{t('common.loading')}...</div>}>
        <BlogsSection />
      </Suspense>

      {/* Contact Form Section - Lazy loaded */}
      <Suspense fallback={<div className="h-32 flex items-center justify-center text-gray-400 text-sm">{t('common.loading')}...</div>}>
        <ContactForm />
      </Suspense>

      {/* Small WhatsApp Button */}
      <div className="flex justify-center mt-8">
        <a
          href="https://wa.me/0794144738?text=Hello! I visited your website and would like to connect."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-full text-sm transition border border-green-600/30"
        >
          <IconWhatsapp /> <span>WhatsApp</span>
        </a>
      </div>
    </div>
  )
}