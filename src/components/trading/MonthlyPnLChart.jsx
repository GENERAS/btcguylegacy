// Simple CSS-based bar chart - no heavy charting library needed
export default function MonthlyPnLChart({ data, formatCurrency }) {
  if (!data || data.length === 0) return null

  const maxValue = Math.max(...data.map(d => Math.abs(d.pnl)), 0.01)
  
  return (
    <div className="h-full flex flex-col">
      {/* Chart bars */}
      <div className="flex-1 flex items-end gap-4 px-2 pb-2">
        {data.map((item, index) => {
          const height = Math.min((Math.abs(item.pnl) / maxValue) * 100, 100)
          const isPositive = item.pnl >= 0
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative">
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                {formatCurrency(item.pnl)}
              </div>
              
              {/* Bar */}
              <div 
                className={`w-full max-w-16 rounded-t transition-all duration-500 ${
                  isPositive ? 'bg-blue-500 hover:bg-blue-400' : 'bg-red-500 hover:bg-red-400'
                }`}
                style={{ height: `${height}%`, minHeight: '4px' }}
              />
              
              {/* Label */}
              <span className="text-xs text-gray-400">{item.month}</span>
            </div>
          )
        })}
      </div>
      
      {/* Zero line */}
      <div className="border-t border-slate-600 mx-2" />
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-gray-400">Profit</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-gray-400">Loss</span>
        </div>
      </div>
    </div>
  )
}
