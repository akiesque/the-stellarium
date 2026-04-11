import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Shroomseek",
    description:
      "A Resnet18 model that predicts the species of a mushroom based on its image.",
    tags: ["Streamlit", "Python", "ResNet18"],
    link: "https://github.com/akiesque/shroomseek",
  },
  {
    title: "Cryptone",
    description:
      "A model that predicts the price of a cryptocurrency based on its news and social media sentiment.",
    tags: ["Streamlit", "ARIMA-LSTM", "RoBERTa-FinBERT"],
    link: "https://github.com/akiesque/cryptone",
  },
  {
    title: "Cafe.ly",
    description:
      "A coffee recommendation system that recommends coffee based on the user's preferences and current IP location.",
    tags: ["Electron", "Python", "Flask", "OpenStreetMap API"],
    link: "https://github.com/akiesque/cafe.ly",
  },
  {
    title: "LogIX",
    description:
      "Finetuned a TrOCR model to recognize text from receipts and to streamline receipt logging processes of small to medium-sized businesses.",
    tags: ["Python", "OpenCV", "Transformers"],
    link: "https://github.com/akiesque/logix",
  },
];

const ProjectsTab = () => {
  return (
    <motion.div
      className="relative md:fixed md:z-10 w-full max-w-5xl mx-auto -my-5 md:-my-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: "easeInOut", duration: 0.5 }}
    >
      <h2 className="font-display text-3xl text-center md:text-center md:text-4xl font-bold m-2">
        Selected{" "}
        <span className="text-[hsl(var(--nav-active-text))]">Projects</span>
      </h2>
      <p className="text-muted-foreground text-center md:text-center mb-10 w-full">
        A curated collection of things I've built. Each one taught me something
        new.
      </p>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <motion.a
            key={project.title}
            href={project.link}
            whileHover={{
              y: -6,
              scale: 1.01,
              transition: { duration: 0.22, ease: [0.25, 0.1, 0.36, 1] },
            }}
            className="group block rounded-lg border border-border bg-gradient-to-br from-[hsl(var(--nav-active-bg)/0.55)] via-[hsl(var(--card))] to-[hsl(var(--muted)/0.75)] p-6 transition-all duration-300 hover:border-[hsl(var(--nav-active-border))] hover:bg-[hsl(var(--nav-hover-bg)/0.75)] hover:shadow-[0_16px_34px_-20px_hsl(var(--nav-active-bg))]"
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
