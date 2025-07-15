import Link from 'next/link';
import { 
  Home,
  Music,
  Mail,
  Phone,
  MapPin,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Star
} from 'lucide-react';

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
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'YouTube', href: '#', icon: Youtube },
    { name: 'LinkedIn', href: '#', icon: Linkedin }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-950 to-gray-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-8 w-32 h-32 bg-primary-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-8 w-40 h-40 bg-secondary-400/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Main Footer Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mr-3">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
                  TourPad
                </span>
              </div>
            </div>
            <p className="text-xl font-semibold text-white mb-4 leading-tight">
              Where Music Feels Like Home
            </p>
            <p className="text-neutral-300 mb-6 leading-relaxed">
              Connecting touring musicians with passionate hosts for unforgettable 
              intimate concerts. Building community, one show at a time.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-neutral-300">
              <div className="flex items-center group">
                <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-500/20 transition-colors">
                  <Mail className="w-4 h-4 text-primary-400" />
                </div>
                <span className="group-hover:text-white transition-colors">hello@tourpad.com</span>
              </div>
              <div className="flex items-center group">
                <div className="w-8 h-8 bg-secondary-500/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-secondary-500/20 transition-colors">
                  <Phone className="w-4 h-4 text-secondary-400" />
                </div>
                <span className="group-hover:text-white transition-colors">1-800-TOURPAD</span>
              </div>
              <div className="flex items-center group">
                <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-500/20 transition-colors">
                  <MapPin className="w-4 h-4 text-primary-400" />
                </div>
                <span className="group-hover:text-white transition-colors">Austin, TX</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-neutral-300 hover:text-primary-300 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-neutral-300 hover:text-secondary-300 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-neutral-300 hover:text-primary-300 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-neutral-300 hover:text-secondary-300 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 pt-12 border-t border-neutral-700/50">
          <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl p-8 backdrop-blur-sm border border-neutral-600/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center mb-3">
                  <Star className="w-6 h-6 text-primary-400 mr-2" />
                  <h3 className="text-xl font-semibold text-white">Stay Connected</h3>
                </div>
                <p className="text-neutral-300">Get updates on new features, artist spotlights, and community stories</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-5 py-3 bg-neutral-800/50 border border-neutral-600/30 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 backdrop-blur-sm"
                />
                <button className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-6 md:mb-0">
              <p className="text-neutral-400">
                © {currentYear} TourPad. All rights reserved.
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-neutral-400 text-sm">Made with</span>
                <Heart className="w-4 h-4 text-primary-400 fill-current" />
                <span className="text-neutral-400 text-sm">for musicians</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-neutral-400 text-sm">Follow us:</span>
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-neutral-800/50 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-primary-500/20 hover:scale-110 transition-all duration-200 backdrop-blur-sm border border-neutral-700/30"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}