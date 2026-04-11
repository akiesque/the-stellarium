import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import HomeTab from "./HomeTab";
import ProjectsTab from "./ProjectsTab";
import ContactTab from "./ContactTab";
import Gallery from "./Gallery";
import { House, Library, MessageCircle, Images } from "lucide-react";
import AppShell from "./layout/AppShell";

const tabs = [
  { id: "home", label: "Home", icon: House },
  { id: "projects", label: "Projects", icon: Library },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "contact", label: "Contact Me", icon: MessageCircle },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);

  return (
    <AppShell
      backgroundTab={activeTab}
      navRight={({ isDarkMode }) => {
        const highlightedTab = hoveredTab ?? activeTab;
        return (
          <>
            <div
              className="flex items-center gap-1 flex-wrap justify-end"
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
            <Link
              to="/vrm-lab"
              className="text-sm font-medium px-3 py-2 rounded-lg text-[hsl(var(--nav-text))] hover:text-[hsl(var(--nav-hover-text))] hover:bg-[hsl(var(--nav-hover-bg)/0.5)] transition-colors shrink-0"
            >
              VRM lab
            </Link>
          </>
        );
      }}
    >
      <main className="relative z-10 container mx-auto max-w-5xl px-6 py-20 md:py-32">
        {activeTab === "home" && <HomeTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "gallery" && <Gallery />}
        {activeTab === "contact" && <ContactTab />}
      </main>
    </AppShell>
  );
}
