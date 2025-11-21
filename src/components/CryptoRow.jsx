import React, { useState, useMemo } from 'react'
import CoinChartModal from './CoinChartModal'
import { ResponsiveContainer, LineChart, Line } from 'recharts'

function formatNum(n){
  if(n === null || n === undefined) return '-'
  return n >= 1e9 ? (n/1e9).toFixed(2) + 'B' : n >= 1e6 ? (n/1e6).toFixed(2) + 'M' : n.toLocaleString()
}

export default function CryptoRow({ coin, idx, isWatched, toggleWatch }){
  const [openChart, setOpenChart] = useState(false)
  const [spark, setSpark] = useState(null)
  const [sparkLoading] = useState(false)
  const change = coin.price_change_percentage_24h
  const changeColor = change > 0 ? 'text-emerald-400' : 'text-red-400'

  // derive inline spark from markets' `sparkline_in_7d.price` if available
  useMemo(()=>{
    try{
      const s = coin?.sparkline_in_7d?.price || coin?.sparkline || null
      if(!s || !Array.isArray(s)){
        setSpark(null)
        return
      }
      // convert to objects and downsample to ~40 points
      const maxPts = 40
      const step = Math.max(1, Math.floor(s.length / maxPts))
      const sampled = s.filter((_, i)=> i % step === 0).map((p, i)=>({ time: i, price: p }))
      setSpark(sampled)
    }catch(e){
      setSpark(null)
    }
  }, [coin])

  return (
    <tr className="hover:bg-slate-800 transition">
      <td className="px-4 py-3 text-sm text-slate-400">{idx}</td>
      <td className="px-4 py-3 flex items-center gap-3">
        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
        <div>
          <div className="font-medium">{coin.name}</div>
          <div className="text-xs text-slate-400 uppercase">{coin.symbol}</div>
        </div>
      </td>
      <td className="px-4 py-3 font-medium">${coin.current_price?.toLocaleString()}</td>
      <td className={`px-4 py-3 font-medium ${changeColor}`}>{change ? change.toFixed(2) + '%' : '-'}</td>
      <td className="px-4 py-3">${formatNum(coin.market_cap)}</td>
      <td className="px-4 py-3 w-36">
        {sparkLoading && <div className="text-xs text-slate-400">...</div>}
        {spark && (
          <div className="w-28 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spark}>
                <Line dataKey="price" stroke="#60a5fa" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </td>
      <td className="px-4 py-3 flex items-center gap-2">
        <button onClick={()=>toggleWatch(coin.id)} className={`px-2 py-1 rounded text-sm ${isWatched? 'bg-yellow-400 text-slate-900':'bg-slate-800 text-slate-200'}`}>
          {isWatched ? '★' : '☆'}
        </button>
        <button onClick={()=>setOpenChart(true)} className="px-2 py-1 rounded text-sm bg-slate-800 text-slate-200">Chart</button>
      </td>

      {openChart && (
        <CoinChartModal coinId={coin.id} coinName={coin.name} onClose={()=>setOpenChart(false)} />
      )}
    </tr>
  )
}
