"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { ProfileProvider } from "@/hooks/useProfile";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <ProfileProvider>
            {children}
            <Toaster />
            <Sonner richColors closeButton toastOptions={{
              classNames: {
                toast: "bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-4",
                title: "text-foreground font-bold tracking-tight",
                description: "text-muted-foreground",
                actionButton: "bg-primary text-primary-foreground font-bold",
                cancelButton: "bg-muted text-muted-foreground",
                error: "border-destructive/30 bg-destructive/5 text-destructive",
                success: "border-success/30 bg-success/5 text-success",
              }
            }} />
          </ProfileProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
