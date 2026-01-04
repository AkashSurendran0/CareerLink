import Link from "next/link"
import { Briefcase, FileText, Target, Users, ListChecks, Phone, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl text-black">CareerLink</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <span className="px-4 py-2 text-black hover:text-blue-600 transition-colors">Login</span>
            </Link>
            <Link href="/signup">
              <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Sign up
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-pretty">
                AI-Powered careers made <span className="text-blue-600">effortless</span>
              </h1>
              <p className="text-lg text-gray-600">
                CareerLink uses AI to create tailored resumes and cover letters that match job descriptions perfectly.
                For companies, manage applicants, streamline hiring, and schedule calls—all in one place.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 w-full sm:w-auto transition-colors">
                  Get started for free <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="#features">
                <button className="px-6 py-3 border border-gray-300 hover:border-blue-600 hover:text-blue-600 rounded-lg font-medium w-full sm:w-auto transition-colors text-black">
                  Learn more
                </button>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-md">
              <div className="absolute inset-0 bg-blue-50 rounded-2xl" />
              <div className="absolute inset-6 bg-white rounded-xl shadow-2xl flex items-center justify-center">
                <Users className="w-32 h-32 text-blue-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <p className="text-gray-600">Active professionals</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">5000+</div>
              <p className="text-gray-600">Job opportunities</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">98%</div>
              <p className="text-gray-600">Success rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black">Everything you need to succeed</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful tools for job seekers and companies to connect and thrive together.
          </p>
        </div>

        <div className="space-y-16">
          {/* For Job Seekers */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-black">
              <FileText className="w-6 h-6 text-blue-600" />
              For Job Seekers
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow">
                <FileText className="w-8 h-8 text-blue-600 mb-4" />
                <h4 className="font-semibold text-lg mb-2 text-black">AI Resume Builder</h4>
                <p className="text-gray-600">
                  Create professional resumes instantly with AI assistance. Highlight your best achievements and skills
                  with confidence.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow">
                <FileText className="w-8 h-8 text-blue-600 mb-4" />
                <h4 className="font-semibold text-lg mb-2 text-black">AI Cover Letters</h4>
                <p className="text-gray-600">
                  Generate compelling cover letters tailored to each job description. Make a lasting impression on
                  hiring managers.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow col-span-full md:col-span-2 lg:col-span-1">
                <Target className="w-8 h-8 text-blue-600 mb-4" />
                <h4 className="font-semibold text-lg mb-2 text-black">Job-Description Tailored</h4>
                <p className="text-gray-600">
                  Automatically customize your resume and cover letter to match each job description perfectly. Increase
                  your chances of getting noticed.
                </p>
              </div>
            </div>
          </div>

          {/* For Companies */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-black">
              <Users className="w-6 h-6 text-blue-600" />
              For Companies
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow">
                <ListChecks className="w-8 h-8 text-blue-600 mb-4" />
                <h4 className="font-semibold text-lg mb-2 text-black">Easy Applicants Listing</h4>
                <p className="text-gray-600">
                  View all your job applicants in one organized dashboard. Filter, search, and manage candidates
                  effortlessly.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow">
                <Users className="w-8 h-8 text-blue-600 mb-4" />
                <h4 className="font-semibold text-lg mb-2 text-black">Streamlined Hiring</h4>
                <p className="text-gray-600">
                  Simplify your entire recruitment process. Track candidates through every stage and make data-driven
                  hiring decisions.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow col-span-full md:col-span-2 lg:col-span-1">
                <Phone className="w-8 h-8 text-blue-600 mb-4" />
                <h4 className="font-semibold text-lg mb-2 text-black">Easy Call Scheduling</h4>
                <p className="text-gray-600">
                  Schedule interviews and calls with candidates directly in the platform. No back-and-forth emails
                  needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to transform your career journey?</h2>
          <p className="text-blue-100 text-lg">
            Join thousands of professionals and companies using CareerLink to succeed together.
          </p>
          <div className="flex justify-center">
            <Link href="/signup">
              <button className="px-6 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                Start your journey today <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-black">CareerLink</span>
              </div>
              <p className="text-sm text-gray-600">Connecting careers with opportunities.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Resources", links: ["Help", "Contact", "Status"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4 text-black">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 CareerLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
