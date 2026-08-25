import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'

const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://facebook.com/bereusefull', Icon: Facebook },
  { name: 'Instagram', href: 'https://instagram.com/bereusefull', Icon: Instagram },
  { name: 'Twitter', href: 'https://twitter.com/bereusefull', Icon: Twitter },
  { name: 'YouTube', href: 'https://www.youtube.com/@BeReUseFull', Icon: Youtube },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/showcase/re-use-full/', Icon: Linkedin },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="https://reusefull.org/" className="flex items-center">
            <img
              src="/reusefull-logo-350.png"
              alt="Reusefull Logo"
              className="h-14 w-14 object-contain"
            />
          </a>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>&copy; 2020-{year} Re.Use.Full. All Rights Reserved.</span>
            <a href="https://reusefull.org/privacy-policy/" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <a href="https://reusefull.org/terms-and-conditions/" className="hover:text-blue-600 transition-colors">
              Terms and Conditions
            </a>
          </div>
          <div>
            Built and maintained by{' '}
            <a
              href="https://www.kcdigitaldrive.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Kansas City Digital Drive
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
