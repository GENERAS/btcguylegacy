import React, { useEffect, useState, lazy, Suspense } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import CommentsSection from '../components/comments/CommentsSection'

// Inline SVG icons
const IconTrendingUp = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const IconDollar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const IconPercent = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const IconTrophy = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

const IconSkull = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const IconChevronDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const IconChevronUp = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
)

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

const IconLightbulb = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

const IconWarning = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

const IconBookOpen = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

// Lazy load heavy recharts only when needed
const MonthlyPnLChart = lazy(() => import('../components/trading/MonthlyPnLChart'))

const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
}

export default function TradingPage() {
  useScrollToTop()
  
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAllTrades, setShowAllTrades] = useState(false)
  const [expandedTrade, setExpandedTrade] = useState(null)
  const [stats, setStats] = useState({
    totalPnL: 0,
    winRate: 0,
    winningTrades: 0,
    losingTrades: 0,
    bestTrade: 0,
    worstTrade: 0,
    avgWin: 0,
    avgLoss: 0,
    profitFactor: 0
  })
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    loadTrades()
    
    const channel = supabase
      .channel('trading-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'trades' },
        () => loadTrades()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const loadTrades = async () => {
    try {
      const { data } = await supabase
        .from('trades')
        .select('*')
        .order('trade_date', { ascending: false })
      
      setTrades(data || [])
      calculateStats(data || [])
      prepareChartData(data || [])
    } catch (error) {
      console.error('Error loading trades:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (tradesData) => {
    const totalPnL = tradesData.reduce((sum, t) => sum + (t.profit_loss || 0), 0)
    const winningTradesList = tradesData.filter(t => t.profit_loss > 0)
    const losingTradesList = tradesData.filter(t => t.profit_loss < 0)
    const winningTrades = winningTradesList.length
    const losingTrades = losingTradesList.length
    const winRate = tradesData.length > 0 ? (winningTrades / tradesData.length) * 100 : 0
    const bestTrade = Math.max(...tradesData.map(t => t.profit_loss || 0), 0)
    const worstTrade = Math.min(...tradesData.map(t => t.profit_loss || 0), 0)
    
    const totalWins = winningTradesList.reduce((sum, t) => sum + (t.profit_loss || 0), 0)
    const totalLosses = Math.abs(losingTradesList.reduce((sum, t) => sum + (t.profit_loss || 0), 0))
    const avgWin = winningTrades > 0 ? totalWins / winningTrades : 0
    const avgLoss = losingTrades > 0 ? totalLosses / losingTrades : 0
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? totalWins : 0

    setStats({
      totalPnL,
      winRate: winRate.toFixed(1),
      winningTrades,
      losingTrades,
      bestTrade,
      worstTrade,
      avgWin: avgWin.toFixed(2),
      avgLoss: avgLoss.toFixed(2),
      profitFactor: profitFactor.toFixed(2)
    })
  }

  const prepareChartData = (tradesData) => {
    const monthlyData = {}
    tradesData.forEach(trade => {
      const date = new Date(trade.trade_date)
      const month = date.toLocaleString('default', { month: 'short' })
      monthlyData[month] = (monthlyData[month] || 0) + (trade.profit_loss || 0)
    })
    
    setChartData(Object.entries(monthlyData).map(([month, pnl]) => ({ month, pnl })))
  }

  const toggleExpand = (tradeId) => {
    setExpandedTrade(expandedTrade === tradeId ? null : tradeId)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const displayTrades = showAllTrades ? trades : trades.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Hero Section - Value Proposition */}
      <section className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        <div className="relative px-6 py-10 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Stop Losing. <span className="text-amber-400">Start Winning.</span>
              </h1>
              <p className="text-gray-200 text-lg max-w-2xl mx-auto">
                Real trading results. Real strategies. No fluff. Learn what actually works in the markets.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                <div className={`text-xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(stats.totalPnL)}
                </div>
                <div className="text-xs text-gray-300">Total P&L</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                <div className="text-xl font-bold text-blue-400">{stats.winRate}%</div>
                <div className="text-xs text-gray-300">Win Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                <div className="text-xl font-bold text-amber-400">{stats.profitFactor}</div>
                <div className="text-xs text-gray-300">Profit Factor</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link 
                to="/service"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl font-semibold transition"
              >
                Get Mentorship <IconArrowRight />
              </Link>
              <button 
                onClick={() => document.getElementById('trades-section').scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold transition"
              >
                See All Trades
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Learn From Me */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
            <IconTrophy />
          </div>
          <h3 className="font-semibold mb-2">Proven Results</h3>
          <p className="text-sm text-gray-400">
            Not theory. These are my actual trades with real money. See my win rate, profit factor, and monthly performance.
          </p>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-3">
            <IconLightbulb />
          </div>
          <h3 className="font-semibold mb-2">Stop Bad Strategies</h3>
          <p className="text-sm text-gray-400">
            Tired of courses that don't work? Learn from someone who's been there. Cut your learning curve in half.
          </p>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
            <IconBookOpen />
          </div>
          <h3 className="font-semibold mb-2">1-on-1 Mentorship</h3>
          <p className="text-sm text-gray-400">
            Get personalized guidance. Ask questions. Review your trades. Build a strategy that fits YOUR style.
          </p>
        </div>
      </section>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-5">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="text-blue-500"><IconTrendingUp /></span>
            Monthly Performance
          </h2>
          <div className="h-64">
            <Suspense fallback={<div className="h-full flex items-center justify-center text-gray-400">Loading...</div>}>
              <MonthlyPnLChart data={chartData} formatCurrency={formatCurrency} />
            </Suspense>
          </div>
        </div>
      )}

      {/* Recent Trades - Compact */}
      <section id="trades-section" className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold">Recent Trades</h2>
            <p className="text-xs text-gray-400">
              {stats.winningTrades} wins / {stats.losingTrades} losses • Click to view comments
            </p>
          </div>
          {trades.length > 5 && (
            <button
              onClick={() => setShowAllTrades(!showAllTrades)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {showAllTrades ? 'Show Less' : `View All (${trades.length})`}
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-700/50 text-xs">
              <tr>
                <th className="px-3 py-2 text-left rounded-tl-lg">Date</th>
                <th className="px-3 py-2 text-left">Pair</th>
                <th className="px-3 py-2 text-right">P&L</th>
                <th className="px-3 py-2 text-left">Strategy</th>
                <th className="px-3 py-2 text-center rounded-tr-lg"></th>
              </tr>
            </thead>
            <tbody>
              {displayTrades.map(trade => (
                <React.Fragment key={trade.id}>
                  <tr 
                    className="border-t border-slate-700/50 cursor-pointer hover:bg-slate-700/30 transition-colors text-xs"
                    onClick={() => toggleExpand(trade.id)}
                  >
                    <td className="px-3 py-2 font-mono text-gray-400">
                      {new Date(trade.trade_date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 font-mono font-medium">{trade.pair}</td>
                    <td className={`px-3 py-2 text-right font-bold ${trade.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(trade.profit_loss)}
                    </td>
                    <td className="px-3 py-2">
                      {trade.strategy ? (
                        <span className="px-2 py-0.5 bg-blue-500/20 rounded text-xs">{trade.strategy}</span>
                      ) : '-'}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {expandedTrade === trade.id ? (
                        <span className="text-blue-400"><IconChevronUp /></span>
                      ) : (
                        <span className="text-gray-500"><IconChevronDown /></span>
                      )}
                    </td>
                  </tr>
                  {expandedTrade === trade.id && (
                    <tr className="bg-slate-800/40">
                      <td colSpan="5" className="px-3 py-3">
                        <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                          <div>
                            <span className="text-gray-500">Entry:</span>
                            <span className="ml-2 font-mono">{formatCurrency(trade.entry_price)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Exit:</span>
                            <span className="ml-2 font-mono">{formatCurrency(trade.exit_price)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Platform:</span>
                            <span className="ml-2">{trade.platform}</span>
                          </div>
                        </div>
                        <CommentsSection contentType="trade" contentId={trade.id} compact />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {trades.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No trades recorded yet.</p>
          </div>
        )}
      </section>

      {/* Key Lessons */}
      <section className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-xl p-5 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
            <IconWarning />
          </div>
          <div>
            <h3 className="font-semibold mb-1">What I've Learned</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5"><IconCheck /></span>
                <span>Risk management is more important than profits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5"><IconCheck /></span>
                <span>A simple strategy executed well beats complex systems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5"><IconCheck /></span>
                <span>Psychology matters more than technical analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5"><IconCheck /></span>
                <span>Consistency beats occasional big wins</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-800 rounded-2xl p-6 text-center border border-slate-700">
        <h2 className="text-xl font-bold mb-2">Ready to Level Up Your Trading?</h2>
        <p className="text-gray-400 mb-4 text-sm max-w-md mx-auto">
          Stop wasting time on strategies that don't work. Get mentored by someone with real market experience.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link 
            to="/service"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
          >
            Start Mentorship <IconArrowRight />
          </Link>
          <a 
            href="https://wa.me/250789123456"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600/80 hover:bg-green-600 text-white rounded-xl font-semibold transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}