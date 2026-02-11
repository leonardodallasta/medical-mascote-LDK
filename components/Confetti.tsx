import React, { useEffect, useRef } from 'react';

const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: any[] = [];
    const colors = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#0dcaf0'];

    for (let i = 0; i < 100; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 3 + 2,
        vx: Math.random() * 2 - 1
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      pieces.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.w, p.h);

        if (p.y > canvas.height) {
            p.y = -10;
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const timeout = setTimeout(() => {
        cancelAnimationFrame(animationId);
    }, 3000);

    return () => {
        cancelAnimationFrame(animationId);
        clearTimeout(timeout);
    };
  }, []);

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  );
};

export default Confetti;