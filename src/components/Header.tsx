import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui'
import { useState } from 'react'
import { Menu, X, ChevronDown, User } from 'lucide-react'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

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
          <nav className="hidden 2xl:flex items-center space-x-6">
            <div className="relative group">
              <Link
                to="/donate"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors flex items-center"
              >
                Donate
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="relative group">
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors flex items-center">
                What We Do
                <ChevronDown className="ml-1 h-4 w-4" />
              </a>
            </div>
            <div className="relative group">
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors flex items-center">
                Get Involved
                <ChevronDown className="ml-1 h-4 w-4" />
              </a>
            </div>
            <div className="relative group">
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors flex items-center">
                Charity Partners
                <ChevronDown className="ml-1 h-4 w-4" />
              </a>
            </div>
            <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Contact
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Blog
            </a>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden 2xl:flex items-center space-x-4">
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-medium">
              Signup
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 text-sm font-medium flex items-center"
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
          <div className="2xl:hidden border-t border-gray-100 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium rounded-md hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/donate"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium rounded-md hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Donate
              </Link>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium rounded-md hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                What We Do
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium rounded-md hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Involved
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium rounded-md hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Charity Partners
              </a>
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
