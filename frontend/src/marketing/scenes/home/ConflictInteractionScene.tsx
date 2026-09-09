import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AgentNode {
  id: string;
  name: string;
  strategy: string;
  x: number;
  y: number;
  initialRadius: number;
  finalRadius: number;
  coalition: 'A' | 'B';
}

const AGENTS: AgentNode[] = [
  { id: '1', name: 'Agent 01', strategy: 'Tit-for-Tat', x: 120, y: 70, initialRadius: 16, finalRadius: 20, coalition: 'A' },
  { id: '2', name: 'Agent 02', strategy: 'Cooperative', x: 200, y: 50, initialRadius: 16, finalRadius: 22, coalition: 'A' },
  { id: '3', name: 'Agent 03', strategy: 'Cooperative', x: 160, y: 130, initialRadius: 16, finalRadius: 18, coalition: 'A' },
  { id: '4', name: 'Agent 04', strategy: 'Defector', x: 280, y: 90, initialRadius: 16, finalRadius: 24, coalition: 'B' },
  { id: '5', name: 'Agent 05', strategy: 'Aggressive', x: 360, y: 60, initialRadius: 16, finalRadius: 12, coalition: 'B' },
  { id: '6', name: 'Agent 06', strategy: 'Tit-for-Tat', x: 420, y: 110, initialRadius: 16, finalRadius: 17, coalition: 'B' },
  { id: '7', name: 'Agent 07', strategy: 'Random', x: 320, y: 160, initialRadius: 16, finalRadius: 14, coalition: 'B' },
  { id: '8', name: 'Agent 08', strategy: 'Cooperative', x: 240, y: 190, initialRadius: 16, finalRadius: 15, coalition: 'A' },
];

