import { Link } from 'react-router-dom';

import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';

export default function Home() {
  const { data, locales } = usePreloadedDataLocalized();

  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <h2 className="text-xl font-semibold">Hjulverkstan</h2>
      <div className="flex gap-2">
        {locales.map((locale) => (
          <Link className="font-bold" key={locale} to={`/${locale}`}>
            {locale}
          </Link>
        ))}
      </div>
      <Link className="font-bold" to="/portal">
        Go to Portal
      </Link>
      <p>{data.generalContent.slogan}</p>
      {data.shop.map((shop) => (
        <div key={shop.id}>
          <h3 className="text-lg font-semibold">{shop.name}</h3>
          <p>{shop.bodyText}</p>
        </div>
      ))}
    </div>
  );
}
