import type { JSX } from 'react';
import { calculateDDay, isUrgent } from '../../utils/dateUtils';

interface BadgeProps {
  // 서버에서 계산된 D-Day 문자열이 있으면 우선 사용합니다 (예: 'D-3', 'D-Day', '종료').
  dday?: string;
  // deadline이 주어지면 클라이언트에서 D-Day를 계산합니다.
  deadline?: Date | string;
}

export const Badge = ({ dday, deadline }: BadgeProps): JSX.Element => {
  const dDay = dday ?? (deadline ? calculateDDay(deadline) : '');
  const urgent = deadline ? isUrgent(deadline) : (typeof dday === 'string' && /D-?\d+|D-Day/.test(dday));
  
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
