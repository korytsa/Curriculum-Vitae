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
import { IoSearchSharp, IoClose } from "react-icons/io5";

import { cn } from "@/shared/lib";

type SearchableRecord = Record<string, unknown>;

export interface SearchInputProps<
  TData extends SearchableRecord = SearchableRecord,
> extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange"
  > {
  data?: TData[];
  fields?: string[];
  onResults?: (results: TData[]) => void;
  onQueryChange?: (value: string) => void;
  resetKey?: number;
  hasError?: boolean;
}

const SearchInputBase = <TData extends SearchableRecord = SearchableRecord>(
  {
    className,
    data,
    fields,
    onResults,
    onQueryChange,
    resetKey,
    hasError,
    ...props
  }: SearchInputProps<TData>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [query, setQuery] = useState("");

  const getFieldValue = useCallback((item: SearchableRecord, path: string) => {
    return path.split(".").reduce<unknown>((acc, segment) => {
      if (acc === undefined || acc === null) {
        return undefined;
      }
      if (typeof acc !== "object") {
        return undefined;
      }
      return (acc as SearchableRecord)[segment];
    }, item);
  }, []);

  const filterData = useCallback(
    (value: string) => {
      if (!data || !fields?.length) {
        return data ?? [];
      }

      const normalizedQuery = value.trim().toLowerCase();
      if (!normalizedQuery) return data;

      return data.filter((item) =>
        fields.some((field) => {
          const rawValue = getFieldValue(item, field);
          if (rawValue === undefined || rawValue === null) return false;

          return String(rawValue).toLowerCase().includes(normalizedQuery);
        })
      );
    },
    [data, fields, getFieldValue]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onQueryChange?.(value);
  };

  const handleClear = () => {
    setQuery("");
    onQueryChange?.("");
  };

  useEffect(() => {
    if (onResults) {
      onResults(filterData(query));
    }
  }, [filterData, onResults, query]);

  useEffect(() => {
    if (resetKey !== undefined) {
      setQuery("");
    }
  }, [resetKey]);

  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 rounded-full border px-4 py-2 text-white focus-within:text-white",
        hasError ? "border-red-500" : "border-white/25",
        className
      )}
    >
      <IoSearchSharp className="h-[22px] w-[22px]" />

      <input
        type="search"
        ref={ref}
        value={query}
        onChange={handleChange}
        placeholder="Search"
        aria-invalid={hasError ? true : undefined}
        className="flex-1 bg-transparent placeholder:text-white/50 focus:outline-none"
        {...props}
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center justify-center text-white hover:text-white/80 transition-colors"
          aria-label="Clear search"
        >
          <IoClose className="h-5 w-5" />
        </button>
      )}
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
