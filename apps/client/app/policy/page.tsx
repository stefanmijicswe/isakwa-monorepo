import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { Button } from "../../components/ui/button"
import Link from "next/link"

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">S</span>
              </div>
              <div>
                <h1 className="text-lg font-medium text-slate-900">Singidunum</h1>
                <p className="text-xs text-slate-500">University</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                ← Back
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          
          {/* Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-light text-slate-900 mb-4">Privacy Policy</h1>
            <p className="text-slate-500">Last updated: December 2024</p>
          </div>
          
          {/* Introduction */}
          <Card className="border-0 shadow-none bg-transparent mb-12">
            <CardContent className="p-0">
              <p className="text-lg text-slate-700 leading-relaxed">
                Singidunum University is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Information We Collect</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Personal Information</h3>
                <p className="text-slate-600 mb-4">When you apply for admission, register for courses, or contact us, we may collect:</p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Name, email address, and phone number</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Educational background and transcripts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Identification documents and passport information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Financial information for tuition payments</span>
                  </li>
                </ul>
              </div>
              
              <Separator className="my-8" />
              
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Automatically Collected Information</h3>
                <p className="text-slate-600 mb-4">We automatically collect certain information when you visit our website:</p>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>IP address and device information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Browser type and operating system</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Pages visited and time spent on our site</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">How We Use Your Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Academic Services</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Processing applications and enrollments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Managing student records and transcripts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Providing academic support and counseling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Communicating about courses and programs</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Administrative Purposes</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Processing payments and financial aid</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Sending important announcements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Improving our website and services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Complying with legal obligations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Information Sharing</h2>
            <p className="text-slate-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-medium text-slate-800 mb-3">We may share your information with:</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Accrediting bodies and regulatory authorities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Service providers who assist in our operations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Legal authorities when required by law</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Other educational institutions for transfer credits</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Data Security */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Data Security</h2>
            <p className="text-slate-600 mb-6">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <div className="text-2xl mb-3">🔒</div>
                <h4 className="font-medium text-slate-800 mb-2">Encryption</h4>
                <p className="text-sm text-slate-600">All data is encrypted in transit and at rest</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <div className="text-2xl mb-3">🛡️</div>
                <h4 className="font-medium text-slate-800 mb-2">Access Control</h4>
                <p className="text-sm text-slate-600">Strict access controls and authentication</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <div className="text-2xl mb-3">📊</div>
                <h4 className="font-medium text-slate-800 mb-2">Monitoring</h4>
                <p className="text-sm text-slate-600">Continuous security monitoring and audits</p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Your Rights</h2>
            <p className="text-slate-600 mb-6">
              You have certain rights regarding your personal information under applicable data protection laws.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Access and Control</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Access your personal information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Correct inaccurate information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Request deletion of your data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Object to processing of your data</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Communication Preferences</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Opt-out of marketing communications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Choose how we contact you</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Update your contact information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Manage notification settings</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Contact Us</h2>
            <p className="text-slate-600 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-slate-800 mb-3">Data Protection Officer</h3>
                <div className="space-y-2 text-slate-600">
                  <p>Email: privacy@singidunum.ac.rs</p>
                  <p>Phone: +381 11 123 4567</p>
                  <p>Address: Danijelova 32, 11000 Belgrade, Serbia</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-3">Office Hours</h3>
                <div className="space-y-2 text-slate-600">
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-slate-100">
            <p className="text-slate-500 text-sm mb-6">
              This Privacy Policy is effective as of December 2024 and will remain in effect except with respect to any changes in its provisions in the future.
            </p>
            <Link href="/">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
