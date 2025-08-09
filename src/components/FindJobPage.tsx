import React from 'react';
import { Briefcase, ExternalLink, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';
import PageTransition from './PageTransition';

interface FindJobPageProps {
  onBack: () => void;
}

const FindJobPage: React.FC<FindJobPageProps> = ({ onBack }) => {
  const { reducedMotion } = useTheme();

  const jobSites = [
    {
      name: 'Indeed',
      url: 'https://www.indeed.com/jobs?q=remote&l=',
      description: 'Find remote jobs and career opportunities',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'LinkedIn Jobs',
      url: 'https://www.linkedin.com/jobs/search/?keywords=remote&location=Worldwide',
      description: 'Professional network job search',
      color: 'from-blue-600 to-blue-700'
    },
    {
      name: 'Remote.co',
      url: 'https://remote.co/remote-jobs/',
      description: 'Exclusively remote job opportunities',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'FlexJobs',
      url: 'https://www.flexjobs.com/',
      description: 'Flexible and remote job listings',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'AngelList',
      url: 'https://angel.co/jobs',
      description: 'Startup and tech company positions',
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'We Work Remotely',
      url: 'https://weworkremotely.com/',
      description: 'Large remote work community',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  return (
    <PageTransition className="min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 bg-noise" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="flex items-center space-x-2 text-white/60 hover:text-white mb-8 transition-colors duration-200 glass backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-white/30"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Trip Planner</span>
        </motion.button>

        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <motion.div 
            className="inline-flex items-center justify-center mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 rounded-3xl shadow-glow-primary animate-pulse-glow">
              <Briefcase className="h-12 w-12 text-dark-900" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white text-glow mb-6">
            Find Your Dream Job
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Since you're planning a vacation longer than 30 days, maybe it's time to explore new career opportunities that offer better work-life balance!
          </p>
          
          <motion.div 
            className="mt-8 p-6 glass backdrop-blur-md rounded-2xl border border-primary-400/30 bg-primary-500/10 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          >
            <p className="text-white/90 leading-relaxed">
              <span className="text-primary-400 font-semibold">💡 Pro Tip:</span> Many remote jobs offer unlimited PTO or flexible schedules. You might find a career that actually supports those long vacation dreams!
            </p>
          </motion.div>
        </motion.div>

        {/* Job Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {jobSites.map((site, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
            >
              <GlassCard className="p-6 h-full flex flex-col" hover={true} glow="primary">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-display font-bold text-white">{site.name}</h3>
                  <ExternalLink className="h-5 w-5 text-white/60" />
                </div>
                
                <p className="text-white/70 mb-6 flex-grow leading-relaxed">
                  {site.description}
                </p>
                
                <motion.a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full bg-gradient-to-r ${site.color} text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Browse Jobs</span>
                  <ExternalLink className="h-4 w-4" />
                </motion.a>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* AI Resume/Interview Coach Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
        >
          <GlassCard className="p-8 text-center" glow="secondary">
            <motion.div 
              className="inline-flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-gradient-to-r from-secondary-500 to-primary-500 p-4 rounded-2xl shadow-glow-secondary">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Briefcase className="h-8 w-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-display font-bold text-white text-glow mb-4">
              AI Resume & Interview Coach
            </h2>
            
            <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
              Get personalized help with your resume, cover letters, and interview preparation using our AI-powered career coaching tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton
                variant="secondary"
                size="lg"
                onClick={() => alert('AI Resume Coach coming soon!')}
                className="shadow-glow-secondary"
              >
                AI Resume Builder
              </GlassButton>
              
              <GlassButton
                variant="primary"
                size="lg"
                onClick={() => alert('AI Interview Coach coming soon!')}
                className="shadow-glow-primary"
              >
                Interview Practice
              </GlassButton>
            </div>
            
            <motion.p 
              className="mt-4 text-sm text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2, ease: 'easeOut' }}
            >
              Coming soon - AI-powered career coaching tailored to your goals
            </motion.p>
          </GlassCard>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1, ease: 'easeOut' }}
        >
          <GlassCard className="p-6 max-w-2xl mx-auto" glow="none">
            <blockquote className="text-white/90 text-lg italic leading-relaxed">
              "The best time to plant a tree was 20 years ago. The second best time is now."
            </blockquote>
            <p className="text-white/60 mt-3 font-medium">
              - Chinese Proverb
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default FindJobPage;