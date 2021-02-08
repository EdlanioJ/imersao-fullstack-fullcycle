import { forwardRef, useContext } from 'react';
import BankContext from '../../context/BankContext';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: 'primary' | 'info';
}

const buttonStyles = {
  primary: 'btn-primary',
  info: 'btn-info',
};

const Button = forwardRef<any, ButtonProps>(
  ({ variant = 'primary', ...rest }, ref) => {
    const bank = useContext(BankContext);

    const className = [
      'btn',
      buttonStyles[variant],
      bank.cssCode,
      rest.className,
    ]
      .join(' ')
      .trim();
    return <button className={className} {...rest} ref={ref} />;
  }
);

export default Button;
