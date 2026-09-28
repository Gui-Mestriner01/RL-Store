/** Fiozinho decorativo com um losango no meio — assina as seções. */
const Ornamento = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 12"
    aria-hidden="true"
    className={`h-3 w-28 text-line ${className}`}
    fill="none"
  >
    <path d="M0 6h44M76 6h44" stroke="currentColor" strokeWidth="1" />
    <path
      d="M60 1.5 64.5 6 60 10.5 55.5 6z"
      stroke="var(--color-rose)"
      strokeWidth="1"
      fill="none"
    />
    <circle cx="50" cy="6" r="1" fill="var(--color-rose)" />
    <circle cx="70" cy="6" r="1" fill="var(--color-rose)" />
  </svg>
);

export default Ornamento;
