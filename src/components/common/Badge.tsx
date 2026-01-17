import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'urgent' | 'outline';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2.5 px-[15px] py-[15px] rounded-[50px]';
  
  const variantStyles = {
    default: 'bg-gray-scalegray-scale-300 text-black',
    urgent: 'bg-red-500 text-white',
    outline: 'bg-gray-scalegray-scale-50 border border-solid border-gray-scalegray-scale-800 text-gray-scalegray-scale-800'
  };
  
  return (
    <span
      className={clsx(
        baseStyles,
        variantStyles[variant],
        'font-body-b3-200 font-[number:var(--body-b3-200-font-weight)] text-[length:var(--body-b3-200-font-size)] tracking-[var(--body-b3-200-letter-spacing)] leading-[var(--body-b3-200-line-height)] [font-style:var(--body-b3-200-font-style)]',
        className
      )}
    >
      {children}
    </span>
  );
};
