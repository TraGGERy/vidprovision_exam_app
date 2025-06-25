'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from './components/Navigation';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  imageUrl: string;
  slug: string;
  category: string;
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  // Sample blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Essential Road Signs Every Driver Should Know',
      excerpt: 'Understanding road signs is crucial for safe driving. Learn about the most important signs you\'ll encounter on Zimbabwe roads.',
      date: '2024-05-15',
      author: 'Captain Roadwise',
      imageUrl: '/image_p1_q1.png',
      slug: 'essential-road-signs',
      category: 'road-signs'
    },
    {
      id: '2',
      title: 'Defensive Driving Techniques for New Drivers',
      excerpt: 'Learn how to anticipate hazards and drive defensively to prevent accidents before they happen.',
      date: '2024-05-10',
      author: 'Safety Sally',
      imageUrl: '/image_p2_q1.png',
      slug: 'defensive-driving-techniques',
      category: 'safety'
    },
    {
      id: '3',
      title: 'Understanding Right of Way Rules at Intersections',
      excerpt: 'Confused about who goes first at intersections? This comprehensive guide explains all the rules you need to know.',
      date: '2024-05-05',
      author: 'Professor Drive',
      imageUrl: '/image_p5_q1.png',
      slug: 'right-of-way-rules',
      category: 'rules'
    },
    {
      id: '4',
      title: 'How to Parallel Park Like a Pro',
      excerpt: 'Master the art of parallel parking with these step-by-step instructions and helpful tips.',
      date: '2024-04-28',
      author: 'Mechanic Mike',
      imageUrl: '/image_p7_q2.png',
      slug: 'parallel-parking-guide',
      category: 'techniques'
    },
    {
      id: '5',
      title: 'Common Mistakes to Avoid During Your Driving Test',
      excerpt: 'Don\'t let these common errors cost you your license. Learn what examiners look for and how to avoid critical mistakes.',
      date: '2024-04-20',
      author: 'Captain Roadwise',
      imageUrl: '/image_p10_q2.png',
      slug: 'driving-test-mistakes',
      category: 'test-prep'
    },
    {
    id: '6',
    title: 'Night Driving Safety Tips',
    excerpt: 'Driving after dark presents unique challenges. Learn essential techniques for safe night driving on Zimbabwe roads.',
    date: '2024-04-15',
    author: 'Safety Sally',
    imageUrl: '/image_p3_q2.png',
    slug: 'night-driving-safety',
    category: 'safety'
  },
    {
      id: '7',
      title: 'Understanding Your Vehicle\'s Dashboard Warning Lights',
      excerpt: 'Those mysterious symbols on your dashboard are trying to tell you something important. Learn what each warning light means.',
      date: '2024-04-10',
      author: 'Mechanic Mike',
      imageUrl: '/image_p4_q1.png',
      slug: 'dashboard-warning-lights',
      category: 'maintenance'
    },
    {
      id: '8',
      title: 'How to Drive Safely in Heavy Rain',
      excerpt: 'Zimbabwe\'s rainy season can create hazardous driving conditions. These tips will help you navigate safely when the downpours begin.',
      date: '2024-04-05',
      author: 'Captain Roadwise',
      imageUrl: '/image_p6_q1.png',
      slug: 'driving-in-rain',
      category: 'safety'
    },
    {
      id: '9',
      title: 'Essential Car Maintenance Tips for New Drivers',
      excerpt: 'Regular maintenance extends your vehicle\'s life and prevents breakdowns. Learn the basics every driver should know.',
      date: '2024-03-28',
      author: 'Mechanic Mike',
      imageUrl: '/image_p8_q1.png',
      slug: 'car-maintenance-basics',
      category: 'maintenance'
    },
  ];

  // Categories derived from blog posts
  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  // Filter posts based on search term and category
  useEffect(() => {
    const filtered = blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory]);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation />
       <div className="container mx-auto pt-16 pb-10 sm:py-24 px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <div className="flex justify-center mb-3">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-tight">Driving Knowledge Blog</h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
            Expert advice, tips, and insights to help you become a safer and more confident driver
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full p-3 pl-10 text-sm sm:text-base bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          <div className="w-full sm:w-auto">
            <select
              className="w-full p-3 text-sm sm:text-base bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-gray-700">
                <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image 
                      src={post.imageUrl} 
                      alt={post.title} 
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-all duration-700 hover:scale-110 filter hover:brightness-110"
                    />
                  </div>
                  <div className="absolute top-0 right-0 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 m-2 rounded-md shadow-md z-10">
                    {post.category.replace('-', ' ')}
                  </div>
                </div>
                
                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-center text-gray-400 text-xs sm:text-sm mb-2">
                    <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>{formatDate(post.date)}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      {post.author}
                    </span>
                  </div>
                  
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 line-clamp-2 hover:text-blue-400 transition-colors">{post.title}</h2>
                  
                  <p className="text-sm sm:text-base text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <Link href={`/blog/${post.slug}`} prefetch={true} className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 sm:py-16 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-lg">
            <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 opacity-75">🔍</div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">No articles found</h3>
            <p className="text-sm sm:text-base text-gray-400 max-w-md mx-auto">Try adjusting your search or filter criteria to find what you&apos;re looking for</p>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-10 sm:mt-16 text-center">
          <Link href="/" prefetch={true} className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium text-base sm:text-lg transition-colors bg-gray-900/50 backdrop-blur-sm py-2 px-4 rounded-lg hover:bg-gray-800/70 shadow-md">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Driving Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}