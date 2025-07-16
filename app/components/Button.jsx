export default function Button({ children, variant = 'primary', size = 'md', ...props }) {
  const baseStyles = 'rounded-full font-semibold transition duration-300';
  const variants = {
    primary: 'bg-gradient-to-r from-[#1e90ff] via-[#00bfff] to-[#0077ff] text-white hover:from-[#00bfff] hover:to-[#1e90ff] shadow-lg',
    secondary: 'bg-[#101c3a] text-[#1e90ff] hover:bg-gradient-to-r hover:from-[#1e90ff] hover:to-[#00bfff] hover:text-white border border-[#1e90ff] shadow',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
}