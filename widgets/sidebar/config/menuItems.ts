import { FaUserFriends } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";
import { GrDocumentUser } from "react-icons/gr";
import { MdOutlineApartment, MdOutlineWorkOutline, MdOutlineFolderCopy } from "react-icons/md";

export type MenuItem = {
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	labelKey: string;
};

type MenuKey = "users" | "projects" | "cvs" | "departments" | "positions" | "skills" | "languages";

const CATALOG: Record<MenuKey, MenuItem> = {
	users: {
		href: "/users",
		icon: FaUserFriends,
		labelKey: "features.sidebar.menu.employees",
	},
	projects: {
		href: "/projects",
		icon: MdOutlineFolderCopy,
		labelKey: "features.sidebar.menu.projects",
	},
	cvs: {
		href: "/cvs",
		icon: GrDocumentUser,
		labelKey: "features.sidebar.menu.cvs",
	},
	departments: {
		href: "/departments",
		icon: MdOutlineApartment,
		labelKey: "features.sidebar.menu.departments",
	},
	positions: {
		href: "/positions",
		icon: MdOutlineWorkOutline,
		labelKey: "features.sidebar.menu.positions",
	},
	skills: {
		href: "/skills",
		icon: FaArrowTrendUp,
		labelKey: "features.sidebar.menu.skills",
	},
	languages: {
		href: "/languages",
		icon: IoLanguage,
		labelKey: "features.sidebar.menu.languages",
	},
};

const makeMenu = (keys: MenuKey[]): MenuItem[] => keys.map((k) => CATALOG[k]);

export const adminPrimaryMenuItems = makeMenu(["users", "projects", "cvs"]);
export const adminSecondaryMenuItems = makeMenu(["departments", "positions", "skills", "languages"]);
export const employeeMenuItems = makeMenu(["users", "skills", "languages", "cvs"]);

export const menuItems = employeeMenuItems;
