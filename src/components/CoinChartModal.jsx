import React, { useEffect, useState } from 'react'
import { fetchCoinChart, clearChartCacheKey } from '../../api/crypto'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'

function fmtTime(ts){
  const d = new Date(ts)
  return d.getHours() + ':' + String(d.getMinutes()).padStart(2,'0')
}

export default function CoinChartModal({ coinId, coinName, onClose }){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [days, setDays] = useState(1)
  const [retryIndex, setRetryIndex] = useState(0)

  useEffect(()=>{
    let mounted = true
    async function load(){
      setLoading(true); setError(null)
      try{
        const prices = await fetchCoinChart(coinId, days)
        if(!mounted) return
        const pts = prices.map(p=>({ time: p.time, price: p.price }))
        setData(pts)
      }catch(err){
        if(mounted) setError(err.message || 'Network error')
      }finally{ if(mounted) setLoading(false) }
    }
    load()
    return ()=>{ mounted = false }
  }, [coinId, days, retryIndex])

  function handleRetry(){
    // clear cached key and force reload
    clearChartCacheKey(coinId, days)
    setRetryIndex(i => i + 1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      <div className="relative w-[95%] max-w-3xl bg-slate-900 border border-slate-800 rounded p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">{coinName} — {days === 1 ? '24h' : days + 'd'}</h3>
            <p className="text-sm text-slate-400">Price chart ({days === 1 ? 'last 24 hours' : `last ${days} days`})</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-slate-400">Range:</div>
            <button onClick={()=>setDays(1)} className={`px-2 py-1 rounded ${days===1 ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-200'}`}>24h</button>
            <button onClick={()=>setDays(7)} className={`px-2 py-1 rounded ${days===7 ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-200'}`}>7d</button>
            <button onClick={()=>setDays(30)} className={`px-2 py-1 rounded ${days===30 ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-200'}`}>30d</button>
            <button onClick={onClose} className="px-3 py-1 bg-slate-800 rounded">Close</button>
          </div>
        </div>

        <div className="h-64">
          {loading && <div className="flex items-center justify-center h-full">Loading chart...</div>}
          {error && (
            <div className="text-red-400">
              <div>Error loading chart: {error}</div>
              <div className="mt-2">
                <button onClick={handleRetry} className="px-3 py-1 bg-brand-500 rounded text-white">Retry</button>
              </div>
            </div>
          )}
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                <XAxis dataKey="time" tickFormatter={fmtTime} tick={{ fill: '#cbd5e1' }} />
                <Tooltip formatter={(val)=>[`$${val.toFixed(2)}`, 'Price']} labelFormatter={(lab)=>fmtTime(lab)} />
                <Line type="monotone" dataKey="price" stroke="#60a5fa" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
