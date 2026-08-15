import React, { useEffect, useRef } from 'react';

export interface CyberMotherboardCanvasProps {
  mode: 'ambient_motherboard' | 'blackhole' | 'silicon_motherboard';
  currentStepIndex?: number;
  completedStepCount?: number;
  totalSteps?: number;
  warpProgress?: number; // 0 to 1 during warp dive
  intensity?: number; // 0.1 to 1 for ambient vs full blast
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
}

interface CircuitTrace {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3?: number;
  y3?: number;
  active: boolean;
  stationIdx: number;
  pulseProgress: number;
  speed: number;
  color: string;
}

interface ChipNode {
  id: string;
  name: string;
  role: string;
  x: number; // 0 to 1 relative
  y: number;
  w: number;
  h: number;
  stationIdx: number;
  heat: number;
  active: boolean;
}

export const CyberMotherboardCanvas: React.FC<CyberMotherboardCanvasProps> = ({
  mode,
  currentStepIndex = 0,
  completedStepCount = 0,
  totalSteps = 8,
  warpProgress = 1,
  intensity = 0.7,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Generate Tron / Black Hole star particles
    const starCount = mode === 'ambient_motherboard' ? 220 : 380;
    const stars: Particle[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * 1000 + 1,
        vx: 0,
        vy: 0,
        vz: Math.random() * 3 + 2,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? '#06B6D4' : Math.random() > 0.5 ? '#10B981' : '#F59E0B',
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    // Define 9 Silicon Microchip locations on motherboard
    const chips: ChipNode[] = [
      { id: 'CPU-01', name: 'TRUST_ROOT', role: 'Git HEAD Invariant', x: 0.18, y: 0.22, w: 110, h: 65, stationIdx: 0, heat: 0.9, active: true },
      { id: 'BUS-02', name: 'LOOM_STAGE', role: 'State Machine Bus', x: 0.45, y: 0.2, w: 120, h: 65, stationIdx: 1, heat: 0.8, active: true },
      { id: 'REG-03', name: 'OPERATOR_CTX', role: 'Local Principal Vault', x: 0.75, y: 0.22, w: 110, h: 65, stationIdx: 2, heat: 0.75, active: true },
      { id: 'ASIC-04', name: 'AST_SQUEEZER', role: '42% Token Compression', x: 0.2, y: 0.52, w: 115, h: 65, stationIdx: 3, heat: 0.95, active: true },
      { id: 'SCHED-05', name: 'TASK_MATRIX', role: 'Multi-Core Governed Q', x: 0.48, y: 0.5, w: 120, h: 65, stationIdx: 4, heat: 0.85, active: true },
      { id: 'VAULT-06', name: 'SRC_REGISTRY', role: 'Air-Gapped Private Docs', x: 0.78, y: 0.52, w: 115, h: 65, stationIdx: 5, heat: 0.7, active: true },
      { id: 'ROM-07', name: 'EVIDENCE_SEAL', role: 'Immutable Hash Receipts', x: 0.25, y: 0.82, w: 120, h: 65, stationIdx: 6, heat: 0.8, active: true },
      { id: 'GATE-08', name: 'HUMAN_INTERLOCK', role: 'Dual-Key Auth Perms', x: 0.55, y: 0.8, w: 120, h: 65, stationIdx: 7, heat: 0.9, active: true },
      { id: 'CORE-00', name: 'CRYPTO_KERNEL', role: 'Deterministic VM Root', x: 0.82, y: 0.82, w: 115, h: 65, stationIdx: -1, heat: 1.0, active: true },
    ];

    // Copper & Gold PCB Circuit Traces
    const traces: CircuitTrace[] = [
      { x1: 0.18, y1: 0.22, x2: 0.45, y2: 0.2, active: true, stationIdx: 0, pulseProgress: 0.2, speed: 0.008, color: '#06B6D4' },
      { x1: 0.45, y1: 0.2, x2: 0.75, y2: 0.22, active: true, stationIdx: 1, pulseProgress: 0.5, speed: 0.007, color: '#10B981' },
      { x1: 0.45, y1: 0.2, x2: 0.48, y2: 0.5, active: true, stationIdx: 2, pulseProgress: 0.8, speed: 0.009, color: '#F59E0B' },
      { x1: 0.18, y1: 0.22, x2: 0.2, y2: 0.52, active: true, stationIdx: 3, pulseProgress: 0.1, speed: 0.008, color: '#06B6D4' },
      { x1: 0.2, y1: 0.52, x2: 0.48, y2: 0.5, active: true, stationIdx: 3, pulseProgress: 0.4, speed: 0.01, color: '#10B981' },
      { x1: 0.48, y1: 0.5, x2: 0.78, y2: 0.52, active: true, stationIdx: 4, pulseProgress: 0.6, speed: 0.007, color: '#06B6D4' },
      { x1: 0.2, y1: 0.52, x2: 0.25, y2: 0.82, active: true, stationIdx: 5, pulseProgress: 0.3, speed: 0.008, color: '#F59E0B' },
      { x1: 0.48, y1: 0.5, x2: 0.55, y2: 0.8, active: true, stationIdx: 6, pulseProgress: 0.7, speed: 0.009, color: '#10B981' },
      { x1: 0.78, y1: 0.52, x2: 0.82, y2: 0.82, active: true, stationIdx: 7, pulseProgress: 0.2, speed: 0.008, color: '#06B6D4' },
      { x1: 0.25, y1: 0.82, x2: 0.55, y2: 0.8, active: true, stationIdx: 6, pulseProgress: 0.9, speed: 0.007, color: '#06B6D4' },
      { x1: 0.55, y1: 0.8, x2: 0.82, y2: 0.82, active: true, stationIdx: 7, pulseProgress: 0.5, speed: 0.01, color: '#10B981' },
    ];

    let angle = 0;

    const render = () => {
      angle += 0.01;

      // Base Background Substrate
      if (mode === 'blackhole') {
        // Deep space singularity
        ctx.fillStyle = 'rgba(3, 5, 8, 0.4)';
        ctx.fillRect(0, 0, width, height);

        // Center of Black Hole Singularity
        const cx = width / 2;
        const cy = height / 2;

        // Gravitational Lensing Accretion Disk (Tron Rings)
        for (let r = 8; r > 0; r--) {
          ctx.beginPath();
          ctx.ellipse(
            cx,
            cy,
            r * 45 + Math.sin(angle * 2 + r) * 6,
            r * 24 + Math.cos(angle * 1.5 + r) * 4,
            angle * 0.2 + (r * Math.PI) / 8,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle =
            r % 2 === 0
              ? `rgba(6, 182, 212, ${0.45 / r})`
              : `rgba(16, 185, 129, ${0.4 / r})`;
          ctx.lineWidth = 2 + (8 - r) * 0.8;
          ctx.stroke();
        }

        // Relativistic Singularity Event Horizon Core
        const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 140);
        grad.addColorStop(0, '#000000');
        grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.95)');
        grad.addColorStop(0.85, 'rgba(6, 182, 212, 0.4)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 140, 0, Math.PI * 2);
        ctx.fill();

        // Singularity Photon Ring Glow
        ctx.strokeStyle = '#06B6D4';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(cx, cy, 68 + Math.sin(angle * 5) * 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Tron Hyper-warp grid rays
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.lineWidth = 1;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a + angle * 0.5) * 80, cy + Math.sin(a + angle * 0.5) * 80);
          ctx.lineTo(cx + Math.cos(a + angle * 0.5) * (width * 1.2), cy + Math.sin(a + angle * 0.5) * (height * 1.2));
          ctx.stroke();
        }
      } else {
        // Mode is ambient_motherboard or silicon_motherboard
        ctx.fillStyle = mode === 'ambient_motherboard' ? 'rgba(5, 8, 14, 0.35)' : 'rgba(5, 8, 14, 0.5)';
        ctx.fillRect(0, 0, width, height);

        // 1. Grid matrix lines on Silicon Substrate
        const gridSize = 45;
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < width; x += gridSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();

        // 2. Copper & Gold Conductive Circuit Traces
        traces.forEach((trace) => {
          const x1 = trace.x1 * width;
          const y1 = trace.y1 * height;
          const x2 = trace.x2 * width;
          const y2 = trace.y2 * height;

          // Orthogonal PCB routing (corner at 45 or 90 deg)
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          ctx.strokeStyle = trace.active ? 'rgba(245, 158, 11, 0.25)' : 'rgba(71, 85, 105, 0.15)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(midX, y1);
          ctx.lineTo(midX, y2);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Bus parallel trace
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x1, y1 + 4);
          ctx.lineTo(midX + 4, y1 + 4);
          ctx.lineTo(midX + 4, y2 + 4);
          ctx.lineTo(x2, y2 + 4);
          ctx.stroke();

          // Live Electron / Photon Pulse traveling through trace
          trace.pulseProgress += trace.speed;
          if (trace.pulseProgress > 1) trace.pulseProgress = 0;

          // Calculate pulse coords along 3 segments
          let px = x1;
          let py = y1;
          const p = trace.pulseProgress;
          if (p < 0.33) {
            const segP = p / 0.33;
            px = x1 + (midX - x1) * segP;
            py = y1;
          } else if (p < 0.66) {
            const segP = (p - 0.33) / 0.33;
            px = midX;
            py = y1 + (y2 - y1) * segP;
          } else {
            const segP = (p - 0.66) / 0.34;
            px = midX + (x2 - midX) * segP;
            py = y2;
          }

          // Draw Glowing Electron packet
          ctx.shadowColor = trace.color;
          ctx.shadowBlur = 10;
          ctx.fillStyle = trace.color;
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // 3. Render 9 Silicon Microchips & IC Package Sockets
        chips.forEach((chip) => {
          const cx = chip.x * width;
          const cy = chip.y * height;
          const isSelected = chip.stationIdx === currentStepIndex;
          const isCompleted = chip.stationIdx >= 0 && chip.stationIdx < completedStepCount;

          // IC Package Body
          ctx.save();
          ctx.translate(cx - chip.w / 2, cy - chip.h / 2);

          // Socket Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(4, 4, chip.w, chip.h);

          // Silicon Chip Body
          ctx.fillStyle = isSelected
            ? 'rgba(11, 25, 44, 0.95)'
            : isCompleted
            ? 'rgba(8, 30, 22, 0.9)'
            : 'rgba(11, 19, 27, 0.85)';
          ctx.fillRect(0, 0, chip.w, chip.h);

          // Chip Border & Corner Pins
          ctx.strokeStyle = isSelected
            ? '#06B6D4'
            : isCompleted
            ? '#10B981'
            : 'rgba(6, 182, 212, 0.35)';
          ctx.lineWidth = isSelected ? 2 : 1;
          if (isSelected) {
            ctx.shadowColor = '#06B6D4';
            ctx.shadowBlur = 12;
          }
          ctx.strokeRect(0, 0, chip.w, chip.h);
          ctx.shadowBlur = 0;

          // Gold IC Pins on left & right
          const pinCount = 4;
          for (let p = 0; p < pinCount; p++) {
            const py = 12 + p * 12;
            ctx.fillStyle = '#F59E0B';
            // Left pin
            ctx.fillRect(-5, py, 5, 4);
            // Right pin
            ctx.fillRect(chip.w, py, 5, 4);
          }

          // Top heat spreader notch
          ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
          ctx.fillRect(chip.w / 2 - 10, 0, 20, 3);

          // Chip ID & Label
          ctx.fillStyle = isSelected ? '#00F0FF' : isCompleted ? '#34D399' : '#94A3B8';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(chip.id, 8, 16);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 8px monospace';
          ctx.fillText(chip.name, 8, 28);

          ctx.fillStyle = '#64748B';
          ctx.font = '7px sans-serif';
          ctx.fillText(chip.role.substring(0, 16), 8, 42);

          // Status LED
          ctx.fillStyle = isSelected ? '#00F0FF' : isCompleted ? '#10B981' : '#F59E0B';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(chip.w - 12, 14, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.restore();
        });

        // 4. Interactive Magnetic Flux Line tracking mouse
        if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;

          ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(mx, my, 45, 0, Math.PI * 2);
          ctx.stroke();

          // Crosshairs
          ctx.beginPath();
          ctx.moveTo(mx - 60, my);
          ctx.lineTo(mx + 60, my);
          ctx.moveTo(mx, my - 60);
          ctx.lineTo(mx, my + 60);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Starfield 3D Warp acceleration
      const cx = width / 2;
      const cy = height / 2;
      const warpSpeed = mode === 'blackhole' ? 16 : 4;

      stars.forEach((star) => {
        star.z -= warpSpeed;
        if (star.z <= 0) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 280 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const sz = Math.max(0.5, (1 - star.z / 1000) * star.size * 2);
          const alpha = (1 - star.z / 1000) * star.alpha * (mode === 'ambient_motherboard' ? 0.6 : 1);

          ctx.fillStyle = star.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(px, py, sz, 0, Math.PI * 2);
          ctx.fill();

          // Light streak on warp
          if (mode === 'blackhole' || mode === 'silicon_motherboard') {
            ctx.strokeStyle = star.color;
            ctx.lineWidth = sz * 0.8;
            ctx.beginPath();
            ctx.moveTo(px, py);
            const prevK = 280 / (star.z + warpSpeed * 2);
            ctx.lineTo(star.x * prevK + cx, star.y * prevK + cy);
            ctx.stroke();
          }
        }
      });
      ctx.globalAlpha = 1.0;

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [mode, currentStepIndex, completedStepCount, totalSteps, warpProgress]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none transition-opacity duration-700 ${
        mode === 'ambient_motherboard' ? 'z-0 opacity-80' : 'z-10 opacity-100'
      }`}
    />
  );
};
