import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Circle {
  id: string;
  x: number;
  y: number;
  r: number;
  baseX: number;
  baseY: number;
}

interface Line {
  from: string;
  to: string;
  type: 'horizontal' | 'vertical';
}

export const BackgroundDecoration: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);

  // Définir les cercles initiaux
  const circles1: Circle[] = [
    { id: 'c1', baseX: 100, baseY: 80, x: 100, y: 80, r: 8 },
    { id: 'c2', baseX: 250, baseY: 120, x: 250, y: 120, r: 6 },
    { id: 'c3', baseX: 400, baseY: 60, x: 400, y: 60, r: 10 },
    { id: 'c4', baseX: 550, baseY: 100, x: 550, y: 100, r: 7 },
    { id: 'c5', baseX: 700, baseY: 50, x: 700, y: 50, r: 9 },
    { id: 'c6', baseX: 850, baseY: 90, x: 850, y: 90, r: 6 },
    { id: 'c7', baseX: 1000, baseY: 70, x: 1000, y: 70, r: 8 },
    { id: 'c8', baseX: 1100, baseY: 110, x: 1100, y: 110, r: 7 },
  ];

  const circles2: Circle[] = [
    { id: 'c9', baseX: 150, baseY: 200, x: 150, y: 200, r: 6 },
    { id: 'c10', baseX: 300, baseY: 240, x: 300, y: 240, r: 8 },
    { id: 'c11', baseX: 450, baseY: 180, x: 450, y: 180, r: 7 },
    { id: 'c12', baseX: 600, baseY: 220, x: 600, y: 220, r: 9 },
    { id: 'c13', baseX: 750, baseY: 170, x: 750, y: 170, r: 6 },
    { id: 'c14', baseX: 900, baseY: 210, x: 900, y: 210, r: 8 },
    { id: 'c15', baseX: 1050, baseY: 190, x: 1050, y: 190, r: 7 },
  ];

  const circles3: Circle[] = [
    { id: 'c16', baseX: 200, baseY: 150, x: 200, y: 150, r: 6 },
    { id: 'c17', baseX: 400, baseY: 130, x: 400, y: 130, r: 8 },
    { id: 'c18', baseX: 600, baseY: 160, x: 600, y: 160, r: 7 },
    { id: 'c19', baseX: 800, baseY: 140, x: 800, y: 140, r: 9 },
    { id: 'c20', baseX: 1000, baseY: 150, x: 1000, y: 150, r: 6 },
  ];

  // Définir les connexions
  const lines1: Line[] = [
    { from: 'c1', to: 'c2', type: 'horizontal' },
    { from: 'c2', to: 'c3', type: 'horizontal' },
    { from: 'c3', to: 'c4', type: 'horizontal' },
    { from: 'c4', to: 'c5', type: 'horizontal' },
    { from: 'c5', to: 'c6', type: 'horizontal' },
    { from: 'c6', to: 'c7', type: 'horizontal' },
    { from: 'c7', to: 'c8', type: 'horizontal' },
  ];

  const lines2: Line[] = [
    { from: 'c9', to: 'c1', type: 'vertical' },
    { from: 'c10', to: 'c2', type: 'vertical' },
    { from: 'c12', to: 'c4', type: 'vertical' },
  ];

  const lines3: Line[] = [
    { from: 'c16', to: 'c17', type: 'horizontal' },
    { from: 'c17', to: 'c18', type: 'horizontal' },
    { from: 'c18', to: 'c19', type: 'horizontal' },
    { from: 'c19', to: 'c20', type: 'horizontal' },
  ];

  // Animation du temps pour mouvements organiques
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.01);
    }, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  // Suivi de la souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 50;
      const y = (e.clientY / window.innerHeight - 0.5) * 50;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculer les positions animées des cercles
  const getAnimatedPosition = (circle: Circle, offset: number) => {
    const mouseOffsetX = mousePosition.x * (1 + offset * 0.3);
    const mouseOffsetY = mousePosition.y * (1 + offset * 0.3);
    
    const floatX = Math.sin(time * 0.5 + circle.id.charCodeAt(1) * 0.1) * 15;
    const floatY = Math.cos(time * 0.7 + circle.id.charCodeAt(1) * 0.15) * 12;
    
    return {
      x: circle.baseX + floatX + mouseOffsetX,
      y: circle.baseY + floatY + mouseOffsetY,
    };
  };

  // Trouver un cercle par ID
  const findCircle = (id: string, circles: Circle[]): Circle | undefined => {
    return circles.find(c => c.id === id);
  };

  // Générer un chemin de ligne courbe
  const getCurvePath = (fromCircle: Circle, toCircle: Circle, offset: number): string => {
    const fromPos = getAnimatedPosition(fromCircle, offset);
    const toPos = getAnimatedPosition(toCircle, offset);
    const midX = (fromPos.x + toPos.x) / 2;
    const midY = (fromPos.y + toPos.y) / 2;
    const controlY = fromCircle.baseY < 150 ? midY - 40 : midY + 40;
    return `M ${fromPos.x} ${fromPos.y} Q ${midX} ${controlY} ${toPos.x} ${toPos.y}`;
  };

  // Générer un chemin de ligne verticale courbe
  const getVerticalPath = (fromCircle: Circle, toCircle: Circle, offset: number): string => {
    const fromPos = getAnimatedPosition(fromCircle, offset);
    const toPos = getAnimatedPosition(toCircle, offset);
    const controlX = (fromPos.x + toPos.x) / 2 - 25;
    const controlY = (fromPos.y + toPos.y) / 2;
    return `M ${fromPos.x} ${fromPos.y} Q ${controlX} ${controlY} ${toPos.x} ${toPos.y}`;
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Groupe 1 - Ligne supérieure */}
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-20"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        {circles1.map((circle) => {
          const pos = getAnimatedPosition(circle, 0);
          return (
            <motion.circle
              key={circle.id}
              cx={pos.x}
              cy={pos.y}
              r={circle.r}
              fill="#1a1a1a"
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
          );
        })}

        {lines1.map((line) => {
          const fromCircle = findCircle(line.from, circles1);
          const toCircle = findCircle(line.to, circles1);
          if (!fromCircle || !toCircle) return null;
          const path = getCurvePath(fromCircle, toCircle, 0);
          return (
            <motion.path
              key={`line-${line.from}-${line.to}`}
              d={path}
              stroke="#1a1a1a"
              strokeWidth="1.5"
              fill="none"
              opacity="0.3"
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
          );
        })}
      </svg>

      {/* Groupe 2 - Ligne du milieu */}
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-20"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        {circles2.map((circle) => {
          const pos = getAnimatedPosition(circle, 0.3);
          return (
            <motion.circle
              key={circle.id}
              cx={pos.x}
              cy={pos.y}
              r={circle.r}
              fill="#1a1a1a"
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
          );
        })}

        {lines2.map((line) => {
          const fromCircle = findCircle(line.from, circles2);
          const toCircle = line.to.startsWith('c1') || line.to.startsWith('c2') || line.to.startsWith('c4')
            ? findCircle(line.to, circles1)
            : findCircle(line.from, circles2);
          if (!fromCircle || !toCircle) return null;
          const path = line.type === 'vertical'
            ? getVerticalPath(fromCircle, toCircle, 0.15)
            : getCurvePath(fromCircle, toCircle, 0.3);
          return (
            <motion.path
              key={`line-${line.from}-${line.to}`}
              d={path}
              stroke="#1a1a1a"
              strokeWidth="1.5"
              fill="none"
              opacity="0.2"
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
          );
        })}
      </svg>

      {/* Groupe 3 - Ligne du bas */}
      <svg
        className="absolute bottom-0 left-0 w-full h-64 opacity-15"
        viewBox="0 0 1200 200"
        preserveAspectRatio="xMidYMid slice"
      >
        {circles3.map((circle) => {
          const pos = getAnimatedPosition(circle, 0.5);
          return (
            <motion.circle
              key={circle.id}
              cx={pos.x}
              cy={pos.y}
              r={circle.r}
              fill="#1a1a1a"
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
          );
        })}

        {lines3.map((line) => {
          const fromCircle = findCircle(line.from, circles3);
          const toCircle = findCircle(line.to, circles3);
          if (!fromCircle || !toCircle) return null;
          const path = getCurvePath(fromCircle, toCircle, 0.5);
          return (
            <motion.path
              key={`line-${line.from}-${line.to}`}
              d={path}
              stroke="#1a1a1a"
              strokeWidth="1.5"
              fill="none"
              opacity="0.2"
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
          );
        })}
      </svg>
    </div>
  );
};
