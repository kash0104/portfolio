import { codeToHtml } from "shiki";

export async function CodeBlock({ code, lang = "typescript" }: { code: string; lang?: string }) {
  const html = await codeToHtml(code, { lang, theme: "github-dark-default" });
  return <div className="rounded border border-border overflow-hidden text-sm" dangerouslySetInnerHTML={{ __html: html }} />;
}
