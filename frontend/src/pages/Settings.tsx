import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { authApi, hospitalApi } from '@/api/client'
import { Button, Card, CardHeader, CardContent, Input, ErrorMessage } from '@/components/shared'
import { getErrorMessage, planConfig } from '@/lib/utils'
import { CheckCircle2, Building2, User, Shield } from 'lucide-react'

const PLANS = [
  { id: 'basic', name: 'Basic', price: '$49/mo', features: ['Up to 5 doctors', 'Patients & Appointments', 'Billing'] },
  { id: 'advanced', name: 'Advanced', price: '$149/mo', features: ['Up to 20 doctors', 'Pharmacy module', 'Lab module', 'Advanced reports'] },
  { id: 'enterprise', name: 'Enterprise', price: '$399/mo', features: ['Unlimited doctors', 'Multi-branch', 'Priority support', 'Custom integration'] },
]

export default function SettingsPage() {
  const { user, hospital, refreshUser } = useAuth()
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '', specialization: user?.specialization || '' })
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm: '' })
  const [profileMsg, setProfileMsg] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState('')

  const setP = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setProfileForm(p => ({ ...p, [f]: e.target.value }))
  const setPw = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setPwForm(p => ({ ...p, [f]: e.target.value }))

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setProfileMsg('')
    try {
      await authApi.updateProfile(profileForm)
      await refreshUser()
      setProfileMsg('Profile updated successfully!')
    } catch (err) {
      setProfileMsg(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const upgradePlan = async (plan: string) => {
    if (!hospital) return
    setUpgradeLoading(plan)
    try {
      await hospitalApi.upgrade(hospital.id, plan)
      await refreshUser()
    } catch (err) {
      console.error(err)
    } finally {
      setUpgradeLoading('')
    }
  }

  const currentPlan = hospital?.plan ?? 'trial'
  const planInfo = planConfig[currentPlan] || planConfig.trial

  return (
    <div className="page-container max-w-4xl">
      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User size={18} className="text-blue-600" />
            <h3 className="font-semibold text-slate-900">Profile Settings</h3>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="space-y-4 max-w-lg">
            {profileMsg && (
              <div className={`text-sm p-3 rounded-lg ${profileMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {profileMsg}
              </div>
            )}
            <Input label="Full Name" value={profileForm.name} onChange={setP('name')} required />
            <Input label="Phone" value={profileForm.phone} onChange={setP('phone')} />
            <Input label="Specialization" value={profileForm.specialization} onChange={setP('specialization')} />
            <div className="p-3 bg-slate-50 rounded-lg text-sm">
              <p className="text-slate-500">Email: <span className="font-medium text-slate-800">{user?.email}</span></p>
              <p className="text-slate-500 mt-1">Role: <span className="font-medium text-slate-800 capitalize">{user?.role?.replace('_', ' ')}</span></p>
            </div>
            <Button type="submit" loading={loading}>Save Profile</Button>
          </form>
        </CardContent>
      </Card>

      {/* Hospital Info */}
      {hospital && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-blue-600" />
              <h3 className="font-semibold text-slate-900">Hospital Information</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm max-w-lg">
              <div>
                <p className="text-slate-500 mb-0.5">Hospital Name</p>
                <p className="font-medium text-slate-900">{hospital.name}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-0.5">Email</p>
                <p className="font-medium text-slate-900">{hospital.email}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-0.5">Current Plan</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planInfo.color}`}>{planInfo.label}</span>
              </div>
              <div>
                <p className="text-slate-500 mb-0.5">Status</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 capitalize">{hospital.subscription_status}</span>
              </div>
              <div>
                <p className="text-slate-500 mb-0.5">Total Beds</p>
                <p className="font-medium text-slate-900">{hospital.total_beds}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-0.5">Pharmacy</p>
                <p className="font-medium text-slate-900">{hospital.has_pharmacy ? '✅ Enabled' : '❌ Locked'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Upgrade */}
      {(user?.role === 'hospital_admin' || user?.role === 'super_admin') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-blue-600" />
              <h3 className="font-semibold text-slate-900">Subscription Plan</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 mb-5">Upgrade your plan to unlock more features.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {PLANS.map(plan => {
                const isActive = currentPlan === plan.id
                return (
                  <div key={plan.id} className={`rounded-xl border-2 p-5 transition-all ${isActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900">{plan.name}</h4>
                      {isActive && <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Current</span>}
                    </div>
                    <p className="text-xl font-bold text-slate-800 mb-4">{plan.price}</p>
                    <ul className="space-y-2 mb-5">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={isActive ? 'secondary' : 'primary'}
                      size="sm"
                      className="w-full"
                      disabled={isActive}
                      loading={upgradeLoading === plan.id}
                      onClick={() => upgradePlan(plan.id)}
                    >
                      {isActive ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
