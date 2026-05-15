import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Calendar, ListOrdered, UserCheck, Building2,
  FileText, Receipt, Pill, FlaskConical, Settings, LogOut,
  Menu, X, Activity, ChevronRight, Lock,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn, initials, planConfig } from '@/lib/utils'

interface NavItem {
  to: string
  label: string
  icon: React.ElementType
  requiresFeature?: 'pharmacy' | 'lab'
  roles?: string[]
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/appointments', label: 'Appointments', icon: Calendar },
  { to: '/queue', label: 'OPD Queue', icon: ListOrdered },
  { to: '/staff', label: 'Staff', icon: UserCheck, roles: ['hospital_admin', 'super_admin'] },
  { to: '/departments', label: 'Departments', icon: Building2 },
  { to: '/medical-records', label: 'Medical Records', icon: FileText },
  { to: '/billing', label: 'Billing', icon: Receipt },
  { to: '/pharmacy', label: 'Pharmacy', icon: Pill, requiresFeature: 'pharmacy' },
  { to: '/lab', label: 'Laboratory', icon: FlaskConical, requiresFeature: 'lab' },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { user, hospital, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const plan = hospital?.plan ?? 'trial'
  const planInfo = planConfig[plan] || planConfig.trial

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300 sticky top-0 shrink-0',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        {!collapsed && (
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">Hospora</span>
          </button>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 ml-auto"
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Hospital info */}
      {!collapsed && hospital && (
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-500 mb-0.5">Hospital</p>
          <p className="text-sm font-semibold text-slate-800 truncate">{hospital.name}</p>
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block', planInfo.color)}>
            {planInfo.label}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => {
          const locked = item.requiresFeature
            ? !(hospital?.[`has_${item.requiresFeature}` as keyof typeof hospital])
            : false

          const hasRole = !item.roles || item.roles.includes(user?.role ?? '')

          if (!hasRole) return null

          return (
            <div key={item.to}>
              {locked ? (
                <div className={cn(
                  'sidebar-link opacity-50 cursor-not-allowed',
                  collapsed && 'justify-center px-2'
                )}>
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      <Lock size={12} />
                    </>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) => cn(
                    'sidebar-link',
                    isActive && 'active',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                </NavLink>
              )}
            </div>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-slate-100">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
              {initials(user?.name ?? 'U')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <button onClick={logout} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="w-full flex justify-center p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  )
}
