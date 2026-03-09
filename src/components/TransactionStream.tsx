import { useEffect, useRef, useState } from 'react'

interface Transaction {
  id: string
  type: string
  chain: string
  amountUSD?: number
  token0?: string
  token1?: string
  timestamp: number
}

export function TransactionStream() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [metrics, setMetrics] = useState({
    txPerSecond: 0,
    totalTx: 0,
    connected: false,
  })
  const wsRef = useRef<WebSocket | null>(null)
  const txCountRef = useRef(0)
  const lastSecondRef = useRef(Date.now())

  useEffect(() => {
    const apiKey = import.meta.env.VITE_STREAMS_API_KEY
    const wssUrl = import.meta.env.VITE_STREAMS_WSS_URL || 'wss://streams.mobula.io'

    if (!apiKey) {
      console.error('Missing VITE_STREAMS_API_KEY')
      return
    }

    const ws = new WebSocket(wssUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')
      setMetrics(prev => ({ ...prev, connected: true }))

      // Subscribe to swap-enriched events on all chains
      ws.send(JSON.stringify({
        type: 'stream',
        authorization: apiKey,
        chainIds: ['evm:1', 'evm:56', 'evm:8453', 'solana:mainnet'],
        events: ['swap-enriched'],
        subscriptionTracking: true,
      }))
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)

        // Handle subscription confirmation
        if (message.event === 'subscribed') {
          console.log('Subscribed:', message)
          return
        }

        // Handle swap data
        if (message.data && message.chainId) {
          const swap = message.data

          const tx: Transaction = {
            id: `${message.chainId}-${swap.transactionHash || Date.now()}-${Math.random()}`,
            type: 'swap',
            chain: message.chainId,
            amountUSD: swap.amountUSD,
            token0: swap.addressToken0,
            token1: swap.addressToken1,
            timestamp: Date.now(),
          }

          setTransactions(prev => {
            const updated = [tx, ...prev].slice(0, 30)
            return updated
          })

          // Update metrics
          txCountRef.current++
          setMetrics(prev => ({ ...prev, totalTx: txCountRef.current }))

          // Calculate tx/s every second
          const now = Date.now()
          if (now - lastSecondRef.current >= 1000) {
            const txInLastSecond = txCountRef.current
            setMetrics(prev => ({ ...prev, txPerSecond: txInLastSecond }))
            txCountRef.current = 0
            lastSecondRef.current = now
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setMetrics(prev => ({ ...prev, connected: false }))
    }

    ws.onclose = () => {
      console.log('WebSocket closed')
      setMetrics(prev => ({ ...prev, connected: false }))
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const getChainDisplay = (chainId: string) => {
    if (chainId.includes(':1')) return 'ETH'
    if (chainId.includes('56')) return 'BSC'
    if (chainId.includes('8453')) return 'Base'
    if (chainId.includes('solana')) return 'Solana'
    return chainId
  }

  const getChainColor = (chainId: string) => {
    if (chainId.includes(':1')) return 'text-blue-400'
    if (chainId.includes('56')) return 'text-yellow-400'
    if (chainId.includes('8453')) return 'text-blue-500'
    if (chainId.includes('solana')) return 'text-purple-400'
    return 'text-zinc-400'
  }

  const getActionColor = (action: string) => {
    return action === 'Buy' ? 'text-green-400' : 'text-red-400'
  }

  const getActionEmoji = (action: string) => {
    return action === 'Buy' ? '🟢' : '🔴'
  }

  return (
    <div className="border border-zinc-800/30 rounded-lg p-6 bg-zinc-950/50 backdrop-blur">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium mb-1">Live Router Swaps</h3>
          <p className="text-sm text-zinc-500">Real-time trades routed through Mobula</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold">{txPerSecond}</div>
            <div className="text-xs text-zinc-500">tx/s</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-zinc-500">Live</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {transactions.map((tx, index) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3 rounded bg-zinc-900/50 border border-zinc-800/30 hover:border-zinc-700/50 transition-all"
            style={{
              animation: `slideIn 0.3s ease-out`,
              opacity: Math.max(0.3, 1 - index * 0.02),
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-base">{getActionEmoji(tx.action)}</span>
              <div className={`text-xs font-mono font-semibold ${getChainColor(tx.chain)}`}>
                {getChainDisplay(tx.chain)}
              </div>
              <div className={`text-sm font-medium ${getActionColor(tx.action)}`}>
                {tx.action}
              </div>
              <div className="text-sm text-zinc-400">{tx.token}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-zinc-300">
                ${tx.amountUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-zinc-500">
                {new Date(tx.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thumb-zinc-800::-webkit-scrollbar-thumb {
          background-color: rgb(39 39 42);
          border-radius: 2px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  )
}
