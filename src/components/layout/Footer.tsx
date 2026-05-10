const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer aria-label="Footer" className="bg-slate-900 text-slate-500 py-10 sm:py-16 px-4 border-t border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
        <div className="space-y-1">
          <p className="text-blue-500 text-lg sm:text-xl italic tracking-tighter uppercase font-black underline underline-offset-8">
            Abdullah Ventures
          </p>
          <p className="text-xs sm:text-sm text-slate-400">
            Digital B2B trade hub serving global partners from Kuala Lumpur and beyond.
          </p>
        </div>
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.3em] font-bold leading-relaxed">
          © {currentYear} Kazi Abdullah Al Mamun · Bangsar Hub, Kuala Lumpur, Malaysia
        </p>
      </div>
    </footer>
  );
};

export default Footer;
