import type { BlogPost } from "@/app/lib/blog/types";
import { SOBBING_MELTDOWN_SECTIONS } from "@/app/lib/blog/content/sobbing-meltdown";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "sobbing-meltdown",
    title: "What to say when your child is having a complete sobbing meltdown",
    description:
      "Why fewer words usually work better when your child is crying hard, flooded, and unable to calm down yet.",
    category: "Big feelings & meltdowns",
    publishedAt: "2026-07-01",
    image: "/images/blog/sobbing-meltdown.jpg",
    imageAlt: "Parent sitting calmly with a child during a hard emotional moment at home",
    author: {
      name: "Courtney White",
      role: "Founder, Phrasewell",
      avatar: "/images/courtney-white-founder.png",
    },
    sections: SOBBING_MELTDOWN_SECTIONS,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
