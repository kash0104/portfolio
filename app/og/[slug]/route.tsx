import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { getProjectBySlug } from "@/lib/mdx";

// Node runtime — `lib/mdx` uses node:fs to read MDX from disk.
// Edge runtime cannot import fs and would 500 in production.
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = slug === "home" ? null : getProjectBySlug(slug);
  const title = project?.title ?? site.title;
  const subtitle = project?.summary ?? site.description;
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          color: "#ededed",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 64,
          fontFamily: "monospace",
        }}
      >
        <div style={{ color: "#10b981", fontSize: 24 }}>$ kashyap.vadhel</div>
        <div
          style={{
            fontSize: 64,
            marginTop: 32,
            fontWeight: 600,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 28, color: "#a3a3a3", marginTop: 24 }}>
          {subtitle}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
