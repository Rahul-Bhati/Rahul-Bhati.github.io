/** Brand monogram — violet→fuchsia "R" tile. Matches the OG cards & project tiles. */
export function Logo({
  size = 28,
  className,
  title = "Rahul Bhati",
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id="rb-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="26" fill="url(#rb-logo-grad)" />
      <text
        x="50"
        y="53"
        fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontSize="60"
        fontWeight="700"
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
      >
        R
      </text>
    </svg>
  );
}
