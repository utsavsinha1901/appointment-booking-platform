import React from 'react';
import { useApp } from '../context/AppContext';
import { Github, BookOpen, Info, Wind, Container, Atom, ExternalLink, Calendar, Mail, Phone, MapPin } from 'lucide-react';

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
    email: <Mail className="w-4 h-4 mr-2 flex-shrink-0" />,
    phone: <Phone className="w-4 h-4 mr-2 flex-shrink-0" />,
    address: <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />,
  };

  const keyReferences = [
    // Conditionally show API Docs for master role
    ...(userRole === 'master' ? [{ name: 'API Docs', href: 'http://localhost:8000/docs', icon: icons.api }] : []),
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

   const contactUsDetails = [
    { name: 'support@schedulink.com', href: 'mailto:support@schedulink.com', icon: icons.email },
    { name: '+1-555-123-4567', href: 'tel:+1-555-123-4567', icon: icons.phone },
    { name: '123 Main St, Anytown USA', href: '#', icon: icons.address },
  ];

  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                 <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Schedulink</h1>
              </div>
            </div>
            <p className="text-purple-200 text-base">
             Smart Appointment Scheduler for Modern Businesses.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 xl:mt-0 xl:col-span-3">
            <div>
               <h3 className="text-base font-bold text-white tracking-wider uppercase">
                Key References
              </h3>
              <ul className="mt-4 space-y-3">
                {keyReferences.map((item) => (

                  <li key={item.name}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-200 hover:text-white transition-colors flex items-center">
                      {item.icon}
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
           
            <div>
              <h3 className="text-base font-bold text-white tracking-wider uppercase">
                Resources
              </h3>
              <ul className="mt-4 space-y-3">
                {resources.map((item) => (
                 <li key={item.name}>
                   <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-200 hover:text-white transition-colors flex items-center">
                   {item.icon}
                    <span>{item.name}</span>
                   </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="text-base font-bold text-white tracking-wider uppercase">
                Contact Us
              </h3>
              <ul className="mt-4 space-y-3">
                {contactUsDetails.map((contact) => (
                  <li key={contact.name}>
                    <a href={contact.href} className="text-sm text-purple-200 hover:text-white transition-colors flex items-center">
                      {contact.icon}
                      <span>{contact.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-blue-500/50 pt-8">
          <p className="text-base text-purple-300 text-center">
            &copy; {new Date().getFullYear()} Cognizant Technology Solutions. Schedulink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;