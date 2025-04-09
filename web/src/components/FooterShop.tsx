import { ArrowRight } from 'lucide-react';

export function FooterShop() {
  const shops = [
    {
      name: 'Hjällbo Shop',
      address: 'Skolspåret 15, 424 31 Angered',
      phone: '032423438',
    },
    {
      name: 'Backa Shop',
      address: 'Västra gården bakom 23, 443 14 Hisingsbacka',
      phone: '032423438',
    },
    {
      name: 'Biskopsgården Shop',
      address: 'Femte spåret vid sidan 34, 423 11 Göteborg',
      phone: '032423438',
    },
    {
      name: 'Frölunda Shop',
      address: 'Skolspåret 15, 424 31 Angered',
      phone: '032423438',
    },
    {
      name: 'Angered Shop',
      address: 'Fisktorget 13, 423 31 Göteborg',
      phone: '032423438',
    },
  ];

  return (
    <div
      className="grid w-full grid-cols-1 gap-x-8 gap-y-10 text-center
        sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:text-left"
    >
      {shops.map((shop) => {
        const addressParts = shop.address.split(',');
        return (
          <div
            key={shop.name}
            className="flex flex-col items-center lg:items-start"
          >
            <div
              className="mb-1 inline-flex cursor-pointer items-center gap-1
                font-semibold text-black"
            >
              <span>{shop.name}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
            <p className="text-sm">{addressParts[0]}</p>
            {addressParts[1] && (
              <p className="text-sm">{addressParts[1].trim()}</p>
            )}
            <div className="mt-2">
              <p className="text-sm">{shop.phone}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm font-semibold text-green-600">Open</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
