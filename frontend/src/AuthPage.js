import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, UserPlus, Lock, Mail, User } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    const { email, password, name } = formData;

    if (!isLogin && !name) {
      setError('Name is required');
      return false;
    }

    if (!email) {
      setError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');

    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <Scale className="h-12 w-12 text-blue-800 mx-auto" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">Legal Firm</h1>
          <p className="mt-2 text-gray-600">Legal Excellence, Digital Efficiency</p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600 mt-2">
                {isLogin ? 'Access your legal dashboard' : 'Join our network of legal professionals'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {isLogin && (
                <div className="text-right">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#1B263B] text-white py-3 rounded-lg hover:bg-[#0D1B2A] transition-colors font-medium flex items-center justify-center gap-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  'Processing...'
                ) : isLogin ? (
                  <>
                    <Lock className="h-5 w-5" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Create Account
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="border-t border-gray-200 p-6">
            <p className="text-center text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ name: '', email: '', password: '' });
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;