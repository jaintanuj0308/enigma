import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, LogIn, LogOut, UserPlus, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_BASE = '/api/auth';

export default function SettingsPanel({ token, setToken, user, setUser }) {
  const [activeTab, setActiveTab] = useState('login'); // login | register
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const isLogin = activeTab === 'login';
    const endpoint = isLogin ? '/login' : '/register';

    try {
      const response = await axios.post(`${API_BASE}${endpoint}`, formData);
      const { token: newToken, user: newUser } = response.data;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      
      setSuccess(`Successfully ${isLogin ? 'logged in' : 'registered'}!`);
      setFormData({ username: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Optional: Inform backend to invalidate token
      if (token) {
        await axios.post(`${API_BASE}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setSuccess('Logged out successfully');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-10 w-full animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Settings & Account</h2>
        <p className="text-slate-500 mt-2">Manage your authentication and preferences.</p>
      </div>

      {user ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{user.username}</h3>
              <p className="text-sm text-slate-500 font-medium tracking-wide">AUTHENTICATED USER</p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
            <h4 className="text-sm font-semibold text-slate-800 mb-2">Account Capabilities</h4>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Create new startup ideas</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Edit your own ideas</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Delete your own ideas</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> View archived (expired) ideas created by you</li>
            </ul>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl font-semibold transition-colors border border-red-100"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md mx-auto">
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => { setActiveTab('login'); setError(null); setSuccess(null); }}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LogIn size={18} /> Login
            </button>
            <button 
              onClick={() => { setActiveTab('register'); setError(null); setSuccess(null); }}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'register' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <UserPlus size={18} /> Register
            </button>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">{activeTab === 'login' ? 'Welcome Back' : 'Create Account'}</h3>
              <p className="text-sm text-slate-500 mt-1">
                {activeTab === 'login' ? 'Enter your credentials to access your account.' : 'Sign up to create and manage startup ideas.'}
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm mb-6 border border-emerald-100">
                <CheckCircle2 size={16} />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter password"
                    minLength={4}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm shadow-blue-600/20 transition-all flex justify-center mt-2 disabled:opacity-70"
              >
                {loading ? 'Processing...' : activeTab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
