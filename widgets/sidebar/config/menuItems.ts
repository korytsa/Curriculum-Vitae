import { FaUserFriends } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";
import { GrDocumentUser } from "react-icons/gr";

export const menuItems = [
	{
		href: "/users",
		icon: FaUserFriends,
		label: "Employees",
	},
	{
		href: "/skills",
		icon: FaArrowTrendUp,
		label: "Skills",
	},
	{
		href: "/languages",
		icon: IoLanguage,
		label: "Languages",
	},
	{
		href: "/cvs",
		icon: GrDocumentUser,
		label: "CVs",
	},
];
