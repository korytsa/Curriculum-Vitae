import { FaUserFriends } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";
import { GrDocumentUser } from "react-icons/gr";

export const menuItems = [
	{
		href: "/users",
		icon: FaUserFriends,
		labelKey: "features.sidebar.menu.employees",
	},
	{
		href: "/skills",
		icon: FaArrowTrendUp,
		labelKey: "features.sidebar.menu.skills",
	},
	{
		href: "/languages",
		icon: IoLanguage,
		labelKey: "features.sidebar.menu.languages",
	},
	{
		href: "/cvs",
		icon: GrDocumentUser,
		labelKey: "features.sidebar.menu.cvs",
	},
];
