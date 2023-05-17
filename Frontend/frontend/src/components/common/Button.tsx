import styled from 'styled-components';
import tw from 'twin.macro';

interface ButtonProps {
  color: string;
  size: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

const Button = styled.button<ButtonProps>`
  ${tw`rounded-full shadow-sm min-w-[130px] font-medium text-white cursor-pointer `}
  background-color: ${(props) => props.color};
  width: ${(props) => {
    if (props.size === 'sm') return '8rem';
    if (props.size === 'md') return '13rem';
    if (props.size === 'lg') return '21rem';
    return '175px';
  }};
  font-size: 1.4rem;
  border: none;
  height: 4.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 버튼 사용시 이렇게 하면 됩니다용
// <Button color="#B3E9EB" size="sm">
//         Small Button
//       </Button>
//       <Button color="#36C2CC" size="md">
//         Medium Button
//       </Button>
//       <Button color="#046F75" size="lg">
//         Large Button
//       </Button>

export default Button;
