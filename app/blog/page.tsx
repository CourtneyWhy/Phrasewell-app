import type { Metadata } from "next";
import { LandingHeader } from "@/app/components/landing/LandingHeader";
import { LandingFooter } from "@/app/components/landing/LandingFooter";
import { BlogBetaSection } from "@/app/components/blog/BlogBetaSection";
import { BlogPostCard } from "@/app/components/blog/BlogPostCard";
import { BLOG_POSTS } from "@/app/lib/blog/posts";

export const metadata: Metadata = {
  title: "Parenting scripts — Phrasewell",
  description:
    "Calm words for foster, adoptive, and kinship parents when behavior gets hard — meltdowns, lying, bedtime, and more.",
  openGraph: {
    title: "Parenting scripts — Phrasewell",
    description:
      "Calm words for foster, adoptive, and kinship parents when behavior gets hard — meltdowns, lying, bedtime, and more.",
  },
};

export default function BlogIndexPage() {
  return (
    <div className="landing-page blog-page">
      <LandingHeader />

      <main>
        <BlogBetaSection id="blog-beta-top" />

        <section className="blog-index-hero" aria-labelledby="blog-index-heading">
          <div className="landing-container blog-index-hero-inner">
            <h1 id="blog-index-heading" className="blog-index-title font-heading">
              Parenting scripts
            </h1>
            <p className="blog-index-lead">
              Calm, practical words for hard moments — what to say when theory is in your head but
              the words won&apos;t come.
            </p>
          </div>
        </section>

        <section className="landing-section" aria-label="Blog posts">
          <div className="landing-container">
            <ul className="blog-grid">
              {BLOG_POSTS.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </ul>
          </div>
        </section>

        <BlogBetaSection id="blog-beta-bottom" compact />
      </main>

      <LandingFooter />
    </div>
  );
}
