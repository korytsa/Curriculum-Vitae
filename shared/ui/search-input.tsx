import {
	forwardRef,
	useCallback,
	useEffect,
	useState,
	type ChangeEvent,
	type ForwardedRef,
	type InputHTMLAttributes,
	type ReactElement,
	type Ref,
} from "react";
import { IoSearchSharp } from "react-icons/io5";

import { cn } from "@/shared/lib";

type SearchableRecord = Record<string, unknown>;

export interface SearchInputProps<TData extends SearchableRecord = SearchableRecord>
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> {
	data?: TData[];
	fields?: Array<keyof TData & string>;
	onResults?: (results: TData[]) => void;
}

const SearchInputBase = <TData extends SearchableRecord = SearchableRecord>(
	{ className, data, fields, onResults, ...props }: SearchInputProps<TData>,
	ref: ForwardedRef<HTMLInputElement>,
) => {
	const [query, setQuery] = useState("");

	const filterData = useCallback(
		(value: string) => {
			if (!data || !fields?.length) {
				return data ?? [];
			}

			const normalizedQuery = value.trim().toLowerCase();
			if (!normalizedQuery) return data;

			return data.filter((item) =>
				fields.some((field) => {
					const rawValue = item?.[field];
					if (rawValue === undefined || rawValue === null) return false;

					return String(rawValue).toLowerCase().includes(normalizedQuery);
				}),
			);
		},
		[data, fields],
	);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
	};

	useEffect(() => {
		if (onResults) {
			onResults(filterData(query));
		}
	}, [filterData, onResults, query]);

	return (
		<div className="flex w-full items-center gap-3 rounded-full text-white border border-white/25 bg-transparent px-4 py-2 transition-all hover:border-white/80 focus-within:border-red-500 focus-within:hover:border-red-500 focus-within:text-white">
            <IoSearchSharp className="w-[22px] h-[22px]" />

			<input
				type="search"
				ref={ref}
				value={query}
				onChange={handleChange}
                placeholder="Search"
				className={cn(
					"flex-1 bg-transparent placeholder:text-white/50 focus:outline-none",
					className,
				)}
				{...props}
			/>
		</div>
	);
};

const ForwardedSearchInput = forwardRef(SearchInputBase);
ForwardedSearchInput.displayName = "SearchInput";

const SearchInput = ForwardedSearchInput as <
	TData extends SearchableRecord = SearchableRecord,
>(
	props: SearchInputProps<TData> & { ref?: Ref<HTMLInputElement> }
) => ReactElement | null;

export { SearchInput };