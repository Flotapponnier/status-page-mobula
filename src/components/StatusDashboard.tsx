export function StatusDashboard() {
  const services = [
    { name: 'API', status: 'operational', uptime: '99.9%' },
    { name: 'WebSocket', status: 'operational', uptime: '99.8%' },
    { name: 'Ethereum', status: 'operational', uptime: '99.9%' },
    { name: 'Solana', status: 'operational', uptime: '99.9%' },
    { name: 'BSC', status: 'operational', uptime: '99.7%' },
    { name: 'Base', status: 'operational', uptime: '99.8%' },
  ]

  return (
    <div className="relative z-10 min-h-screen flex flex-col p-8">
      {/* Nav */}
      <nav className="absolute top-8 right-8">
        <img src="/logo.svg" alt="Mobula" className="h-8 w-auto" />
      </nav>

      <div className="max-w-4xl w-full mx-auto flex flex-col justify-center flex-1">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Mobula Status</h1>
          <p className="text-zinc-400">All systems operational</p>
        </div>

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
        <div className="border border-zinc-800/30 rounded-lg p-6 bg-zinc-950/50 backdrop-blur">
          <h3 className="text-lg font-medium mb-4">90 Day Uptime</h3>
          <div className="flex gap-1">
            {Array.from({ length: 90 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-8 bg-green-500/20 rounded-sm"
                title={`Day ${i + 1}: 100%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-zinc-500">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  )
}
