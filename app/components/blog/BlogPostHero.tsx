import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/app/lib/blog/types";

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogPostHero({ post }: { post: BlogPost }) {
  return (
    <header className="blog-post-hero">
      <div className="landing-container">
        <Link href="/blog" className="blog-back-link">
          ← All parenting scripts
        </Link>
        <div className="blog-post-hero-panel">
          <div className="blog-post-hero-copy">
            <p className="blog-post-hero-category">{post.category}</p>
            <h1 className="blog-post-hero-title font-heading">{post.title}</h1>
            <p className="blog-post-hero-description">{post.description}</p>
            <div className="blog-post-hero-author">
              <Image
                src={post.author.avatar}
                alt=""
                width={36}
                height={36}
                className="blog-grid-card-avatar"
              />
              <div>
                <p className="blog-post-hero-author-name">{post.author.name}</p>
                <p className="blog-post-hero-author-role">{post.author.role}</p>
              </div>
            </div>
            <time className="blog-post-hero-date" dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>
          <div className="blog-post-hero-image-wrap">
            <Image
              src={post.image}
              alt={post.imageAlt}
              width={720}
              height={480}
              className="blog-post-hero-image"
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
}
