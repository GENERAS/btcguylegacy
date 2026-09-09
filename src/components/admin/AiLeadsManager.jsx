import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';
import { 
  MessageSquare, Mail, Phone, MapPin, Building, 
  Search, Filter, RefreshCw, ExternalLink, Tag,
  Clock, Globe, Briefcase, DollarSign, Trash2
} from 'lucide-react';

const AiLeadsManager = () => {
  const { isDark } = useTheme();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const bg = isDark ? 'bg-gray-800' : 'bg-white'
  const bgSub = isDark ? 'bg-gray-700/50' : 'bg-gray-50'
  const border = isDark ? 'border-gray-700' : 'border-gray-200'
  const text = isDark ? 'text-white' : 'text-gray-900'
  const textSub = isDark ? 'text-gray-300' : 'text-gray-600'
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500'
  const inputBg = isDark ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  const focusRing = 'focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500'
  const pageBg = isDark ? 'bg-gray-900' : 'bg-gray-50'
  const pillInactive = isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  const btnGhost = isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  const btnOutline = isDark ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-800 hover:bg-gray-50'
  const linkAccent = isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'
  const dangerLink = isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
  const successLink = isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
  const optCls = isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching AI leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadLabel = async (id, label) => {
    try {
      const { error } = await supabase
        .from('ai_leads')
        .update({ lead_label: label })
        .eq('id', id);

      if (error) throw error;
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      const { error } = await supabase
        .from('ai_leads')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setSelectedLead(null);
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const getLabelColor = (label) => {
    switch (label) {
      case 'hot': return isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800';
      case 'warm': return isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      case 'cold': return isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 'new': return isDark ? 'bg-gray-500/30 text-gray-300' : 'bg-gray-100 text-gray-800';
      default: return isDark ? 'bg-gray-500/30 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (filter !== 'all' && lead.lead_label !== filter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        lead.name?.toLowerCase().includes(term) ||
        lead.email?.toLowerCase().includes(term) ||
        lead.phone?.includes(term) ||
        lead.whatsapp?.includes(term) ||
        lead.company?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.lead_label === 'new').length,
    hot: leads.filter(l => l.lead_label === 'hot').length,
    warm: leads.filter(l => l.lead_label === 'warm').length,
    cold: leads.filter(l => l.lead_label === 'cold').length,
  };

  return (
    <div className={`p-6 min-h-screen ${pageBg}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${text}`}>AI Assistant Leads</h1>
        <p className={`${textSub} mt-1`}>Leads captured by the AI chatbot and website audit form</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className={`${bg} rounded-xl shadow-sm p-4 border ${border} border-l-4 border-l-gray-500`}>
          <p className={`${textMuted} text-sm`}>Total Leads</p>
          <p className={`text-2xl font-bold ${text}`}>{stats.total}</p>
        </div>
        <div className={`${bg} rounded-xl shadow-sm p-4 border ${border} border-l-4 border-l-gray-400`}>
          <p className={`${textMuted} text-sm`}>New</p>
          <p className={`text-2xl font-bold ${text}`}>{stats.new}</p>
        </div>
        <div className={`${bg} rounded-xl shadow-sm p-4 border ${border} border-l-4 border-l-red-500`}>
          <p className={`${textMuted} text-sm`}>Hot</p>
          <p className={`text-2xl font-bold ${text}`}>{stats.hot}</p>
        </div>
        <div className={`${bg} rounded-xl shadow-sm p-4 border ${border} border-l-4 border-l-yellow-500`}>
          <p className={`${textMuted} text-sm`}>Warm</p>
          <p className={`text-2xl font-bold ${text}`}>{stats.warm}</p>
        </div>
        <div className={`${bg} rounded-xl shadow-sm p-4 border ${border} border-l-4 border-l-blue-500`}>
          <p className={`${textMuted} text-sm`}>Cold</p>
          <p className={`text-2xl font-bold ${text}`}>{stats.cold}</p>
        </div>
      </div>

      <div className={`${bg} rounded-xl shadow-sm p-4 mb-6 border ${border}`}>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search by name, email, phone, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 border rounded-lg outline-none transition-colors ${inputBg} ${focusRing}`}
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['all', 'new', 'hot', 'warm', 'cold'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  filter === f ? 'bg-yellow-600 text-white hover:bg-yellow-700' : pillInactive
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={fetchLeads}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${btnGhost}`}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className={`${bg} rounded-xl shadow-sm p-12 text-center border ${border}`}>
          <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={textMuted}>No leads found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className={`${bg} rounded-xl shadow-sm hover:shadow-md transition-shadow border ${border}`}>
              <div className="p-5">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className={`font-semibold text-lg ${text}`}>{lead.name || 'Anonymous'}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLabelColor(lead.lead_label)}`}>
                        {lead.lead_label || 'new'}
                      </span>
                      {lead.source && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800'}`}>
                          {lead.source}
                        </span>
                      )}
                    </div>
                    <div className={`flex flex-wrap gap-4 text-sm ${textSub}`}>
                      {lead.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </div>
                      )}
                      {lead.whatsapp && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          WhatsApp: {lead.whatsapp}
                        </div>
                      )}
                      {lead.company && (
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {lead.company}
                        </div>
                      )}
                      {lead.industry && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {lead.industry}
                        </div>
                      )}
                      {lead.website_url && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <a href={lead.website_url} target="_blank" rel="noopener noreferrer" className={linkAccent}>
                            {lead.website_url.replace(/^https?:\/\//, '').substring(0, 30)}...
                          </a>
                        </div>
                      )}
                      {lead.budget_range && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {lead.budget_range}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <select
                      value={lead.lead_label || 'new'}
                      onChange={(e) => updateLeadLabel(lead.id, e.target.value)}
                      className={`px-3 py-2 border rounded-lg text-sm outline-none transition-colors cursor-pointer ${inputBg} ${focusRing}`}
                    >
                      <option value="new" className={optCls}>New</option>
                      <option value="hot" className={optCls}>Hot</option>
                      <option value="warm" className={optCls}>Warm</option>
                      <option value="cold" className={optCls}>Cold</option>
                    </select>
                    <button
                      onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${btnOutline}`}
                    >
                      {selectedLead?.id === lead.id ? 'Hide' : 'View'}
                    </button>
                  </div>
                </div>

                {selectedLead?.id === lead.id && (
                  <div className={`mt-4 pt-4 border-t ${border}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className={`font-semibold mb-2 ${text}`}>Lead Details</h4>
                        <div className="space-y-2 text-sm">
                          {lead.project_type && <p className={text}><span className={`${textSub} font-medium`}>Project Type:</span> {lead.project_type}</p>}
                          {lead.user_type && <p className={text}><span className={`${textSub} font-medium`}>User Type:</span> {lead.user_type}</p>}
                          {lead.location && <p className={text}><span className={`${textSub} font-medium`}>Location:</span> {lead.location}</p>}
                          {lead.message && <p className={text}><span className={`${textSub} font-medium`}>Message:</span> {lead.message}</p>}
                          {lead.project_brief && <p className={text}><span className={`${textSub} font-medium`}>Project Brief:</span> {lead.project_brief}</p>}
                        </div>
                      </div>
                      <div>
                        {lead.chat_transcript && (
                          <div>
                            <h4 className={`font-semibold mb-2 ${text}`}>Chat Transcript</h4>
                            <div className={`${bgSub} rounded-lg p-3 text-sm max-h-48 overflow-y-auto ${text}`}>
                              {lead.chat_transcript}
                            </div>
                          </div>
                        )}
                        {lead.discovery_answers && (
                          <div className="mt-4">
                            <h4 className={`font-semibold mb-2 ${text}`}>Discovery Answers</h4>
                            <div className={`${bgSub} rounded-lg p-3 text-sm ${text}`}>
                              {typeof lead.discovery_answers === 'object'
                                ? JSON.stringify(lead.discovery_answers, null, 2)
                                : lead.discovery_answers}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className={`${linkAccent} text-sm`}>Send Email</a>
                      )}
                      {lead.whatsapp && (
                        <a href={`https://wa.me/${lead.whatsapp}`} target="_blank" rel="noopener noreferrer" className={`${successLink} text-sm flex items-center gap-1`}>
                          WhatsApp <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button onClick={() => deleteLead(lead.id)} className={`${dangerLink} text-sm flex items-center gap-1 ml-auto`}>
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiLeadsManager;
