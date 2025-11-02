import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/lib/i18n';

export default function Footer() {
  const { messages } = useTranslation();
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {messages.app.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {messages.ui.footer.description}
            </p>
            <div className="flex space-x-4">
              <span className="text-sm text-gray-500">
                {messages.ui.footer.madeWith}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {messages.ui.footer.quickLinks}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  {messages.ui.navigation.home}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  {messages.ui.navigation.products}
                </Link>
              </li>
              <li>
                <Link href="/category/featured" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  {messages.ui.navigation.featured}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {messages.ui.footer.contact}
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://wa.me/5581999999999" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {messages.ui.footer.whatsApp}
                </a>
              </li>
              <li>
                <span className="text-sm text-gray-600">
                  {messages.ui.footer.businessHours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {messages.app.name}. {messages.ui.footer.allRightsReserved}
          </p>
          <p className="text-sm text-gray-500 mt-2 md:mt-0">
            {messages.ui.footer.builtWith}
          </p>
        </div>
      </div>
    </footer>
  );
}