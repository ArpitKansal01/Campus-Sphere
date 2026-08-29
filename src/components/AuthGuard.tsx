"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const publicPaths = ["/", "/signin", "/signup"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Check if the current path is public
    const isPublicPath = publicPaths.includes(pathname);

    if (!token && !isPublicPath) {
      // If no token and trying to access a protected route, redirect to sign in
      router.push("/signin");
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  // Optionally, show nothing or a loading spinner while checking authentication on protected routes
  if (isAuthenticated === null && !publicPaths.includes(pathname)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
