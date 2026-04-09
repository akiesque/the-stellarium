import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HomeTab from "./HomeTab";
import ProjectsTab from "./ProjectsTab";
import DarkMode from "./ui/DarkMode";
import ContactTab from "./ContactTab";
import { House, Library, MessageCircle } from "lucide-react";

const tabs = [
  { id: "home", label: "Home", icon: House },
  { id: "projects", label: "Projects", icon: Library },
  { id: "contact", label: "Contact Me", icon: MessageCircle },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);

    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [isDarkMode]);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b overflow-hidden border-border bg-background/80 backdrop-blur-md">
        <div className="container max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          <span className="font-display text-lg font-bold tracking-tight">
            the stellarium<span className="text-primary">.</span>
          </span>

          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <motion.button
                whileHover={{
                  backgroundColor: "#b2bb7d",
                  transition: { duration: 0.2 },
                }}
                transition={{ duration: 0.2 }}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 container max-w-5xl mx-auto px-6 py-16">
        {activeTab === "home" && <HomeTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "contact" && <ContactTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
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
