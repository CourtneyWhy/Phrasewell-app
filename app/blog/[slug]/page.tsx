import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingHeader } from "@/app/components/landing/LandingHeader";
import { LandingFooter } from "@/app/components/landing/LandingFooter";
import { BetaForm } from "@/app/components/landing/BetaForm";
import { BLOG_POSTS, getBlogPost } from "@/app/lib/blog/posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post not found — Phrasewell" };
  return {
    title: `${post.title} — Phrasewell`,
    description: post.description,
  };
}

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="landing-page blog-page">
      <LandingHeader />

      <main>
        <header className="blog-post-header">
          <div className="landing-container blog-post-header-inner">
            <Link href="/blog" className="blog-back-link">
              ← All parenting scripts
            </Link>
            <div className="blog-card-meta">
              <span>{post.category}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>
            <h1 className="blog-post-title font-heading">{post.title}</h1>
            <p className="blog-post-description">{post.description}</p>
          </div>
        </header>

        <article className="landing-container blog-post-body">
          <div className="blog-prose">
            <p>{post.intro}</p>

            <div className="blog-quote">
              <p className="blog-quote-label">Say this</p>
              <blockquote>{post.sayThis}</blockquote>
            </div>

            <h2 className="font-heading">Do this</h2>
            <p>{post.doThis}</p>

            <div className="blog-callout">
              <strong>Helpful note:</strong> {post.helpfulNote}
            </div>

            <p>
              Phrasewell gives you scripts like this for dozens of hard moments — tuned by behavior
              and age. Tap the situation, read the words, take a breath.
            </p>
          </div>
        </article>

        <section className="blog-post-cta">
          <div className="landing-container">
            <div className="landing-card blog-cta-card">
              <h2 className="font-heading">Want scripts in the moment?</h2>
              <p>Join the beta — we&apos;re inviting foster, adoptive, and kinship parents in small groups.</p>
              <BetaForm />
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
