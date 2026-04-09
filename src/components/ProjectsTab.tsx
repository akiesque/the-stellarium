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
        Selected <span className="text-primary">Projects</span>
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
            whileHover={{ y: -4 }}
            className="group block rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium"
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
