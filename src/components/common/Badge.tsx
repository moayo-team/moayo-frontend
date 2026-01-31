import type { JSX } from 'react';
import { calculateDDay, isUrgent } from '../../utils/dateUtils';

interface BadgeProps {
  deadline: Date;
}

export const Badge = ({ deadline }: BadgeProps): JSX.Element => {
  const dDay = calculateDDay(deadline);
  const urgent = isUrgent(deadline);
  
  return (
    <div className={`inline-flex px-2 py-[5px] self-stretch flex-[0_0_auto] ${
      urgent ? 'bg-red-50' : 'bg-gray-scalegray-scale-50'
    } rounded-[5px] items-center justify-center gap-[5px] relative`}>
      <div className="inline-flex items-center gap-[9px] relative flex-[0_0_auto] mt-[-1.50px] mb-[-1.50px]">
        <time className={`w-fit mt-[-1.00px] font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] ${
          urgent ? 'text-red-600' : 'text-gray-scalegray-scale-800'
        } text-[length:var(--body-b2-200-font-size)] leading-[var(--body-b2-200-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-200-letter-spacing)] [font-style:var(--body-b2-200-font-style)]`}>
          {dDay}
        </time>
      </div>
    </div>
  );
};
