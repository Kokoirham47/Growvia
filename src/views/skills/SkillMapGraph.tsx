'use client'

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react'

import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  ChevronUp,
  Layers
} from 'lucide-react'

import type { SkillMapNode, SkillMapEdge } from '@/types/skills'

interface SkillMapGraphProps {
  nodes: SkillMapNode[]
  edges: SkillMapEdge[]
  onSelectSkill?: (skillId: string) => void
}

export default function SkillMapGraph({ nodes, edges, onSelectSkill }: SkillMapGraphProps) {
  // Zoom & Pan State for Smooth Dragging
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const didDragRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter & Hover State
  const [activeFilter, setActiveFilter] = useState<'all' | 'blue' | 'indigo' | 'green' | 'orange'>('all')
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Legend Dropdown State
  const [isLegendOpen, setIsLegendOpen] = useState(false)
  const legendRef = useRef<HTMLDivElement>(null)

  // Close legend dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (legendRef.current && !legendRef.current.contains(e.target as Node)) {
        setIsLegendOpen(false)
      }
    }

    if (isLegendOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLegendOpen])

  // Hover handlers with slight grace period so cursor can reach connected nodes without flickering
  const handleNodeMouseEnter = (nodeId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    setHoveredNodeId(nodeId)
  }

  const handleNodeMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredNodeId(null)
    }, 180)
  }

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(1.8, Number((prev + 0.15).toFixed(2))))
  const handleZoomOut = () => setZoom(prev => Math.max(0.6, Number((prev - 0.15).toFixed(2))))

  const handleResetZoom = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    setZoom(1)
    setPan({ x: 0, y: 0 })
    setHoveredNodeId(null)
    setActiveFilter('all')
  }

  // Mouse drag handlers for canvas panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Left mouse button only
    setIsDragging(true)
    didDragRef.current = false
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      didDragRef.current = true
    }

    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Touch drag handlers for mobile & touchscreens
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]

      setIsDragging(true)
      didDragRef.current = false
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        panX: pan.x,
        panY: pan.y
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    const touch = e.touches[0]
    const dx = touch.clientX - dragStartRef.current.x
    const dy = touch.clientY - dragStartRef.current.y

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      didDragRef.current = true
    }

    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Non-passive wheel event listener to cleanly prevent window scrolling while zooming inside the graph
  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92

      setZoom(prev => Math.min(2.0, Math.max(0.5, Number((prev * zoomFactor).toFixed(2)))))
    }

    container.addEventListener('wheel', handleWheelNative, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheelNative)
    }
  }, [])

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Node color mapping as specified in design:
  // green (Strong), blue (Hard Skill), indigo (AI Detected), orange (Develop)
  const getNodeColor = useCallback((colorType: SkillMapNode['colorType']) => {
    switch (colorType) {
      case 'green':
        return {
          fill: '#10B981',
          ring: '#34D399',
          border: '#059669',
          glowGradient: 'halo-green',
          nodeGradient: 'node-green',
          lightBg: '#ECFDF5',
          text: '#065F46',
          label: 'Strong',
          edgeColor: 'rgba(16, 185, 129, 0.45)'
        }
      case 'blue':
        return {
          fill: '#2563EB',
          ring: '#60A5FA',
          border: '#1D4ED8',
          glowGradient: 'halo-blue',
          nodeGradient: 'node-blue',
          lightBg: '#EFF6FF',
          text: '#1E40AF',
          label: 'Hard Skill',
          edgeColor: 'rgba(37, 99, 235, 0.45)'
        }
      case 'indigo':
        return {
          fill: '#8B5CF6',
          ring: '#A78BFA',
          border: '#6D28D9',
          glowGradient: 'halo-indigo',
          nodeGradient: 'node-indigo',
          lightBg: '#F5F3FF',
          text: '#5B21B6',
          label: 'AI Detected',
          edgeColor: 'rgba(139, 92, 246, 0.45)'
        }
      case 'orange':
      default:
        return {
          fill: '#F59E0B',
          ring: '#FBBF24',
          border: '#D97706',
          glowGradient: 'halo-orange',
          nodeGradient: 'node-orange',
          lightBg: '#FFFBEB',
          text: '#92400E',
          label: 'Develop',
          edgeColor: 'rgba(245, 158, 11, 0.45)'
        }
    }
  }, [])

  // Connected node IDs for the currently hovered node
  const connectedNodeIds = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>()

    const set = new Set<string>([hoveredNodeId])

    edges.forEach(e => {
      if (e.source === hoveredNodeId) set.add(e.target)
      if (e.target === hoveredNodeId) set.add(e.source)
    })

    return set
  }, [hoveredNodeId, edges])

  // Filtered nodes: if a filter is active, show nodes matching the filter,
  // PLUS any node that connects to the currently hovered node so lines don't point to empty space!
  const filteredNodes = useMemo(() => {
    if (activeFilter === 'all') return nodes

    return nodes.filter(n => {
      // 1. Matches active category filter
      if (n.colorType === activeFilter) return true

      // 2. Or is connected to the currently hovered node!
      if (hoveredNodeId && connectedNodeIds.has(n.id)) return true

      return false
    })
  }, [nodes, activeFilter, hoveredNodeId, connectedNodeIds])

  // Map of node positions by id
  const nodeMap = useMemo(() => {
    const map = new Map<string, SkillMapNode>()

    nodes.forEach(n => map.set(n.id, n))

    return map
  }, [nodes])

  // Set of currently visible node IDs to ensure edges only connect visible nodes
  const visibleNodeIds = useMemo(() => {
    return new Set(filteredNodes.map(n => n.id))
  }, [filteredNodes])

  // Get active hovered node
  const hoveredNode = hoveredNodeId ? nodeMap.get(hoveredNodeId) : null

  // Progress ring constants (radius = 24)
  const ringRadius = 24
  const ringCircumference = 2 * Math.PI * ringRadius // ~150.8

  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* Top Filter and Zoom Controls Bar */}
      <div className='flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs'>
        {/* Filter Pills (No Dots, Clean Text) */}
        <div className='flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs font-medium no-scrollbar'>
          <span className='text-slate-400 font-normal mr-1 hidden sm:inline'>Filter:</span>
          <button
            type='button'
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#1E3A8A] text-white shadow-xs font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Semua ({nodes.length})
          </button>
          <button
            type='button'
            onClick={() => setActiveFilter('blue')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
              activeFilter === 'blue'
                ? 'bg-[#2563EB] text-white font-semibold shadow-xs'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60'
            }`}
          >
            Hard Skill
          </button>
          <button
            type='button'
            onClick={() => setActiveFilter('indigo')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
              activeFilter === 'indigo'
                ? 'bg-[#8B5CF6] text-white font-semibold shadow-xs'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60'
            }`}
          >
            AI Detected
          </button>
          <button
            type='button'
            onClick={() => setActiveFilter('green')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
              activeFilter === 'green'
                ? 'bg-[#10B981] text-white font-semibold shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
            }`}
          >
            Strong
          </button>
          <button
            type='button'
            onClick={() => setActiveFilter('orange')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
              activeFilter === 'orange'
                ? 'bg-[#F59E0B] text-white font-semibold shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60'
            }`}
          >
            Develop
          </button>
        </div>

        {/* Sleek Zoom & Reset Toolbar */}
        <div className='flex items-center gap-1 p-1 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs'>
          <button
            type='button'
            onClick={handleZoomIn}
            title='Perbesar (Zoom In)'
            aria-label='Zoom in'
            className='p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs active:scale-95'
          >
            <ZoomIn className='w-4 h-4' />
          </button>

          <span className='text-[11px] font-semibold text-slate-600 dark:text-slate-300 px-1 select-none min-w-[38px] text-center'>
            {Math.round(zoom * 100)}%
          </span>

          <button
            type='button'
            onClick={handleZoomOut}
            title='Perkecil (Zoom Out)'
            aria-label='Zoom out'
            className='p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs active:scale-95'
          >
            <ZoomOut className='w-4 h-4' />
          </button>

          <div className='w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5' />

          <button
            type='button'
            onClick={handleResetZoom}
            title='Reset Tampilan & Posisi'
            aria-label='Reset zoom and pan'
            className='p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs active:scale-95'
          >
            <RotateCcw className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* Main Full-Width SVG Canvas Area (Supports Drag to Pan & Wheel Zoom) */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (didDragRef.current) return

          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
          }

          setHoveredNodeId(null)
        }}
        className={`relative w-full h-[740px] rounded-2xl bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9]/60 to-[#F8FAFC] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner select-none overscroll-contain ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Subtle grid pattern */}
        <div
          className='absolute inset-0 opacity-[0.45] dark:opacity-[0.18] pointer-events-none'
          style={{
            backgroundImage: 'radial-gradient(#94A3B8 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient atmospheric background glows */}
        <div className='absolute top-10 left-20 w-72 h-72 rounded-full bg-amber-400/10 dark:bg-amber-500/5 blur-3xl pointer-events-none' />
        <div className='absolute top-20 right-32 w-80 h-80 rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-3xl pointer-events-none' />
        <div className='absolute bottom-16 left-36 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl pointer-events-none' />
        <div className='absolute bottom-12 right-24 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none' />

        {/* Top Right Helper Tip */}
        <div className='absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 shadow-xs pointer-events-none'>
          <Info className='w-3.5 h-3.5 text-[#2563EB]' />
          <span>Klik atau arahkan kursor ke node untuk melihat relasi skill</span>
        </div>

        {/* SVG Interactive Canvas */}
        <svg
          viewBox='0 0 1000 750'
          className='w-full h-full'
        >
          <defs>
            {/* Ethereal Radial Halos for Glowing Nodes */}
            <radialGradient id='halo-green' cx='50%' cy='50%' r='50%'>
              <stop offset='0%' stopColor='#10B981' stopOpacity='0.55' />
              <stop offset='50%' stopColor='#10B981' stopOpacity='0.2' />
              <stop offset='100%' stopColor='#10B981' stopOpacity='0' />
            </radialGradient>
            <radialGradient id='halo-blue' cx='50%' cy='50%' r='50%'>
              <stop offset='0%' stopColor='#2563EB' stopOpacity='0.55' />
              <stop offset='50%' stopColor='#2563EB' stopOpacity='0.2' />
              <stop offset='100%' stopColor='#2563EB' stopOpacity='0' />
            </radialGradient>
            <radialGradient id='halo-indigo' cx='50%' cy='50%' r='50%'>
              <stop offset='0%' stopColor='#8B5CF6' stopOpacity='0.55' />
              <stop offset='50%' stopColor='#8B5CF6' stopOpacity='0.2' />
              <stop offset='100%' stopColor='#8B5CF6' stopOpacity='0' />
            </radialGradient>
            <radialGradient id='halo-orange' cx='50%' cy='50%' r='50%'>
              <stop offset='0%' stopColor='#F59E0B' stopOpacity='0.55' />
              <stop offset='50%' stopColor='#F59E0B' stopOpacity='0.2' />
              <stop offset='100%' stopColor='#F59E0B' stopOpacity='0' />
            </radialGradient>

            {/* Vibrant Node Spheres Gradients */}
            <linearGradient id='node-green' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='#10B981' />
              <stop offset='100%' stopColor='#059669' />
            </linearGradient>
            <linearGradient id='node-blue' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='#3B82F6' />
              <stop offset='100%' stopColor='#1D4ED8' />
            </linearGradient>
            <linearGradient id='node-indigo' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='#A855F7' />
              <stop offset='100%' stopColor='#7C3AED' />
            </linearGradient>
            <linearGradient id='node-orange' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='#FBBF24' />
              <stop offset='100%' stopColor='#D97706' />
            </linearGradient>

            {/* Active Edge Highlighting Gradient */}
            <linearGradient id='activeEdgeGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='#2563EB' stopOpacity='1' />
              <stop offset='100%' stopColor='#8B5CF6' stopOpacity='1' />
            </linearGradient>

            {/* Drop Shadows */}
            <filter id='nodeDropShadow' x='-30%' y='-30%' width='160%' height='160%'>
              <feDropShadow dx='0' dy='3' stdDeviation='4' floodOpacity='0.16' />
            </filter>
            <filter id='labelShadow' x='-20%' y='-20%' width='140%' height='140%'>
              <feDropShadow dx='0' dy='2' stdDeviation='3' floodOpacity='0.08' />
            </filter>
          </defs>

          {/* Pan & Zoom Root Group */}
          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{
              transformOrigin: '500px 375px',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            {/* 1. EDGES LAYER (Organic Curved Dotted Connections) */}
            <g className='edges-layer'>
              {edges.map((edge, idx) => {
                const sourceNode = nodeMap.get(edge.source)
                const targetNode = nodeMap.get(edge.target)

                if (!sourceNode || !targetNode) return null

                // Ensure both endpoints are actually visible in the current filtered/hovered state
                if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) {
                  return null
                }

                const isEdgeHighlighted =
                  hoveredNodeId === edge.source ||
                  hoveredNodeId === edge.target

                // In filter mode, if this edge is not connected to hovered node,
                // only render if both nodes match the active filter
                const isSourceFilterMatch = activeFilter === 'all' || sourceNode.colorType === activeFilter
                const isTargetFilterMatch = activeFilter === 'all' || targetNode.colorType === activeFilter

                if (activeFilter !== 'all' && !isEdgeHighlighted && (!isSourceFilterMatch || !isTargetFilterMatch)) {
                  return null
                }

                const isDimmed = Boolean(hoveredNodeId) && !isEdgeHighlighted

                // Organic Quadratic Bezier Curve calculation
                const dx = targetNode.x - sourceNode.x
                const dy = targetNode.y - sourceNode.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                const curvature = 22 * Math.sin((sourceNode.x + targetNode.y) % 6)
                const cx = (sourceNode.x + targetNode.x) / 2 + (-dy / (dist || 1)) * curvature
                const cy = (sourceNode.y + targetNode.y) / 2 + (dx / (dist || 1)) * curvature

                const pathData = `M ${sourceNode.x} ${sourceNode.y} Q ${cx} ${cy} ${targetNode.x} ${targetNode.y}`
                const sourceColor = getNodeColor(sourceNode.colorType)

                return (
                  <path
                    key={`edge-${edge.source}-${edge.target}-${idx}`}
                    d={pathData}
                    fill='none'
                    stroke={isEdgeHighlighted ? 'url(#activeEdgeGradient)' : sourceColor.edgeColor}
                    strokeWidth={isEdgeHighlighted ? 2.5 : 1.3}
                    strokeDasharray={isEdgeHighlighted ? 'none' : '4 4'}
                    strokeOpacity={isDimmed ? 0.12 : isEdgeHighlighted ? 1 : 0.65}
                    className='transition-all duration-200 pointer-events-none'
                  />
                )
              })}
            </g>

            {/* 2. NODES LAYER (Scattered Organic Glowing Spheres & Badges) */}
            <g className='nodes-layer'>
              {filteredNodes.map(node => {
                const colorInfo = getNodeColor(node.colorType)
                const isHovered = hoveredNodeId === node.id
                const isConnected = connectedNodeIds.has(node.id)
                const isDimmed = Boolean(hoveredNodeId) && !isConnected

                // Progress ring arc offset (0% = full offset, 100% = 0 offset)
                const dashOffset = ringCircumference * (1 - Math.min(100, Math.max(0, node.score)) / 100)
                const pillWidth = Math.max(72, node.name.length * 6.5 + 20)

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className='cursor-pointer transition-all duration-200'
                    onMouseEnter={() => handleNodeMouseEnter(node.id)}
                    onMouseLeave={handleNodeMouseLeave}
                    onClick={e => {
                      e.stopPropagation()
                      if (didDragRef.current) return // Prevent click triggering while dragging

                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current)
                        hoverTimeoutRef.current = null
                      }

                      setHoveredNodeId(null)
                      onSelectSkill?.(node.id)
                    }}
                    opacity={isDimmed ? 0.22 : 1}
                  >
                    {/* Outer Glowing Halo (Radial Gradient Glow) */}
                    <circle
                      r={isHovered ? 48 : 38}
                      fill={`url(#${colorInfo.glowGradient})`}
                      className='transition-all duration-300 pointer-events-none'
                    />

                    {/* Progress Track Background Ring */}
                    <circle
                      r={ringRadius}
                      fill='none'
                      stroke='#FFFFFF'
                      strokeOpacity={0.65}
                      strokeWidth={3.5}
                      className='dark:stroke-slate-800 dark:stroke-opacity-60'
                    />

                    {/* Vibrant Progress Arc representing Kemahiran % */}
                    <circle
                      r={ringRadius}
                      fill='none'
                      stroke={colorInfo.ring}
                      strokeWidth={3.5}
                      strokeLinecap='round'
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={dashOffset}
                      transform='rotate(-90)'
                      className='transition-all duration-500'
                      filter={`drop-shadow(0 0 3px ${colorInfo.fill})`}
                    />

                    {/* Solid Inner Circle with Linear Gradient & Shadow */}
                    <circle
                      r={20}
                      fill={`url(#${colorInfo.nodeGradient})`}
                      stroke={isHovered ? '#FFFFFF' : 'transparent'}
                      strokeWidth={isHovered ? 2 : 0}
                      filter='url(#nodeDropShadow)'
                      className='transition-all duration-200'
                    />

                    {/* Score Text inside node */}
                    <text
                      y={4.5}
                      textAnchor='middle'
                      fill='#FFFFFF'
                      fontSize='12'
                      fontWeight='700'
                      fontFamily='Poppins, sans-serif'
                      className='pointer-events-none select-none'
                    >
                      {node.score}%
                    </text>

                    {/* Node Label Capsule Below */}
                    <g transform='translate(0, 36)'>
                      <rect
                        x={-pillWidth / 2}
                        y={-10}
                        width={pillWidth}
                        height={20}
                        rx={10}
                        fill={isHovered ? '#0F172A' : '#FFFFFF'}
                        stroke={isHovered ? colorInfo.fill : '#E2E8F0'}
                        strokeWidth={isHovered ? 1.5 : 1}
                        filter='url(#labelShadow)'
                        className='transition-colors duration-150 dark:fill-slate-900 dark:stroke-slate-700'
                      />
                      <text
                        textAnchor='middle'
                        y={3.5}
                        fill={isHovered ? '#FFFFFF' : '#1E293B'}
                        className='transition-colors duration-150 dark:fill-slate-200 select-none'
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
          </g>
        </svg>

        {/* Collapsible Dropdown Legend (Bottom Left, Non-Obtrusive) */}
        <div ref={legendRef} className='absolute bottom-4 left-4 z-20'>
          {/* Popover Dropdown Card (Opens Above Button) */}
          {isLegendOpen && (
            <div
              onClick={e => e.stopPropagation()}
              className='absolute bottom-full left-0 mb-2 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xl text-xs flex flex-col gap-3 w-[300px] sm:w-[350px] animate-in fade-in zoom-in-95 duration-150 z-30 select-none'
            >
              {/* Popover Header */}
              <div className='flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2'>
                <div className='flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs'>
                  <Layers className='w-3.5 h-3.5 text-[#2563EB]' />
                  <span>Panduan Legenda Graf</span>
                </div>
                <button
                  type='button'
                  onClick={() => setIsLegendOpen(false)}
                  aria-label='Tutup panduan legenda'
                  className='p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs'
                >
                  ✕
                </button>
              </div>

              {/* Section 1: Node Types */}
              <div className='flex flex-col gap-1.5'>
                <span className='font-bold text-[11px] text-slate-700 dark:text-slate-300'>Kategori Node:</span>
                <div className='grid grid-cols-2 gap-2 text-[11px] font-medium'>
                  <div className='flex items-center gap-1.5'>
                    <span className='w-2.5 h-2.5 rounded-full bg-[#10B981]' />
                    <span className='text-slate-700 dark:text-slate-300'>Strong (≥ 85%)</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <span className='w-2.5 h-2.5 rounded-full bg-[#2563EB]' />
                    <span className='text-slate-700 dark:text-slate-300'>Hard Skill</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <span className='w-2.5 h-2.5 rounded-full bg-[#8B5CF6]' />
                    <span className='text-slate-700 dark:text-slate-300'>AI Detected</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <span className='w-2.5 h-2.5 rounded-full bg-[#F59E0B]' />
                    <span className='text-slate-700 dark:text-slate-300'>Develop</span>
                  </div>
                </div>
              </div>

              <div className='w-full h-px bg-slate-100 dark:bg-slate-800' />

              {/* Section 2: Relationship Lines */}
              <div className='flex flex-col gap-1.5'>
                <span className='font-bold text-[11px] text-slate-700 dark:text-slate-300'>Keterangan Relasi:</span>
                <div className='flex flex-col gap-2 text-[11px] text-slate-600 dark:text-slate-400'>
                  <div className='flex items-start gap-2'>
                    <span className='w-4 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shrink-0 mt-1.5 shadow-2xs' />
                    <span>
                      <strong className='font-semibold text-slate-800 dark:text-slate-200'>Garis Menyala:</strong>{' '}
                      Skill yang dipraktikkan bersamaan dalam satu proyek atau portofolio.
                    </span>
                  </div>

                  <div className='flex items-start gap-2'>
                    <span className='w-4 border-t border-dashed border-slate-400 dark:border-slate-500 shrink-0 mt-2' />
                    <span>
                      <strong className='font-semibold text-slate-800 dark:text-slate-200'>Garis Titik:</strong>{' '}
                      Korelasi domain keahlian yang saling melengkapi satu sama lain.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compact Trigger Button */}
          <button
            type='button'
            onClick={e => {
              e.stopPropagation()
              setIsLegendOpen(prev => !prev)
            }}
            aria-expanded={isLegendOpen}
            className='flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-blue-400 transition-all cursor-pointer'
          >
            {/* 4 Color Dots Preview */}
            <div className='flex items-center gap-1 shrink-0'>
              <span className='w-2 h-2 rounded-full bg-[#10B981]' />
              <span className='w-2 h-2 rounded-full bg-[#2563EB]' />
              <span className='w-2 h-2 rounded-full bg-[#8B5CF6]' />
              <span className='w-2 h-2 rounded-full bg-[#F59E0B]' />
            </div>

            <span>Legenda & Relasi</span>

            <ChevronUp
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isLegendOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Hover / Selected Node Detail Card on the Graph */}
        {hoveredNode && (
          <div className='absolute top-4 left-4 z-10 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg text-xs max-w-[280px] animate-in fade-in zoom-in-95 duration-150 pointer-events-none'>
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

            {hoveredNode.evidenceTags && hoveredNode.evidenceTags.length > 0 && (
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
