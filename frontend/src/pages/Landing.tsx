import { Link } from 'react-router-dom'
import { Activity, Users, Calendar, Shield, BarChart3, Pill, FlaskConical, CheckCircle2, ArrowRight } from 'lucide-react'

const features = [
  { icon: Users, title: 'Patient Management', desc: 'Complete patient records with medical history, allergies & treatment plans' },
  { icon: Calendar, title: 'Smart Scheduling', desc: 'Appointment booking with doctor availability and department routing' },
  { icon: BarChart3, title: 'Revenue Analytics', desc: 'Real-time billing, invoicing and revenue dashboards' },
  { icon: Shield, title: 'Multi-Tenant Security', desc: 'Complete data isolation per hospital with role-based access control' },
  { icon: Pill, title: 'Pharmacy Module', desc: 'Medicine inventory management with low-stock alerts' },
  { icon: FlaskConical, title: 'Laboratory', desc: 'Lab test ordering, result tracking and reporting' },
]

const plans = [
  { name: 'Basic', price: '$49', period: '/mo', features: ['Up to 5 doctors', 'Patient management', 'Appointments', 'Billing', 'Basic reports'], cta: 'Get Started', highlight: false },
  { name: 'Advanced', price: '$149', period: '/mo', features: ['Up to 20 doctors', 'Everything in Basic', 'Pharmacy module', 'Laboratory module', 'Advanced analytics'], cta: 'Most Popular', highlight: true },
  { name: 'Enterprise', price: '$399', period: '/mo', features: ['Unlimited doctors', 'Everything in Advanced', 'Multi-branch support', 'Priority support', 'Custom integrations'], cta: 'Contact Sales', highlight: false },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-200 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-xl">Hospora</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2">
            Sign In
          </Link>
          <Link to="/register" className="text-sm font-semibold bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          Hospital Management Software
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          Modern Healthcare<br />
          <span className="text-blue-600">Management Platform</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Hospora is hospital management software for owners and teams. Manage patients, appointments, billing, pharmacy and lab tests in one system.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register" className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors text-base shadow-lg shadow-blue-200">
            Start Free Trial <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="text-slate-700 font-medium px-6 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors text-base">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Everything your hospital needs</h2>
          <p className="text-slate-600 text-center mb-12 max-w-xl mx-auto">Complete hospital operations management with enterprise-grade security and multi-tenant architecture.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Simple, transparent pricing</h2>
        <p className="text-slate-600 text-center mb-12">Start with a free trial. No credit card required.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl p-8 border-2 ${plan.highlight ? 'border-blue-500 bg-blue-600 text-white shadow-xl shadow-blue-200' : 'border-slate-200 bg-white'}`}>
              <h3 className={`font-bold text-xl mb-1 ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                <span className={plan.highlight ? 'text-blue-200' : 'text-slate-500'}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={16} className={plan.highlight ? 'text-blue-200' : 'text-emerald-500'} />
                    <span className={plan.highlight ? 'text-blue-100' : 'text-slate-700'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`block text-center font-semibold py-3 rounded-xl transition-colors ${plan.highlight ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center">
        <p className="text-sm text-slate-500">© 2025 Hospora. Hospital Management Software.</p>
      </footer>
    </div>
  )
}
