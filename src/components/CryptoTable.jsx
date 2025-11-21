import React from 'react'
import CryptoRow from './CryptoRow'

export default function CryptoTable({ coins = [], watchlist = [], toggleWatch }){
  if(!coins.length) return <div className="text-center py-12">No coins found.</div>

  return (
    <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded">
      <table className="min-w-full divide-y divide-slate-800">
        <thead className="bg-slate-900 sticky top-0">
          <tr className="text-left text-xs text-slate-400">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Coin</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">24h %</th>
            <th className="px-4 py-3">Market Cap</th>
            <th className="px-4 py-3">Watch</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {coins.map((c, idx)=> (
            <CryptoRow key={c.id} idx={idx+1} coin={c} isWatched={watchlist.includes(c.id)} toggleWatch={toggleWatch} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
