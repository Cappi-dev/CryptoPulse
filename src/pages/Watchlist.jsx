import React, { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import CryptoTable from '../components/CryptoTable'
import { fetchCoinsByIds } from '../../api/crypto'

export default function Watchlist({ view, setView, watchlist, toggleWatch }){
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sortKey, setSortKey] = useState('market_cap')

  useEffect(()=>{
    let mounted = true
    async function load(){
      if(!watchlist || !watchlist.length){
        setCoins([])
        return
      }
      setLoading(true); setError(null)
      try{
        const data = await fetchCoinsByIds(watchlist, { per_page: watchlist.length })
        if(mounted) setCoins(data)
      }catch(err){
        if(mounted) setError(err.message)
      }finally{ if(mounted) setLoading(false) }
    }
    load()
    // refresh every 15 seconds for watchlist
    const id = setInterval(load, 15000)
    return ()=>{ mounted=false; clearInterval(id) }
  }, [watchlist])

  const filtered = useMemo(()=>{
    const arr = coins || []
    const sorted = [...arr].sort((a,b)=>{
      if(sortKey === 'price') return b.current_price - a.current_price
      if(sortKey === 'market_cap') return (b.market_cap || 0) - (a.market_cap || 0)
      if(sortKey === 'change') return (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
      return 0
    })
    return sorted
  }, [coins, sortKey])

  return (
    <div className="container mx-auto px-4 py-8">
      <Header view={view} setView={setView} watchlistCount={watchlist.length} />

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Watchlist</h2>
          <div className="text-sm text-slate-400">{watchlist.length} coins</div>
        </div>
      </div>

      <div className="mt-6">
        {loading && <div className="text-center py-12">Loading watchlist...</div>}
        {error && <div className="text-center py-12 text-red-400">Error: {error}</div>}
        {!loading && !error && (
          watchlist.length ? (
            <CryptoTable coins={filtered} watchlist={watchlist} toggleWatch={toggleWatch} />
          ) : (
            <div className="text-center py-12 text-slate-400">Your watchlist is empty. Add coins from the Market view.</div>
          )
        )}
      </div>
    </div>
  )
}
