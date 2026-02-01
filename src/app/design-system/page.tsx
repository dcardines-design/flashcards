'use client';

import { useState } from 'react';
import {
  BookOpen,
  Trophy,
  Clock,
  Flame,
  Target,
  ArrowLeft,
  Plus,
  Trash2,
  Pencil,
  Users,
  Share2,
  Check,
  X,
  Loader2,
  Send,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import Link from 'next/link';

export default function DesignSystemPage() {
  const [toggleOn, setToggleOn] = useState(false);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Design System</h1>
        <p className="text-sm text-zinc-500">FreeFlashcards.app Design Tokens & Components</p>
      </div>

      {/* Design Tokens - Colors */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-white mb-2">Color Tokens</h2>
        <p className="text-sm text-zinc-500 mb-6">Core color palette used throughout the app</p>

        {/* Background */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-4">
          <h3 className="text-sm font-medium text-white mb-3">Background</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-[#0a0a0b] rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0a0a0b] rounded border border-zinc-700" />
                <div>
                  <p className="text-sm text-white font-mono">--bg-app</p>
                  <p className="text-xs text-zinc-500">#0a0a0b</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">bg-[#0a0a0b]</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-900 rounded border border-zinc-700" />
                <div>
                  <p className="text-sm text-white font-mono">--bg-card</p>
                  <p className="text-xs text-zinc-500">#18181b</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">bg-zinc-900</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-800 rounded border border-zinc-700" />
                <div>
                  <p className="text-sm text-white font-mono">--bg-input</p>
                  <p className="text-xs text-zinc-500">#27272a</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded">bg-zinc-800</code>
            </div>
          </div>
        </div>

        {/* Primary Colors */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-4">
          <h3 className="text-sm font-medium text-white mb-3">Primary (Brand)</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--primary</p>
                  <p className="text-xs text-zinc-500">#10b981</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">emerald-500</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--primary-hover</p>
                  <p className="text-xs text-zinc-500">#059669</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">emerald-600</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--primary-accent</p>
                  <p className="text-xs text-zinc-500">#14b8a6</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">teal-500</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--gradient-primary</p>
                  <p className="text-xs text-zinc-500">emerald-500 → teal-500</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">from-emerald-500 to-teal-500</code>
            </div>
          </div>
        </div>

        {/* Status Colors */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-4">
          <h3 className="text-sm font-medium text-white mb-3">Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-400 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--success</p>
                  <p className="text-xs text-zinc-500">#4ade80</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">green-400</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-400 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--error</p>
                  <p className="text-xs text-zinc-500">#f87171</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">red-400</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--warning</p>
                  <p className="text-xs text-zinc-500">#fbbf24</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">amber-400</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-400 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--streak</p>
                  <p className="text-xs text-zinc-500">#fb923c</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">orange-400</code>
            </div>
          </div>
        </div>

        {/* Text Colors */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-4">
          <h3 className="text-sm font-medium text-white mb-3">Text</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--text-primary</p>
                  <p className="text-xs text-zinc-500">#ffffff</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">text-white</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-300 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--text-secondary</p>
                  <p className="text-xs text-zinc-500">#d4d4d8</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">text-zinc-300</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-400 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--text-muted</p>
                  <p className="text-xs text-zinc-500">#a1a1aa</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">text-zinc-400</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-500 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--text-subtle</p>
                  <p className="text-xs text-zinc-500">#71717a</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">text-zinc-500</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-600 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--text-placeholder</p>
                  <p className="text-xs text-zinc-500">#52525b</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">text-zinc-600</code>
            </div>
          </div>
        </div>

        {/* Border Colors */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
          <h3 className="text-sm font-medium text-white mb-3">Border</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-zinc-800 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--border-default</p>
                  <p className="text-xs text-zinc-500">#27272a</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">border-zinc-800</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-zinc-700 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--border-input</p>
                  <p className="text-xs text-zinc-500">#3f3f46</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">border-zinc-700</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-emerald-500 rounded" />
                <div>
                  <p className="text-sm text-white font-mono">--border-focus</p>
                  <p className="text-xs text-zinc-500">#10b981</p>
                </div>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">border-emerald-500</code>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Tokens */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-white mb-2">Typography Tokens</h2>
        <p className="text-sm text-zinc-500 mb-6">Font sizes, weights, and line heights</p>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-4">
          <h3 className="text-sm font-medium text-white mb-3">Font Family</h3>
          <div className="p-3 rounded-lg border border-zinc-800">
            <p className="text-white font-mono">Inter</p>
            <p className="text-xs text-zinc-500 mt-1">System font stack with Inter as primary</p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-4">
          <h3 className="text-sm font-medium text-white mb-3">Text Sizes</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div>
                <p className="text-2xl font-bold text-white">Page Title</p>
                <p className="text-xs text-zinc-500 mt-1">24px / 32px line-height</p>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">text-2xl font-bold</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div>
                <p className="text-xl font-bold text-white">Section Title</p>
                <p className="text-xs text-zinc-500 mt-1">20px / 28px line-height</p>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">text-xl font-bold</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div>
                <p className="text-lg font-semibold text-white">Card Title</p>
                <p className="text-xs text-zinc-500 mt-1">18px / 28px line-height</p>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">text-lg font-semibold</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div>
                <p className="text-base text-white">Body Text</p>
                <p className="text-xs text-zinc-500 mt-1">16px / 24px line-height</p>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">text-base</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div>
                <p className="text-sm text-white">Small Text</p>
                <p className="text-xs text-zinc-500 mt-1">14px / 20px line-height</p>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">text-sm</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <div>
                <p className="text-xs text-white">Caption</p>
                <p className="text-xs text-zinc-500 mt-1">12px / 16px line-height</p>
              </div>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">text-xs</code>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
          <h3 className="text-sm font-medium text-white mb-3">Font Weights</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <p className="text-white font-bold">Bold (700)</p>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">font-bold</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <p className="text-white font-semibold">Semibold (600)</p>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">font-semibold</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <p className="text-white font-medium">Medium (500)</p>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">font-medium</code>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800">
              <p className="text-white font-normal">Regular (400)</p>
              <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">font-normal</code>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-white mb-4">Buttons</h2>

        <h3 className="text-sm font-medium text-zinc-400 mb-3">Primary</h3>
        <div className="flex flex-wrap gap-3 mb-6">
          <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors">
            Primary Button
          </button>
          <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium opacity-50 cursor-not-allowed">
            Disabled
          </button>
          <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading
          </button>
        </div>

        <h3 className="text-sm font-medium text-zinc-400 mb-3">Secondary</h3>
        <div className="flex flex-wrap gap-3 mb-6">
          <button className="px-4 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl font-medium hover:bg-zinc-700 transition-colors">
            Secondary Button
          </button>
          <button className="px-4 py-2.5 bg-zinc-800/50 text-zinc-400 rounded-xl font-medium hover:bg-zinc-700/50 transition-colors">
            Tertiary Button
          </button>
        </div>

        <h3 className="text-sm font-medium text-zinc-400 mb-3">Icon Buttons</h3>
        <div className="flex flex-wrap gap-3 mb-6">
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-red-400">
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <Share2 className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <h3 className="text-sm font-medium text-zinc-400 mb-3">FAB (Floating Action Button)</h3>
        <div className="flex gap-3">
          <button className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </section>

      {/* Input Tokens */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-white mb-2">Input Tokens</h2>
        <p className="text-sm text-zinc-500 mb-6">Form input sizes and styles</p>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-4">
          <h3 className="text-sm font-medium text-white mb-3">Input Sizes</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Large Input</span>
                <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">px-4 py-3 (16px / 12px)</code>
              </div>
              <input
                type="text"
                placeholder="Large input - 48px height"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Medium Input</span>
                <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">px-4 py-2.5 (16px / 10px)</code>
              </div>
              <input
                type="text"
                placeholder="Medium input - 42px height"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Small Input</span>
                <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">px-3 py-2 text-sm (12px / 8px)</code>
              </div>
              <input
                type="text"
                placeholder="Small input - 36px height"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Compact Input</span>
                <code className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">px-3 py-1.5 text-sm (12px / 6px)</code>
              </div>
              <input
                type="text"
                placeholder="Compact - 32px height"
                className="w-full px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-4">
          <h3 className="text-sm font-medium text-white mb-3">Input States</h3>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-zinc-400 block mb-2">Default</span>
              <input
                type="text"
                placeholder="Default state"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500"
              />
            </div>
            <div>
              <span className="text-sm text-zinc-400 block mb-2">Focus</span>
              <input
                type="text"
                placeholder="Focus state"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-emerald-500 rounded-xl text-white placeholder-zinc-500"
              />
            </div>
            <div>
              <span className="text-sm text-zinc-400 block mb-2">Error</span>
              <input
                type="text"
                placeholder="Error state"
                className="w-full px-4 py-3 bg-zinc-800 border border-red-500 rounded-xl text-white placeholder-zinc-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-4">
          <h3 className="text-sm font-medium text-white mb-3">Textarea</h3>
          <textarea
            placeholder="Enter text..."
            rows={3}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          />
          <p className="text-xs text-zinc-500 mt-2">Same padding as large input, resize-none by default</p>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
          <h3 className="text-sm font-medium text-white mb-3">Toggle</h3>
          <div className="space-y-4">
            <button
              onClick={() => setToggleOn(!toggleOn)}
              className="flex items-center justify-between w-full p-3 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <span className="text-sm text-zinc-400">Toggle Option</span>
              {toggleOn ? (
                <ToggleRight className="w-8 h-8 text-emerald-500" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-zinc-600" />
              )}
            </button>
            <p className="text-xs text-zinc-500">Using Lucide ToggleLeft/ToggleRight icons at 32px</p>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-white mb-4">Cards</h2>

        <h3 className="text-sm font-medium text-zinc-400 mb-3">Basic Card</h3>
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 mb-6">
          <p className="text-white">Basic card content</p>
        </div>

        <h3 className="text-sm font-medium text-zinc-400 mb-3">Gradient Card</h3>
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Gradient Card</h3>
          <p className="text-white/80">Used for hero sections and completion screens</p>
        </div>

        <h3 className="text-sm font-medium text-zinc-400 mb-3">Stat Card</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900 rounded-xl p-4 text-center border border-zinc-800">
            <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">150</p>
            <p className="text-xs text-zinc-500">Points</p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 text-center border border-zinc-800">
            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">5</p>
            <p className="text-xs text-zinc-500">Streak</p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 text-center border border-zinc-800">
            <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">85%</p>
            <p className="text-xs text-zinc-500">Accuracy</p>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-white mb-4">Progress</h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-zinc-400 mb-2">Progress Bar (70%)</p>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                style={{ width: '70%' }}
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-zinc-400 mb-2">Small Progress (40%)</p>
            <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                style={{ width: '40%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Icons */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-white mb-4">Icons</h2>
        <p className="text-sm text-zinc-500 mb-4">Using Lucide React icons</p>

        <div className="grid grid-cols-6 gap-4">
          {[
            { icon: BookOpen, name: 'BookOpen' },
            { icon: Trophy, name: 'Trophy' },
            { icon: Clock, name: 'Clock' },
            { icon: Flame, name: 'Flame' },
            { icon: Target, name: 'Target' },
            { icon: Plus, name: 'Plus' },
            { icon: Trash2, name: 'Trash2' },
            { icon: Pencil, name: 'Pencil' },
            { icon: Users, name: 'Users' },
            { icon: Share2, name: 'Share2' },
            { icon: Check, name: 'Check' },
            { icon: X, name: 'X' },
            { icon: Loader2, name: 'Loader2' },
            { icon: Send, name: 'Send' },
            { icon: Sparkles, name: 'Sparkles' },
            { icon: ArrowLeft, name: 'ArrowLeft' },
          ].map(({ icon: Icon, name }) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <Icon className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-xs text-zinc-600">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-white mb-4">Spacing</h2>
        <div className="space-y-3">
          {[
            { size: 'p-2', px: '8px' },
            { size: 'p-3', px: '12px' },
            { size: 'p-4', px: '16px' },
            { size: 'p-5', px: '20px' },
            { size: 'p-6', px: '24px' },
          ].map(({ size, px }) => (
            <div key={size} className="flex items-center gap-4">
              <div className={`bg-emerald-500/20 border border-emerald-500/50 rounded-lg ${size}`}>
                <div className="w-8 h-8 bg-emerald-500 rounded" />
              </div>
              <span className="text-sm text-zinc-400">{size} ({px})</span>
            </div>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-white mb-4">Border Radius</h2>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-lg mb-2" />
            <p className="text-xs text-zinc-500">rounded-lg</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-xl mb-2" />
            <p className="text-xs text-zinc-500">rounded-xl</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl mb-2" />
            <p className="text-xs text-zinc-500">rounded-2xl</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-full mb-2" />
            <p className="text-xs text-zinc-500">rounded-full</p>
          </div>
        </div>
      </section>
    </div>
  );
}
