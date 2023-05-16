'use client';

import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
const FeedTab = styled.div`
  ${tw`flex pt-12 fixed min-w-[100%] justify-evenly text-white text-xl z-10`}
`;
export function Navigation() {
  const location = useLocation();
  const pathname = location.pathname;
  const navLinks = [
    { href: '/bucket', name: '버킷리스트' },
    { href: '/photo-cloud', name: '사진첩' },
    { href: '/diary', name: '다이어리' },
    { href: '/will', name: '유언장' },
  ];
  return (
    <FeedTab>
      {navLinks.map((link: any) => {
        const isActive = pathname.startsWith(link.href);

        return (
          <Link
            className={
              isActive
                ? 'cursor-pointer mb-6 inline-block pb-1 font-bold border-b-4'
                : 'text-black'
            }
            to={link.href}
            key={link.name}
            style={isActive ? { borderColor: '#FFA9A9' } : {}}
          >
            {link.name}
          </Link>
        );
      })}
    </FeedTab>
  );
}
