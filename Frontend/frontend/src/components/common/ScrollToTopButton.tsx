import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

const ScrollToTopButton = styled.button`
  ${tw`fixed bottom-4 right-4 p-2 rounded-full bg-gray-700 text-white z-50`}
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-3px);
  }
`;

interface Props {
  scrollToTop: () => void;
}

const TopButton: React.FC<Props> = ({ scrollToTop }) => {
  return (
    <ScrollToTopButton onClick={scrollToTop}>
      <div>TOP</div>
    </ScrollToTopButton>
  );
};

export default TopButton;
