import { useEffect, useState } from 'react'

interface Transaction {
  id: string
  type: string
  action: 'Buy' | 'Sell'
  chain: string
  amountUSD: number
  token: string
  from: string
  timestamp: number
}

const MOCK_TOKENS = ['WETH', 'USDC', 'USDT', 'PEPE', 'SHIB', 'DOGE', 'LINK', 'UNI', 'AAVE', 'REKT', 'TKFG']
const MOCK_CHAINS = [
  { id: 'evm:1', name: 'ETH' },
  { id: 'evm:56', name: 'BSC' },
  { id: 'evm:8453', name: 'Base' },
  { id: 'solana:mainnet', name: 'Solana' }
]

function generateMockTransaction(): Transaction {
  const chain = MOCK_CHAINS[Math.floor(Math.random() * MOCK_CHAINS.length)]
  const action = Math.random() > 0.5 ? 'Buy' : 'Sell'
  const token = MOCK_TOKENS[Math.floor(Math.random() * MOCK_TOKENS.length)]
  const amountUSD = Math.random() * 10000 + 10

  return {
    id: `${Date.now()}-${Math.random()}`,
    type: 'swap',
    action,
    chain: chain.id,
    amountUSD,
    token,
    from: `0x${Math.random().toString(16).slice(2, 42)}`,
    timestamp: Date.now(),
  }
}

export function TransactionStream() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [txPerSecond, setTxPerSecond] = useState(0)

  useEffect(() => {
    // Generate mock transactions
    const interval = setInterval(() => {
      const newTx = generateMockTransaction()
      setTransactions(prev => [newTx, ...prev].slice(0, 30))
    }, 800 + Math.random() * 1200) // Random interval between 0.8-2s

    // Calculate tx/s
    let txCount = 0
    const countInterval = setInterval(() => {
      txCount++
    }, 800)

    const metricsInterval = setInterval(() => {
      setTxPerSecond(txCount)
      txCount = 0
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(countInterval)
      clearInterval(metricsInterval)
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
