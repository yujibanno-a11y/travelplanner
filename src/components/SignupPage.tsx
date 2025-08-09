import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { signUp } from '../lib/auth';

interface SignupPageProps {
  onBack: () => void;
  onSignup: () => void;
  onNavigateToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onBack, onSignup, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      console.log('Starting signup process...');
      await signUp(formData.email, formData.password, formData.name);
      console.log('Signup completed successfully');
      setIsLoading(false);
      onSignup();
    } catch (error: any) {
      console.error('Signup failed:', error);
      setIsLoading(false);
      
      // More detailed error handling
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle specific Supabase errors
      if (error.message?.includes('Invalid API key')) {
        errorMessage = 'Configuration error: Invalid API key. Please check your Supabase settings.';
      } else if (error.message?.includes('For security purposes, you can only request this after')) {
        errorMessage = 'Too many signup attempts from this device. Please wait a minute and try again.';
      } else if (error.message?.includes('over_email_send_rate_limit')) {
        errorMessage = 'Too many signup attempts from this device. Please wait a minute and try again.';
      } else if (error.message?.includes('signup is disabled')) {
        errorMessage = 'User registration is currently disabled. Please contact support.';
      } else if (error.message?.includes('email')) {
        errorMessage = 'Email-related error. Please check your email address or try again later.';
      }
      
      setAuthError(errorMessage);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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

      {/* Signup Card */}
      <div className="max-w-md mx-auto">
        <div className="glass backdrop-blur-md rounded-xl shadow-lg p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-white/70">Start planning your perfect trips</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-white/80 mb-2">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  aria-label="Full name"
                  className={`w-full pl-10 pr-4 py-3 glass backdrop-blur-md border rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50 bg-white/5 text-white placeholder-white/60 transition-all duration-300 ${
                    errors.name ? 'border-red-400/50 bg-red-500/10' : 'border-white/20'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name}</p>
              )}
            </div>

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
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white/80 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  aria-label="Confirm password"
                  className={`w-full pl-10 pr-12 py-3 glass backdrop-blur-md border rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50 bg-white/5 text-white placeholder-white/60 transition-all duration-300 ${
                    errors.confirmPassword ? 'border-red-400/50 bg-red-500/10' : 'border-white/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-white/60 hover:text-white transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Auth Error */}
            {authError && (
              <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl backdrop-blur-md">
                <p className="text-red-400 text-sm">{authError}</p>
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-dark-900 py-3 px-6 rounded-xl font-semibold hover:from-primary-400 hover:to-secondary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-glow-primary"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark-900"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
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

          {/* Login Prompt */}
          <div className="text-center">
            <p className="text-sm text-white/70">
              Already have an account?{' '}
              <button
                onClick={onNavigateToLogin}
                className="font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-200"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;