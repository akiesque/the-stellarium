import { SunMedium, MoonStar } from "lucide-react";

interface Props {
  onClick: () => void;
  isDarkMode: boolean;
}

const DarkMode = ({ onClick, isDarkMode }: Props) => {
  return (
    <div className="relative">
      <button
        type="button"
        className={`relative rounded-md border border-border px-1 py-1 -my-4 text-xs sm:text-sm text-foreground transition-colors group ${
          isDarkMode ? "hover:bg-gray-100" : "hover:bg-gray-800"
        }`}
        onClick={onClick}
        aria-pressed={isDarkMode}
      >
        {isDarkMode ? (
          <SunMedium className="w-4 h-4 text-gray-100 group-hover:text-gray-800" />
        ) : (
          <MoonStar className="w-4 h-4 text-gray-800 group-hover:text-gray-100" />
        )}

        {/* tooltip inside the button */}
        <div className="absolute top-full -mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground bg-background px-2 py-5 rounded pointer-events-none whitespace-nowrap">
          Toggle mode
        </div>
      </button>
    </div>
  );
};

export default DarkMode;
