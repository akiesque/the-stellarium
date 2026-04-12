import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";
import AboutMeTab from "./HomeTab";
import ProjectsTab from "./ProjectsTab";
import ContactTab from "./ContactTab";
// import Gallery from "./Gallery";
import { House, Library, MessageCircle, ArrowUp } from "lucide-react";
import AppShell from "./layout/AppShell";

const tabs = [
  { id: "about-me", label: "About Me", icon: House },
  { id: "projects", label: "Projects", icon: Library },
  // { id: "gallery", label: "Gallery", icon: Images },
  { id: "contact", label: "Contact Me", icon: MessageCircle },
] as const;

type TabId = (typeof tabs)[number]["id"];

type TabButtonRefsRef = { current: Partial<Record<TabId, HTMLButtonElement>> };

function NavArrowBelowBar({
  activeTab,
  tabBtnRefs,
}: {
  activeTab: TabId;
  tabBtnRefs: TabButtonRefsRef;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [centerX, setCenterX] = useState<number | null>(null);

  const measure = useCallback(() => {
    const strip = stripRef.current;
    const btn = tabBtnRefs.current[activeTab];
    if (!strip || !btn) return;
    const sr = strip.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setCenterX(br.left + br.width / 2 - sr.left);
  }, [activeTab, tabBtnRefs]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <div ref={stripRef} className="absolute h-8 w-full overflow-visible">
      {centerX != null ? (
        <motion.div
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={false}
          animate={{ left: centerX }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        >
          <ArrowUp
            className="h-4 w-4 text-[hsl(var(--nav-active-text))] animate-bounce"
            strokeWidth={4}
          />
        </motion.div>
      ) : null}
    </div>
  );
}

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<TabId>("about-me");
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);
  const tabBtnRefs = useRef<Partial<Record<TabId, HTMLButtonElement>>>({});

  return (
    <AppShell
      backgroundTab={activeTab}
      belowNav={
        <NavArrowBelowBar activeTab={activeTab} tabBtnRefs={tabBtnRefs} />
      }
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
                  type="button"
                  ref={(el) => {
                    if (el) tabBtnRefs.current[tab.id] = el;
                    else delete tabBtnRefs.current[tab.id];
                  }}
                  whileHover={{
                    transition: { ease: [0, 0.71, 0.2, 1.01] },
                  }}
                  whileTap={{ scale: 0.9 }}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onFocus={() => setHoveredTab(tab.id)}
                  className={`inline-flex text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "text-[hsl(var(--nav-active-text))]"
                      : "text-[hsl(var(--nav-text))] hover:text-[hsl(var(--nav-hover-text))]"
                  }`}
                >
                  <span className="relative inline-flex items-center gap-2 rounded-lg px-4 py-2">
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
                    <tab.icon className="relative z-10 w-4 h-4 shrink-0" />
                    <span className="relative z-10 hidden sm:inline">
                      {tab.label}
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </>
        );
      }}
    >
      <main className="relative z-10 container mx-auto max-w-5xl px-6 pt-[5.75rem] pb-20 md:pt-36 md:pb-32">
        {activeTab === "about-me" && <AboutMeTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {/* {activeTab === "gallery" && <Gallery />} */}
        {activeTab === "contact" && <ContactTab />}
      </main>
    </AppShell>
  );
}
