'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Beam {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  opacity: number;
  hue: number;
}

export function HeroBeams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize beams
    const initBeams = () => {
      beamsRef.current = [];
      for (let i = 0; i < 12; i++) {
        beamsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          angle: Math.random() * Math.PI * 2,
          speed: 0.2 + Math.random() * 0.5,
          length: 150 + Math.random() * 300,
          opacity: 0.1 + Math.random() * 0.15,
          hue: 280 + Math.random() * 60, // Purple to pink range
        });
      }
    };
    initBeams();

    // Track mouse
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouse);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(9, 9, 11, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      beamsRef.current.forEach((beam) => {
        // Subtle attraction to mouse
        const dx = mouseRef.current.x - beam.x;
        const dy = mouseRef.current.y - beam.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 400) {
          beam.angle += Math.atan2(dy, dx) * 0.001;
        }

        // Move beam
        beam.x += Math.cos(beam.angle) * beam.speed;
        beam.y += Math.sin(beam.angle) * beam.speed;

        // Wrap around
        if (beam.x < -beam.length) beam.x = canvas.width + beam.length;
        if (beam.x > canvas.width + beam.length) beam.x = -beam.length;
        if (beam.y < -beam.length) beam.y = canvas.height + beam.length;
        if (beam.y > canvas.height + beam.length) beam.y = -beam.length;

        // Draw beam with gradient
        const endX = beam.x + Math.cos(beam.angle) * beam.length;
        const endY = beam.y + Math.sin(beam.angle) * beam.speed;

        const gradient = ctx.createLinearGradient(beam.x, beam.y, endX, endY);
        gradient.addColorStop(0, `hsla(${beam.hue}, 80%, 60%, 0)`);
        gradient.addColorStop(0.5, `hsla(${beam.hue}, 80%, 60%, ${beam.opacity})`);
        gradient.addColorStop(1, `hsla(${beam.hue}, 80%, 60%, 0)`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw glow
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${beam.hue}, 100%, 70%, ${beam.opacity * 0.3})`;
        ctx.lineWidth = 8;
        ctx.filter = 'blur(4px)';
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.filter = 'none';
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.8)_70%)] pointer-events-none" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Shooting stars */}
      <ShootingStars />
    </>
  );
}

const shootingStarConfigs = [
  { duration: 2.5, delay: 0 },
  { duration: 3.2, delay: 3.5 },
  { duration: 2.8, delay: 7 },
  { duration: 3.5, delay: 10.5 },
  { duration: 2.2, delay: 14 },
  { duration: 3.8, delay: 17.5 },
];

function ShootingStars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shootingStarConfigs.map((config, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-20"
          style={{
            left: `${10 + i * 15}%`,
            top: '-80px',
            background: 'linear-gradient(to bottom, transparent, rgba(236, 72, 153, 0.8), transparent)',
            transform: 'rotate(45deg)',
          }}
          animate={{
            y: ['0vh', '120vh'],
            x: ['0vw', '30vw'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: config.duration,
            repeat: Infinity,
            delay: config.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
