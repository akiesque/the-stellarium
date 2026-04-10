import { useEffect, useState } from "react";
import { motion } from "motion/react";
import HomeTab from "./HomeTab";
import ProjectsTab from "./ProjectsTab";
import DarkMode from "./ui/DarkMode";
import ContactTab from "./ContactTab";
import Gallery from "./Gallery";
import { House, Library, MessageCircle, Images } from "lucide-react";

const tabs = [
  { id: "home", label: "Home", icon: House },
  { id: "projects", label: "Projects", icon: Library },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "contact", label: "Contact Me", icon: MessageCircle },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const highlightedTab = hoveredTab ?? activeTab;

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);

    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [isDarkMode]);

  const galleryLocked = activeTab === "gallery";

  return (
    <div
      className={
        galleryLocked ? "h-[100dvh] overflow-hidden" : "min-h-screen"
      }
    >
      {/* Navigation */}
      <nav className="fixed absolute top-0 left-0 w-full z-50 border-b overflow-hidden border-border bg-background/80 backdrop-blur-md">
        <div className="container max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          <span className="font-display text-lg font-bold tracking-tight">
            the <span className="text-primary text-teal-600">stellarium</span>
            <span className="text-primary">.</span>
          </span>
          <div
            className="flex items-center gap-1"
            onMouseLeave={() => setHoveredTab(null)}
          >
            {tabs.map((tab) => (
              <motion.button
                whileHover={{
                  transition: { ease: [0, 0.71, 0.2, 1.01] },
                }}
                whileTap={{ scale: 0.9 }}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onFocus={() => setHoveredTab(tab.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "text-[hsl(var(--nav-active-text))]"
                    : "text-[hsl(var(--nav-text))] hover:text-[hsl(var(--nav-hover-text))]"
                }`}
              >
                {highlightedTab === tab.id && (
                  <motion.div
                    layoutId="tabHighlight"
                    className="absolute inset-0 rounded-lg border"
                    style={{
                      backgroundColor:
                        activeTab === tab.id
                          ? "hsl(var(--nav-active-bg) / 0.9)"
                          : isDarkMode
                            ? "hsl(var(--nav-hover-bg) / 0.9)"
                            : "hsl(var(--nav-hover-bg) / 0.95)",
                      borderColor: "hsl(var(--nav-active-border) / 0.9)",
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  />
                )}
                <tab.icon className="relative z-10 w-4 h-4" />
                <span className="relative z-10 hidden sm:inline">
                  {tab.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main
        className={
          galleryLocked
            ? "z-10 container mx-auto flex min-h-0 max-h-[calc(100dvh-4rem-6.5rem)] max-w-5xl flex-col overflow-hidden px-6 pt-5 pb-6"
            : "z-10 container mx-auto max-w-5xl px-6 py-20 md:py-32"
        }
      >
        {activeTab === "home" && <HomeTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "gallery" && <Gallery />}
        {activeTab === "contact" && <ContactTab />}
      </main>

      {/* Footer */}
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
};

export default Index;
