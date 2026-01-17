import type { ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = '입력해주세요' }: SearchBarProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex w-full h-14 items-center gap-2.5 px-5 py-[15px] rounded-[100px] border border-solid border-gray-scalegray-scale-300">
      <label htmlFor="search-input" className="sr-only">
        검색
      </label>
      <input
        id="search-input"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="relative w-full font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-black text-[length:var(--heading-h3-300-font-size)] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] placeholder:text-gray-scalegray-scale-300 focus:outline-none"
        aria-label="검색 입력"
      />
    </div>
  );
};
