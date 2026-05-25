import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return post ? { title: post.title, description: post.summary } : {};
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return (
    <>
      <Nav />
      <main className="max-w-[720px] mx-auto px-6 md:px-10 py-16">
        <h1 className="text-3xl md:text-5xl font-semibold">{post.title}</h1>
        <p className="font-mono text-xs text-text-dim mt-2">{post.date}</p>
        <article className="prose prose-invert mt-8 max-w-none"><MDXRemote source={post.body} /></article>
      </main>
      <Footer />
    </>
  );
}
