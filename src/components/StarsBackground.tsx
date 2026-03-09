import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  color: string
  orbitRadius: number
  orbitSpeed: number
  angle: number
}

export function StarsBackground() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<Star[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const centerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Generate stars (discreet - 60 stars only)
    const stars: Star[] = []
    const colors = ['bg-zinc-600', 'bg-zinc-500', 'bg-zinc-400']

    for (let i = 0; i < 60; i++) {
      stars.push({
        x: 50,
        y: 50,
        size: Math.random() > 0.7 ? 2 : 1,
        opacity: 0.2 + Math.random() * 0.4, // Max 0.6 opacity (discreet)
        color: colors[Math.floor(Math.random() * colors.length)],
        orbitRadius: 50 + Math.random() * 350,
        orbitSpeed: 0.0002 + Math.random() * 0.0003,
        angle: Math.random() * Math.PI * 2,
      })
    }
    starsRef.current = stars

    // Update center position
    const updateCenter = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        centerRef.current = { x: rect.width / 2, y: rect.height / 2 }
      }
    }
    updateCenter()
    window.addEventListener('resize', updateCenter)

    // Mouse tracking (for gravity effect)
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        }
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    let animationId: number
    const animate = () => {
      starsRef.current.forEach((star) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - centerRef.current.x
        const dy = mouseRef.current.y - centerRef.current.y
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy)

        // Adjust orbit speed based on mouse proximity (subtle effect)
        const influenceFactor = Math.min(distanceFromCenter / 400, 1)
        const adjustedSpeed = star.orbitSpeed * (1 + influenceFactor * 0.3)

        // Update angle
        star.angle += adjustedSpeed

        // Calculate position
        star.x = 50 + Math.cos(star.angle) * (star.orbitRadius / 8)
        star.y = 50 + Math.sin(star.angle) * (star.orbitRadius / 8)
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', updateCenter)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
        {starsRef.current.map((star, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${star.color}`}
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: star.opacity,
              willChange: 'transform',
              transition: 'left 0.1s linear, top 0.1s linear',
            }}
          />
        ))}
      </div>
    </div>
  )
}
