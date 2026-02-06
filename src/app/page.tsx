'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  
  const navigationCards = [
    {
      title: 'Learning Journey',
      description: 'Explore the skill tree and start your AI learning path',
      icon: '🎯',
      href: '/learning-journey',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Admin Panel',
      description: 'Manage content, feedback, and publishing',
      icon: '⚙️',
      href: '/admin',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Learning Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Interactive AI education platform
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {navigationCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative p-8">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-3xl shadow-lg`}>
                    {card.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {card.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {card.description}
                    </p>
                  </div>
                  
                  <svg 
                    className="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Info */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Getting Started
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Choose <strong>Learning Journey</strong> to explore AI concepts through an interactive skill tree, 
                  or access the <strong>Admin Panel</strong> to manage learning content, view feedback, and publish materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
