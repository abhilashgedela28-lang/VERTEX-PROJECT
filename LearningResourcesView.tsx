
import React, { useState } from 'react';
import { Library, Search, Filter, ExternalLink, Globe, Star, Users, Clock, Award } from 'lucide-react';

const LearningResourcesView: React.FC = () => {
  const [filter, setFilter] = useState('All');
  
  const platforms = [
    { name: 'Coursera', logo: 'https://picsum.photos/seed/coursera/100/100', tags: ['Academic', 'Paid', 'Certificate'], rating: 4.8, url: 'https://www.coursera.org' },
    { name: 'Udemy', logo: 'https://picsum.photos/seed/udemy/100/100', tags: ['Practical', 'Paid', 'Skill-based'], rating: 4.5, url: 'https://www.udemy.com' },
    { name: 'freeCodeCamp', logo: 'https://picsum.photos/seed/fcc/100/100', tags: ['Developer', 'Free', 'Hands-on'], rating: 4.9, url: 'https://www.freecodecamp.org' },
    { name: 'LinkedIn Learning', logo: 'https://picsum.photos/seed/linkedin/100/100', tags: ['Business', 'Subscription'], rating: 4.2, url: 'https://www.linkedin.com/learning' },
    { name: 'Pluralsight', logo: 'https://picsum.photos/seed/pluralsight/100/100', tags: ['IT', 'Pro', 'Subscription'], rating: 4.6, url: 'https://www.pluralsight.com' },
    { name: 'GeeksforGeeks', logo: 'https://picsum.photos/seed/gfg/100/100', tags: ['CS Fundamentals', 'Free', 'Practice'], rating: 4.7, url: 'https://www.geeksforgeeks.org' },
  ];

  const featuredCourses = [
    { title: "Google Data Analytics Professional Certificate", platform: "Coursera", price: "Paid", duration: "6 Months", level: "Beginner", students: "1.2M+", url: "https://www.coursera.org/professional-certificates/google-data-analytics" },
    { title: "JavaScript: The Hard Parts", platform: "Frontend Masters", price: "Subscription", duration: "12 Hours", level: "Advanced", students: "45K+", url: "https://frontendmasters.com/courses/javascript-hard-parts-v2/" },
    { title: "AWS Cloud Practitioner Essentials", platform: "Amazon Training", price: "Free", duration: "6 Hours", level: "Beginner", students: "200K+", url: "https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials" },
    { title: "Effective Business Communication", platform: "Udemy", price: "Paid", duration: "10 Hours", level: "Intermediate", students: "85K+", url: "https://www.udemy.com/course/effective-business-communication-skills/" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Learning Library</h2>
          <p className="text-slate-500 mt-1">Curated resources to accelerate your growth.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search platforms..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
      </div>

      {/* Featured Platforms */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800">Top Platforms</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {platforms.map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-center group cursor-pointer block">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                <img src={p.logo} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{p.name}</h4>
              <div className="flex items-center justify-center gap-1 text-[10px] text-amber-500 font-bold mb-3">
                <Star size={10} fill="currentColor" />
                {p.rating}
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                {p.tags.slice(0, 1).map((tag, ti) => (
                  <span key={ti} className="px-1.5 py-0.5 bg-slate-50 text-[8px] font-bold text-slate-400 uppercase rounded border border-slate-100">{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Featured Courses */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Award size={20} className="text-blue-600" />
          Recommended Courses for You
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredCourses.map((c, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all flex flex-col group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">{c.platform}</span>
                  <h4 className="text-xl font-bold text-slate-800 mt-2 leading-tight group-hover:text-blue-600 transition-colors">{c.title}</h4>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${c.price === 'Free' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {c.price}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Duration</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{c.duration}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Library size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Level</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{c.level}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Users size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Students</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{c.students}</p>
                </div>
              </div>

              <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-2">
                Enroll Now
                <ExternalLink size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Spotlight */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[2rem] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4">Official Cloud & Tech Certifications</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Earn industry-standard credentials from AWS, Google, and Microsoft. We help you find the right exam paths and preparation materials.
            </p>
            <div className="flex flex-wrap gap-4">
              {['AWS Solutions Architect', 'GCP Professional', 'Azure Fundamentals', 'CompTIA Security+'].map((c, i) => (
                <div key={i} className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-xs font-medium text-slate-300">
                  {c}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center">
            <h4 className="text-lg font-bold mb-4">Ready to certify?</h4>
            <p className="text-sm text-slate-400 mb-6">Our AI Career Discovery found that these certifications can increase your matching score by 25%.</p>
            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40">
              Browse All Certifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningResourcesView;
