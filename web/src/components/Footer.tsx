import { FooterShop } from './FooterShop';
import { FooterText } from './FooterText';

export default function Footer() {
  return (
    <footer
      className="flex flex-col items-center gap-12 bg-[#F0F0F0] px-4 py-10
        md:gap-16 md:px-8 md:py-16 lg:px-16 lg:py-20"
    >
      <div className="flex w-full justify-center">
        <nav
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 rounded-full
            bg-white px-6 py-3 text-sm text-gray-700 md:gap-8 md:px-8"
        >
          {['Home', 'Shops', 'Services', 'Stories', 'Support', 'Contact'].map(
            (item) => (
              <div key={item} className="cursor-pointer hover:underline">
                {item}
              </div>
            ),
          )}
        </nav>
      </div>

      <div className="w-full border-t border-gray-300" />

      <FooterShop />

      <div className="w-full border-t border-gray-300" />

      <FooterText />
    </footer>
  );
}
