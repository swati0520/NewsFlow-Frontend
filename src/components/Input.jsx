const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
  className = "",
  ...props
}) => {
  const inputClasses = [
    "w-full rounded-2xl border border-violet-400/20 bg-white/3 px-4 py-3.5 text-base text-white placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-violet-300/70 focus:bg-violet-500/[0.04] focus:ring-2 focus:ring-violet-400/30",
    className,
  ].join(" ");

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm text-zinc-300">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        className={inputClasses}
        {...props}
      />
    </div>
  );
};

export default Input;
