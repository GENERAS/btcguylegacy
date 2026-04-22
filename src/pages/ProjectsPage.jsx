import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import CommentsSection from '../components/comments/CommentsSection'

// Simple inline SVG icons - no external libraries
const IconHeart = ({ filled }) => (
  <svg className="w-4 h-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const IconEye = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const IconGithub = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const IconExternal = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

const IconStar = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const IconCode = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

const IconRocket = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" clipRule="evenodd" />
  </svg>
)

const IconCheck = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const IconLayer = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
  </svg>
)

// Tech colors only - no icons
const getTechColor = (tech) => {
  const techLower = tech.toLowerCase()
  const colors = [
    { match: ['react', 'tailwind'], style: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    { match: ['next'], style: 'bg-white/10 text-white border-white/20' },
    { match: ['node', 'mongo'], style: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { match: ['python', 'sql', 'database'], style: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { match: ['javascript', 'ts'], style: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { match: ['aws'], style: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { match: ['docker'], style: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  ]
  
  const match = colors.find(c => c.match.some(m => techLower.includes(m)))
  return match ? match.style : 'bg-slate-700/50 text-gray-300 border-slate-600'
}

// Force scroll to top
const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
}

export default function ProjectsPage() {
  useScrollToTop()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('projectFavorites') || '[]')
    }
    return []
  })
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  useEffect(() => {
    loadProjects()
    
    const channel = supabase
      .channel('projects-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' },
        () => loadProjects()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const loadProjects = async () => {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('display_order')
      
      setProjects(data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (projectId) => {
    const newFavorites = favorites.includes(projectId)
      ? favorites.filter(id => id !== projectId)
      : [...favorites, projectId]
    
    setFavorites(newFavorites)
    localStorage.setItem('projectFavorites', JSON.stringify(newFavorites))
  }

  const categories = ['all', ...new Set(projects.map(p => p.category))]

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory)

  const featuredProjects = projects.filter(p => p.is_featured).slice(0, 3)
  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    live: projects.filter(p => p.live_demo_url).length,
    techs: [...new Set(projects.flatMap(p => p.tech_stack || []))].length
  }

  const getStatusBadge = (status) => {
    const badges = {
      completed: { bg: 'bg-green-500/20 text-green-400 border-green-500/30', text: 'Completed', icon: <IconCheck /> },
      building: { bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30', text: 'In Progress', icon: <IconRocket /> },
      planned: { bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30', text: 'Planned', icon: <IconLayer /> }
    }
    const s = badges[status] || badges.planned
    return (
      <span className={`${s.bg} border px-2 py-1 rounded-full text-xs flex items-center gap-1`}>
        {s.icon} {s.text}
      </span>
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
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        <div className="relative px-6 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Project <span className="text-amber-400">Portfolio</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl mx-auto">
              Explore my work in web development, mobile apps, trading systems, and blockchain solutions
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-gray-300">Projects</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
                <div className="text-xs text-gray-300">Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="text-2xl font-bold text-blue-400">{stats.live}</div>
                <div className="text-xs text-gray-300">Live Demos</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="text-2xl font-bold text-purple-400">{stats.techs}+</div>
                <div className="text-xs text-gray-300">Technologies</div>
              </div>
            </div>

            {/* CTA */}
            <Link 
              to="/hire-me"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl font-semibold transition"
            >
              Start Your Project <IconArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects - Horizontal Scroll */}
      {featuredProjects.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <IconStar className="text-amber-400" />
            <h2 className="text-2xl font-bold">Featured Projects</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {featuredProjects.map(project => (
              <div 
                key={project.id}
                className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-40 overflow-hidden">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center">
                      <IconCode className="text-4xl text-gray-600" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(project.status)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-amber-400 transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filters & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
              }`}
            >
              {cat === 'all' ? 'All Projects' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-slate-800 rounded-full p-1">
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-full text-sm transition ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
          >
            Grid
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-full text-sm transition ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-4"
      }>
        {filteredProjects.map(project => (
          <div 
            key={project.id} 
            className={`group bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 ${viewMode === 'grid' ? 'hover:-translate-y-2' : 'flex flex-col md:flex-row'}`}
          >
            {/* Image */}
            <div className={`relative overflow-hidden ${viewMode === 'list' ? 'md:w-72 h-48 md:h-auto shrink-0' : ''}`}>
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${viewMode === 'grid' ? 'h-48' : 'h-full'}`}
                />
              ) : (
                <div className={`bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center ${viewMode === 'grid' ? 'h-48' : 'h-full min-h-[200px]'}`}>
                  <IconCode className="text-5xl text-gray-600 group-hover:text-blue-500 transition-colors" />
                </div>
              )}
              
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(project.id)}
                className={`absolute top-3 left-3 p-2 rounded-full transition-colors ${favorites.includes(project.id) ? 'text-red-500 bg-red-500/20' : 'text-white bg-black/50 hover:bg-black/70'}`}
              >
                <IconHeart filled={favorites.includes(project.id)} />
              </button>
              
              {/* Status */}
              <div className="absolute top-3 right-3">
                {getStatusBadge(project.status)}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1">
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              
              {/* Tech Stack */}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack.slice(0, viewMode === 'grid' ? 4 : 6).map((tech, i) => {
                      const colorClass = getTechColor(tech)
                      return (
                        <span
                          key={i}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${colorClass}`}
                        >
                          {tech}
                        </span>
                      )
                    })}
                    {project.tech_stack.length > (viewMode === 'grid' ? 4 : 6) && (
                      <span className="text-xs text-gray-500 px-2 py-0.5">+{project.tech_stack.length - (viewMode === 'grid' ? 4 : 6)}</span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <div className="flex gap-3">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <IconGithub />
                      <span className="hidden sm:inline">Code</span>
                    </a>
                  )}
                  {project.live_demo_url && (
                    <a
                      href={project.live_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <IconExternal />
                      <span className="hidden sm:inline">Live</span>
                    </a>
                  )}
                </div>
                
                {/* Views */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <IconEye />
                  <span>{Math.floor(Math.random() * 500) + 100}</span>
                </div>
              </div>
              
              {/* Comments - Only in grid mode */}
              {viewMode === 'grid' && (
                <div className="mt-4 pt-3 border-t border-slate-700/50">
                  <CommentsSection contentType="project" contentId={project.id} compact />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center text-3xl text-gray-600">
            &lt;/&gt;
          </div>
          <p className="text-lg text-gray-400 mb-2">No projects found</p>
          <p className="text-sm text-gray-500 mb-4">Try selecting a different category</p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            View All Projects
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-center border border-slate-700">
        <h2 className="text-2xl font-bold mb-2">Have a project in mind?</h2>
        <p className="text-gray-400 mb-4">Let's build something amazing together</p>
        <Link 
          to="/hire-me"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
        >
          Hire Me <IconArrowRight />
        </Link>
      </section>
    </div>
  )
}