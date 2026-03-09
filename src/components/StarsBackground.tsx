import { useEffect, useRef, useState } from 'react'

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
  const [, setTick] = useState(0)

  useEffect(() => {
    // Generate stars (120 stars)
    const stars: Star[] = []
    const colors = ['bg-zinc-600', 'bg-zinc-500', 'bg-zinc-400']

    for (let i = 0; i < 120; i++) {
      stars.push({
        x: 50,
        y: 50,
        size: Math.random() > 0.5 ? 3 : 2,
        opacity: 0.3 + Math.random() * 0.4,
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
        // Update angle for orbit
        star.angle += star.orbitSpeed

        // Calculate base orbit position
        const baseX = 50 + Math.cos(star.angle) * (star.orbitRadius / 8)
        const baseY = 50 + Math.sin(star.angle) * (star.orbitRadius / 8)

        // Calculate star position in pixels relative to center
        const starX = centerRef.current.x + (baseX - 50) * 8
        const starY = centerRef.current.y + (baseY - 50) * 8

        // Calculate distance from mouse to star
        const dx = mouseRef.current.x - starX
        const dy = mouseRef.current.y - starY
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy)

        // If mouse is within 150px radius, push star away
        const pushRadius = 150
        if (distanceToMouse < pushRadius && distanceToMouse > 0) {
          const pushStrength = (pushRadius - distanceToMouse) / pushRadius
          const pushX = -(dx / distanceToMouse) * pushStrength * 5
          const pushY = -(dy / distanceToMouse) * pushStrength * 5

          star.x = baseX + pushX
          star.y = baseY + pushY
        } else {
          star.x = baseX
          star.y = baseY
        }
      })

      setTick(t => t + 1)
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
            }}
          />
        ))}
      </div>
    </div>
  )
}
