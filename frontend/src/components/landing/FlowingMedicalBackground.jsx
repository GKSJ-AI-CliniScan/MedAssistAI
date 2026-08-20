import React, { useEffect, useRef } from 'react';

export default function FlowingMedicalBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // DNA Helix parameters
    const dnaStrands = [
      { phase: 0, speed: 0.002, amplitude: 80, yOffset: height * 0.4 },
      { phase: Math.PI, speed: 0.002, amplitude: 80, yOffset: height * 0.4 },
      { phase: 0.5, speed: 0.0015, amplitude: 60, yOffset: height * 0.6 },
      { phase: Math.PI * 1.5, speed: 0.0015, amplitude: 60, yOffset: height * 0.6 },
    ];

    // Particle system
    const particleCount = 150;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '#06B6D4' : Math.random() > 0.5 ? '#2563EB' : '#7C3AED',
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      });
    }

    // Molecular network nodes
    const networkNodes = [];
    const nodeCount = 40;

    for (let i = 0; i < nodeCount; i++) {
      networkNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.3 + 0.1,
        connections: [],
      });
    }

    // ECG lines
    const ecgLines = [
      { y: height * 0.3, speed: 2, phase: 0 },
      { y: height * 0.7, speed: 1.5, phase: Math.PI },
    ];

    // Light gradients
    const lightGradients = [
      { x: width * 0.2, y: height * 0.3, radius: 400, speed: 0.0005, phase: 0 },
      { x: width * 0.8, y: height * 0.7, radius: 350, speed: 0.0007, phase: Math.PI },
    ];

    let time = 0;

    function drawDNA() {
      dnaStrands.forEach((strand, index) => {
        ctx.beginPath();
        ctx.strokeStyle = index < 2 ? '#06B6D4' : '#2563EB';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4;

        for (let x = 0; x < width + 200; x += 5) {
          const y = strand.yOffset + 
                    Math.sin((x * 0.01) + strand.phase + time * strand.speed) * strand.amplitude +
                    Math.sin((x * 0.005) + time * strand.speed * 0.5) * strand.amplitude * 0.5;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Draw base pairs
        ctx.globalAlpha = 0.2;
        for (let x = 50; x < width; x += 80) {
          const y1 = strand.yOffset + 
                     Math.sin((x * 0.01) + strand.phase + time * strand.speed) * strand.amplitude;
          const y2 = strand.yOffset + 
                     Math.sin((x * 0.01) + strand.phase + Math.PI + time * strand.speed) * strand.amplitude;
          
          ctx.beginPath();
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
          ctx.strokeStyle = '#06B6D4';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Base pair dots
          ctx.beginPath();
          ctx.arc(x, y1, 2, 0, Math.PI * 2);
          ctx.arc(x, y2, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#06B6D4';
          ctx.fill();
        }
      });
    }

    function drawParticles() {
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Pulse effect
        particle.pulse += particle.pulseSpeed;
        const pulseOpacity = particle.opacity + Math.sin(particle.pulse) * 0.1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = pulseOpacity;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = pulseOpacity * 0.3;
        ctx.fill();
      });
    }

    function drawMolecularNetwork() {
      // Update nodes
      networkNodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;
      });

      // Draw connections
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < networkNodes.length; i++) {
        for (let j = i + 1; j < networkNodes.length; j++) {
          const dx = networkNodes[i].x - networkNodes[j].x;
          const dy = networkNodes[i].y - networkNodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(networkNodes[i].x, networkNodes[i].y);
            ctx.lineTo(networkNodes[j].x, networkNodes[j].y);
            ctx.globalAlpha = (1 - distance / 150) * 0.15;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      networkNodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = '#06B6D4';
        ctx.globalAlpha = node.opacity;
        ctx.fill();
      });
    }

    function drawECG() {
      ecgLines.forEach((ecg) => {
        ctx.beginPath();
        ctx.strokeStyle = '#06B6D4';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.15;

        for (let x = 0; x < width; x += 2) {
          const normalizedX = (x + time * ecg.speed) % width;
          const y = ecg.y + 
                    Math.sin(normalizedX * 0.02 + ecg.phase) * 10 +
                    Math.sin(normalizedX * 0.05) * 5 +
                    Math.sin(normalizedX * 0.1) * 2;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });
    }

    function drawLightGradients() {
      lightGradients.forEach((gradient) => {
        gradient.phase += gradient.speed;
        const x = gradient.x + Math.sin(gradient.phase) * 100;
        const y = gradient.y + Math.cos(gradient.phase) * 50;

        const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, gradient.radius);
        radialGradient.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
        radialGradient.addColorStop(0.5, 'rgba(37, 99, 235, 0.05)');
        radialGradient.addColorStop(1, 'rgba(6, 20, 38, 0)');

        ctx.fillStyle = radialGradient;
        ctx.globalAlpha = 1;
        ctx.fillRect(0, 0, width, height);
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw base gradient
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, '#061426');
      bgGradient.addColorStop(0.5, '#0A2342');
      bgGradient.addColorStop(1, '#061426');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw layers in order
      drawLightGradients();
      drawDNA();
      drawMolecularNetwork();
      drawParticles();
      drawECG();

      // Vignette overlay
      const vignetteGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.7);
      vignetteGradient.addColorStop(0, 'rgba(6, 20, 38, 0)');
      vignetteGradient.addColorStop(1, 'rgba(6, 20, 38, 0.6)');
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, width, height);

      time += 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Fallback static elements for non-JS environments */}
      <noscript>
        <div className="absolute inset-0 bg-gradient-to-br from-[#061426] via-[#0A2342] to-[#061426]" />
      </noscript>
    </div>
  );
}
