import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6 overflow-x-auto scrollbar-hide">
      <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-emerald-600 transition whitespace-nowrap">
        <Home className="w-4 h-4" />
        <span>خانه</span>
      </Link>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <ChevronLeft className="w-4 h-4 text-gray-400 shrink-0" />
          {item.href ? (
            <Link to={item.href} className="text-gray-500 hover:text-emerald-600 transition whitespace-nowrap">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-bold whitespace-nowrap">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
