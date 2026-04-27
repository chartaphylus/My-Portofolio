import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="pb-6 mb-8 border-b border-gray-200 dark:border-[#1F1F1F] flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white mb-1">
          {title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
