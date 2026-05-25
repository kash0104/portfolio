import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata = { title: "Blog" };

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <>
      <Nav />
      <main className="max-w-[800px] mx-auto px-6 md:px-10 py-16">
        <h1 className="text-3xl md:text-5xl font-semibold">Writing</h1>
        {posts.length === 0 ? (
          <p className="mt-6 text-text-muted">Articles on data engineering coming soon.</p>
        ) : (
          <ul className="mt-10 space-y-6">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="block">
                  <h2 className="text-lg font-semibold hover:text-accent">{p.title}</h2>
                  <p className="text-text-muted text-sm mt-1">{p.summary}</p>
                  <p className="font-mono text-xs text-text-dim mt-1">{p.date}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
