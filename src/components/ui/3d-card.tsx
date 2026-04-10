import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

type MotionState = {
  rotateX: number;
  rotateY: number;
};

const CardMotionContext = createContext<MotionState>({
  rotateX: 0,
  rotateY: 0,
});

type CardContainerProps = {
  children: ReactNode;
  className?: string;
};

export function CardContainer({ children, className = "" }: CardContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width - 0.5) * 2;
    const py = (y / rect.height - 0.5) * 2;
    setRotateY(px * 14);
    setRotateX(-py * 14);
  };

  const reset = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const value = useMemo(() => ({ rotateX, rotateY }), [rotateX, rotateY]);

  return (
    <CardMotionContext.Provider value={value}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={reset}
        className={`flex justify-center [perspective:1200px] ${className}`}
      >
        {children}
      </div>
    </CardMotionContext.Provider>
  );
}

type CardBodyProps = {
  children: ReactNode;
  className?: string;
};

export function CardBody({ children, className = "" }: CardBodyProps) {
  const { rotateX, rotateY } = useContext(CardMotionContext);

  return (
    <div
      className={`relative [transform-style:preserve-3d] transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
    >
      {children}
    </div>
  );
}

type CardItemProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  translateZ?: string | number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "style">;

export function CardItem<T extends ElementType = "div">({
  as,
  children,
  className = "",
  translateZ = 0,
  style,
  ...rest
}: CardItemProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const z =
    typeof translateZ === "string" ? Number.parseFloat(translateZ) || 0 : translateZ;

  return (
    <Component
      {...(rest as object)}
      className={className}
      style={{
        ...(style as object),
        transform: `translateZ(${z}px)`,
      }}
    >
      {children}
    </Component>
  );
}
