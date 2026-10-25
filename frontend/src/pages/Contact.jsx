import { useState } from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle, FaSpinner } from 'react-icons/fa'
import Toast from '../components/Toast'
import API from '../utils/api'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'error' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setToast({ message: '', type: 'error' })

    try {
      await API.post('/contact', form)
      setSuccess(true)
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to send message', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-20 px-6">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'error' })} />
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-warm-900 mb-4">Get in Touch</h1>
          <p className="text-warm-700">We're here to help you 24/7.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-warm-900 rounded-3xl p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
             <h2 className="font-display text-2xl font-bold mb-8 relative">Contact Information</h2>
             
             <div className="space-y-6 relative">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400"><FaPhone /></div>
                 <div>
                   <p className="text-sm text-gray-400">Call Us</p>
                   <p className="font-bold">1800-123-4567</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400"><FaEnvelope /></div>
                 <div>
                   <p className="text-sm text-gray-400">Email Us</p>
                   <p className="font-bold">hello@roadassist.in</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400"><FaMapMarkerAlt /></div>
                 <div>
                   <p className="text-sm text-gray-400">Visit Us</p>
                   <p className="font-bold">Bangalore, India</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-xl">
             {success ? (
               <div className="text-center py-12">
                 <FaCheckCircle className="text-6xl text-emerald-500 mx-auto mb-4" />
                 <h3 className="text-2xl font-bold text-warm-900 mb-2">Message Sent!</h3>
                 <p className="text-warm-700">Our team will get back to you shortly.</p>
                 <button onClick={() => { setSuccess(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }} className="mt-6 text-amber-600 font-bold hover:underline">
                   Send another message
                 </button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-warm-700 mb-1 block">Name</label>
                     <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-cream-200 rounded-xl px-4 py-2.5 focus:border-amber-500 outline-none" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-warm-700 mb-1 block">Phone</label>
                     <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-cream-200 rounded-xl px-4 py-2.5 focus:border-amber-500 outline-none" />
                   </div>
                 </div>
                 <div>
                   <label className="text-xs font-bold text-warm-700 mb-1 block">Email</label>
                   <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-cream-200 rounded-xl px-4 py-2.5 focus:border-amber-500 outline-none" />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-warm-700 mb-1 block">Subject</label>
                   <input required type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full border border-cream-200 rounded-xl px-4 py-2.5 focus:border-amber-500 outline-none" />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-warm-700 mb-1 block">Message</label>
                   <textarea required rows="4" value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full border border-cream-200 rounded-xl px-4 py-2.5 focus:border-amber-500 outline-none resize-none" />
                 </div>
                 <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-amber-500 text-white font-bold shadow-lg hover:bg-amber-600 transition-colors">
                   {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Send Message'}
                 </button>
               </form>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Contact