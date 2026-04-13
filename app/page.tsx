'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const countryEvents: Record<string, { name: string; events: { year: string; title: string; desc: string; delta: string; up: boolean }[] }> = {
  india: {
    name: 'India',
    events: [
      { year: '1991', title: 'Balance of payments crisis', desc: 'India nearly ran out of foreign reserves. The IMF bailout forced sweeping economic liberalisation.', delta: '+6% debt spike', up: true },
      { year: '2008', title: 'Global financial crisis', desc: 'India launched a large fiscal stimulus, boosting public spending at the cost of higher debt.', delta: '+5% over 2 years', up: true },
      { year: '2020', title: 'Covid-19 pandemic shock', desc: 'The economy contracted 7.3%. Emergency spending drove debt to its highest level in 40 years.', delta: '+16% in one year', up: true },
    ]
  },
  usa: {
    name: 'United States',
    events: [
      { year: '2001', title: '9/11 & War on Terror', desc: 'Military spending surged. Two simultaneous wars added trillions to the national debt.', delta: '+8% over 4 years', up: true },
      { year: '2008', title: 'Financial crisis & bank bailouts', desc: 'The subprime collapse triggered the worst recession since the 1930s. TARP added $1.4 trillion in a year.', delta: '+29% in 3 years', up: true },
      { year: '2020', title: 'Covid relief spending', desc: 'The CARES Act totalled over $5 trillion — the largest peacetime fiscal expansion in US history.', delta: '+25% in one year', up: true },
    ]
  },
  greece: {
    name: 'Greece',
    events: [
      { year: '2001', title: 'Joined the Eurozone', desc: 'Greece adopted the euro, gaining access to cheap credit. Government borrowing exploded.', delta: 'Structural shift', up: true },
      { year: '2010', title: 'Sovereign debt crisis', desc: 'Greece revealed its deficit was double official figures. The EU/IMF bailout came with brutal austerity.', delta: '+41% in 5 years', up: true },
      { year: '2018', title: 'Exit from bailout programme', desc: 'After 8 years of austerity, Greece exited its third bailout. Debt remained the highest in the EU.', delta: '-15% gradual fall', up: false },
    ]
  },
  japan: {
    name: 'Japan',
    events: [
      { year: '1991', title: 'Asset bubble collapse', desc: 'Stock and real estate prices crashed. Japan entered a "Lost Decade" of stagnation.', delta: '+66% over 10 years', up: true },
      { year: '2011', title: 'Tōhoku earthquake & tsunami', desc: 'The most expensive natural disaster in history cost $360 billion. Reconstruction added massively to debt.', delta: '+24% over 3 years', up: true },
      { year: '2013', title: '"Abenomics" launched', desc: "PM Abe's bold three-arrow strategy aimed to end deflation but added more debt.", delta: 'Structural programme', up: true },
    ]
  }
};

export default function Home() {
  const [selected, setSelected] = useState('india');
  const [chartData, setChartData] = useState<{year: string; debt: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [narration, setNarration] = useState('');
  const [narrating, setNarrating] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNarration('');
    fetch(`/api/debt?country=${selected}`)
      .then(res => res.json())
      .then(data => {
        setChartData(data);
        setLoading(false);
        // Auto-generate narration
        setNarrating(true);
        fetch('/api/narrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: countryEvents[selected].name, data }),
        })
          .then(res => res.json())
          .then(d => { setNarration(d.narration); setNarrating(false); })
          .catch(() => setNarrating(false));
      });
  }, [selected]);

  const country = countryEvents[selected];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <span className="inline-block text-xs font-medium bg-blue-900 text-blue-300 px-3 py-1 rounded-full mb-6 tracking-widest uppercase">AI-powered data journalism</span>
        <h1 className="text-5xl font-semibold leading-tight mb-4">
          Every country's debt<br />has a <span className="text-blue-400">story</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
          Pick a country. Watch decades of economic history unfold — wars, crises, recoveries — narrated by AI, powered by real World Bank data.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          {Object.entries(countryEvents).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                selected === key
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
              }`}
            >
              {val.name}
            </button>
          ))}
        </div>
      </div>

      {/* AI Narration Box */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <div className="bg-blue-950 border border-blue-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-400 text-xs font-medium uppercase tracking-widest">AI Narration</span>
          </div>
          {narrating ? (
            <p className="text-blue-200 text-sm leading-relaxed animate-pulse">Generating story...</p>
          ) : narration ? (
            <p className="text-blue-100 text-sm leading-relaxed">{narration}</p>
          ) : (
            <p className="text-blue-400 text-sm">Loading...</p>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="max-w-4xl mx-auto px-6 mb-10">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-lg font-medium mb-1">{country.name} — Debt as % of GDP</h2>
          <p className="text-gray-500 text-sm mb-6">1990 – present · Live World Bank data</p>
          {loading ? (
            <div className="h-60 flex items-center justify-center text-gray-500">Loading live data...</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="year" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} interval={4} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => [`${v}%`, 'Debt/GDP']} contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }} />
                <Line type="monotone" dataKey="debt" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-4">Key events</h3>
        <div className="flex flex-col gap-4">
          {country.events.map((e, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex gap-4">
              <div className="text-blue-400 font-medium text-sm w-10 pt-0.5 shrink-0">{e.year}</div>
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${e.up ? 'bg-red-400' : 'bg-green-400'}`} />
              <div>
                <div className="font-medium text-white mb-1">{e.title}</div>
                <div className="text-gray-400 text-sm leading-relaxed">{e.desc}</div>
                <div className={`text-xs font-medium mt-2 ${e.up ? 'text-red-400' : 'text-green-400'}`}>
                  {e.up ? '▲' : '▼'} {e.delta}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}