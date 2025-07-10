import Link from 'next/link';
import { 
  HomeIcon,
  MusicalNoteIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Find Hosts', href: '/hosts' },
      { name: 'Browse Artists', href: '/artists' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Success Stories', href: '/stories' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Safety', href: '/safety' },
      { name: 'Community Guidelines', href: '/guidelines' },
      { name: 'Trust & Safety', href: '/trust' },
      { name: 'Report Issue', href: '/report' }
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Accessibility', href: '/accessibility' },
      { name: 'Sitemap', href: '/sitemap' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: '📘' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'Instagram', href: '#', icon: '📸' },
    { name: 'YouTube', href: '#', icon: '📺' },
    { name: 'LinkedIn', href: '#', icon: '💼' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <HomeIcon className="w-8 h-8 text-blue-400 mr-2" />
                <span className="text-2xl font-bold">TourPad</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connecting touring musicians with passionate hosts for unforgettable 
              intimate concerts. Building community, one show at a time.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                <span>hello@tourpad.com</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2" />
                <span>1-800-TOURPAD</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2" />
                <span>Austin, TX</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
              <p className="text-gray-400">Get updates on new features and community stories</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <p className="text-gray-400">
                © {currentYear} TourPad. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Made with</span>
                <span className="text-red-400">♥</span>
                <span className="text-gray-400 text-sm">for musicians</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}