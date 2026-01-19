import { NavLink } from "react-router-dom";

const ProfileSidebar = () => {
    const menu = [
        { label: "프로필", path: "/profile" },
        { label: "이력 관리", path: "history" },
        { label: "게시글 관리", path: "posts" },
    ];

    return (
        <aside className="flex w-[317px] h-fit px-[39px] py-[80px]
            justify-center items-center gap-[10px]
            border rounded-[20px] border-[#D6D6D8]">
            <nav className="w-full">
                <ul className="flex flex-col items-center self-stretch gap-[77px] shrink-0">
                    {menu.map(({ label, path }) => (
                        <li key={path}>
                            <NavLink
                                to={path}
                                end
                                className={({ isActive }) =>
                                `w-[223px] px-[10px] py-[2px] items-center 
                                font-pretendard text-[24px] font-bold leading-[130%] cursor-pointer
                                ${isActive ? "text-[#343436]"
                                : "text-[#969599]"}`
                                }
                            >
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default ProfileSidebar;