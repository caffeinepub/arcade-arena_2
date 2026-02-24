import { SiFacebook, SiX, SiInstagram, SiYoutube, SiGithub } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'arcade-arena';

  return (
    <footer className="border-t border-neonBlue/20 bg-black/95 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent mb-2">
              Arcade Arena
            </h3>
            <p className="text-gray-400 text-sm">
              Play fun browser games with friends online
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-semibold text-neonBlue mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-neonBlue transition-colors"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-neonBlue transition-colors"
              >
                <SiX className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-neonBlue transition-colors"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-neonBlue transition-colors"
              >
                <SiYoutube className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-neonBlue transition-colors"
              >
                <SiGithub className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-neonBlue mb-3">Contact</h4>
            <p className="text-gray-400 text-sm">contact@arcadearena.com</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neonBlue/10 text-center text-sm text-gray-400">
          <p className="flex items-center justify-center gap-1">
            © {currentYear} Arcade Arena. Built with{' '}
            <Heart className="h-4 w-4 text-neonPurple fill-neonPurple" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neonBlue hover:text-neonPurple transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
