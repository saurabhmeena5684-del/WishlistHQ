export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <rect width="32" height="32" rx="7" className="fill-elevated" />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10 5.5h12c1.4 0 2.5 1.1 2.5 2.5v16c0 1.4-1.1 2.5-2.5 2.5H10c-1.4 0-2.5-1.1-2.5-2.5V8c0-1.4 1.1-2.5 2.5-2.5zm1.75 3.25h8.5v13.5h-8.5V8.75z"
      />
    </svg>
  );
}
