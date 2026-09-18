const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "group flex w-full items-center justify-center gap-3 rounded-full border border-violet-400/30 bg-white/3 px-5 py-3.5 text-base font-medium text-zinc-50 shadow-[0_0_0_1px_rgba(168,85,247,0.08),0_18px_40px_rgba(76,29,149,0.28)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/60 hover:bg-violet-500/8 hover:shadow-[0_0_0_1px_rgba(192,132,252,0.25),0_18px_44px_rgba(168,85,247,0.28)] focus:outline-none focus:ring-2 focus:ring-violet-400/70 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
