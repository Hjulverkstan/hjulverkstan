import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const pathNameMapping: { [key: string]: string } = {
  shops: 'Shops',
  stories: 'Stories',
  services: 'Services',
  'join-us': 'Join Us',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ignoredLangCodes = ['sv', 'en', 'ar', 'fa', 'so', 'bs', 'tr'];

export const Breadcrumbs = () => {
  const location = useLocation();
  const allPathSegments = location.pathname
    .split('/')
    .filter((segment) => segment);

  let langPrefix = '';
  let displaySegments = allPathSegments;

  if (
    allPathSegments.length > 0 &&
    ignoredLangCodes.includes(allPathSegments[0].toLowerCase())
  ) {
    langPrefix = `/${allPathSegments[0]}`;
    displaySegments = allPathSegments.slice(1);
  }

  if (displaySegments.length === 0) {
    return null;
  }

  const breadcrumbItems = [
    <li key="home" className="flex items-center">
      <Link to={langPrefix || '/'} className="hover:underline">
        Home
      </Link>
    </li>,
  ];

  let currentDisplayPath = '';
  displaySegments.forEach((segment, index) => {
    currentDisplayPath += `/${segment}`;
    const fullPath = langPrefix + currentDisplayPath;
    const isLast = index === displaySegments.length - 1;
    const displayName =
      pathNameMapping[segment.toLowerCase()] ||
      capitalize(segment.replace('-', ' '));

    breadcrumbItems.push(
      <li key={`sep-${index}`} className="flex items-center" aria-hidden="true">
        <svg
          className="mx-3 h-3 w-3 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
        </svg>
      </li>,
    );

    if (isLast) {
      breadcrumbItems.push(<li key={fullPath}>{displayName}</li>);
    } else {
      breadcrumbItems.push(
        <li key={fullPath} className="flex items-center">
          <Link to={fullPath} className="hover:underline">
            {displayName}
          </Link>
        </li>,
      );
    }
  });

  return (
    <nav aria-label="Breadcrumb" className="text-muted-foreground mb-8 text-sm">
      <ol className="inline-flex list-none p-0">{breadcrumbItems}</ol>
    </nav>
  );
};
