'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className="relative bg-slate-900 text-slate-400 py-16 px-6 md:px-12 lg:px-20 font-sans border-t border-slate-800 overflow-hidden">
      
      {/* Faint Background Logo / Watermark - Visible on mobile but scaled */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none overflow-hidden">
        <span className="text-[100px] sm:text-[150px] md:text-[250px] lg:text-[280px] font-black tracking-tighter leading-none text-white whitespace-nowrap">AV HUB</span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col h-full justify-between">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between w-full mb-16 gap-12">
          
          {/* Brand & Socials / Left Side */}
          <div className="w-full md:max-w-sm flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0">
            <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-blue-500 mb-6 underline underline-offset-8">
              Abdullah Ventures
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-400 mb-8 max-w-[320px] md:max-w-none">
              Digital B2B trade hub serving global partners from Kuala Lumpur and beyond. Creating high-quality trading experiences and connecting global hubs.
            </p>
            {/* Social Icons under paragraph */}
            <div className="flex space-x-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-[42px] h-[42px] rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-[#0a66c2] hover:text-white transition-colors shadow-sm">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-[42px] h-[42px] rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-[#25D366] hover:text-white transition-colors shadow-sm">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.441 7.465-7.441a7.41 7.41 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.442-7.461 7.442m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.111-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"/></svg>
              </a>
            </div>
          </div>

          {/* Links Grid / Right Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 text-[14px]">
            
            {/* Column 1 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-lg font-bold text-slate-100 mb-6">Quick Links</h2>
              <ul className="space-y-4 font-medium text-slate-400">
                <li><Link href="/" className="hover:text-blue-500 transition">Home</Link></li>
                <li><Link href="/dashboard" className="hover:text-blue-500 transition">Dashboard</Link></li>
                <li><Link href="/nodes" className="hover:text-blue-500 transition">Global Nodes</Link></li>
                <li><Link href="/login" className="hover:text-blue-500 transition">Portal Login</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-lg font-bold text-slate-100 mb-6">Support & Legal</h2>
              <ul className="space-y-4 font-medium text-slate-400">
                <li><Link href="#" className="hover:text-blue-500 transition">Contact Support</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Help Center</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full pt-8 border-t border-slate-800/50 text-[13px] text-slate-500 gap-6">
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2.5 px-4 py-2 border border-slate-700/50 rounded-full bg-slate-800/50 shadow-sm w-max">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-slate-300">All systems operational</span>
          </div>

          <p className="text-center md:text-left">
            Copyright © {currentYear} — <span className="font-bold text-slate-300">Kazi Abdullah Al Mamun</span>. All rights reserved. Bangsar Hub, KL.
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed right-4 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 outline-none text-white z-50 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          showTopBtn 
            ? 'bottom-[80px] sm:bottom-[104px] opacity-100 transform translate-y-0 hover:-translate-y-1 hover:bg-blue-500 pointer-events-auto' 
            : 'bottom-[40px] opacity-0 transform translate-y-8 pointer-events-none'
        }`}
      >
        <svg width="24" height="24" className="sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </button>
    </footer>
  );
};

export default Footer;
