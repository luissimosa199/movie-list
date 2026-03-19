import Link from "next/link";

interface BreadcrumbItem {
  href?: string;
  label: string;
  active?: boolean;
}

interface DecisionBreadcrumbsProps {
  items: BreadcrumbItem[];
  accentClassName?: string;
}

export default function DecisionBreadcrumbs({
  items,
  accentClassName = "text-white",
}: DecisionBreadcrumbsProps) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={item.active ? accentClassName : ""}>{item.label}</span>
          )}
          {index < items.length - 1 ? <span className="text-zinc-700">/</span> : null}
        </div>
      ))}
    </nav>
  );
}
