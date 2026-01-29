interface PublicToggleProps {
  isPublic: boolean;
  onChange: (value: boolean) => void;
}

const PublicToggle = ({ isPublic, onChange }: PublicToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isPublic}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!isPublic);
      }}
      className={`
        relative flex items-center
        w-[40px] h-[24px] p-[3px]
        rounded-full transition-all duration-200 ease-in-out
        bg-transparent border-2 box-border
        ${isPublic ? "border-[#6EEBC7]" : "border-[#7C7B80]"}
      `}
    >
      {/* 동그라미 */}
      <span
        className={`
          block w-[14px] h-[14px] rounded-full shadow-sm
          transition-transform duration-200 ease-in-out
          ${isPublic
            ? "bg-[#6EEBC7] translate-x-[15px]"
            : "bg-[#7C7B80] translate-x-0"}
        `}
      />
    </button>
  );
};

export default PublicToggle;
