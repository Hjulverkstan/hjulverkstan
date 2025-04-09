import { ArrowRight } from 'lucide-react';

export function PartnersSection() {
  const partners = [
    { name: 'Poseidon', src: '/poseidon.png' },
    { name: 'Bostadsbolaget', src: '/bostadsbolaget.png' },
    { name: 'Poseidon', src: '/poseidon.png' },
    { name: 'Bostadsbolaget', src: '/bostadsbolaget.png' },
    { name: 'Familjebostäder', src: '/familjebostader.png' },
    { name: 'Poseidon', src: '/poseidon.png' },
    { name: 'Bostadsbolaget', src: '/bostadsbolaget.png' },
    { name: 'Familjebostäder', src: '/familjebostader.png' },
    { name: 'Poseidon', src: '/poseidon.png' },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="mb-12 flex w-full items-center justify-between">
        <h2 className="text-3xl font-bold">Our partners</h2>
        <a
          href="#"
          className="flex items-center gap-2 text-sm text-gray-800 no-underline
            hover:text-gray-900"
        >
          See all partners
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div
        className="grid grid-cols-2 place-items-center gap-6 sm:grid-cols-3
          md:grid-cols-4 lg:grid-cols-5"
      >
        {partners.map((partner, index) => (
          <img
            key={index}
            src={partner.src}
            alt={partner.name}
            className="h-16 w-auto"
          />
        ))}
      </div>
    </div>
  );
}
