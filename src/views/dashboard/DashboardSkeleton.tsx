'use client'

import React from 'react'

export default function DashboardSkeleton() {
  return (
    <div
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className='flex flex-col gap-6 w-full pb-12 animate-pulse text-slate-800 dark:text-slate-200'
    >
      {/* 1. TOP GREETING & OVERVIEW HEADER SKELETON */}
      <section className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1'>
        <div className='flex flex-col gap-2'>
          <div className='h-8 w-56 sm:w-72 rounded-2xl bg-slate-200/80 dark:bg-slate-800' />
          <div className='h-4 w-72 sm:w-96 rounded-xl bg-slate-100 dark:bg-slate-800/60' />
        </div>

        {/* Action Button Pills */}
        <div className='flex items-center gap-3 shrink-0'>
          <div className='h-10 w-36 sm:w-44 rounded-2xl bg-slate-200/80 dark:bg-slate-800' />
          <div className='h-10 w-36 sm:w-44 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800' />
        </div>
      </section>

      {/* 2. ROW OF 4 STAT CARDS SKELETON */}
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between h-[160px]'
          >
            <div>
              <div className='flex items-center justify-between'>
                <div className='h-3.5 w-28 rounded-md bg-slate-200/80 dark:bg-slate-800' />
                <div className='w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800/80' />
              </div>

              <div className='flex items-baseline gap-2 mt-3'>
                <div className='h-8 w-16 rounded-xl bg-slate-200 dark:bg-slate-700/80' />
                <div className='h-5 w-14 rounded-full bg-slate-100 dark:bg-slate-800' />
              </div>
            </div>

            <div className='pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
              <div className='h-3 w-32 rounded bg-slate-100 dark:bg-slate-800/60' />
              <div className='h-3 w-10 rounded bg-slate-100 dark:bg-slate-800/60' />
            </div>
          </div>
        ))}
      </section>

      {/* 3. TARGET CAREER BANNER SKELETON */}
      <section className='rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs flex flex-col gap-4'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 rounded-2xl bg-slate-200/80 dark:bg-slate-800' />
            <div className='space-y-2'>
              <div className='h-5 w-48 sm:w-64 rounded-xl bg-slate-200/80 dark:bg-slate-800' />
              <div className='h-3.5 w-32 sm:w-44 rounded-md bg-slate-100 dark:bg-slate-800/60' />
            </div>
          </div>
          <div className='h-9 w-32 rounded-2xl bg-slate-100 dark:bg-slate-800/80' />
        </div>

        <div className='space-y-2 pt-2'>
          <div className='flex justify-between items-center'>
            <div className='h-3 w-28 rounded bg-slate-100 dark:bg-slate-800/60' />
            <div className='h-3 w-12 rounded bg-slate-100 dark:bg-slate-800/60' />
          </div>
          <div className='h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden'>
            <div className='h-full w-2/5 rounded-full bg-slate-200 dark:bg-slate-700' />
          </div>
        </div>
      </section>

      {/* 4. MAIN TWO-COLUMN DASHBOARD SECTION */}
      <section className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* Left Column (8 cols): Competency Chart Card */}
        <div className='lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col gap-5 min-h-[420px]'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800'>
            <div className='space-y-1.5'>
              <div className='h-5 w-44 rounded-xl bg-slate-200/80 dark:bg-slate-800' />
              <div className='h-3.5 w-60 rounded-md bg-slate-100 dark:bg-slate-800/60' />
            </div>
            <div className='flex gap-2'>
              <div className='h-8 w-24 rounded-xl bg-slate-100 dark:bg-slate-800' />
              <div className='h-8 w-24 rounded-xl bg-slate-100 dark:bg-slate-800' />
            </div>
          </div>

          {/* Bar Chart Skeletons */}
          <div className='flex-1 flex flex-col justify-around gap-4 pt-2'>
            {[85, 65, 45, 90, 55].map((width, idx) => (
              <div key={idx} className='space-y-1.5'>
                <div className='flex justify-between text-xs'>
                  <div className='h-3.5 w-32 rounded bg-slate-200/80 dark:bg-slate-800' />
                  <div className='h-3.5 w-12 rounded bg-slate-100 dark:bg-slate-800' />
                </div>
                <div className='h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden'>
                  <div
                    className='h-full rounded-full bg-slate-200/90 dark:bg-slate-700'
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): AI Insight & Quick Activity */}
        <div className='lg:col-span-4 flex flex-col gap-6'>
          {/* AI Career Insight Box */}
          <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col gap-4'>
            <div className='flex items-center gap-2.5'>
              <div className='w-8 h-8 rounded-xl bg-slate-200/80 dark:bg-slate-800' />
              <div className='h-4 w-36 rounded-md bg-slate-200/80 dark:bg-slate-800' />
            </div>
            <div className='space-y-2'>
              <div className='h-3.5 w-full rounded bg-slate-100 dark:bg-slate-800/60' />
              <div className='h-3.5 w-5/6 rounded bg-slate-100 dark:bg-slate-800/60' />
              <div className='h-3.5 w-4/6 rounded bg-slate-100 dark:bg-slate-800/60' />
            </div>
            <div className='h-9 w-full rounded-2xl bg-slate-200/80 dark:bg-slate-800 mt-1' />
          </div>

          {/* Recent Activity Mini List */}
          <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col gap-4 flex-1'>
            <div className='flex justify-between items-center'>
              <div className='h-4 w-32 rounded-md bg-slate-200/80 dark:bg-slate-800' />
              <div className='h-3 w-12 rounded bg-slate-100 dark:bg-slate-800/60' />
            </div>
            <div className='space-y-3 pt-1'>
              {[1, 2, 3].map(item => (
                <div key={item} className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0' />
                  <div className='flex-1 space-y-1.5 min-w-0'>
                    <div className='h-3.5 w-3/4 rounded bg-slate-200/80 dark:bg-slate-800' />
                    <div className='h-2.5 w-1/2 rounded bg-slate-100 dark:bg-slate-800/60' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
