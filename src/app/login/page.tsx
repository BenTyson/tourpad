'use client';
import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  UserIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { validateData, loginSchema } from '@/lib/validation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [demoUsers] = useState([
    { email: 'admin@tourpad.com', password: 'password123', type: 'Admin User', description: 'Full platform access' },
    { email: 'sarah@example.com', password: 'password123', type: 'Artist', description: 'Folk musician Sarah Johnson' },
    { email: 'marcus@example.com', password: 'password123', type: 'Artist', description: 'Jazz pianist Marcus Williams' },
    { email: 'luna@example.com', password: 'password123', type: 'Artist', description: 'Electronic artist Luna Martinez' },
    { email: 'mike@example.com', password: 'password123', type: 'Host', description: 'Mike\'s Music Room (Denver, CO)' },
    { email: 'emily@example.com', password: 'password123', type: 'Host', description: 'Thompson Garden Sessions (Austin, TX)' },
    { email: 'james@example.com', password: 'password123', type: 'Host', description: 'The Wilson Barn (Nashville, TN)' },
    { email: 'fan@example.com', password: 'password123', type: 'Fan', description: 'Music lover Emma Rodriguez' }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrors([]);

    // Validate form data
    const validation = validateData(loginSchema, formData);
    if (!validation.success) {
      setErrors(validation.errors || ['Invalid login data']);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        setErrors(['Invalid email or password']);
      } else {
        // Get session to determine redirect
        const session = await getSession();
        
        if (session?.user?.type === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors(['An error occurred during login. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    console.log('Demo login clicked:', email, password);
    setFormData({ email, password });
    setErrors([]); // Clear any previous errors
    
    // Auto-submit after a brief delay to allow state to update
    setTimeout(async () => {
      setIsLoading(true);
      
      try {
        const result = await signIn('credentials', {
          email: email,
          password: password,
          redirect: false
        });

        if (result?.error) {
          setErrors(['Invalid email or password']);
        } else {
          // Get session to determine redirect
          const session = await getSession();
          
          if (session?.user?.type === 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        }
      } catch (error) {
        console.error('Demo login error:', error);
        setErrors(['An error occurred during login. Please try again.']);
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your TourPad account</p>
        </div>

        {/* Demo Users */}
        <Card className="border-secondary-200">
          <CardHeader>
            <h3 className="text-sm font-medium text-secondary-800">Demo Accounts (Click to Auto-Fill)</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoUsers.map((user, index) => (
              <button
                key={index}
                onClick={() => handleDemoLogin(user.email, user.password)}
                className="w-full text-left p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors border border-secondary-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-secondary-900">{user.type}</div>
                    <div className="text-xs text-secondary-600">{user.email}</div>
                    <div className="text-xs text-secondary-500">{user.description}</div>
                  </div>
                  <UserIcon className="w-4 h-4 text-secondary-400" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardContent className="p-6">
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">Login Failed</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
                placeholder="Enter your email"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-secondary-600 hover:text-secondary-800">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LockClosedIcon className="w-4 h-4 mr-2" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-secondary-600 hover:text-secondary-800">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-secondary-600 hover:text-secondary-800">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
