import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContentBody } from "@/components/content-body";

describe("content rendering", () => {
  it("keeps one page-level h1 by demoting markdown h1", () => {
    const html = renderToStaticMarkup(createElement(ContentBody, { body: "# 文中标题" }));
    expect(html).toContain("<h2>文中标题</h2>");
    expect(html).not.toContain("<h1>");
  });

  it("renders safe links and does not execute raw HTML", () => {
    const html = renderToStaticMarkup(
      createElement(ContentBody, {
        body: "<img src=x onerror=alert(1)>\n\n[链接](https://example.com)",
      }),
    );
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<script");
    expect(html).toContain('href="https://example.com"');
  });
});
