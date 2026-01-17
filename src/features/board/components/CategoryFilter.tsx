import type { Category } from '../../../types';
import { clsx } from 'clsx';

interface CategoryFilterProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const categories: Category[] = ['All', 'Planning', 'Marketing', 'Design', 'IT'];

const categoryLabels: Record<Category, string> = {
  All: '전체',
  Planning: '기획',
  Marketing: '마케팅',
  Design: '디자인',
  IT: 'IT'
};

export const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <nav
      className="inline-flex h-[38px] items-center gap-2.5 px-2.5 py-[5px] bg-[#d9d9d9] rounded-[100px]"
      role="tablist"
      aria-label="카테고리 필터"
    >
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={activeCategory === category}
          onClick={() => onCategoryChange(category)}
          className={clsx(
            'inline-flex flex-col items-center justify-center px-2.5 py-[3px] rounded-[30px] transition-colors',
            activeCategory === category
              ? 'bg-gray-scalewhite'
              : 'bg-transparent hover:bg-gray-scalegray-scale-100'
          )}
        >
          <span className="font-body-b3-200 font-[number:var(--body-b3-200-font-weight)] text-black text-[length:var(--body-b3-200-font-size)] tracking-[var(--body-b3-200-letter-spacing)] leading-[var(--body-b3-200-line-height)] whitespace-nowrap [font-style:var(--body-b3-200-font-style)]">
            {categoryLabels[category]}
          </span>
        </button>
      ))}
    </nav>
  );
};
