import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingHeader } from "@/app/components/landing/LandingHeader";
import { LandingFooter } from "@/app/components/landing/LandingFooter";
import { BlogBetaSection } from "@/app/components/blog/BlogBetaSection";
import { BlogPostContent } from "@/app/components/blog/BlogPostContent";
import { BlogPostHero } from "@/app/components/blog/BlogPostHero";
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
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="landing-page blog-page">
      <LandingHeader />

      <main>
        <BlogPostHero post={post} />

        <div className="landing-container blog-post-join-wrap">
          <a href="#post-beta" className="landing-btn landing-btn-primary blog-index-cta">
            Join the beta
          </a>
        </div>

        <article className="landing-container blog-post-body">
          <BlogPostContent sections={post.sections} />
        </article>

        <BlogBetaSection id="post-beta" />
      </main>

      <LandingFooter />
    </div>
  );
}
