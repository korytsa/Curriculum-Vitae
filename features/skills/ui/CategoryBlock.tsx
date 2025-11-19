import { SkillIndicator } from '@/shared/ui';
import type { SkillCategory } from '../model/types';

interface CategoryBlockProps {
  category: SkillCategory;
}

export function CategoryBlock({ category }: CategoryBlockProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-5">
        {category.name}
      </div>
      <div className="flex flex-wrap items-start gap-16">
        {category.skills.map((skill) => (
          <div key={skill.id} className="w-max min-w-[220px]">
            <SkillIndicator
              label={skill.name}
              value={skill.value}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {category.children?.map((child) => (
        <div key={child.id} className="pl-6 border-l border-white/10 space-y-3">
          <div className="text-xs uppercase text-gray-500">{child.name}</div>
          <div className="flex flex-wrap items-start gap-16">
            {child.skills.map((skill) => (
              <div key={skill.id} className="w-max min-w-[220px]">
                <SkillIndicator
                  label={skill.name}
                  value={skill.value}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

