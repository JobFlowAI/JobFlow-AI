"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans flex data-[type=success]:border-success/30 data-[type=error]:border-destructive/30 data-[type=warning]:border-gold/30 data-[type=info]:border-blue-500/30 items-start w-full gap-4 rounded-2xl p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] backdrop-blur-2xl bg-background/70 border border-border/50",
          title: "text-sm font-bold text-foreground tracking-tight leading-tight",
          description: "text-[13px] text-muted-foreground mt-1 leading-relaxed",
          actionButton: "bg-primary text-primary-foreground font-semibold rounded-lg px-4 py-2 text-xs transition-transform hover:scale-105 active:scale-95 shadow-sm",
          cancelButton: "bg-secondary text-secondary-foreground font-semibold rounded-lg px-4 py-2 text-xs transition-colors hover:bg-secondary/80",
          icon: "mt-0.5 w-5 h-5 flex-shrink-0 group-data-[type=success]:text-success group-data-[type=error]:text-destructive group-data-[type=warning]:text-gold group-data-[type=info]:text-blue-500",
        },
      }}
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-success drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />,
        error: <XCircle className="w-5 h-5 text-destructive drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" />,
        info: <Info className="w-5 h-5 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />,
        warning: <AlertTriangle className="w-5 h-5 text-gold drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
