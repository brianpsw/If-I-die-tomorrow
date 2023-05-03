import styled from 'styled-components';
import tw from 'twin.macro';

interface ButtonProps {
  color: string;
  size: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

const Button = styled.button<ButtonProps>`
  ${tw`rounded-full shadow-sm font-medium text-white cursor-pointer`}
  background-color: ${(props) => props.color};
  width: ${(props) => {
    if (props.size === 'sm') return '114px';
    if (props.size === 'md') return '175px';
    if (props.size === 'lg') return '342px';
    return '175px';
  }};
  font-size: 16px;
  border: none;
  height: 38px;
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
