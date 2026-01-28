import { useState } from 'react';
import type { JSX } from 'react';

export const TagSelectionSection = (): JSX.Element => {
  const [selectedTags, setSelectedTags] = useState<string[]>(['기획', '디자인', '개발']);
  
  const availableTags = [
    { id: 'planning', label: '기획', isActive: true },
    { id: 'design', label: '디자인', isActive: true },
    { id: 'development', label: '개발', isActive: true },
  ];

  const handleTagClick = (tagId: string) => {
    const tag = availableTags.find(t => t.id === tagId);
    if (tag) {
      setSelectedTags(prev =>
prev.includes(tag.label) 
          ? prev.filter(t => t !== tag.label)
          : [...prev, tag.label]
      );
    }
  };

  const handleAddTag = () => {
    console.log('Add new tag');
  };

  return (
    <section 
      className="flex flex-col w-[999px] items-start justify-center gap-2.5 px-[31px] py-5 absolute top-[948px] left-[391px] bg-gray-scale30 rounded-[10px]"
      aria-labelledby="tag-selection-heading"
    >
<div className="flex items-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
<h2 
          id="tag-selection-heading"
          className="relative w-fit font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-black text-[length:var(--heading-h3-300-font-size)] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] whitespace-nowrap [font-style:var(--heading-h3-300-font-style)]"
        >
직무태그 설정
        </h2>
<div 
          className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]"
          role="group"
          aria-label="직무 태그 선택"
        >
{availableTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagClick(tag.id)}
              className="flex w-[100px] h-[51px] items-center justify-center gap-[5px] px-2.5 py-[3px] relative bg-gray-scalegray-scale-50 rounded-[10px] border border-solid border-[#969599] hover:bg-gray-scalegray-scale-100 focus:outline-none focus:ring-2 focus:ring-primaryprimary-500 focus:ring-offset-2 transition-colors"
              aria-pressed={Boolean(selectedTags.includes(tag.label))}
            >
<span className="w-20 font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--body-b1-200-font-size)] text-center leading-[var(--body-b1-200-line-height)] relative tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)]">
{tag.label}
              </span>
</button>
))}

          <button
            type="button"
            onClick={handleAddTag}
            className="flex w-[129px] h-[51px] items-center justify-center gap-[5px] px-2.5 py-[3px] relative bg-gray-scalegray-scale-50 rounded-[10px] border border-solid border-[#d6d6d8] hover:bg-gray-scalegray-scale-100 focus:outline-none focus:ring-2 focus:ring-primaryprimary-500 focus:ring-offset-2 transition-colors"
            aria-label="새 태그 추가"
          >
<span className="flex-1 font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-gray-scalegray-scale-300 text-[length:var(--body-b1-200-font-size)] text-center leading-[var(--body-b1-200-line-height)] relative tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)]">
추가하기 +
            </span>
</button>
</div>
</div>
</section>
);
};
