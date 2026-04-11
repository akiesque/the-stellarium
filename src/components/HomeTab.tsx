import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const HomeTab = () => {
  return (
    <motion.div className="relative md:fixed md:z-10">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6"
      >
        I build things
        <br />
        for the{" "}
        <span className="text-primary animate-pulse text-teal-500">web</span>.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl mb-10"
      >
        I'm a developer passionate about crafting clean, performant, and
        delightful digital experiences. Currently focused on modern web
        technologies and design systems.
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
