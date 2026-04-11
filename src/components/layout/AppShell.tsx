import { useEffect, useState, type ReactNode } from "react";
import DarkMode from "../ui/DarkMode";
import VRMBackground from "../VRMBackground";

type AppShellProps = {
  /** Right side of the nav: tabs, route links, etc. Receives dark mode for styling that depends on it. */
  navRight: (ctx: { isDarkMode: boolean }) => ReactNode;
  children: ReactNode;
  /** Passed to `VRMBackground` so the 3D camera can react to portfolio tabs. */
  backgroundTab?: string;
};

export default function AppShell({
  navRight,
  children,
  backgroundTab,
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
      <VRMBackground activeTab={backgroundTab} />
      <nav className="fixed absolute top-0 left-0 w-full z-50 border-b overflow-hidden border-border bg-background/80 backdrop-blur-md">
        <div className="container max-w-5xl mx-auto px-6 flex items-center justify-between h-16 gap-4">
          <span className="font-display text-lg font-bold tracking-tight shrink-0">
            the <span className="text-primary text-teal-600">stellarium</span>
            <span className="text-primary">.</span>
          </span>
          <div className="flex items-center gap-2 min-w-0 justify-end">
            {navRight({ isDarkMode })}
          </div>
        </div>
      </nav>

      {children}

      <footer className="fixed bottom-0 left-0 w-full z-50 border-t border-border py-8 overflow-hidden border-border bg-background/80 backdrop-blur-md">
        <div className="relative z-10 container max-w-5xl mx-auto px-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} — Built with passion.
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
