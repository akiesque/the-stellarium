import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const HomeTab = () => {
  return (
    <motion.div className="relative md:fixed md:z-10">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-xs uppercase tracking-widest text-muted-foreground mb-3"
      >
        Hello! Welcome to the{" "}
        <span className="text-primary text-teal-500">stellarium</span>.
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="font-display text-5xl md:text-7xl font-bold leading-tight mb-4"
      >
        I make data
        <br />{" "}
        <span className="text-primary animate-pulse text-teal-500">
          pretty
        </span>{" "}
        & {""}
        <span className="text-primary animate-pulse text-teal-500">useful</span>
        .
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl mb-10"
      >
        I'm Stephanie Fermil, an aspiring data scientist passionate about
        learning data science and creating impactful, artistic and efficient
        solutions because{" "}
        <span className="text-primary text-teal-600">
          data deserves to look pretty.
        </span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <span className="text-sm font-body">Explore my work</span>
        <ArrowRight className="w-4 h-4 bounce-right" />
      </motion.div>
    </motion.div>
  );
};

export default HomeTab;
