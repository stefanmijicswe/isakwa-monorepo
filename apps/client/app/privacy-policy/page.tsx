import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { Button } from "../../components/ui/button"
import Link from "next/link"

export default function PrivacyPolicyPage() {
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
        <div className="max-w-4xl mx-auto">
          
          {/* Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-light text-slate-900 mb-4">Privacy Policy</h1>
            <p className="text-slate-500">Last updated: August 14, 2025</p>
            <p className="text-sm text-slate-400 mt-2">Singidunum University • Belgrade, Serbia</p>
          </div>
          
          {/* Introduction */}
          <Card className="border-0 shadow-none bg-transparent mb-12">
            <CardContent className="p-0">
              <p className="text-lg text-slate-700 leading-relaxed">
                This Privacy Policy describes how Singidunum University ("the University," "we," "us," or "our") collects, uses, and protects your personal information when you use our digital platforms, including our website, learning management systems, student portals, and related services (collectively, "Services").
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Information We Collect</h2>
            <div className="space-y-4">
              <p className="text-slate-600">
                We collect information that you provide directly to us and information that is automatically collected when you use our Services.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-800 mb-3">Personal Information:</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start">
                      <span className="text-slate-400 mr-3 mt-1">•</span>
                      <span>Name, email address, and contact details</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-400 mr-3 mt-1">•</span>
                      <span>Student ID, academic records, and enrollment information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-400 mr-3 mt-1">•</span>
                      <span>Faculty credentials and research affiliations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-400 mr-3 mt-1">•</span>
                      <span>Payment and financial information</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-800 mb-3">Automatically Collected:</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start">
                      <span className="text-slate-400 mr-3 mt-1">•</span>
                      <span>Device information and IP addresses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-400 mr-3 mt-1">•</span>
                      <span>Usage patterns and analytics data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-400 mr-3 mt-1">•</span>
                      <span>Cookies and similar tracking technologies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-400 mr-3 mt-1">•</span>
                      <span>System logs and error reports</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">How We Use Your Information</h2>
            <p className="text-slate-600 mb-4">
              We use the information we collect to provide, maintain, and improve our Services, and to fulfill our educational and administrative responsibilities.
            </p>
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-medium text-slate-800 mb-3">Primary Uses:</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Providing educational services and academic support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Managing student enrollment and academic records</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Processing payments and financial transactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Communicating important updates and announcements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Ensuring security and preventing fraud</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal Basis for Processing */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Legal Basis for Processing</h2>
            <p className="text-slate-600 mb-4">
              We process your personal information based on several legal grounds, including consent, contractual obligations, and legitimate interests.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Legal Grounds:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Consent for optional services and communications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Contract performance for enrolled students</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Legitimate interests in institutional operations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Legal obligations and regulatory compliance</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Compliance Framework:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>General Data Protection Regulation (GDPR)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Serbian Data Protection Law</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Higher Education Act and regulations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Institutional privacy policies</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Information Sharing and Disclosure */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Information Sharing and Disclosure</h2>
            <p className="text-slate-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties, except as described in this policy or with your explicit consent.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 mb-3">Limited Sharing Circumstances:</h3>
              <div className="space-y-2 text-blue-800">
                <p>• <strong>Service Providers:</strong> Trusted partners who assist in service delivery</p>
                <p>• <strong>Legal Requirements:</strong> When required by law or court orders</p>
                <p>• <strong>Academic Collaboration:</strong> Research partnerships and joint programs</p>
                <p>• <strong>Emergency Situations:</strong> Health and safety emergencies</p>
                <p>• <strong>Consent-Based:</strong> When you explicitly authorize disclosure</p>
              </div>
            </div>
          </div>

          {/* Data Security and Protection */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Data Security and Protection</h2>
            <p className="text-slate-600 mb-4">
              We implement comprehensive security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Security Measures:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Encryption of data in transit and at rest</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Multi-factor authentication and access controls</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Regular security audits and vulnerability assessments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Employee training on data protection practices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Retention and Deletion */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Data Retention and Deletion</h2>
            <p className="text-slate-600 mb-4">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="font-medium text-amber-900 mb-3">Retention Periods:</h3>
              <ul className="space-y-2 text-amber-800">
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Student records: 10 years after graduation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Financial records: 7 years for tax purposes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Research data: Duration of research project + 5 years</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Website analytics: 2 years maximum</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Your Rights and Choices */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Your Rights and Choices</h2>
            <p className="text-slate-600 mb-4">
              You have certain rights regarding your personal information, including the right to access, correct, and delete your data, subject to legal and institutional requirements.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Your Rights:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Access and review your personal information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Request correction of inaccurate data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Request deletion of your data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Withdraw consent for optional processing</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">How to Exercise:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Contact our Data Protection Officer</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Submit formal written requests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Use student portal privacy settings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Follow institutional procedures</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cookies and Tracking Technologies */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Cookies and Tracking Technologies</h2>
            <p className="text-slate-600 mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content and services.
            </p>
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-medium text-slate-800 mb-3">Cookie Categories:</h3>
              <div className="space-y-2 text-slate-600">
                <p>• <strong>Essential Cookies:</strong> Required for basic functionality</p>
                <p>• <strong>Functional Cookies:</strong> Enhance user experience</p>
                <p>• <strong>Analytics Cookies:</strong> Help improve our services</p>
                <p>• <strong>Marketing Cookies:</strong> Provide relevant content</p>
              </div>
            </div>
          </div>

          {/* International Data Transfers */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">International Data Transfers</h2>
            <p className="text-slate-600 mb-4">
              Your personal information may be transferred to and processed in countries other than Serbia, particularly within the European Union and for international academic collaborations.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 mb-3">Transfer Safeguards:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Adequacy decisions by relevant authorities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Standard contractual clauses for data protection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Binding corporate rules for institutional transfers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Explicit consent for specific transfers</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Children's Privacy */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Children's Privacy</h2>
            <p className="text-slate-600 mb-4">
              Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13 without parental consent.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="font-medium text-amber-900 mb-3">Special Considerations:</h3>
              <div className="space-y-2 text-amber-800">
                <p>• <strong>Parental Consent:</strong> Required for users under 18</p>
                <p>• <strong>Educational Programs:</strong> Special provisions for minors</p>
                <p>• <strong>Limited Data Collection:</strong> Minimal necessary information</p>
                <p>• <strong>Enhanced Protection:</strong> Additional safeguards for minors</p>
              </div>
            </div>
          </div>

          {/* Changes to This Policy */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Changes to This Policy</h2>
            <p className="text-slate-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes through appropriate channels and update the "Last updated" date.
            </p>
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-medium text-slate-800 mb-3">Notification Process:</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Email notifications to registered users</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Website announcements and banners</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Student portal notifications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>30-day advance notice for major changes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Contact Information</h2>
            <p className="text-slate-600 mb-6">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact our Data Protection Officer.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-slate-800 mb-3">Data Protection Officer</h3>
                <div className="space-y-2 text-slate-600">
                  <p>Email: dpo@singidunum.ac.rs</p>
                  <p>Phone: +381 11 123 4569</p>
                  <p>Address: Danijelova 32, 11000 Belgrade, Serbia</p>
                  <p>Office Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-3">Privacy Office</h3>
                <div className="space-y-2 text-slate-600">
                  <p>Email: privacy@singidunum.ac.rs</p>
                  <p>Phone: +381 11 123 4570</p>
                  <p>Address: Danijelova 32, 11000 Belgrade, Serbia</p>
                  <p>Office Hours: Monday - Friday, 8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-slate-100">
            <p className="text-slate-500 text-sm mb-6">
              This Privacy Policy is effective as of August 14, 2025 and constitutes our commitment to protecting your privacy and personal information.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  Return to Homepage
                </Button>
              </Link>
              <Link href="/terms">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  View Terms of Service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
