import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Support & Inquiries
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          We’re Here to Help
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Have questions regarding test preparation, home collection schedules, or your digital medical report? Reach our care desk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info Details */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Direct Contact Channels
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Phone Support (Toll-Free)</p>
                  <p className="font-mono text-slate-700 text-sm mt-0.5">1800-209-4455</p>
                  <p className="text-[11px] text-slate-400">Available 6:00 AM – 10:00 PM daily</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Email Inquiries</p>
                  <p className="text-slate-700 mt-0.5">support@medilab-diagnostics.com</p>
                  <p className="text-[11px] text-slate-400">Response within 2 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Central Laboratory Facility</p>
                  <p className="text-slate-700 mt-0.5">MediLab Central Tower, 42 Healthcare Boulevard, Medical District, Mumbai 400001</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Sample Collection Operating Hours</p>
                  <p className="text-slate-700 mt-0.5">Monday to Sunday: 6:00 AM – 8:00 PM</p>
                  <p className="text-[11px] text-slate-400">365 Days a Year (Including Public Holidays)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-teal-50 rounded-xl border border-teal-100">
                <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-teal-950">Thank You!</h3>
                <p className="text-xs text-teal-800">
                  Your message has been received by our clinical coordinator. We will reply to your registered email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="mt-2 text-xs font-bold text-teal-700 underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g., Aarav Sharma"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g., aarav@example.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message or Query *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="Describe how we can assist you with your test booking..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
