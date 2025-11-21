import React, { useEffect, useMemo, useState } from 'react'
import { fetchCoins } from '../../api/crypto'
import Header from '../components/Header'
import SearchSortBar from '../components/SearchSortBar'
import CryptoTable from '../components/CryptoTable'

export default function Home({ view, setView, watchlist, toggleWatch }){
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('market_cap')
  const [perPage, setPerPage] = useState(50)

  useEffect(()=>{
    let mounted = true
    async function load(){
      setLoading(true)
      setError(null)
      try{
        const data = await fetchCoins({ per_page: perPage })
        if(mounted) setCoins(data)
      }catch(err){
        if(mounted) setError(err.message)
      }finally{ if(mounted) setLoading(false) }
    }
    load()
    // refresh every 10 seconds
    const id = setInterval(load, 10000)
    return ()=>{ mounted=false; clearInterval(id) }
  }, [perPage])

  const filtered = useMemo(()=>{
    const q = search.trim().toLowerCase()
    let arr = coins
    if(q) arr = arr.filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))

    // sorting
    const sorted = [...arr].sort((a,b)=>{
      if(sortKey === 'price') return b.current_price - a.current_price
      if(sortKey === 'market_cap') return (b.market_cap || 0) - (a.market_cap || 0)
      if(sortKey === 'change') return (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
      return 0
    })
    return sorted
  }, [coins, search, sortKey])

  return (
    <div className="container mx-auto px-4 py-8">
      <Header view={view} setView={setView} watchlistCount={watchlist.length} />

      <div className="mt-6">
        <SearchSortBar
          search={search}
          setSearch={setSearch}
          sortKey={sortKey}
          setSortKey={setSortKey}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </div>

      <div className="mt-6">
        {loading && <div className="text-center py-12">Loading coins...</div>}
        {error && <div className="text-center py-12 text-red-400">Error: {error}</div>}
        {!loading && !error && (
          <CryptoTable coins={filtered} watchlist={watchlist} toggleWatch={toggleWatch} />
        )}
      </div>
    </div>
  )
}
