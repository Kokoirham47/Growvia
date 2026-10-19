'use client'

import React, { useState, useMemo } from 'react'
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Link2,
  CheckCircle2,
  Info,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react'
import { SkillMapNode, SkillMapEdge, SkillItem } from '@/types/skills'

interface SkillMapGraphProps {
  nodes: SkillMapNode[]
  edges: SkillMapEdge[]
  onSelectSkill?: (skillId: string) => void
}

export default function SkillMapGraph({ nodes, edges, onSelectSkill }: SkillMapGraphProps) {
  // Zoom & Pan State
  const [zoom, setZoom] = useState(1)
  const [activeFilter, setActiveFilter] = useState<'all' | 'blue' | 'indigo' | 'green' | 'orange'>('all')
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(1.6, prev + 0.15))
  const handleZoomOut = () => setZoom(prev => Math.max(0.7, prev - 0.15))
  const handleResetZoom = () => {
    setZoom(1)
    setSelectedNodeId(null)
    setActiveFilter('all')
  }

  // Node size calculator based on evidence count
  const getNodeRadius = (evidenceCount: number) => {
    switch (evidenceCount) {
      case 3:
      case 4:
        return 38
      case 2:
        return 30
      case 1:
      default:
        return 24
    }
  }

  // Node color mapping as specified:
  // blue (hard skill), indigo (AI detected), green (strong), orange (develop)
  const getNodeColor = (colorType: SkillMapNode['colorType']) => {
    switch (colorType) {
      case 'blue':
        return {
          fill: '#2563EB',
          border: '#1D4ED8',
          glow: 'rgba(37, 99, 235, 0.25)',
          lightBg: '#EFF6FF',
          text: '#1E40AF',
          label: 'Hard Skill'
        }
      case 'indigo':
        return {
          fill: '#6366F1',
          border: '#4F46E5',
          glow: 'rgba(99, 102, 241, 0.25)',
          lightBg: '#EEF2FF',
          text: '#4338CA',
          label: 'AI Detected'
        }
      case 'green':
        return {
          fill: '#16A34A',
          border: '#15803D',
          glow: 'rgba(22, 163, 74, 0.25)',
          lightBg: '#DCFCE7',
          text: '#166534',
          label: 'Strong'
        }
      case 'orange':
        return {
          fill: '#F59E0B',
          border: '#D97706',
          glow: 'rgba(245, 158, 11, 0.25)',
          lightBg: '#FEF3C7',
          text: '#B45309',
          label: 'Develop'
        }
    }
  }

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    if (activeFilter === 'all') return nodes
    return nodes.filter(n => n.colorType === activeFilter)
  }, [nodes, activeFilter])

  // Map of node positions by id
  const nodeMap = useMemo(() => {
    const map = new Map<string, SkillMapNode>()
    nodes.forEach(n => map.set(n.id, n))
    return map
  }, [nodes])

  // Get active hovered node
  const hoveredNode = hoveredNodeId ? nodeMap.get(hoveredNodeId) : null
  const selectedNode = selectedNodeId ? nodeMap.get(selectedNodeId) : null

  // Connected node IDs for highlighting
  const connectedNodeIds = useMemo(() => {
    const targetId = hoveredNodeId || selectedNodeId
    if (!targetId) return new Set<string>()

    const set = new Set<string>([targetId])
    edges.forEach(e => {
      if (e.source === targetId) set.add(e.target)
      if (e.target === targetId) set.add(e.source)
    })
    return set
  }, [hoveredNodeId, selectedNodeId, edges])

  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* Top Filter and Controls Bar */}
      <div className='flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs'>
        {/* Filter Pills */}
        <div className='flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs font-medium'>
          <span className='text-slate-400 font-normal mr-1 hidden sm:inline'>Filter:</span>
          <button
            type='button'
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#1E3A8A] text-white shadow-xs font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Semua ({nodes.length})
          </button>
          <button
            type='button'
            onClick={() => setActiveFilter('blue')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'blue'
                ? 'bg-[#2563EB] text-white font-semibold'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
            }`}
          >
            <span className='w-2 h-2 rounded-full bg-[#2563EB]' />
            <span>Hard Skill</span>
          </button>
          <button
            type='button'
            onClick={() => setActiveFilter('indigo')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'indigo'
                ? 'bg-[#6366F1] text-white font-semibold'
                : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
            }`}
          >
            <span className='w-2 h-2 rounded-full bg-[#6366F1]' />
            <span>AI Detected</span>
          </button>
          <button
            type='button'
            onClick={() => setActiveFilter('green')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'green'
                ? 'bg-[#16A34A] text-white font-semibold'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <span className='w-2 h-2 rounded-full bg-[#16A34A]' />
            <span>Strong</span>
          </button>
          <button
            type='button'
            onClick={() => setActiveFilter('orange')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'orange'
                ? 'bg-[#F59E0B] text-white font-semibold'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
            }`}
          >
            <span className='w-2 h-2 rounded-full bg-[#F59E0B]' />
            <span>Develop</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className='flex items-center gap-1 shrink-0'>
          <button
            type='button'
            onClick={handleZoomIn}
            title='Perbesar'
            aria-label='Zoom in'
            className='p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer'
          >
            <ZoomIn className='w-4 h-4' />
          </button>
          <button
            type='button'
            onClick={handleZoomOut}
            title='Perkecil'
            aria-label='Zoom out'
            className='p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer'
          >
            <ZoomOut className='w-4 h-4' />
          </button>
          <button
            type='button'
            onClick={handleResetZoom}
            title='Reset Tampilan'
            aria-label='Reset zoom'
            className='p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer'
          >
            <RotateCcw className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* Main Full-Width SVG Canvas Area */}
      <div className='relative w-full h-[540px] rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] dark:from-slate-950 dark:to-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner select-none'>
        {/* Subtle grid pattern */}
        <div
          className='absolute inset-0 opacity-[0.4] dark:opacity-[0.15] pointer-events-none'
          style={{
            backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Top Right Helper Tip */}
        <div className='absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 shadow-xs'>
          <Info className='w-3.5 h-3.5 text-[#2563EB]' />
          <span>Klik atau arahkan kursor ke node untuk melihat relasi skill</span>
        </div>

        {/* SVG Node Graph */}
        <svg
          viewBox='0 0 1000 520'
          className='w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-300 ease-out'
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <defs>
            {/* Gradients for edges */}
            <linearGradient id='edgeGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='#93C5FD' stopOpacity='0.7' />
              <stop offset='100%' stopColor='#C7D2FE' stopOpacity='0.7' />
            </linearGradient>
            <linearGradient id='activeEdgeGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='#2563EB' stopOpacity='1' />
              <stop offset='100%' stopColor='#6366F1' stopOpacity='1' />
            </linearGradient>

            {/* Drop shadows for nodes */}
            <filter id='nodeGlow' x='-20%' y='-20%' width='140%' height='140%'>
              <feDropShadow dx='0' dy='3' stdDeviation='4' floodOpacity='0.25' />
            </filter>
            <filter id='activeGlow' x='-30%' y='-30%' width='160%' height='160%'>
              <feDropShadow dx='0' dy='4' stdDeviation='8' floodColor='#2563EB' floodOpacity='0.45' />
            </filter>
          </defs>

          {/* 1. EDGES (Connecting related skills) */}
          <g className='edges-layer'>
            {edges.map((edge, idx) => {
              const sourceNode = nodeMap.get(edge.source)
              const targetNode = nodeMap.get(edge.target)
              if (!sourceNode || !targetNode) return null

              const isEdgeHighlighted =
                (hoveredNodeId === edge.source || hoveredNodeId === edge.target) ||
                (selectedNodeId === edge.source || selectedNodeId === edge.target)

              const isDimmed =
                (hoveredNodeId || selectedNodeId) && !isEdgeHighlighted

              // Subtle curved path
              const dx = targetNode.x - sourceNode.x
              const dy = targetNode.y - sourceNode.y
              const cx = (sourceNode.x + targetNode.x) / 2 - dy * 0.1
              const cy = (sourceNode.y + targetNode.y) / 2 + dx * 0.1
              const pathData = `M ${sourceNode.x} ${sourceNode.y} Q ${cx} ${cy} ${targetNode.x} ${targetNode.y}`

              return (
                <path
                  key={`edge-${edge.source}-${edge.target}-${idx}`}
                  d={pathData}
                  fill='none'
                  stroke={isEdgeHighlighted ? 'url(#activeEdgeGradient)' : '#CBD5E1'}
                  strokeWidth={isEdgeHighlighted ? 3 : 1.5}
                  strokeDasharray={isEdgeHighlighted ? 'none' : '4 3'}
                  strokeOpacity={isDimmed ? 0.15 : isEdgeHighlighted ? 1 : 0.6}
                  className='transition-all duration-200'
                />
              )
            })}
          </g>

          {/* 2. NODES (Skills as circular nodes) */}
          <g className='nodes-layer'>
            {filteredNodes.map(node => {
              const radius = getNodeRadius(node.evidenceCount)
              const colorInfo = getNodeColor(node.colorType)
              const isHovered = hoveredNodeId === node.id
              const isSelected = selectedNodeId === node.id
              const isConnected = connectedNodeIds.has(node.id)
              const isDimmed = (hoveredNodeId || selectedNodeId) && !isConnected

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className='cursor-pointer transition-all duration-200 group'
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => {
                    setSelectedNodeId(prev => (prev === node.id ? null : node.id))
                    onSelectSkill?.(node.id)
                  }}
                  opacity={isDimmed ? 0.25 : 1}
                >
                  {/* Outer pulse/glow on hover or active */}
                  {(isHovered || isSelected) && (
                    <circle
                      r={radius + 8}
                      fill='none'
                      stroke={colorInfo.fill}
                      strokeWidth={2}
                      strokeOpacity={0.4}
                      className='animate-ping origin-center'
                    />
                  )}

                  {/* Node Outer Halo Ring */}
                  <circle
                    r={radius + 4}
                    fill={colorInfo.fill}
                    fillOpacity={isHovered || isSelected ? 0.25 : 0.12}
                    className='transition-all duration-200'
                  />

                  {/* Main Circular Node */}
                  <circle
                    r={radius}
                    fill={colorInfo.fill}
                    stroke={isSelected ? '#FFFFFF' : colorInfo.border}
                    strokeWidth={isSelected ? 3.5 : 2}
                    filter={isHovered || isSelected ? 'url(#activeGlow)' : 'url(#nodeGlow)'}
                    className='transition-all duration-200'
                  />

                  {/* Evidence Count Pill inside or Badge on circle */}
                  <circle
                    cx={radius * 0.7}
                    cy={-radius * 0.7}
                    r={9}
                    fill='#FFFFFF'
                    stroke={colorInfo.border}
                    strokeWidth={1.5}
                  />
                  <text
                    x={radius * 0.7}
                    y={-radius * 0.7 + 3.5}
                    textAnchor='middle'
                    fill={colorInfo.text}
                    fontSize='9'
                    fontWeight='700'
                    fontFamily='Poppins, sans-serif'
                  >
                    {node.evidenceCount}
                  </text>

                  {/* Score Text inside node */}
                  <text
                    y={radius > 30 ? -2 : 4}
                    textAnchor='middle'
                    fill='#FFFFFF'
                    fontSize={radius > 30 ? '13' : '11'}
                    fontWeight='700'
                    fontFamily='Poppins, sans-serif'
                  >
                    {node.score}%
                  </text>

                  {/* Subtext 'Kemahiran' if large enough */}
                  {radius > 30 && (
                    <text
                      y={12}
                      textAnchor='middle'
                      fill='rgba(255, 255, 255, 0.85)'
                      fontSize='8'
                      fontWeight='500'
                      fontFamily='Poppins, sans-serif'
                    >
                      Kemahiran
                    </text>
                  )}

                  {/* Node Label Below */}
                  <g transform={`translate(0, ${radius + 15})`}>
                    {/* Background capsule for label readability */}
                    <rect
                      x={-node.name.length * 3.6 - 10}
                      y={-10}
                      width={node.name.length * 7.2 + 20}
                      height={18}
                      rx={9}
                      fill={isHovered || isSelected ? '#1E293B' : 'rgba(255, 255, 255, 0.92)'}
                      stroke={isHovered || isSelected ? '#334155' : '#E2E8F0'}
                      strokeWidth={1}
                    />
                    <text
                      textAnchor='middle'
                      y={3}
                      fill={isHovered || isSelected ? '#FFFFFF' : '#1E293B'}
                      fontSize='11'
                      fontWeight='600'
                      fontFamily='Poppins, sans-serif'
                    >
                      {node.name}
                    </text>
                  </g>
                </g>
              )
            })}
          </g>
        </svg>

        {/* LEGEND (Bottom Left as specified) */}
        <div className='absolute bottom-4 left-4 z-10 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-md text-xs flex flex-col gap-2 max-w-[260px]'>
          <div className='flex items-center gap-1.5 font-bold text-[#1E3A8A] dark:text-blue-300 text-xs border-b border-slate-100 dark:border-slate-800 pb-1.5'>
            <Layers className='w-3.5 h-3.5' />
            <span>Keterangan Node Graph</span>
          </div>

          <div className='grid grid-cols-2 gap-x-3 gap-y-1.5'>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-[#2563EB] shrink-0' />
              <span className='text-slate-700 dark:text-slate-300 font-medium text-[11px]'>Hard Skill</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-[#6366F1] shrink-0' />
              <span className='text-slate-700 dark:text-slate-300 font-medium text-[11px]'>AI Detected</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-[#16A34A] shrink-0' />
              <span className='text-slate-700 dark:text-slate-300 font-medium text-[11px]'>Strong</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-[#F59E0B] shrink-0' />
              <span className='text-slate-700 dark:text-slate-300 font-medium text-[11px]'>Develop</span>
            </div>
          </div>

          <div className='pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[10px] text-slate-500'>
            <span className='inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 font-bold text-[9px]'>3</span>
            <span>Ukuran node = Bukti pengalaman</span>
          </div>
        </div>

        {/* Hover / Selected Node Detail Card on the Graph */}
        {hoveredNode && (
          <div className='absolute top-4 left-4 z-10 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg text-xs max-w-[280px] animate-in fade-in zoom-in-95 duration-150'>
            <div className='flex items-center justify-between gap-2'>
              <h5 className='font-bold text-slate-900 dark:text-white text-sm truncate'>
                {hoveredNode.name}
              </h5>
              <span
                className='text-[10px] font-semibold px-2 py-0.5 rounded-full'
                style={{
                  backgroundColor: getNodeColor(hoveredNode.colorType).lightBg,
                  color: getNodeColor(hoveredNode.colorType).text
                }}
              >
                {getNodeColor(hoveredNode.colorType).label}
              </span>
            </div>

            <div className='mt-2 flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs'>
              <span>Tingkat Kemahiran:</span>
              <span className='font-bold text-[#2563EB]'>{hoveredNode.score}%</span>
            </div>

            <div className='mt-1 flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs'>
              <span>Bukti Pengalaman:</span>
              <span className='font-medium text-slate-900 dark:text-white'>
                {hoveredNode.evidenceCount} portofolio
              </span>
            </div>

            {hoveredNode.evidenceTags && (
              <div className='mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1'>
                {hoveredNode.evidenceTags.map((t, idx) => (
                  <span
                    key={idx}
                    className='text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
