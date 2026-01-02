
import React, { useState, useRef } from 'react';
import { UserProfile, Skill, Certification } from '../types';
import { User, Mail, Phone, BookOpen, Star, Plus, Trash2, Link as LinkIcon, ExternalLink, Save, Globe, Camera, Upload } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const ProfileView: React.FC<Props> = ({ profile, setProfile }) => {
  const [newSkill, setNewSkill] = useState("");
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [showAddCert, setShowAddCert] = useState(false);
  const [newCert, setNewCert] = useState<Certification>({ name: '', url: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalProfile(prev => ({
      ...prev,
      links: {
        ...prev.links,
        [name]: value
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfile(prev => ({
          ...prev,
          profilePicture: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const addSkill = () => {
    if (!newSkill) return;
    const skill: Skill = { name: newSkill, proficiency: 'Beginner' };
    setLocalProfile(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
    setNewSkill("");
  };

  const removeSkill = (index: number) => {
    setLocalProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const toggleSkillProficiency = (index: number) => {
    const levels: Skill['proficiency'][] = ['Beginner', 'Intermediate', 'Advanced'];
    setLocalProfile(prev => {
      const newSkills = [...prev.skills];
      const currentIdx = levels.indexOf(newSkills[index].proficiency);
      newSkills[index].proficiency = levels[(currentIdx + 1) % levels.length];
      return { ...prev, skills: newSkills };
    });
  };

  const addCertification = () => {
    if (!newCert.name) return;
    setLocalProfile(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
    setNewCert({ name: '', url: '' });
    setShowAddCert(false);
  };

  const saveChanges = () => {
    setProfile(localProfile);
    alert("Profile saved successfully!");
  };

  const getPlatformIcon = (url?: string) => {
    if (!url) return <Star size={18} className="text-amber-500" />;
    const u = url.toLowerCase();
    if (u.includes('coursera')) return <div className="text-blue-600 font-bold text-xs">C</div>;
    if (u.includes('udemy')) return <div className="text-purple-600 font-bold text-xs">U</div>;
    if (u.includes('freecodecamp')) return <div className="text-green-800 font-bold text-xs">fcc</div>;
    if (u.includes('linkedin')) return <div className="text-blue-800 font-bold text-xs">in</div>;
    if (u.includes('geeksforgeeks')) return <div className="text-green-600 font-bold text-xs">GFG</div>;
    return <Globe size={18} className="text-slate-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Professional Profile</h2>
        <button 
          onClick={saveChanges}
          className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm flex items-center gap-2"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center relative">
            <div className="relative inline-block mb-4">
              <div 
                onClick={triggerFileInput}
                className="w-32 h-32 bg-slate-100 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-slate-400 border-4 border-white shadow-sm overflow-hidden cursor-pointer group"
              >
                {localProfile.profilePicture ? (
                  <img src={localProfile.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  localProfile.name.split(' ').map(n => n[0]).join('')
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera className="text-white" size={24} />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>

            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 text-left">Full Name</label>
                  <input 
                    name="name"
                    value={localProfile.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 text-left">Target Domain</label>
                  <input 
                    name="preferredDomains"
                    value={localProfile.preferredDomains[0]}
                    onChange={(e) => setLocalProfile({...localProfile, preferredDomains: [e.target.value]})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
               </div>
            </div>
            
            <div className="space-y-3 text-left mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" />
                <input 
                  name="email"
                  value={localProfile.email}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm"
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={16} className="text-slate-400" />
                <input 
                  name="phone"
                  value={localProfile.phone}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm"
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <BookOpen size={16} className="text-slate-400" />
                <input 
                  name="education"
                  value={localProfile.education}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <LinkIcon size={18} className="text-blue-600" />
              Social Links
            </h4>
            <div className="space-y-4">
              <div className="group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">LinkedIn</label>
                <input 
                  name="linkedin"
                  value={localProfile.links.linkedin}
                  onChange={handleLinkChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="linkedin.com/in/..."
                />
              </div>
              <div className="group">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">GitHub</label>
                <input 
                  name="github"
                  value={localProfile.links.github}
                  onChange={handleLinkChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="github.com/..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Star size={20} className="text-amber-500" />
              Skills & Expertise
            </h3>
            
            <div className="mb-8">
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill (e.g. Docker)" 
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {localProfile.skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm group hover:border-blue-300 transition-all">
                    <span className="font-medium text-slate-700">{skill.name}</span>
                    <button 
                      onClick={() => toggleSkillProficiency(i)}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase transition-colors ${
                        skill.proficiency === 'Advanced' ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' :
                        skill.proficiency === 'Intermediate' ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {skill.proficiency}
                    </button>
                    <button onClick={() => removeSkill(i)} className="text-slate-400 hover:text-red-500 ml-1 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-600" />
              Certifications
            </h3>
            <div className="space-y-4">
              {localProfile.certifications.map((cert, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl group transition-all hover:border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg border border-slate-100 flex items-center justify-center">
                      {getPlatformIcon(cert.url)}
                    </div>
                    <div>
                      <span className="font-medium text-slate-800 block leading-none">{cert.name}</span>
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-1">
                          Verify Credentials <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                       const newCerts = localProfile.certifications.filter((_, idx) => idx !== i);
                       setLocalProfile({...localProfile, certifications: newCerts});
                    }}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              {showAddCert ? (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-fadeIn">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Certification Name</label>
                    <input 
                      type="text"
                      value={newCert.name}
                      onChange={(e) => setNewCert({...newCert, name: e.target.value})}
                      placeholder="e.g. AWS Certified Solutions Architect"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Source URL (Coursera, Udemy, etc.)</label>
                    <input 
                      type="text"
                      value={newCert.url}
                      onChange={(e) => setNewCert({...newCert, url: e.target.value})}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={addCertification}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
                    >
                      Add Certificate
                    </button>
                    <button 
                      onClick={() => setShowAddCert(false)}
                      className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-300 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAddCert(true)}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Add Certification
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
