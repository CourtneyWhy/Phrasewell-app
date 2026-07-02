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

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <li>
      <Link href={`/blog/${post.slug}`} className="blog-grid-card">
        <div className="blog-grid-card-image-wrap">
          <Image
            src={post.image}
            alt={post.imageAlt}
            width={640}
            height={400}
            className="blog-grid-card-image"
          />
        </div>
        <div className="blog-grid-card-body">
          <p className="blog-grid-card-meta">
            <span>{post.category}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </p>
          <h2 className="blog-grid-card-title font-heading">{post.title}</h2>
          <p className="blog-grid-card-description">{post.description}</p>
          <div className="blog-grid-card-author">
            <Image
              src={post.author.avatar}
              alt=""
              width={28}
              height={28}
              className="blog-grid-card-avatar"
            />
            <span>
              By <strong>{post.author.name}</strong>
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
