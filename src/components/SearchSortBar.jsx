import React from 'react'

export default function SearchSortBar({ search, setSearch, sortKey, setSortKey, perPage, setPerPage }){
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3 w-full md:w-1/2">
        <input
          value={search}
          onChange={e=>setSearch(e.target.value)}
          placeholder="Search by name or symbol"
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <select value={sortKey} onChange={e=>setSortKey(e.target.value)} className="bg-slate-800 border border-slate-700 rounded px-2 py-2 text-sm">
          <option value="market_cap">Sort: Market Cap</option>
          <option value="price">Sort: Price</option>
          <option value="change">Sort: 24h Change</option>
        </select>

        <select value={perPage} onChange={e=>setPerPage(Number(e.target.value))} className="bg-slate-800 border border-slate-700 rounded px-2 py-2 text-sm">
          <option value={10}>Top 10</option>
          <option value={25}>Top 25</option>
          <option value={50}>Top 50</option>
          <option value={100}>Top 100</option>
        </select>
      </div>
    </div>
  )
}
