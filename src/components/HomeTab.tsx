import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import myImage from "../assets/my-image.jpg";

const HomeTab = () => {
  return (
    <motion.div className="relative w-full flow-root gap-6">
      <motion.img
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        src={myImage}
        alt="its me! hi!"
        className="w-1/2 md:w-1/3 h-auto max-h-[800px] object-cover rounded-xl float-right ml-6 mb-6 md:ml-12 md:mb-12 custom-shape"
      />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-sm md:text-xs uppercase tracking-widest text-muted-foreground mb-3"
      >
        Hello! Welcome to the{" "}
        <span className="text-primary text-teal-500">code atelier</span>.
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="font-display text-5xl md:text-7xl font-bold leading-tight mb-4"
      >
        <span className="text-primary text-teal-600">Stephanie Fermil</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-10"
      >
        I'm an aspiring data scientist passionate about data science, machine
        learning and creating impactful, and efficient business solutions
        presented through{" "}
        <span className="text-primary text-teal-600">
          <b>interaction and creativity</b>.
        </span>
        <br />
        <br /> I am a curious and passionate individual who always seeks answers
        and wants to bridge my knowledge in data science and my creativity in
        design to create innovative solutions.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <span className="text-sm font-body">More about me</span>
        <ArrowRight className="w-4 h-4 bounce-right" />
      </motion.div>
    </motion.div>
  );
};

export default HomeTab;
