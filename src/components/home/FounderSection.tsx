import image from '../../assets/founder.jpg';

const FounderSection = () => (
  <section id="about" className="py-14 sm:py-20 lg:py-24 bg-slate-900 text-white px-4 sm:px-6 lg:px-10">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
      <div className="w-52 h-52 sm:w-64 sm:h-64 bg-slate-800 rounded-2xl border-2 border-blue-500 overflow-hidden shadow-2xl relative rotate-2">
        <img
          src={image.src}
          alt="CEO Kazi Abdullah Al Mamun"
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500"
        />
        <div className="absolute bottom-0 w-full bg-blue-600 py-1 text-[10px] font-black uppercase tracking-widest text-center">
          Founder & CEO
        </div>
      </div>
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl sm:text-3xl font-black uppercase italic text-blue-500 mb-2">Kazi Abdullah Al Mamun</h2>
        <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 italic">
          Ex-MNC Professional (Category 1 - EP1)
        </p>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light italic mb-8 border-l-0 md:border-l-4 border-blue-600 pl-0 md:pl-6">
          Managed by a former MNC Professional in Malaysia. Abdullah Ventures bridges Asian
          technology with global trade needs from our strategic Bangsar headquarters.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="bg-slate-800 p-3 rounded text-[9px] font-bold uppercase tracking-widest">
            HQ: Bangsar, Kuala Lumpur
          </div>
          <div className="bg-slate-800 p-3 rounded text-[9px] font-bold uppercase tracking-widest">
            Status: Digital Trade Hub
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FounderSection;
