import { SkillIndicator } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { SkillCategory } from "../model/types";

interface CategoryBlockProps {
  category: SkillCategory;
  isDeleteMode?: boolean;
  selectedSkillIds?: Set<string>;
  onToggleSkillSelection?: (skillId: string) => void;
}

export function CategoryBlock({
  category,
  isDeleteMode = false,
  selectedSkillIds = new Set(),
  onToggleSkillSelection,
}: CategoryBlockProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-5">
        {category.name}
      </div>
      <div className="flex flex-wrap items-start gap-16">
        {category.skills.map((skill) => {
          const isSelected = selectedSkillIds.has(skill.id);
          return (
            <div
              key={skill.id}
              className={cn(
                "w-max min-w-[220px] rounded-full px-4 py-2 transition-all",
                isDeleteMode && "cursor-pointer",
                isDeleteMode && isSelected && "border border-red-500",
                "hover:bg-[#3A3A3A]/60"
              )}
              onClick={() => isDeleteMode && onToggleSkillSelection?.(skill.id)}
            >
              <SkillIndicator
                label={skill.name}
                value={skill.value}
                className={cn(
                  "w-full",
                  isDeleteMode && isSelected && "opacity-70"
                )}
              />
            </div>
          );
        })}
      </div>

      {category.children?.map((child) => (
        <div key={child.id} className="pl-6 border-l border-white/10 space-y-3">
          <div className="text-xs uppercase text-[var(--color-text-subtle)]">
            {child.name}
          </div>
          <div className="flex flex-wrap items-start gap-16">
            {child.skills.map((skill) => {
              const isSelected = selectedSkillIds.has(skill.id);
              return (
                <div
                  key={skill.id}
                  className={cn(
                    "w-max min-w-[220px] rounded-full px-4 py-2 transition-all",
                    isDeleteMode && "cursor-pointer",
                    isDeleteMode && isSelected && "border border-red-500",
                    "hover:bg-[#3A3A3A]/60"
                  )}
                  onClick={() =>
                    isDeleteMode && onToggleSkillSelection?.(skill.id)
                  }
                >
                  <SkillIndicator
                    label={skill.name}
                    value={skill.value}
                    className={cn(
                      "w-full",
                      isDeleteMode && isSelected && "opacity-70"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
