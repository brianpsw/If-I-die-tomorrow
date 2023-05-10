'use client';

import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();
  const pathname = location.pathname;
  const navLinks = [
    { href: '/bucket', name: '버킷리스트' },
    { href: '/photo-cloud', name: '사진첩' },
    { href: '/diary', name: '다이어리' },
    { href: '/will', name: '유안장' },
  ];
  return (
    <>
      {navLinks.map((link: any) => {
        const isActive = pathname.startsWith(link.href);

        return (
          <Link
            className={isActive ? 'text-blue' : 'text-black'}
            to={link.href}
            key={link.name}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
