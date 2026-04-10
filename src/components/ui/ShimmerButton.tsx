interface ShimmerButtonProps {
  label: string;
  description: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

const ShimmerButton = ({
  label,
  description,
  icon,
  onClick,
}: ShimmerButtonProps) => {
  return (
    <div className="relative z-10 flex h-full min-h-0 w-full min-w-0 flex-col">
      <button
        type="button"
        onClick={onClick}
        className="group relative flex h-full min-h-[7.5rem] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-[hsl(var(--nav-active-border)/0.55)] bg-gradient-to-br from-[hsl(var(--nav-active-bg)/0.75)] via-[hsl(var(--card))] to-[hsl(var(--muted)/0.95)] p-4 text-left shadow-[0_14px_36px_-20px_hsl(var(--nav-active-bg)/0.95)] backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[hsl(var(--nav-active-border)/0.95)] hover:shadow-[0_22px_48px_-22px_hsl(var(--nav-active-bg)/0.85)] active:scale-[0.98]"
      >
        {/* Shimmer sweep — primary accent (same family as tab highlight) */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[hsl(var(--primary)/0.28)] to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[hsl(var(--primary)/0.06)] via-[hsl(var(--primary)/0.12)] to-[hsl(var(--primary)/0.06)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10 flex flex-1 items-center gap-4">
          <div className="rounded-lg border border-[hsl(var(--nav-active-border)/0.45)] bg-[hsl(var(--nav-hover-bg)/0.9)] p-3 backdrop-blur-sm transition-colors duration-300 group-hover:border-[hsl(var(--nav-active-border)/0.75)] group-hover:bg-[hsl(var(--nav-hover-bg))]">
            <span className="text-[hsl(var(--nav-active-text))] [&_svg]:text-current">
              {icon}
            </span>
          </div>
          <div className="min-w-0 flex-1 self-stretch text-left">
            <p className="font-display text-lg font-bold text-[hsl(var(--nav-active-text))] transition-colors duration-300 group-hover:text-[hsl(var(--nav-hover-text))]">
              {label}
            </p>
            <p className="text-balance text-sm leading-snug text-muted-foreground transition-colors duration-300">
              {description}
            </p>
          </div>
          <div className="shrink-0 opacity-50 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              className="h-5 w-5 text-[hsl(var(--nav-active-text))]"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ShimmerButton;
