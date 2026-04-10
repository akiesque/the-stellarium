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
    <div className="flex flex-col gap-6 max-w-sm mx-auto relative z-10">
      <button
        onClick={onClick}
        className="group relative p-4 rounded-2xl backdrop-blur-xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 via-black-900/60 to-black/80 shadow-2xl hover:shadow-indigo-500/30 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all duration-500 ease-out cursor-pointer hover:border-indigo-400/60 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-indigo-400/20 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500/30 to-indigo-600/10 backdrop-blur-sm group-hover:from-indigo-400/40 group-hover:to-indigo-500/20 transition-all duration-300">
            {icon}
          </div>
          <div className="flex-1 text-left">
            <p className="text-indigo-400 font-bold text-lg group-hover:text-indigo-300 transition-colors duration-300 drop-shadow-sm">
              {label}
            </p>
            <p className="text-indigo-300/60 text-sm group-hover:text-indigo-200/80 transition-colors duration-300">
              {description}
            </p>
          </div>
          <div className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              className="w-5 h-5 text-indigo-400"
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
