import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack online store with cart, checkout, and payment integration.",
    tags: ["React", "Node.js", "Stripe"],
    link: "#",
  },
  {
    title: "Task Management App",
    description:
      "Collaborative task board with real-time updates and team workspaces.",
    tags: ["TypeScript", "Firebase", "Tailwind"],
    link: "#",
  },
  {
    title: "Weather Dashboard",
    description:
      "Beautiful weather visualization with 7-day forecasts and location search.",
    tags: ["React", "Chart.js", "API"],
    link: "#",
  },
  {
    title: "Portfolio Generator",
    description:
      "A CLI tool that scaffolds stunning developer portfolios from config files.",
    tags: ["Node.js", "CLI", "Templates"],
    link: "#",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ProjectsTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
        Selected{" "}
        <span className="text-[hsl(var(--nav-active-text))]">Projects</span>
      </h2>
      <p className="text-muted-foreground mb-10 max-w-lg">
        A curated collection of things I've built. Each one taught me something
        new.
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {projects.map((project) => (
          <motion.a
            key={project.title}
            href={project.link}
            variants={item}
            whileHover={{
              y: -6,
              scale: 1.01,
              transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            }}
            className="group block rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-[hsl(var(--nav-active-border))] hover:bg-[hsl(var(--nav-hover-bg)/0.55)] hover:shadow-[0_16px_34px_-20px_hsl(var(--nav-active-bg))]"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-display text-xl font-semibold transition-colors group-hover:text-[hsl(var(--nav-active-text))]">
                {project.title}
              </h3>
              <ExternalLink className="w-4 h-4 text-muted-foreground transition-colors group-hover:text-[hsl(var(--nav-active-text))] shrink-0 mt-1" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium transition-colors group-hover:bg-[hsl(var(--nav-hover-bg)/0.85)] group-hover:text-[hsl(var(--nav-hover-text))]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ProjectsTab;
