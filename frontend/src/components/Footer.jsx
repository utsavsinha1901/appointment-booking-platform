export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Key References */}
        <div>
          <h3 className="text-white font-semibold mb-3">Key References</h3>
          <ul className="space-y-2">
            <li>
              https://your-api-docs-link.com
            </li>
            <li>
              https://your-schedulink-about.com
            </li>
            <li>
              https://vibecoding.cognizant.com/
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-3">Resources</h3>
          <ul className="space-y-2">
            <li>
              https://github.com/your-repo/readme
            </li>
            <li>
              https://react.dev/
            </li>
            <li>
              https://tailwindcss.com/
            </li>
            <li>
              https://www.docker.com/
            </li>
            <li>
              https://github.com/Manicoder-code/appointment-booking-platform
            </li>
          </ul>
        </div>

        {/* About Schedulink */}
        <div>
          <h3 className="text-white font-semibold mb-3">About Schedulink</h3>
          <p className="mb-2">Empowering businesses with smart scheduling solutions.</p>
          <p>Built with React, Tailwind CSS, FastAPI, Docker, and SQLite.</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm sm:text-base">
        <p>© 2025 Cognizant Technology Solutions. All rights reserved.</p>
      </div>
    </footer>
  );
}
