import { useState } from 'react';
import { clsx } from 'clsx';

interface RoleFilterProps {
  onRoleSelect: (role: string) => void;
}

const roles = [
  '기획', '마케팅', '디자인', 'IT', '개발', '영업',
  '재무', '인사', '법무', '운영', '전략', '컨설팅',
  '연구', '교육', '의료', '제조', '물류', '서비스',
  '미디어', '예술', '스포츠', '환경', '건설', '농업'
];

export const RoleFilter = ({ onRoleSelect }: RoleFilterProps) => {
  const [activeRole, setActiveRole] = useState<string>('기획');

  const handleRoleClick = (role: string) => {
    setActiveRole(role);
    onRoleSelect(role);
  };

  return (
    <aside
      className="w-[281px] rounded-[10px] border border-solid border-gray-scalegray-scale-300 p-6"
      role="complementary"
      aria-label="역할 필터"
    >
      <div className="flex flex-col items-start gap-3">
        {Array.from({ length: Math.ceil(roles.length / 2) }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-2.5 w-full">
            {roles.slice(rowIndex * 2, rowIndex * 2 + 2).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleClick(role)}
                className={clsx(
                  'flex w-[111px] h-[61px] items-center justify-center gap-2.5 px-[30px] py-[15px] rounded-[10px] transition-colors',
                  activeRole === role
                    ? 'bg-primaryprimary-200'
                    : 'bg-gray-scalewhite border border-solid border-gray-scalegray-scale-200 hover:bg-gray-scalegray-scale-50'
                )}
                aria-pressed={activeRole === role}
                aria-label={`${role} 필터`}
              >
                <span
                  className={clsx(
                    'font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]',
                    activeRole === role ? 'text-black' : 'text-gray-scalegray-scale-200'
                  )}
                >
                  {role}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};
