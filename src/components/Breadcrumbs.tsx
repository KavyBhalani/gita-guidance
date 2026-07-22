"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <nav className="flex items-center text-sm text-foreground/60 mb-6 px-4 py-2 glass rounded-full w-fit mt-4 mx-auto md:mx-0 relative z-20">
      <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;
        const formattedSegment = segment.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

        return (
          <div key={path} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-1 opacity-50" />
            {isLast ? (
              <span className="text-foreground/90 font-medium truncate max-w-[150px] md:max-w-[300px]">
                {formattedSegment}
              </span>
            ) : (
              <Link href={path} className="hover:text-primary transition-colors truncate max-w-[150px]">
                {formattedSegment}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