export const ConflictInteractionScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinStageRef = useRef<HTMLDivElement | null>(null);
  const betrayalEdgeRef = useRef<SVGLineElement | null>(null);
  const betrayalCalloutRef = useRef<HTMLDivElement | null>(null);
  const agentCirclesRef = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=140%',
          pin: pinStageRef.current,
          scrub: true,
          anticipatePin: 1,
        },
      });

      // 1. Meet -> Cooperate: initial network stable
      // 2. Betray: Agent 04 exploits Agent 03
      tl.to(
        betrayalEdgeRef.current,
        {
          stroke: '#983E36',
          strokeWidth: 3,
          strokeDasharray: '4 2',
          duration: 0.3,
          ease: 'power2.in',
        },
        0.35
      );
      tl.fromTo(
        betrayalCalloutRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.2, ease: 'power1.out' },
        0.4
      );

      // 3. Remember & Redistribute: Resource radii change according to payoffs
      agentCirclesRef.current.forEach((circle, idx) => {
        if (!circle) return;
        const targetR = AGENTS[idx].finalRadius;
        tl.to(
          circle,
          {
            attr: { r: targetR },
            duration: 0.4,
            ease: 'power2.out',
          },
          0.55
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-mi-canvas border-b border-mi-rule"
      aria-label="Agents Remember"
    >
      <div
        ref={pinStageRef}
        className="w-full min-h-[100svh] py-16 px-6 sm:px-8 lg:px-16 flex flex-col justify-center max-w-[1600px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left 4 Cols: Interaction Story */}
          <div className="lg:col-span-4 space-y-6">
            <span className="font-mono text-xs text-mi-muted uppercase tracking-wider block">
              Movement 06: Strategic Multi-Agent System
            </span>
            <h2 className="font-sans font-medium text-[clamp(2.2rem,3.4vw,3.8rem)] leading-[0.96] tracking-tight text-mi-ink">
              Agents remember.
            </h2>
            <p className="text-mi-ink-2 text-base leading-relaxed">
              In repeated interaction, outcomes depend on memory. When an actor defects, trust scores decay, coalitions reconfigure, and resources redistribute across successive rounds.
            </p>

            <div className="p-4 bg-mi-paper border border-mi-rule space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-mi-muted uppercase">Interaction Model</span>
                <span className="text-mi-ink">Repeated Prisoner's Dilemma</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mi-muted uppercase">Memory Mechanism</span>
                <span className="text-mi-ink">Trust Matrix & Defection Log</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mi-muted uppercase">Coalition Rebalance</span>
                <span className="text-mi-data-blue font-medium">Alliance Cohesion Dynamic</span>
              </div>
            </div>
          </div>

          {/* Right 8 Cols: Strategic Trust & Resource Network */}
          <div className="lg:col-span-8 bg-mi-paper border border-mi-rule p-6 sm:p-8 relative">
            <div className="flex justify-between items-center mb-4 text-xs font-mono text-mi-muted">
              <span>AGENT INTERACTION NETWORK (N=8)</span>
              <span>NODE SIZE = RESOURCE QUANTITY</span>
            </div>

            <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] bg-mi-canvas border border-mi-rule overflow-hidden">
              <svg viewBox="0 0 540 240" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Coalition Zones */}
                <ellipse cx="180" cy="110" rx="100" ry="75" fill="#315F7A" fillOpacity="0.05" stroke="#315F7A" strokeWidth="1" strokeDasharray="3 3" />
                <text x="120" y="32" fill="#315F7A" fontSize="9" fontFamily="IBM Plex Mono">
                  COALITION ALPHA
                </text>

                <ellipse cx="360" cy="115" rx="105" ry="80" fill="#8A651F" fillOpacity="0.05" stroke="#8A651F" strokeWidth="1" strokeDasharray="3 3" />
                <text x="380" y="32" fill="#8A651F" fontSize="9" fontFamily="IBM Plex Mono">
                  COALITION BETA
                </text>

                {/* Cooperation Trust Edges */}
                <line x1="120" y1="70" x2="200" y2="50" stroke="#3E6B50" strokeWidth="1.5" strokeOpacity="0.6" />
                <line x1="200" y1="50" x2="160" y2="130" stroke="#3E6B50" strokeWidth="1.5" strokeOpacity="0.6" />
                <line x1="160" y1="130" x2="240" y2="190" stroke="#3E6B50" strokeWidth="1.5" strokeOpacity="0.6" />
                <line x1="360" y1="60" x2="420" y2="110" stroke="#626864" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="420" y1="110" x2="320" y2="160" stroke="#626864" strokeWidth="1" strokeOpacity="0.5" />

                {/* Key Interaction Edge (Agent 03 to Agent 04): Betrayal Event */}
                <line
                  ref={betrayalEdgeRef}
                  x1="160"
                  y1="130"
                  x2="280"
                  y2="90"
                  stroke="#3E6B50"
                  strokeWidth="1.5"
                  className="transition-colors"
                />

                {/* Agent Nodes */}
                {AGENTS.map((agent, i) => (
                  <g key={agent.id}>
                    <circle
                      ref={(el) => {
                        agentCirclesRef.current[i] = el;
                      }}
                      cx={agent.x}
                      cy={agent.y}
                      r={agent.initialRadius}
                      fill={agent.coalition === 'A' ? '#F8F9F8' : '#F1F3F2'}
                      stroke={agent.id === '4' ? '#983E36' : '#101311'}
                      strokeWidth={agent.id === '4' ? '2' : '1.5'}
                    />
                    <text
                      x={agent.x}
                      y={agent.y + 4}
                      textAnchor="middle"
                      fill="#101311"
                      fontSize="9"
                      fontFamily="IBM Plex Mono"
                      fontWeight="500"
                    >
                      {agent.id}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Betrayal Event Callout Overlay */}
              <div
                ref={betrayalCalloutRef}
                style={{ left: '38%', top: '26%' }}
                className="absolute font-mono text-[10px] bg-mi-paper border border-mi-data-red text-mi-data-red px-2.5 py-1 tracking-wider uppercase opacity-0 pointer-events-none shadow-subtle"
              >
                BETRAYAL DETECTED (DEFECT / COOPERATE)
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-mi-rule font-mono text-[11px] text-mi-muted">
              <span>Edge color: Cooperation (Green) / Betrayal (Red)</span>
              <span>Round 14 / 10,000</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
