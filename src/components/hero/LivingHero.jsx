import { Link } from 'react-router-dom';
import { FaArrowRight, FaShieldAlt, FaUsers, FaStar, FaCode, FaChartLine } from 'react-icons/fa';

// Compact Hero with image
const LivingHero = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative container mx-auto px-4 py-10 md:py-14">
        <div className="grid md:grid-cols-5 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Left: Content (3 cols) */}
          <div className="md:col-span-3 text-center md:text-left">
            {/* Name */}
            <p className="text-sm text-gray-300 mb-2 tracking-wide uppercase">
              Generas Kagiraneza
            </p>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Turn Your Ideas Into <span className="text-amber-400">Revenue</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-200 mb-6">
              Full-Stack Developer & Trader helping businesses grow with battle-tested solutions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
              <Link
                to="/hire-me"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
              >
                Start Project <FaArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/service"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold transition"
              >
                Get Mentorship
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm">
                <FaShieldAlt className="w-4 h-4 text-green-400" />
                <span>Quality</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm">
                <FaUsers className="w-4 h-4 text-blue-400" />
                <span>100+ Clients</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm">
                <FaStar className="w-4 h-4 text-yellow-400" />
                <span>Proven</span>
              </div>
            </div>
          </div>

          {/* Right: Image (2 cols) */}
          <div className="md:col-span-2 flex justify-center md:justify-end">
            <div className="relative">
              {/* Image container */}
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-xl overflow-hidden bg-slate-800">
                  <img
                    src="/images/generas-profile.jpg"
                    alt="Generas Kagiraneza"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback */}
                  <div className="hidden w-full h-full items-center justify-center text-gray-400 flex-col">
                    <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mb-2">
                      <span className="text-3xl">👤</span>
                    </div>
                    <p className="text-xs">Add image to /public/images/</p>
                  </div>
                </div>
              </div>
              
              {/* Floating badges around image */}
              <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                <FaCode className="w-3 h-3 inline mr-1" /> Dev
              </div>
              <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                <FaChartLine className="w-3 h-3 inline mr-1" /> Trader
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-950 to-transparent"></div>
    </section>
  );
};

export default LivingHero;
