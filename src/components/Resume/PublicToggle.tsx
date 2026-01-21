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
      onClick={() => onChange(!isPublic)}
      className={`
        relative flex items-center
        w-[36.667px] h-[23.333px] p-[5px]
        rounded-full transition-colors duration-200
        bg-transparent ring-2
        ${isPublic ? "ring-[#6EEBC7]" : "ring-[#7C7B80]"}
      `}
    >
      {/* 동그라미 */}
      <span
        className={`
          block w-[13px] h-[13px] rounded-full
          transition-transform duration-200
          ${isPublic
            ? "bg-[#6EEBC7] translate-x-[15px] ring-[#6EEBC7]"
            : "bg-[#7C7B80] translate-x-0"}
        `}
      />
    </button>
  );
};

export default PublicToggle;
