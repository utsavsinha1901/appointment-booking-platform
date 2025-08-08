import React from 'react';
import { Calendar, Zap, Users, Shield, BarChart, Rocket, Eye, GitMerge } from 'lucide-react';

const Section = ({ icon, title, children }) => (
  <section className="mb-12 last:mb-0">
    <div className="flex items-start sm:items-center mb-6">
      <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex-shrink-0 flex items-center justify-center mr-4">
        {icon}
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
    </div>
    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-4">
      {children}
    </div>
  </section>
);

const Feature = ({ title, children }) => (
  <div className="mt-6">
    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h4>
    <p className="mt-2">{children}</p>
  </div>
);

const AboutPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <header className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            About Schedulink
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-purple-200">
            A comprehensive scheduling and resource management platform designed to simplify and automate complex workflows.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Section icon={<Eye className="w-6 h-6 text-primary-600 dark:text-primary-400" />} title="Introduction & Vision">
          <p>
            Schedulink is a comprehensive scheduling and resource management platform designed to simplify and automate complex workflows for individuals, teams, and organizations. Built with flexibility and scalability in mind, Schedulink empowers users to efficiently handle appointments, meetings, tasks, and resource allocation through an intuitive interface and robust feature set.
          </p>
          <p>
            Our vision was to create a solution for the growing challenges faced by modern teams in managing time and resources. With the rise of remote work and dynamic project requirements, traditional scheduling tools often fall short. Schedulink aims to bridge these gaps by offering an integrated platform that adapts to diverse scheduling needs while enhancing productivity and collaboration.
          </p>
        </Section>

        <Section icon={<Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />} title="Core Features">
          <Feature title="Intelligent Scheduling">
            Our engine suggests optimal meeting times by considering availability, resources, and policies. It supports recurring events, buffer times, and priorities, ensuring efficient and realistic schedules.
          </Feature>
          <Feature title="Resource Management">
            Manage physical and virtual resources like rooms and equipment. Track utilization, prevent double-booking, and optimize usage through centralized dashboards.
          </Feature>
          <Feature title="Team Collaboration">
            Create shared calendars, assign tasks, and coordinate projects with real-time updates. Notifications ensure everyone stays informed about changes.
          </Feature>
          <Feature title="Integration Capabilities">
            Seamlessly integrate with tools like Google Calendar, Outlook, Slack, and Zoom to synchronize schedules and automate workflows.
          </Feature>
        </Section>

        <Section icon={<Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />} title="User Experience">
          <Feature title="Intuitive Interface">
            We prioritize user experience with a clean UI, drag-and-drop functionality, and color-coded calendars for effortless navigation.
          </Feature>
          <Feature title="Customization & Accessibility">
            Customize views, notifications, and permissions to match your workflows. The platform adheres to accessibility standards (WCAG) for usability by all.
          </Feature>
        </Section>

        <Section icon={<Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />} title="Security and Privacy">
          <p>
            We place a strong emphasis on data security and privacy. All data is encrypted in transit and at rest, with multi-factor authentication and granular access controls. Compliance with major standards (GDPR, HIPAA, etc.) ensures that user information is handled responsibly.
          </p>
        </Section>
        
        <Section icon={<GitMerge className="w-6 h-6 text-primary-600 dark:text-primary-400" />} title="Use Cases & Analytics">
            <p>
                From corporate scheduling and healthcare appointments to educational institutions and event planning, Schedulink is versatile. Our analytics tools provide insights into scheduling patterns, resource utilization, and productivity trends to help managers make informed decisions.
            </p>
        </Section>

        <Section icon={<Rocket className="w-6 h-6 text-primary-600 dark:text-primary-400" />} title="Future Roadmap">
          <p>
            Schedulink continues to innovate by incorporating AI-powered scheduling, advanced resource forecasting, and enhanced integrations. We actively seek user feedback to prioritize new features and improvements.
          </p>
        </Section>

        <div className="mt-16 text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">A Powerful, Adaptable Solution</h3>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            By combining intelligent automation, flexible resource management, and seamless collaboration, Schedulink helps users reclaim their time and optimize their workflows for efficient, stress-free scheduling.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;