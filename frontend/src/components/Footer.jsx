import React from 'react';
import { useApp } from '../context/AppContext';
import { Github, BookOpen, Info, Wind, Container, Atom, ExternalLink, Calendar } from 'lucide-react';

const Footer = () => {
  const { userRole } = useApp();

  // Icons for links
  const icons = {
    api: <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />,
    about: <Info className="w-4 h-4 mr-2 flex-shrink-0" />,
    readme: <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />,
    react: <Atom className="w-4 h-4 mr-2 flex-shrink-0" />,
    tailwind: <Wind className="w-4 h-4 mr-2 flex-shrink-0" />,
    docker: <Container className="w-4 h-4 mr-2 flex-shrink-0" />,
    github: <Github className="w-4 h-4 mr-2 flex-shrink-0" />,
    vibe: <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />,
  };

  const keyReferences = [
    // Conditionally show API Docs for master role
    ...(userRole === 'master' ? [{ name: 'API Docs', href: 'https://manikandan.info/api/docs', icon: icons.api }] : []),
    { name: 'About Schedulink', href: '#', icon: icons.about },
    { name: 'Vibe Coding', href: 'https://vibecoding.cognizant.com/', icon: icons.vibe },
  ];

  const resources = [
    { name: 'Documentation (README)', href: 'https://github.com/Manicoder-code/appointment-booking-platform/blob/main/README.md', icon: icons.readme },
    { name: 'React', href: 'https://react.dev/', icon: icons.react },
    { name: 'Tailwind CSS', href: 'https://tailwindcss.com/', icon: icons.tailwind },
    { name: 'Docker', href: 'https://www.docker.com/', icon: icons.docker },
    { name: 'GitHub Profile', href: 'https://github.com/Manicoder-code', icon: icons.github },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schedulink</h1>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Smart Appointment Scheduler for Modern Businesses.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                Key References
              </h3>
              <ul className="mt-4 space-y-3">
                {keyReferences.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center">
                      {item.icon}
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-12 sm:mt-0">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                Resources
              </h3>
              <ul className="mt-4 space-y-3">
                {resources.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center">
                      {item.icon}
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-base text-gray-400 dark:text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Cognizant Technology Solutions. Schedulink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;