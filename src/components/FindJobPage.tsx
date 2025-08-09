import React from 'react';
import { Briefcase, ExternalLink, ArrowLeft } from 'lucide-react';

interface FindJobPageProps {
  onBack: () => void;
}

const FindJobPage: React.FC<FindJobPageProps> = ({ onBack }) => {
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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 px-6 py-8 md:px-16 md:py-16">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors duration-200"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Trip Planner</span>
      </button>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl inline-block mb-6">
          <Briefcase className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Since you're planning a vacation longer than 30 days, maybe it's time to explore new career opportunities that offer better work-life balance!
        </p>
      </div>

      {/* Job Sites Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobSites.map((site, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{site.name}</h3>
              <ExternalLink className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6">{site.description}</p>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full bg-gradient-to-r ${site.color} text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2`}
            >
              <span>Browse Jobs</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>

      {/* Fun Message */}
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">💡 Pro Tip</h3>
          <p className="text-yellow-700">
            Many remote jobs offer unlimited PTO or flexible schedules. You might find a career that actually supports those long vacation dreams!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FindJobPage;