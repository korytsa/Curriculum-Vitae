import type { DropdownAlign } from "@/shared/ui/utils";
import type { DropdownMenuItem } from "@/shared/ui";

export type SidebarUserMenuDropdownProps = {
	items: DropdownMenuItem[];
	align?: DropdownAlign;
	className?: string;
	menuClassName?: string;
	menuWidth?: string;
	menuBgColor?: string;
};
