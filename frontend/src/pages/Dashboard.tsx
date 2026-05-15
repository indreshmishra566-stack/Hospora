import { Users, Calendar, DollarSign, UserCheck, BedDouble, FileWarning, TrendingUp } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts'
import {
  useDashboardStats, useRevenueTrends, useRecentAppointments,
  useAppointmentBreakdown, usePatientGrowth,
} from '@/hooks'
import { StatCard, Card, CardHeader, CardContent, LoadingSpinner, Badge } from '@/components/shared'
import { formatCurrency, formatDate, formatTime, appointmentStatusConfig } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  scheduled: '#3b82f6', confirmed: '#8b5cf6', in_progress: '#f59e0b',
  completed: '#10b981', cancelled: '#ef4444', no_show: '#94a3b8',
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: revenue } = useRevenueTrends()
  const { data: recentAppts } = useRecentAppointments()
  const { data: breakdown } = useAppointmentBreakdown()
  const { data: patientGrowth } = usePatientGrowth()

  if (statsLoading) return <LoadingSpinner />

  const s = stats as any
  const revData = (revenue as any[]) || []
  const appts = (recentAppts as any[]) || []
  const breakdownData = (breakdown as any[]) || []
  const growthData = (patientGrowth as any[]) || []

  return (
    <div className="page-container">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value={s?.total_patients ?? 0} icon={Users} color="blue"
          subtitle="Registered patients" />
        <StatCard title="Today's Appointments" value={s?.today_appointments ?? 0} icon={Calendar} color="purple"
          subtitle="Scheduled for today" />
        <StatCard title="Monthly Revenue" value={formatCurrency(s?.monthly_revenue ?? 0)} icon={DollarSign} color="green"
          subtitle="This month" />
        <StatCard title="Total Staff" value={s?.total_staff ?? 0} icon={UserCheck} color="orange"
          subtitle="Active employees" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Available Beds" value={`${s?.available_beds ?? 0}/${s?.total_beds ?? 0}`}
          icon={BedDouble} color="teal" subtitle="Capacity" />
        <StatCard title="Pending Invoices" value={s?.pending_invoices ?? 0} icon={FileWarning} color="red"
          subtitle="Awaiting payment" />
        <div className="col-span-2 stat-card flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Current Plan</p>
            <p className="text-xl font-bold text-slate-900 capitalize">{s?.hospital_plan ?? 'Trial'}</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-semibold text-slate-900">Revenue & Appointments (Last 7 Days)</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `$${v}`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip formatter={(v: any, name: string) => [name === 'revenue' ? formatCurrency(v) : v, name === 'revenue' ? 'Revenue' : 'Appointments']} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRevenue)" />
                <Line yAxisId="right" type="monotone" dataKey="appointments" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Breakdown Pie */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-slate-900">Appointment Status</h3>
          </CardHeader>
          <CardContent>
            {breakdownData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={breakdownData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                      {breakdownData.map((entry: any) => (
                        <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any, name: string) => [v, name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {breakdownData.map((entry: any) => (
                    <div key={entry.status} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[entry.status] }} />
                        <span className="text-slate-600 capitalize">{entry.status.replace('_', ' ')}</span>
                      </div>
                      <span className="font-semibold text-slate-800">{entry.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">No data yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Patient Growth & Recent Appointments */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Patient Growth */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-semibold text-slate-900">Patient Growth (6 Months)</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={growthData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip />
                <Bar dataKey="patients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <h3 className="font-semibold text-slate-900">Recent Appointments</h3>
          </CardHeader>
          <div className="divide-y divide-slate-100">
            {appts.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">No appointments yet</div>
            ) : appts.slice(0, 6).map((a: any) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                  {a.patient_name?.charAt(0) || 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{a.patient_name}</p>
                  <p className="text-xs text-slate-500 truncate">{a.doctor_name} • {formatDate(a.date)} {formatTime(a.time)}</p>
                </div>
                <span className={appointmentStatusConfig[a.status as keyof typeof appointmentStatusConfig]?.className || 'badge badge-gray'}>
                  {appointmentStatusConfig[a.status as keyof typeof appointmentStatusConfig]?.label || a.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
