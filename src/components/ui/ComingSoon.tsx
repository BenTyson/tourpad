import Link from 'next/link';
import { ArrowLeft, Construction, type LucideIcon } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  category?: string;
}

export function ComingSoon({ title, description, icon: Icon = Construction, category }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-mist">
      <section className="relative py-20 bg-gradient-to-br from-french-blue/5 to-sage/5 border-b border-neutral-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-french-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-sage/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-french-blue hover:text-primary-700 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="text-center">
            {category && (
              <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-evergreen border border-sage/20 mb-8">
                <Icon className="w-4 h-4 mr-2" />
                {category}
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              {description}
            </p>
            <div className="inline-flex items-center px-6 py-4 bg-white rounded-2xl shadow-sm border border-neutral-100">
              <Construction className="w-5 h-5 text-french-blue mr-3" />
              <span className="text-gray-700 font-medium">Content coming soon</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
