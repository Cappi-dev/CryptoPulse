import React, { useState, useEffect } from 'react'
import Home from './pages/Home'
import Watchlist from './pages/Watchlist'

export default function App(){
  const [view, setView] = useState('home')
  const [watchlist, setWatchlist] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('cp_watchlist') || '[]') }catch{ return [] }
  })

  useEffect(()=>{
    localStorage.setItem('cp_watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const toggleWatch = (id) => {
    setWatchlist(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-black text-slate-100">
      {view === 'home' && (
        <Home view={view} setView={setView} watchlist={watchlist} toggleWatch={toggleWatch} />
      )}
      {view === 'watchlist' && (
        <Watchlist view={view} setView={setView} watchlist={watchlist} toggleWatch={toggleWatch} />
      )}
    </div>
  )
}
