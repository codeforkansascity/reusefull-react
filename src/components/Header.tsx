import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, User } from 'lucide-react'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDonateDropdownOpen, setIsDonateDropdownOpen] = useState(false)
  const [isWhatWeDoDropdownOpen, setIsWhatWeDoDropdownOpen] = useState(false)
  const [isGetInvolvedDropdownOpen, setIsGetInvolvedDropdownOpen] = useState(false)
  const [isCharityDropdownOpen, setIsCharityDropdownOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const donateDropdownRef = useRef<HTMLDivElement>(null)
  const whatWeDoDropdownRef = useRef<HTMLDivElement>(null)
  const getInvolvedDropdownRef = useRef<HTMLDivElement>(null)
  const charityDropdownRef = useRef<HTMLDivElement>(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
      if (donateDropdownRef.current && !donateDropdownRef.current.contains(event.target as Node)) {
        setIsDonateDropdownOpen(false)
      }
      if (whatWeDoDropdownRef.current && !whatWeDoDropdownRef.current.contains(event.target as Node)) {
        setIsWhatWeDoDropdownOpen(false)
      }
      if (getInvolvedDropdownRef.current && !getInvolvedDropdownRef.current.contains(event.target as Node)) {
        setIsGetInvolvedDropdownOpen(false)
      }
      if (charityDropdownRef.current && !charityDropdownRef.current.contains(event.target as Node)) {
        setIsCharityDropdownOpen(false)
      }
    }

    if (isMobileMenuOpen || isDonateDropdownOpen || isWhatWeDoDropdownOpen || isGetInvolvedDropdownOpen || isCharityDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen, isDonateDropdownOpen, isWhatWeDoDropdownOpen, isGetInvolvedDropdownOpen, isCharityDropdownOpen])

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/reusefull-logo-350.png"
                alt="Reusefull Logo"
                className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">REUSEFULL</h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center space-x-2">
            <div className="relative group" ref={donateDropdownRef}>
              <button
                onClick={() => setIsDonateDropdownOpen(!isDonateDropdownOpen)}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-md font-medium transition-colors flex items-center cursor-pointer"
              >
                Donate
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {/* Donate Dropdown Menu */}
              {isDonateDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/donate"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsDonateDropdownOpen(false)}
                  >
                    Donate
                  </Link>
                  <a
                    href="https://reusefull.org/faqs/donor-faqs/"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsDonateDropdownOpen(false)}
                  >
                    Donor FAQs
                  </a>
                  <a
                    href="https://reusefull.org/un-dumpster-day/"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsDonateDropdownOpen(false)}
                  >
                    Un-Dumpster Day
                  </a>
                </div>
              )}
            </div>
            <div className="relative group" ref={whatWeDoDropdownRef}>
              <button
                onClick={() => setIsWhatWeDoDropdownOpen(!isWhatWeDoDropdownOpen)}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-md font-medium transition-colors flex items-center cursor-pointer"
              >
                What We Do
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {/* What We Do Dropdown Menu */}
              {isWhatWeDoDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <a
                    href="https://reusefull.org/un-dumpster-day/"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsWhatWeDoDropdownOpen(false)}
                  >
                    Un-Dumpster Day
                  </a>
                  <a
                    href="https://reusefull.org/repair-cafes/"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsWhatWeDoDropdownOpen(false)}
                  >
                    Repair Cafes
                  </a>
                  <a
                    href="https://reusefull.org/webinars/"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsWhatWeDoDropdownOpen(false)}
                  >
                    Webinars
                  </a>
                </div>
              )}
            </div>
            <div className="relative group" ref={getInvolvedDropdownRef}>
              <button
                onClick={() => setIsGetInvolvedDropdownOpen(!isGetInvolvedDropdownOpen)}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-md font-medium transition-colors flex items-center cursor-pointer"
              >
                Get Involved
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {/* Get Involved Dropdown Menu */}
              {isGetInvolvedDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <a
                    href="https://reusefull.org/sign-up-for-our-newsletter/"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsGetInvolvedDropdownOpen(false)}
                  >
                    Subscribe
                  </a>
                  <a
                    href="https://reusefull.org/events/"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsGetInvolvedDropdownOpen(false)}
                  >
                    Calendar
                  </a>
                  <a
                    href="https://reusefull.org/sign-up-to-volunteer/"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsGetInvolvedDropdownOpen(false)}
                  >
                    Volunteer
                  </a>
                  <a
                    href="https://givebutter.com/bereusefull"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsGetInvolvedDropdownOpen(false)}
                  >
                    Make a Donation
                  </a>
                </div>
              )}
            </div>
            <div className="relative group" ref={charityDropdownRef}>
              <button
                onClick={() => setIsCharityDropdownOpen(!isCharityDropdownOpen)}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-md font-medium transition-colors flex items-center cursor-pointer"
              >
                Charity Partners
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {/* Charity Partners Dropdown Menu */}
              {isCharityDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <a
                    href="https://reusefull.org/become-a-charity-partner/"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsCharityDropdownOpen(false)}
                  >
                    Charity Partners
                  </a>
                  <a
                    href="https://app.reusefull.org/charity/signup/step/1"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsCharityDropdownOpen(false)}
                  >
                    Signup
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsCharityDropdownOpen(false)}
                  >
                    Update Profile
                  </a>
                  <a
                    href="https://reusefull.org/become-a-charity-partner/"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsCharityDropdownOpen(false)}
                  >
                    Charity Partner FAQs
                  </a>
                  <a
                    href="https://reusefull.org/un-dumpster-day/"
                    className="block px-4 py-2 text-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setIsCharityDropdownOpen(false)}
                  >
                    Un-Dumpster Day
                  </a>
                </div>
              )}
            </div>
            <a href="https://reusefull.org/contact-us/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-md font-medium transition-colors">
              Contact
            </a>
            <a href="https://reusefull.org/about-us/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-md font-medium transition-colors">
              About
            </a>
            <a href="https://reusefull.org/blog/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-md font-medium transition-colors">
              Blog
            </a>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden 2xl:flex items-center space-x-4">
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-md font-medium">
              Signup
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 text-md font-medium flex items-center"
            >
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="2xl:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md hover:bg-blue-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="2xl:hidden border-t border-gray-100 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium rounded-md hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <div className="space-y-1">
                <div className="text-gray-700 px-3 py-2 text-base font-medium text-gray-500">
                  Donate
                </div>
                <Link
                  to="/donate"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Donate
                </Link>
                <a
                  href="https://reusefull.org/faqs/donor-faqs/"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Donor FAQs
                </a>
                <a
                  href="https://reusefull.org/un-dumpster-day/"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Un-Dumpster Day
                </a>
              </div>
              <div className="space-y-1">
                <div className="text-gray-700 px-3 py-2 text-base font-medium text-gray-500">
                  What We Do
                </div>
                <a
                  href="https://reusefull.org/un-dumpster-day/"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Un-Dumpster Day
                </a>
                <a
                  href="https://reusefull.org/repair-cafes/"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Repair Cafes
                </a>
                <a
                  href="https://reusefull.org/webinars/"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Webinars
                </a>
              </div>
              <div className="space-y-1">
                <div className="text-gray-700 px-3 py-2 text-base font-medium text-gray-500">
                  Get Involved
                </div>
                <a
                  href="https://reusefull.org/sign-up-for-our-newsletter/"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Subscribe
                </a>
                <a
                  href="https://reusefull.org/events/"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Calendar
                </a>
                <a
                  href="https://reusefull.org/sign-up-to-volunteer/"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Volunteer
                </a>
                <a
                  href="https://givebutter.com/bereusefull"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Make a Donation
                </a>
              </div>
              <div className="space-y-1">
                <div className="text-gray-700 px-3 py-2 text-base font-medium text-gray-500">
                  Charity Partners
                </div>
                <a
                  href="https://reusefull.org/become-a-charity-partner/"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Charity Partners
                </a>
                <a
                  href="https://app.reusefull.org/charity/signup/step/1"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Signup
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Update Profile
                </a>
                <a
                  href="https://reusefull.org/become-a-charity-partner/"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Charity Partner FAQs
                </a>
                <a
                  href="https://reusefull.org/un-dumpster-day/"
                  className="text-gray-700 hover:text-blue-600 block px-6 py-2 text-md font-medium rounded-md hover:bg-blue-50 ml-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Un-Dumpster Day
                </a>
              </div>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium rounded-md hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium rounded-md hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium rounded-md hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </a>

              {/* Mobile Action Buttons */}
              <div className="pt-4 pb-2 space-y-2">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
                >
                  Charity Signup
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 text-sm font-medium flex items-center justify-center"
                >
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
