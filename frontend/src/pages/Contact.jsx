import { useState } from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle, FaSpinner, FaUser, FaHome } from 'react-icons/fa'
import Toast from '../components/Toast'
import API from '../utils/api'

const Contact = () => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    subject: '', 
    message: '',
    address: '' // ✅ New field
  })
  
  const [loading, setLoading] = useState(false)
  const [successData, setSuccessData] = useState(null) // ✅ Store data to show on success
  const [toast, setToast] = useState({ message: '', type: 'error' })

  const handlePhoneChange = (e) => {
    // Only allow numbers and max 10 digits
    const val = e.target.value.replace(/\D/g, '').slice(0, 10)
    setForm({ ...form, phone: val })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setToast({ message: '', type: 'error' })

    // Frontend validation
    if (form.phone.length !== 10) {
      setToast({ message: 'Phone number must be exactly 10 digits', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const { data } = await API.post('/contact', form)
      setSuccessData(data.data) // ✅ Store the response data
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to send message', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSuccessData(null)
    setForm({ name: '', email: '', phone: '', subject: '', message: '', address: '' })
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
          <div className="bg-warm-900 rounded-3xl p-8 text-white relative overflow-hidden h-fit">
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

          {/* Form or Success Message */}
          <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-xl">
             {successData ? (
               /* ✅ SUCCESS VIEW showing their submitted data */
               <div className="text-center py-6 animate-fadeIn">
                 <FaCheckCircle className="text-6xl text-emerald-500 mx-auto mb-4" />
                 <h3 className="text-2xl font-bold text-warm-900 mb-2">Message Sent!</h3>
                 <p className="text-warm-700 mb-6">Thank you, {successData.name}. We will get back to you shortly.</p>
                 
                 <div className="bg-cream-50 rounded-xl p-5 text-left border border-cream-200 mb-6 space-y-3">
                   <p className="text-xs font-bold text-warm-500 uppercase tracking-wider mb-2">Your Submission</p>
                   <div className="flex items-center gap-2 text-sm text-warm-800"><FaUser className="text-amber-500"/> {successData.name}</div>
                   <div className="flex items-center gap-2 text-sm text-warm-800"><FaEnvelope className="text-amber-500"/> {successData.email}</div>
                   <div className="flex items-center gap-2 text-sm text-warm-800"><FaPhone className="text-amber-500"/> {successData.phone}</div>
                   <div className="flex items-start gap-2 text-sm text-warm-800"><FaHome className="text-amber-500 mt-1"/> {successData.address}</div>
                   <div className="pt-2 border-t border-cream-200 mt-2">
                     <p className="text-xs text-warm-500">Subject: <span className="font-bold text-warm-900">{successData.subject}</span></p>
                     <p className="text-sm text-warm-700 italic mt-1">"{successData.message}"</p>
                   </div>
                 </div>

                 <button onClick={handleReset} className="text-amber-600 font-bold hover:underline">
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
                     <input 
                       required 
                       type="tel" 
                       value={form.phone} 
                       onChange={handlePhoneChange} 
                       placeholder="10-digit number"
                       className="w-full border border-cream-200 rounded-xl px-4 py-2.5 focus:border-amber-500 outline-none" 
                     />
                   </div>
                 </div>
                 <div>
                   <label className="text-xs font-bold text-warm-700 mb-1 block">Email</label>
                   <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-cream-200 rounded-xl px-4 py-2.5 focus:border-amber-500 outline-none" />
                 </div>
                 
                 {/* ✅ New Address Field */}
                 <div>
                   <label className="text-xs font-bold text-warm-700 mb-1 block">Address</label>
                   <input required type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Your full address" className="w-full border border-cream-200 rounded-xl px-4 py-2.5 focus:border-amber-500 outline-none" />
                 </div>

                 <div>
                   <label className="text-xs font-bold text-warm-700 mb-1 block">Subject</label>
                   <input required type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full border border-cream-200 rounded-xl px-4 py-2.5 focus:border-amber-500 outline-none" />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-warm-700 mb-1 block">Message</label>
                   <textarea required rows="3" value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full border border-cream-200 rounded-xl px-4 py-2.5 focus:border-amber-500 outline-none resize-none" />
                 </div>
                 <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-amber-500 text-white font-bold shadow-lg hover:bg-amber-600 transition-colors flex justify-center items-center">
                   {loading ? <FaSpinner className="animate-spin" /> : 'Send Message'}
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