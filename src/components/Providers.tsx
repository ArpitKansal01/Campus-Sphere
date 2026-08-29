"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 60 seconds — won't re-fetch on tab focus
            staleTime: 60 * 1000,
            // Keep unused cache entries for 5 minutes after component unmounts
            gcTime: 5 * 60 * 1000,
            // Retry once on failure, with a 2-second delay
            retry: 1,
            retryDelay: 2000,
            // Don't re-fetch when the window regains focus (avoids hammering DB)
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
