import React from 'react'
import Logo from '../../assets/logo.svg'

export default function Header({ view='home', setView=()=>{}, watchlistCount=0 }){
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={Logo} alt="CryptoPulse" className="w-12 h-12" />
        <div>
          <h1 className="text-2xl font-semibold">CryptoPulse</h1>
          <p className="text-sm text-slate-400">Real-time crypto prices</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-3">
        <button onClick={()=>setView('home')} className={`text-sm ${view==='home' ? 'text-white' : 'text-slate-400'} hover:text-slate-100 transition`}>Market</button>
        <button onClick={()=>setView('watchlist')} className={`relative text-sm ${view==='watchlist' ? 'text-white' : 'text-slate-400'} hover:text-slate-100 transition`}>
          Watchlist
          {watchlistCount>0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-400 text-slate-900">{watchlistCount}</span>
          )}
        </button>
      </div>
    </header>
  )
}
