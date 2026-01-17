import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label 
            htmlFor={id}
            className="font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-black text-[length:var(--body-b2-200-font-size)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            'px-5 py-[15px] rounded-[100px] border border-solid border-gray-scalegray-scale-300',
            'font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-black text-[length:var(--heading-h3-300-font-size)]',
            'placeholder:text-gray-scalegray-scale-300 focus:outline-none focus:ring-2 focus:ring-primaryprimary-500',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
