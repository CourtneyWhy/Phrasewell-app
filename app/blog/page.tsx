import type { Metadata } from "next";
import Link from "next/link";
import { LandingHeader } from "@/app/components/landing/LandingHeader";
import { LandingFooter } from "@/app/components/landing/LandingFooter";
import { BlogSignupBanner } from "@/app/components/blog/BlogSignupBanner";
import { BLOG_POSTS } from "@/app/lib/blog/posts";

export const metadata: Metadata = {
  title: "Parenting scripts — Phrasewell",
  description:
    "Calm words for foster, adoptive, and kinship parents when behavior gets hard — meltdowns, lying, food anxiety, bedtime, and more.",
};

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  return (
    <div className="landing-page blog-page">
      <LandingHeader />

      <main>
        <BlogSignupBanner />

        <section className="blog-hero" aria-labelledby="blog-index-heading">
          <div className="landing-container blog-hero-inner">
            <p className="landing-eyebrow">Parenting scripts</p>
            <h1 id="blog-index-heading" className="blog-title font-heading">
              Calm words for hard moments
            </h1>
            <p className="blog-lead">
              Practical scripts for foster, adoptive, and kinship parents — what to say and do when
              theory is in your head but the words won&apos;t come.
            </p>
          </div>
        </section>

        <section className="landing-section" aria-label="Blog posts">
          <div className="landing-container">
            <ul className="blog-list">
              {BLOG_POSTS.map((post) => (
                <li key={post.slug}>
                  <article className="landing-card blog-card">
                    <div className="blog-card-meta">
                      <span>{post.category}</span>
                      <span aria-hidden>·</span>
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                    </div>
                    <h2 className="blog-card-title font-heading">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="blog-card-description">{post.description}</p>
                    <Link href={`/blog/${post.slug}`} className="blog-card-link">
                      Read script →
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
