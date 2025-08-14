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
        <div className="max-w-4xl mx-auto">
          
          {/* Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-light text-slate-900 mb-4">Terms of Service</h1>
            <p className="text-slate-500">Last updated: August 14, 2025</p>
            <p className="text-sm text-slate-400 mt-2">Singidunum University • Belgrade, Serbia</p>
          </div>
          
          {/* Introduction */}
          <Card className="border-0 shadow-none bg-transparent mb-12">
            <CardContent className="p-0">
              <p className="text-lg text-slate-700 leading-relaxed">
                These Terms of Service constitute a legally binding agreement between you and Singidunum University ("the University," "we," "us," or "our") governing your access to and use of our digital platforms, including but not limited to our website, learning management systems, student portals, and related services (collectively, "Services").
              </p>
            </CardContent>
          </Card>

          {/* Academic Integrity and Standards */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Academic Integrity and Standards</h2>
            <div className="space-y-4">
              <p className="text-slate-600">
                As an academic institution committed to excellence in education and research, we maintain the highest standards of academic integrity. All users of our Services must adhere to these principles.
              </p>
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="font-medium text-slate-800 mb-3">Core Academic Principles:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Maintenance of academic honesty and ethical conduct in all academic endeavors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Proper attribution and citation of sources in accordance with academic standards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Respect for intellectual property rights and copyright laws</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Compliance with institutional policies on research ethics and data management</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Eligibility and Registration */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">User Eligibility and Registration</h2>
            <p className="text-slate-600 mb-4">
              Access to certain Services may require user registration and authentication. By registering, you represent and warrant that:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Eligibility Requirements:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>You are at least 18 years of age or have parental/guardian consent</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>You possess the legal capacity to enter into binding agreements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>You are a current student, faculty member, or authorized affiliate</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Your use of Services complies with applicable laws and regulations</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Account Responsibilities:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Maintenance of accurate and current account information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Protection of account credentials and security measures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Immediate notification of unauthorized access or security breaches</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Compliance with institutional IT security policies</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Acceptable Use Policy */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Acceptable Use Policy</h2>
            <p className="text-slate-600 mb-4">
              Our Services are provided for educational, research, and administrative purposes. Users must comply with this Acceptable Use Policy and all applicable institutional policies.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Permitted Uses:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Academic research and educational activities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Administrative and operational functions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Legitimate academic collaboration and communication</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Access to institutional resources and services</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Prohibited Activities:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Commercial exploitation of institutional resources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Unauthorized access to systems or data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Distribution of malicious software or content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Harassment, discrimination, or inappropriate conduct</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Intellectual Property Rights */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Intellectual Property Rights</h2>
            <p className="text-slate-600 mb-4">
              The University maintains ownership of its intellectual property, including but not limited to trademarks, logos, course materials, research outputs, and proprietary software. Users retain rights to their original academic work, subject to institutional policies.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 mb-3">Intellectual Property Framework:</h3>
              <div className="space-y-2 text-blue-800">
                <p>• <strong>University IP:</strong> Trademarks, logos, institutional branding, and proprietary systems</p>
                <p>• <strong>Faculty IP:</strong> Scholarly works, research outputs, and course materials (subject to institutional policies)</p>
                <p>• <strong>Student IP:</strong> Original academic work, research projects, and creative outputs</p>
                <p>• <strong>Collaborative IP:</strong> Joint research projects and collaborative works</p>
              </div>
            </div>
          </div>

          {/* Data Protection and Privacy */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Data Protection and Privacy</h2>
            <p className="text-slate-600 mb-4">
              The University is committed to protecting the privacy and confidentiality of personal data in accordance with applicable data protection laws, including the General Data Protection Regulation (GDPR) and Serbian data protection legislation.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Data Processing Principles:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Lawful, fair, and transparent processing of personal data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Collection and processing limited to specified, legitimate purposes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Implementation of appropriate technical and organizational security measures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Respect for data subject rights and freedoms</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Research and Academic Freedom */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Research and Academic Freedom</h2>
            <p className="text-slate-600 mb-4">
              The University upholds the principles of academic freedom and research integrity. Researchers and scholars are entitled to pursue knowledge and express ideas freely, subject to ethical considerations and institutional oversight.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="font-medium text-amber-900 mb-3">Academic Freedom Principles:</h3>
              <ul className="space-y-2 text-amber-800">
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Freedom of inquiry and expression in academic pursuits</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Independence in research design and methodology</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Protection from external interference in academic matters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Responsibility to maintain research integrity and ethical standards</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Student Rights and Responsibilities */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Student Rights and Responsibilities</h2>
            <p className="text-slate-600 mb-4">
              Students have specific rights and responsibilities under these Terms of Service, in addition to those outlined in the Student Handbook and institutional policies.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Student Rights:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Access to educational resources and support services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Fair and equitable treatment in academic matters</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Due process in disciplinary proceedings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Protection of academic records and personal information</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3">Student Responsibilities:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Compliance with academic integrity standards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Respect for institutional policies and procedures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Proper use of institutional resources and facilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-slate-400 mr-3 mt-1">•</span>
                    <span>Maintenance of appropriate conduct and behavior</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dispute Resolution and Grievances */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Dispute Resolution and Grievances</h2>
            <p className="text-slate-600 mb-4">
              The University provides formal mechanisms for addressing grievances and resolving disputes related to academic matters, administrative decisions, and alleged violations of institutional policies.
            </p>
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-medium text-slate-800 mb-3">Grievance Procedures:</h3>
              <div className="space-y-2 text-slate-600">
                <p>• <strong>Informal Resolution:</strong> Direct communication with relevant parties</p>
                <p>• <strong>Formal Grievance:</strong> Written submission to appropriate administrative office</p>
                <p>• <strong>Appeal Process:</strong> Review by designated committees or administrators</p>
                <p>• <strong>External Review:</strong> Applicable legal and regulatory mechanisms</p>
              </div>
            </div>
          </div>

          {/* Governing Law and Jurisdiction */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Governing Law and Jurisdiction</h2>
            <p className="text-slate-600 mb-4">
              These Terms of Service are governed by and construed in accordance with the laws of the Republic of Serbia. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the competent courts in Belgrade, Serbia.
            </p>
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-medium text-slate-800 mb-3">Legal Framework:</h3>
              <div className="space-y-2 text-slate-600">
                <p>• <strong>Primary Jurisdiction:</strong> Republic of Serbia</p>
                <p>• <strong>Applicable Law:</strong> Serbian Law and EU Regulations (where applicable)</p>
                <p>• <strong>Dispute Resolution:</strong> Serbian Courts (Belgrade jurisdiction)</p>
                <p>• <strong>Language:</strong> Serbian (English for international reference)</p>
                <p>• <strong>International Students:</strong> Subject to Serbian law and institutional policies</p>
              </div>
            </div>
          </div>

          {/* Amendments and Updates */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Amendments and Updates</h2>
            <p className="text-slate-600 mb-4">
              The University reserves the right to modify these Terms of Service at any time. Significant changes will be communicated to users through appropriate channels, and continued use of Services constitutes acceptance of updated terms.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 mb-3">Modification Process:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Notification of changes through institutional communication channels</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Publication of updated terms on institutional websites</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Opportunity for user feedback on proposed changes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-400 mr-3 mt-1">•</span>
                  <span>Effective date clearly specified for all modifications</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-slate-900 mb-6">Contact Information</h2>
            <p className="text-slate-600 mb-6">
              For questions regarding these Terms of Service or to report violations, please contact the appropriate institutional office.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-slate-800 mb-3">Legal and Compliance Office</h3>
                <div className="space-y-2 text-slate-600">
                  <p>Email: legal@singidunum.ac.rs</p>
                  <p>Phone: +381 11 123 4567</p>
                  <p>Address: Danijelova 32, 11000 Belgrade, Serbia</p>
                  <p>Office Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-3">Student Affairs Office</h3>
                <div className="space-y-2 text-slate-600">
                  <p>Email: student.affairs@singidunum.ac.rs</p>
                  <p>Phone: +381 11 123 4568</p>
                  <p>Address: Danijelova 32, 11000 Belgrade, Serbia</p>
                  <p>Office Hours: Monday - Friday, 8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-slate-100">
            <p className="text-slate-500 text-sm mb-6">
              These Terms of Service are effective as of August 14, 2025 and constitute the complete agreement between users and Singidunum University regarding the use of our Services.
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
