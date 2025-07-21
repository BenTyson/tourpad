'use client';
import { 
  ClockIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface HoldingPageProps {
  user: {
    name: string;
    email: string;
    userType: 'HOST' | 'ARTIST' | 'FAN';
    status: string;
    createdAt: string;
  };
}

export default function HoldingPage({ user }: HoldingPageProps) {
  const getUserTypeDisplay = () => {
    switch (user.userType) {
      case 'HOST': return 'Host';
      case 'ARTIST': return 'Artist';
      case 'FAN': return 'Fan';
      default: return 'User';
    }
  };

  const getApplicationText = () => {
    switch (user.userType) {
      case 'HOST': 
        return {
          title: 'Host Application Under Review',
          subtitle: 'Your venue hosting application is being reviewed by our team',
          nextStep: 'Once approved, you\'ll gain immediate access to your host dashboard where you can manage your venue profile, photos, and start receiving booking requests.'
        };
      case 'ARTIST':
        return {
          title: 'Artist Application Under Review',
          subtitle: 'Your artist application is being reviewed by our team',
          nextStep: 'Once approved, you\'ll be prompted to complete payment setup and then gain full access to your artist dashboard.'
        };
      case 'FAN':
        return {
          title: 'Welcome to TourPad',
          subtitle: 'Complete your subscription to access exclusive live music experiences',
          nextStep: 'Complete your $10/month subscription to start discovering and RSVPing to intimate concerts in your area.'
        };
      default:
        return {
          title: 'Application Under Review',
          subtitle: 'Your application is being processed',
          nextStep: 'You will be notified of the outcome via email.'
        };
    }
  };

  const applicationText = getApplicationText();
  const submittedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Status Card */}
        <Card className="text-center mb-6 border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <ClockIcon className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {applicationText.title}
            </h1>
            <p className="text-gray-600 text-lg">
              {applicationText.subtitle}
            </p>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge variant="warning" className="px-4 py-2 text-sm">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Application Pending Review
                </Badge>
              </div>

              {/* Application Details */}
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-gray-900 mb-3">Application Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Applicant:</span>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{getUserTypeDisplay()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Submitted:</span>
                    <span className="font-medium">{submittedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <InformationCircleIcon className="w-5 h-5 mr-2 text-primary-600" />
                  What Happens Next
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {applicationText.nextStep}
                </p>
              </div>

              {/* Contact Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-left">
                    <h4 className="font-medium text-blue-900">Email Notifications</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      We'll notify you at <strong>{user.email}</strong> as soon as your application status changes. 
                      Make sure to check your spam folder.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button 
                  onClick={refreshPage}
                  variant="secondary" 
                  className="w-full sm:w-auto"
                >
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Check for Updates
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Application Process</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Step 1 - Completed */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Application Submitted</h3>
                  <p className="text-sm text-gray-600">Completed on {submittedDate}</p>
                </div>
              </div>

              {/* Step 2 - Current */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center animate-pulse">
                    <ClockIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Under Review</h3>
                  <p className="text-sm text-gray-600">Our team is reviewing your application</p>
                </div>
              </div>

              {/* Step 3 - Pending */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm font-medium">3</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-500">
                    {user.userType === 'HOST' ? 'Dashboard Access' : 
                     user.userType === 'ARTIST' ? 'Payment Setup' : 
                     'Subscription Setup'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {user.userType === 'HOST' ? 'Immediate access upon approval' :
                     user.userType === 'ARTIST' ? 'Complete payment after approval' :
                     'Complete $10/month subscription'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}