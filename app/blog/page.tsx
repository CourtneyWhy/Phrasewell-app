import type { Metadata } from "next";
import { LandingHeader } from "@/app/components/landing/LandingHeader";
import { LandingFooter } from "@/app/components/landing/LandingFooter";
import { BlogBetaSection } from "@/app/components/blog/BlogBetaSection";
import { BlogPostCard } from "@/app/components/blog/BlogPostCard";
import { BLOG_POSTS } from "@/app/lib/blog/posts";

const BLOG_LEAD =
  "Insights on calm parenting, behavior scripts, and words that help in hard moments.";

export const metadata: Metadata = {
  title: "Blog — Phrasewell",
  description: BLOG_LEAD,
  openGraph: {
    title: "Blog — Phrasewell",
    description: BLOG_LEAD,
  },
};

export default function BlogIndexPage() {
  return (
    <div className="landing-page blog-page">
      <LandingHeader />

      <main>
        <section className="blog-index-hero" aria-labelledby="blog-index-heading">
          <div className="landing-container blog-index-hero-inner">
            <h1 id="blog-index-heading" className="blog-index-title font-heading">
              Phrasewell
            </h1>
            <p className="blog-index-lead">{BLOG_LEAD}</p>
            <a href="#blog-beta" className="landing-btn landing-btn-primary blog-index-cta">
              Join the beta
            </a>
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

        <BlogBetaSection id="blog-beta" />
      </main>

      <LandingFooter />
    </div>
  );
}
