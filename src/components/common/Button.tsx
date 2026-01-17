import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  ...props 
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2.5 rounded-[10px] transition-opacity hover:opacity-80 disabled:opacity-50';
  
  const variantStyles = {
    primary: 'bg-primaryprimary-500 text-black',
    secondary: 'bg-gray-scalegray-scale-300 text-black',
    ghost: 'bg-transparent text-black border border-gray-scalegray-scale-300'
  };
  
  const sizeStyles = {
    sm: 'px-[15px] py-[5px] text-[length:var(--heading-h3-200-font-size)]',
    md: 'px-5 py-2.5 text-[length:var(--heading-h3-200-font-size)]',
    lg: 'px-[30px] py-5 text-[length:var(--heading-h3-100-font-size)]'
  };
  
  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        'font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] [font-style:var(--heading-h3-200-font-style)]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
