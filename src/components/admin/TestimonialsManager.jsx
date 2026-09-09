import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';
import {
  CheckCircle, XCircle, Star, Play, Pause, ExternalLink,
  Image, Mic, TrendingUp, Users, Building, Briefcase,
  Loader2, MessageSquare, Flag, CheckSquare
} from 'lucide-react';

export default function TestimonialsManager() {
  const { isDark } = useTheme();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [playingAudio, setPlayingAudio] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadTestimonials();
  }, [filter]);

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', filter)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ 
          status: 'approved', 
          approved_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;
      loadTestimonials();
    } catch (err) {
      console.error('Error approving testimonial:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;
      loadTestimonials();
    } catch (err) {
      console.error('Error rejecting testimonial:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFeature = async (id, currentFeatured) => {
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_featured: !currentFeatured })
        .eq('id', id);

      if (error) throw error;
      loadTestimonials();
    } catch (err) {
      console.error('Error featuring testimonial:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadTestimonials();
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleAudio = (url) => {
    if (playingAudio?.url === url) {
      playingAudio.audio.pause();
      setPlayingAudio(null);
    } else {
      if (playingAudio) playingAudio.audio.pause();
      const audio = new Audio(url);
      audio.play();
      setPlayingAudio({ url, audio });
      audio.onended = () => setPlayingAudio(null);
    }
  };

  const calculateGrowth = (before, after) => {
    if (!before || !after) return null;
    return (((after - before) / before) * 100).toFixed(1);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: isDark
        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        : 'bg-yellow-100 text-yellow-700 border-yellow-300',
      approved: isDark
        ? 'bg-green-500/20 text-green-400 border-green-500/30'
        : 'bg-green-100 text-green-700 border-green-300',
      rejected: isDark
        ? 'bg-red-500/20 text-red-400 border-red-500/30'
        : 'bg-red-100 text-red-700 border-red-300'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const bg = isDark ? 'bg-gray-800' : 'bg-white';
  const bgSub = isDark ? 'bg-gray-700/50' : 'bg-gray-50';
  const border = isDark ? 'border-gray-700' : 'border-gray-200';
  const text = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`${bg} border ${border} rounded-lg p-4 text-center`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {testimonials.filter(t => t.status === 'pending').length}
          </div>
          <div className={`text-sm ${textMuted}`}>Pending</div>
        </div>
        <div className={`${bg} border ${border} rounded-lg p-4 text-center`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            {testimonials.filter(t => t.status === 'approved').length}
          </div>
          <div className={`text-sm ${textMuted}`}>Approved</div>
        </div>
        <div className={`${bg} border ${border} rounded-lg p-4 text-center`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
            {testimonials.filter(t => t.is_featured).length}
          </div>
          <div className={`text-sm ${textMuted}`}>Featured</div>
        </div>
        <div className={`${bg} border ${border} rounded-lg p-4 text-center`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-yellow-600'}`}>
            {testimonials.reduce((acc, t) => acc + (t.rating || 5), 0) / (testimonials.length || 1).toFixed(1)}
          </div>
          <div className={`text-sm ${textMuted}`}>Avg Rating</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['pending', 'approved', 'rejected', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize transition ${
              filter === status
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : `${bgSub} ${textMuted} ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className={`${bg} rounded-xl border ${
              testimonial.is_featured ? 'border-amber-500/50' : border
            } overflow-hidden`}
          >
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
                    {testimonial.client_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${text}`}>{testimonial.client_name}</h3>
                    <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
                      <Building className="w-4 h-4" />
                      {testimonial.client_company || 'No company'}
                      {testimonial.client_position && ` - ${testimonial.client_position}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(testimonial.status)}
                  {testimonial.is_featured && (
                    <span className={`px-3 py-1 rounded-full text-sm border ${
                      isDark
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-amber-100 text-amber-700 border-amber-300'
                    }`}>
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className={`${bgSub} rounded-lg p-4`}>
                <div className={`flex items-center gap-2 font-medium mb-2 ${isDark ? 'text-blue-400' : 'text-yellow-600'}`}>
                  <Briefcase className="w-4 h-4" />
                  {testimonial.project_title}
                </div>
                <p className={`text-sm ${textSub}`}>{testimonial.project_description}</p>
                <div className="flex gap-4 mt-3 text-sm">
                  {testimonial.project_link && (
                    <a
                      href={testimonial.project_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1 ${isDark ? 'text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300' : 'text-yellow-600 hover:text-blue-700'}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Site
                    </a>
                  )}
                  {testimonial.demo_link && (
                    <a
                      href={testimonial.demo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1 ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </a>
                  )}
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="flex items-start gap-2">
                <MessageSquare className={`w-5 h-5 mt-1 ${textMuted}`} />
                <p className={`${textSub} flex-1`}>{testimonial.testimonial_text}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < (testimonial.rating || 5)
                        ? 'text-amber-400 fill-amber-400'
                        : isDark ? 'text-gray-600' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Screenshots */}
              {testimonial.project_screenshots?.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {testimonial.project_screenshots.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTestimonial(testimonial)}
                      className="flex-shrink-0 relative w-32 h-24 rounded-lg overflow-hidden"
                    >
                      <img
                        src={url}
                        alt={`Screenshot ${idx + 1}`}
                        loading="lazy" className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Voice Messages */}
              <div className="flex gap-2">
                {testimonial.voice_message_en && (
                  <button
                    onClick={() => toggleAudio(testimonial.voice_message_en)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      playingAudio?.url === testimonial.voice_message_en
                        ? isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                        : isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {playingAudio?.url === testimonial.voice_message_en ? (
                      <><Pause className="w-4 h-4" /> Stop EN</>
                    ) : (
                      <><Play className="w-4 h-4" /> Play EN</>
                    )}
                  </button>
                )}
                {testimonial.voice_message_rw && (
                  <button
                    onClick={() => toggleAudio(testimonial.voice_message_rw)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      playingAudio?.url === testimonial.voice_message_rw
                        ? isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                        : isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {playingAudio?.url === testimonial.voice_message_rw ? (
                      <><Pause className="w-4 h-4" /> Stop RW</>
                    ) : (
                      <><Play className="w-4 h-4" /> Play RW</>
                    )}
                  </button>
                )}
              </div>

              {/* Business Impact */}
              {(testimonial.clients_before || testimonial.revenue_before) && (
                <div className={`grid grid-cols-2 gap-4 ${bgSub} rounded-lg p-4`}>
                  {testimonial.clients_before && (
                    <div className="flex items-center gap-2">
                      <Users className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`text-sm ${textSub}`}>Clients:</span>
                      <span className={`font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        +{calculateGrowth(testimonial.clients_before, testimonial.clients_after)}%
                      </span>
                    </div>
                  )}
                  {testimonial.revenue_before && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`text-sm ${textSub}`}>Revenue:</span>
                      <span className={`font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        +{calculateGrowth(testimonial.revenue_before, testimonial.revenue_after)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className={`flex items-center gap-2 pt-4 border-t ${border}`}>
                {testimonial.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(testimonial.id)}
                      disabled={actionLoading === testimonial.id}
                      className={`flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition ${
                        isDark ? 'disabled:bg-gray-700' : 'disabled:bg-gray-300'
                      } disabled:cursor-not-allowed`}
                    >
                      {actionLoading === testimonial.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(testimonial.id)}
                      disabled={actionLoading === testimonial.id}
                      className={`flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition ${
                        isDark ? 'disabled:bg-gray-700' : 'disabled:bg-gray-300'
                      } disabled:cursor-not-allowed`}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                
                {testimonial.status === 'approved' && (
                  <button
                    onClick={() => handleFeature(testimonial.id, testimonial.is_featured)}
                    disabled={actionLoading === testimonial.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      testimonial.is_featured
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : isDark
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                    {testimonial.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                )}

                <button
                  onClick={() => handleDelete(testimonial.id)}
                  disabled={actionLoading === testimonial.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ml-auto ${
                    isDark
                      ? 'bg-gray-900/50 hover:bg-red-900/50 text-red-400'
                      : 'bg-gray-100 hover:bg-red-100 text-red-600'
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className={`text-center py-12 ${textMuted}`}>
          <CheckSquare className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <p>No {filter} testimonials found.</p>
        </div>
      )}

      {/* Image Modal */}
      {selectedTestimonial && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTestimonial(null)}
        >
          <div className="max-w-4xl max-h-[90vh]">
            <img
              src={selectedTestimonial.project_screenshot}
              alt={selectedTestimonial.project_title}
              loading="lazy" className="max-w-full max-h-[85vh] rounded-lg"
            />
            <p className="text-center mt-4 text-gray-200">
              {selectedTestimonial.project_title} - {selectedTestimonial.client_name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
