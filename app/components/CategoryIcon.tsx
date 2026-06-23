/** Minimal line icon per category — atmospheric, not literal */
export function CategoryIcon({ categoryId, color = "var(--muted)" }: { categoryId: string; color?: string }) {
  const size = 24;
  const stroke = color;
  const icons: Record<string, React.ReactNode> = {
    food_eating: (
      <circle cx="12" cy="12" r="4" fill="none" stroke={stroke} strokeWidth="1.5" />
    ),
    aggression_safety: (
      <path d="M12 4v16M4 12h16" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    ),
    lying_dishonesty: (
      <path d="M8 12h8M12 8v8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    ),
    lying_reality: (
      <path d="M8 12h8M12 8v8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    ),
    stealing_taking: (
      <rect x="6" y="8" width="12" height="10" rx="1" fill="none" stroke={stroke} strokeWidth="1.5" />
    ),
    big_feelings: (
      <path d="M12 6c-2 0-4 2-4 4s2 4 4 6 4-2 4-6-2-4-4-4z" fill="none" stroke={stroke} strokeWidth="1.5" />
    ),
    sensory_body: (
      <circle cx="12" cy="12" r="6" fill="none" stroke={stroke} strokeWidth="1.5" />
    ),
    defiance_control: (
      <path d="M8 8l8 8M16 8l-8 8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    ),
    sleep_bedtime: (
      <path d="M12 6v4l3 2" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    ),
    nighttime_sleep: (
      <path d="M12 6v4l3 2" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    ),
    school_public: (
      <path d="M2 12h20M12 2v20" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    ),
    attachment_relationship: (
      <path d="M12 5v14M5 12h14" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    ),
  };
  const icon = icons[categoryId] ?? (
    <circle cx="12" cy="12" r="4" fill="none" stroke={stroke} strokeWidth="1.5" />
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      {icon}
    </svg>
  );
}
