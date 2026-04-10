import Spinner, { type GalleryItem } from "./ui/Spinner";
import { motion } from "motion/react";

/** Add entries here — grid is 1 / 2 / 3 columns by breakpoint. */
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    title: "Brand & UI",
    description: "Palette, type, and layout studies.",
    cover: "🎨",
  },
  {
    id: "2",
    title: "Still frames",
    description: "Compositions and mood boards.",
    cover: "🖼️",
  },
  {
    id: "3",
    title: "Micro-interactions",
    description: "Motion and feedback ideas.",
    cover: "✨",
  },
  {
    id: "4",
    title: "Goals & focus",
    description: "Project direction sketches.",
    cover: "🎯",
  },
  {
    id: "5",
    title: "Patterns",
    description: "Repeating motifs and tiles.",
    cover: "💠",
  },
  {
    id: "6",
    title: "Highlights",
    description: "Featured explorations.",
    cover: "🌟",
  },
  {
    id: "7",
    title: "Structure",
    description: "Grids and scaffolding.",
    cover: "⬡",
  },
  {
    id: "sample-photo",
    title: "Forest path",
    description:
      "Example with a photo — use `imageSrc` / `imageAlt` for assets.",
    imageSrc:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Sunlight through trees on a forest path",
  },
];

const Gallery = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeInOut", duration: 0.45 }}
        className="shrink-0"
      >
        <h2 className="font-display text-2xl font-bold md:text-3xl">Gallery</h2>
        <p className="mt-1 max-w-lg text-muted-foreground">
          I leverage my artistical skills for my projects — here are some of my
          works. Hover cards for depth.
        </p>
      </motion.div>

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-secondary p-3 sm:p-4">
        <Spinner items={GALLERY_ITEMS} />
      </div>
    </div>
  );
};

export default Gallery;
