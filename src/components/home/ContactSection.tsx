"use client";
// src/components/home/ContactSection.js
import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `*New Broadcast Inquiry*%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Requirements:* ${formData.message}`;
    window.open(`https://wa.me/8801999907883?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-14 sm:py-20 lg:py-24 bg-slate-100 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden bg-white">
        <div className="bg-slate-900 text-white p-6 sm:p-8 lg:p-12 md:w-2/5">
          <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-8 tracking-tighter">Get In Touch</h2>
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <MapPin className="text-blue-500" />
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Global Head Office</p>
                <p className="text-xs italic font-medium">Suite-342, Level-3, R H Home Centre, Green Road, Dhaka, Bangladesh</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Mail className="text-blue-500" />
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Direct Inquiry</p>
                <p className="text-xs italic font-medium">kmdmamun@gmail.com</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Phone className="text-blue-500" />
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Hotline</p>
                <p className="text-xs italic font-medium">+880 1999 907883</p>
              </div>
            </div>
          </div>
        </div>
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-12 flex-1 space-y-6">
           <h3 className="text-xl font-black uppercase italic text-slate-800">Send us a message</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <input 
               type="text" 
               aria-label="Full Name"
               value={formData.name}
               onChange={(e) => setFormData({...formData, name: e.target.value})}
               placeholder="FULL NAME" 
               required
               className="border-b-2 border-slate-200 py-3 text-[10px] font-bold outline-none focus:border-blue-600 transition uppercase tracking-widest" 
             />
             <input 
               type="email" 
               aria-label="Email Address"
               value={formData.email}
               onChange={(e) => setFormData({...formData, email: e.target.value})}
               placeholder="EMAIL ADDRESS" 
               required
               className="border-b-2 border-slate-200 py-3 text-[10px] font-bold outline-none focus:border-blue-600 transition uppercase tracking-widest" 
             />
           </div>
           <textarea 
             aria-label="Message"
             value={formData.message}
             onChange={(e) => setFormData({...formData, message: e.target.value})}
             placeholder="DESCRIBE YOUR TRADE OR COMMODITY REQUIREMENTS" 
             required
             className="w-full border-b-2 border-slate-200 py-3 text-[10px] font-bold outline-none focus:border-blue-600 transition uppercase tracking-widest h-32" 
           />
           <button type="submit" aria-label="Broadcast Inquiry" className="w-full bg-blue-600 text-white font-black py-4 uppercase text-[10px] tracking-[0.3em] hover:bg-slate-900 transition">
             Broadcast Inquiry
           </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;