import { Facebook, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 py-10 border-t border-gray-200">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Top Row - Logo + Tagline */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-2xl font-bold text-blue-500 tracking-wide">MoneyPal</h1>
            <p className="text-gray-500 text-sm mt-1">
              AI-powered finance tracker — making money management smart & simple.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {[
              { icon: Facebook, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Linkedin, href: "#" },
              { icon: Github, href: "#" }
            ].map(({ icon: Icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-blue-500 hover:text-white transition-colors"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mt-8">
          <div>
            <h3 className="text-blue-500 font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition">Features</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-blue-500 font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Blog</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Careers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-blue-500 font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Contact</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Status</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-blue-500 font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Cookies</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} MoneyPal. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built with ❤️</p>
        </div>
      </div>
    </footer>
  );
}
