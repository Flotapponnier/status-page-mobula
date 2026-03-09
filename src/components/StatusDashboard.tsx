import { TransactionStream } from './TransactionStream'

export function StatusDashboard() {
  const services = [
    { name: 'API', status: 'operational', uptime: '99.9%' },
    { name: 'WebSocket', status: 'operational', uptime: '99.8%' },
    { name: 'Ethereum', status: 'operational', uptime: '99.9%' },
    { name: 'Solana', status: 'operational', uptime: '99.9%' },
    { name: 'BSC', status: 'operational', uptime: '99.7%' },
    { name: 'Base', status: 'operational', uptime: '99.8%' },
  ]

  // Generate 90 days of uptime data (all green for now)
  const uptimeData = Array.from({ length: 90 }).map((_, i) => ({
    day: i,
    uptime: 100,
    status: 'operational' as const
  }))

  return (
    <div className="relative z-10 min-h-screen flex flex-col p-8">
      {/* Nav */}
      <nav className="absolute top-8 right-8 flex items-center gap-4">
        <div className="text-right">
          <h1 className="text-xl font-bold">Mobula Status</h1>
          <p className="text-sm text-zinc-400">All systems operational</p>
        </div>
        <img src="/logo.svg" alt="Mobula" className="h-12 w-auto" />
      </nav>

      <div className="max-w-4xl w-full mx-auto flex flex-col justify-center flex-1 mt-24">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {services.map((service) => (
            <div
              key={service.name}
              className="border border-zinc-800/30 rounded-lg p-6 bg-zinc-950/50 backdrop-blur"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">{service.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-zinc-400">{service.status}</span>
                </div>
              </div>
              <div className="text-sm text-zinc-500">
                Uptime: {service.uptime}
              </div>
            </div>
          ))}
        </div>

        {/* Uptime History */}
        <div className="border border-zinc-800/30 rounded-lg p-6 bg-zinc-950/50 backdrop-blur mb-8">
          <h3 className="text-lg font-medium mb-4">90 Day Uptime</h3>
          <div className="flex gap-1">
            {uptimeData.map((day) => (
              <div
                key={day.day}
                className="flex-1 h-8 bg-green-500 rounded-sm hover:bg-green-400 transition-colors cursor-pointer"
                title={`Day ${day.day + 1}: ${day.uptime}%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-zinc-500">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Transaction Stream */}
        <TransactionStream />

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {/* Response Time */}
          <div className="border border-zinc-800/30 rounded-lg p-6 bg-zinc-950/50 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-400">Response Time</h3>
              <span className="text-xs text-zinc-500">24h avg</span>
            </div>
            <div className="text-3xl font-bold mb-4">45ms</div>
            <div className="h-16 flex items-end gap-1">
              {Array.from({ length: 24 }).map((_, i) => {
                const height = 30 + Math.random() * 70
                return (
                  <div
                    key={i}
                    className="flex-1 bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                    title={`Hour ${i}: ${Math.round(40 + Math.random() * 20)}ms`}
                  />
                )
              })}
            </div>
          </div>

          {/* Head Lag */}
          <div className="border border-zinc-800/30 rounded-lg p-6 bg-zinc-950/50 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-400">Head Lag</h3>
              <span className="text-xs text-zinc-500">24h avg</span>
            </div>
            <div className="text-3xl font-bold mb-4">2 blocks</div>
            <div className="h-16 flex items-end gap-1">
              {Array.from({ length: 24 }).map((_, i) => {
                const height = 40 + Math.random() * 60
                return (
                  <div
                    key={i}
                    className="flex-1 bg-purple-500 rounded-t"
                    style={{ height: `${height}%` }}
                    title={`Hour ${i}: ${Math.round(1 + Math.random() * 3)} blocks`}
                  />
                )
              })}
            </div>
          </div>

          {/* Transactions */}
          <div className="border border-zinc-800/30 rounded-lg p-6 bg-zinc-950/50 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-400">Transactions</h3>
              <span className="text-xs text-zinc-500">24h avg</span>
            </div>
            <div className="text-3xl font-bold mb-4">1.2M/h</div>
            <div className="h-16 flex items-end gap-1">
              {Array.from({ length: 24 }).map((_, i) => {
                const height = 50 + Math.random() * 50
                return (
                  <div
                    key={i}
                    className="flex-1 bg-green-500 rounded-t"
                    style={{ height: `${height}%` }}
                    title={`Hour ${i}: ${(1.0 + Math.random() * 0.5).toFixed(1)}M`}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
