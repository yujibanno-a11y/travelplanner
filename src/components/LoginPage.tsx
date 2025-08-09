import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react';
import { signIn } from '../lib/auth';

interface LoginPageProps {
  onBack: () => void;
  onLogin: () => void;
  onNavigateToSignup: () => void;
  onNavigateToResetPassword: () => void;
  onNavigateToResetPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLogin, onNavigateToSignup, onNavigateToResetPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setAuthError('');
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { email });
      await signIn(email, password);
      console.log('Login successful');
      setIsLoading(false);
      onLogin();
    } catch (error: any) {
      console.error('Login failed:', error);
      setIsLoading(false);
      
      // More detailed error handling
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setAuthError(errorMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 px-6 py-8 md:px-16 md:py-16">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-white/60 hover:text-white mb-8 transition-colors duration-200 glass backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-white/30"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Home</span>
      </button>

      {/* Login Card */}
      <div className="max-w-md mx-auto">
        <div className="glass backdrop-blur-md rounded-xl shadow-lg p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-white/70">Sign in to your TravelPlanner account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white/80 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className={`w-full pl-10 pr-4 py-3 glass backdrop-blur-md border rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50 bg-white/5 text-white placeholder-white/60 transition-all duration-300 ${
                    errors.email ? 'border-red-400/50 bg-red-500/10' : 'border-white/20'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  aria-label="Password"
                  className={`w-full pl-10 pr-12 py-3 glass backdrop-blur-md border rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50 bg-white/5 text-white placeholder-white/60 transition-all duration-300 ${
                    errors.password ? 'border-red-400/50 bg-red-500/10' : 'border-white/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-white/60 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <button
                type="button"
                onClick={onNavigateToResetPassword}
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors duration-200"
                style={{ cursor: 'pointer' }}
                aria-label="Forgot password – reset it"
              >
                Forgot password?
              </button>
            </div>

            {/* Auth Error */}
            {authError && (
              <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl backdrop-blur-md">
                <p className="text-red-400 text-sm">{authError}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-dark-900 py-3 px-6 rounded-xl font-semibold hover:from-primary-400 hover:to-secondary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-glow-primary"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark-900"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 glass backdrop-blur-md text-white/60">or</span>
              </div>
            </div>
          </div>

          {/* Sign Up Prompt */}
          <div className="text-center">
            <p className="text-sm text-white/70">
              Don't have an account yet?{' '}
              <button
                onClick={onNavigateToSignup}
                className="font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-200"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;