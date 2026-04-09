import { SunMedium, MoonStar } from "lucide-react";

interface Props {
  onClick: () => void;
  isDarkMode: boolean;
}

const DarkMode = ({ onClick, isDarkMode }: Props) => {
  return (
    <button
      type="button"
      className="rounded-md border border-border px-1 py-1 text-xs sm:text-sm text-foreground hover:bg-muted transition-colors"
      onClick={onClick}
      aria-pressed={isDarkMode}
    >
      {isDarkMode ? (
        <SunMedium className="w-4 h-4" />
      ) : (
        <MoonStar className="w-4 h-4" />
      )}
    </button>
  );
};

export default DarkMode;
