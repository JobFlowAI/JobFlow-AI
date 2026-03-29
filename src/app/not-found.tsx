"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center group">
        <h1 className="mb-4 text-8xl font-extrabold tracking-tighter text-foreground">404</h1>
        <p className="mb-8 text-xl text-muted-foreground font-medium">We couldn't track down this page.</p>
        <Link href="/">
          <button className="px-6 py-3 rounded-full bg-foreground text-background font-bold hover:scale-105 transition-all shadow-md">
            Return to operations
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
