import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { Button } from "../../components/ui/button"
import Link from "next/link"

export default function TermsPage() {
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
            <h1 className="text-4xl font-light text-slate-900 mb-4">Terms of Service</h1>
            <p className="text-slate-500">Last updated: December 2024</p>
          </div>
          
          {/* Introduction */}
          <Card className="border-0 shadow-none bg-transparent mb-12">
            <CardContent className="p-0">
              <p className="text-lg text-slate-700 leading-relaxed">
                These Terms of Service govern your use of Singidunum University's website and services. By accessing or using our services, you agree to be bound by these terms and all applicable laws and regulations.
              </p>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Acceptance of Terms</h2>
            <div className="space-y-4">
              <p className="text-slate-600">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="font-medium text-slate-800 mb-3">Key Points:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>You must be at least 18 years old to use our services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>You agree to provide accurate and complete information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>You are responsible for maintaining the security of your account</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use License */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Use License</h2>
            <p className="text-slate-600 mb-4">
              Permission is granted to temporarily download one copy of the materials on Singidunum University's website for personal, non-commercial transitory viewing only.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">What You May Do:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>View and download materials for personal use</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Share information with proper attribution</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Use educational resources for learning purposes</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">What You May Not Do:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Modify or copy the materials</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Use for commercial purposes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Remove copyright or proprietary notices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Disclaimer</h2>
            <p className="text-slate-600 mb-4">
              The materials on Singidunum University's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="font-medium text-amber-900 mb-3">Important Notice:</h3>
              <p className="text-amber-800 text-sm">
                While we strive to provide accurate and up-to-date information, we cannot guarantee that all content is error-free or current. Always verify important information through official channels.
              </p>
            </div>
          </div>

          {/* Limitations */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Limitations</h2>
            <p className="text-slate-600 mb-4">
              In no event shall Singidunum University or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">We Are Not Responsible For:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Indirect, incidental, or consequential damages</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Loss of data, profits, or business opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Third-party actions or content</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Revisions and Errata */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Revisions and Errata</h2>
            <p className="text-slate-600 mb-4">
              The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 mb-3">Updates and Changes:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>We may update these terms at any time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Changes will be posted on this page</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Continued use constitutes acceptance of changes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Links */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">External Links</h2>
            <p className="text-slate-600 mb-4">
              Singidunum University has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Our Policy:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>We carefully review external links</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Links are provided for convenience only</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>We do not control external content</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Your Responsibility:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Verify external link content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Use external sites at your own risk</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Report broken or inappropriate links</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Governing Law */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Governing Law</h2>
            <p className="text-slate-600 mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of Serbia and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-medium text-slate-800 mb-3">Legal Framework:</h3>
              <div className="space-y-2 text-slate-600">
                <p>• Jurisdiction: Republic of Serbia</p>
                <p>• Applicable Law: Serbian Law</p>
                <p>• Dispute Resolution: Serbian Courts</p>
                <p>• Language: Serbian (English for reference)</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Contact Us</h2>
            <p className="text-slate-600 mb-6">
              If you have any questions about these Terms of Service, please contact us.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-slate-800 mb-3">Legal Department</h3>
                <div className="space-y-2 text-slate-600">
                  <p>Email: legal@singidunum.ac.rs</p>
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
              These Terms of Service are effective as of December 2024 and will remain in effect except with respect to any changes in their provisions in the future.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  Return to Homepage
                </Button>
              </Link>
              <Link href="/policy">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  View Privacy Policy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
