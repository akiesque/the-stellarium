import { useEffect, useState, type ReactNode } from "react";
import DarkMode from "../ui/DarkMode";
import { Sparkle } from "lucide-react";

// AppShell is the main layout component for the portfolio page
// It contains the navigation bar, the content, and the footer
// dark mode toggle

type AppShellProps = {
  navRight: (ctx: { isDarkMode: boolean }) => ReactNode;
  belowNav?: ReactNode;
  children: ReactNode;
};

export default function AppShell({
  navRight,
  belowNav,
  children,
}: AppShellProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [isDarkMode]);

  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 z-50 w-full">
        <nav className="border-b border-border bg-background/80 backdrop-blur-md">
          <div className="absolute inset-0 animate-stripes opacity-20 pointer-events-none" />
          <div className="container max-w-5xl mx-auto px-6 flex items-center justify-between h-16 gap-4 overflow-hidden">
            <span className="font-display text-lg font-bold tracking-tight shrink-0">
              <Sparkle className="w-4 h-4 text-primary text-teal-600 inline-block mr-2" />
              the{" "}
              <span className="text-primary text-teal-600 inline-block">
                code atelier
              </span>
              <span className="text-primary inline-block">.</span>
            </span>
            <div className="flex items-center gap-2 min-w-0 justify-end">
              {navRight({ isDarkMode })}
            </div>
          </div>
        </nav>
        {belowNav != null ? (
          <div className="bg-background/80 backdrop-blur-md">
            <div className="container max-w-5xl mx-auto px-6">{belowNav}</div>
          </div>
        ) : null}
      </div>

      {children}

      <footer className="sticky top-[10vh]relative md:fixed bottom-0 left-0 w-full z-50 border-t border-border py-6 md:py-8 overflow-hidden border-border bg-background/80 backdrop-blur-md">
        <div className="absolute inset-0 animate-stripes opacity-20 pointer-events-none" />
        <div className="relative z-10 container max-w-5xl mx-auto px-6 text-center text-muted-foreground text-sm">
          © 2026 — Stephanie Fermil
          <span className="absolute right-6 top-1/2 -translate-y-1/2">
            <DarkMode
              onClick={() => setIsDarkMode((prev) => !prev)}
              isDarkMode={isDarkMode}
            />
          </span>
        </div>
      </footer>
    </div>
  );
}
