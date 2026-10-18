import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Inbox, 
  ShieldCheck, 
  Lock, 
  FileText, 
  BarChart3, 
  Cpu, 
  Settings, 
  Shield, 
  Zap,
  ExternalLink,
  ChevronRight,
  Database,
  Radio,
  X
} from 'lucide-react';

export default function Sidebar({
  currentView,
  setCurrentView,
  pendingReviewsCount = 0,
  isMobileOpen = false,
  setIsMobileOpen
}) {
  const navItems = [
    {
      group: 'WORKSPACE',
      items: [
        { id: 'command_center', label: 'Command Center', icon: LayoutDashboard, badge: 'Live Cockpit' },
        { id: 'traffic', label: 'Agent Traffic', icon: Activity, badge: null },
        { id: 'reviews', label: 'Review Queue', icon: Inbox, badge: pendingReviewsCount > 0 ? `${pendingReviewsCount}` : null, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
        { id: 'policies', label: 'Policy & Guardrails', icon: ShieldCheck, badge: 'MAS FEAT' },
        { id: 'airlock', label: 'Data Airlock', icon: Lock, badge: 'Perimeter' },
        { id: 'audit', label: 'Audit Trail', icon: FileText, badge: null },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
      ]
    },
    {
      group: 'ADMINISTRATION',
      items: [
        { id: 'integrations', label: 'Integrations & A2A', icon: Cpu, badge: 'Active' },
        { id: 'settings', label: 'Settings', icon: Settings, badge: null },
      ]
    }
  ];

  const handleSelectView = (viewId) => {
    setCurrentView(viewId);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 md:z-30
        w-72 sm:w-64 h-screen bg-navy-950 border-r border-navy-750 flex flex-col justify-between shrink-0
        transition-transform duration-300 ease-in-out shadow-2xl
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top Brand Block */}
        <div>
          <div className="p-4 border-b border-navy-750 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-teal via-teal-500 to-indigo-600 flex items-center justify-center shadow-md shadow-teal-500/20">
                <Shield className="w-4 h-4 text-navy-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1">
                  VeriBrake <span className="text-brand-teal font-mono">A2A</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Sovereign Risk Mesh
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen?.(false)}
              className="md:hidden p-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-210px)]" aria-label="Main Navigation">
            {navItems.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectView(item.id)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer text-left
                        ${isActive 
                          ? 'bg-navy-850 text-white border border-navy-700 shadow-sm font-semibold' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'}
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-teal' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      
                      {item.badge && (
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold border shrink-0 ${
                          item.badgeColor || (isActive ? 'bg-teal-950 text-brand-teal border-teal-800' : 'bg-navy-900 text-slate-400 border-navy-750')
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Platform Status Card */}
        <div className="p-3 border-t border-navy-750 bg-navy-950/90 space-y-2">
          <div className="p-2.5 rounded-xl bg-navy-900 border border-navy-750 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Engine Status</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono space-y-0.5">
              <div className="truncate">Cloud: Google Cloud Run</div>
              <div className="truncate">LLM: Gemini 2.5 Flash</div>
              <div className="truncate">Protocol: A2A v0.4.0</div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono text-center">
            VeriBrake &bull; AI Builder Cup JAPAC
          </div>
        </div>

      </aside>
    </>
  );
}
