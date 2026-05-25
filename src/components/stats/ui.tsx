// utilidades compartidas para las vistas de Stats
export const glass =
  "backdrop-blur-xl bg-white/10 border border-white/15 shadow-2xl shadow-black/10 rounded-2xl";

export function IconButton({ children, onClick, label }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`${glass} hover:bg-white/12 size-9 grid place-content-center text-white/90`}
    >
      {children}
    </button>
  );
}
