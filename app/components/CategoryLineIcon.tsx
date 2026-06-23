import {
  Shield,
  Heart,
  CircleCheck,
  Moon,
  BookOpen,
  UtensilsCrossed,
  MessageCircle,
  Package,
  Hand,
  Users,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  food_eating: UtensilsCrossed,
  aggression_safety: Shield,
  lying_reality: MessageCircle,
  stealing_taking: Package,
  big_feelings: Heart,
  sensory_body: Hand,
  defiance_control: CircleCheck,
  nighttime_sleep: Moon,
  school_public: BookOpen,
  attachment_relationship: Users,
};

type CategoryLineIconProps = {
  categoryId: string;
  size?: number;
};

/** Minimal line icon per category — same icons on Home and Search. */
export function CategoryLineIcon({ categoryId, size = 20 }: CategoryLineIconProps) {
  const Icon = CATEGORY_ICONS[categoryId] ?? BookOpen;
  return (
    <Icon
      size={size}
      strokeWidth={1.5}
      style={{ flexShrink: 0, color: "var(--muted)" }}
      aria-hidden
    />
  );
}
