import type { ReactNode } from "react";
import { CardBody, CardContainer, CardItem } from "./3d-card";

export type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  cover?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
};

type SpinnerProps = {
  items?: GalleryItem[];
  className?: string;
};

export default function Spinner({ items, className }: SpinnerProps) {
  const list = items?.length ? items : DEFAULT_GALLERY_ITEMS;

  return (
    <div className={`w-full ${className ?? ""}`}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => (
          <CardContainer key={item.id} className="w-full">
            <CardBody className="group/card bg-card relative h-full w-full rounded-xl border border-border p-5 shadow-sm transition-shadow duration-300 hover:shadow-[0_20px_44px_-28px_hsl(var(--nav-active-bg)/0.5)] dark:hover:shadow-[0_24px_48px_-24px_hsl(0_0%_0%/0.55)]">
              <CardItem
                translateZ={48}
                as="h3"
                className="font-display text-lg font-semibold text-foreground"
              >
                {item.title}
              </CardItem>
              {item.description ? (
                <CardItem
                  as="p"
                  translateZ={56}
                  className="mt-2 text-sm leading-relaxed text-muted-foreground"
                >
                  {item.description}
                </CardItem>
              ) : null}

              {item.imageSrc ? (
                <CardItem translateZ={100} className="mt-4 w-full">
                  <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20">
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt ?? item.title}
                      className="h-52 w-full object-cover transition-transform duration-300 group-hover/card:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                </CardItem>
              ) : item.cover != null ? (
                <CardItem translateZ={96} className="mt-4 w-full">
                  <div className="flex h-52 w-full items-center justify-center rounded-xl border border-border/60 bg-muted/30 text-5xl sm:text-6xl">
                    {item.cover}
                  </div>
                </CardItem>
              ) : null}
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </div>
  );
}

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
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
];
