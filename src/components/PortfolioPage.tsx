import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import HomeTab from "./HomeTab";
import ProjectsTab from "./ProjectsTab";
import ContactTab from "./ContactTab";
import AboutMeTab from "./AboutMeTab";
// import Gallery from "./Gallery";
import { House, Library, MessageCircle } from "lucide-react";
import AppShell from "./layout/AppShell";

const tabs = [
  { id: "home", label: "Home", icon: House },
  { id: "about", label: "About Me", icon: House },
  { id: "projects", label: "Projects", icon: Library },
  // { id: "gallery", label: "Gallery", icon: Images },
  { id: "contact", label: "Contact", icon: MessageCircle },
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

  useLayoutEffect(() => {
    const strip = stripRef.current;
    const btn = tabBtnRefs.current[activeTab];
    if (!strip || !btn) return;
    const sr = strip.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setCenterX(br.left + br.width / 2 - sr.left);
  }, [activeTab, tabBtnRefs]);

  useEffect(() => {
    const measure = () => {
      const strip = stripRef.current;
      const btn = tabBtnRefs.current[activeTab];
      if (!strip || !btn) return;
      const sr = strip.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      setCenterX(br.left + br.width / 2 - sr.left);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeTab, tabBtnRefs]);

  return (
    <div ref={stripRef} className="absolute h-1 w-full overflow-visible">
      {centerX != null ? (
        <motion.div
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={false}
          animate={{ left: centerX }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        ></motion.div>
      ) : null}
    </div>
  );
}

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);
  const [hasEntered, setHasEntered] = useState<Record<TabId, boolean>>({
    home: true,
    about: true,
    projects: true,
    contact: true,
  });
  const tabBtnRefs = useRef<Partial<Record<TabId, HTMLButtonElement>>>({});
  const sectionRefs = useRef<Partial<Record<TabId, HTMLElement>>>({});

  const getClosestTabToViewportAnchor = (): TabId => {
    const activationLineY = window.innerHeight * 0.28;
    let currentTab: TabId | null = null;
    let currentTop = Number.NEGATIVE_INFINITY;

    tabs.forEach((tab) => {
      const section = sectionRefs.current[tab.id];
      if (!section) return;

      const rect = section.getBoundingClientRect();
      if (rect.top <= activationLineY && rect.top > currentTop) {
        currentTop = rect.top;
        currentTab = tab.id;
      }
    });

    return currentTab ?? tabs[0].id;
  };

  // Keep intersection observer so navbar items accurately update on free scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setHasEntered((prev) => {
          const next = { ...prev };
          let changed = false;

          entries.forEach((entry) => {
            const id = entry.target.id as TabId;
            if (
              entry.isIntersecting &&
              entry.intersectionRatio >= 0.2 &&
              !next[id]
            ) {
              next[id] = true;
              changed = true;
            }
          });

          return changed ? next : prev;
        });

        const nextTab = getClosestTabToViewportAnchor();
        setActiveTab((prev) => (prev === nextTab ? prev : nextTab));
      },
      {
        root: null,
        rootMargin: "-16% 0px -52% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    tabs.forEach((tab) => {
      const section = sectionRefs.current[tab.id];
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleTabClick = (id: TabId, behavior: ScrollBehavior = "smooth") => {
    setActiveTab(id);
    setHoveredTab(id);

    const section = sectionRefs.current[id];
    if (!section) return;

    section.scrollIntoView({ behavior, block: "start" });
  };

  return (
    <AppShell
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
                  onClick={() => handleTabClick(tab.id)}
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
                        className="absolute inset-0 rounded-sm border"
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
        <motion.section
          id="home"
          ref={(el) => {
            if (el) sectionRefs.current.home = el;
            else delete sectionRefs.current.home;
          }}
          className="scroll-mt-32 min-h-[100vh] py-6 md:py-1"
          initial={{ opacity: 0 }}
          animate={hasEntered.home ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <HomeTab />
        </motion.section>

        <motion.section
          id="about"
          ref={(el) => {
            if (el) sectionRefs.current.about = el;
            else delete sectionRefs.current.about;
          }}
          className="scroll-mt-16 md:scroll-mt-12 min-h-[50vh] py-6 md:py-5"
          initial={{ opacity: 0 }}
          animate={hasEntered.about ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <AboutMeTab />
        </motion.section>

        <motion.section
          id="projects"
          ref={(el) => {
            if (el) sectionRefs.current.projects = el;
            else delete sectionRefs.current.projects;
          }}
          className="scroll-mt-16 min-h-[250px] py-6 md:py-10"
          initial={{ opacity: 0 }}
          animate={hasEntered.projects ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProjectsTab />
        </motion.section>

        <motion.section
          id="contact"
          ref={(el) => {
            if (el) sectionRefs.current.contact = el;
            else delete sectionRefs.current.contact;
          }}
          className="scroll-mt-16 min-h-[100vh] py-6 md:py-10"
          initial={{ opacity: 0 }}
          animate={hasEntered.contact ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <ContactTab />
        </motion.section>
      </main>
    </AppShell>
  );
}
