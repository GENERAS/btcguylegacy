import { Link } from 'react-router-dom';
import { FaCode, FaChartLine, FaGraduationCap, FaArrowRight } from 'react-icons/fa';

const AboutSection = () => {
  const skills = [
    { icon: FaCode, label: 'Full-Stack Development', desc: 'React, Node.js, Blockchain' },
    { icon: FaChartLine, label: 'Trading Expert', desc: 'Crypto, Forex, Risk Management' },
    { icon: FaGraduationCap, label: 'Continuous Learner', desc: 'From Nursery to PhD Journey' },
  ];

  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left: Image */}
          <div className="relative">
            {/* Main image container */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 p-1">
              <div className="bg-slate-800 rounded-2xl overflow-hidden aspect-[4/5]">
                {/* Placeholder - Replace with your image */}
                <img
                  src="/images/generas-profile.jpg"
                  alt="Generas Kagiraneza"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback placeholder */}
                <div className="hidden w-full h-full bg-slate-700 items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-600 flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                    <p>Add your image to /public/images/generas-profile.jpg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-bold shadow-lg">
              5+ Years Experience
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <p className="text-blue-400 font-semibold mb-2 uppercase tracking-wide">
              About Me
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Building Solutions That <span className="text-amber-400">Matter</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              I'm Generas Kagiraneza, a Full-Stack Developer and Trader from Rwanda. 
              I help businesses turn ideas into revenue through high-converting web apps 
              and proven trading strategies. My journey from Nursery School to mastering 
              code and markets taught me one thing: results speak louder than words.
            </p>

            {/* Skills */}
            <div className="space-y-4 mb-8">
              {skills.map((skill, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <skill.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{skill.label}</h3>
                    <p className="text-gray-500 text-sm">{skill.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/academic"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition"
            >
              See My Full Journey <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
