import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ContentBody({ body }: { body: string }) {
  return (
    <div className="prose-content min-w-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: "h2",
          table: ({ node, ...props }) => {
            void node;
            return <table tabIndex={0} aria-label="可横向滚动的数据表格" {...props} />;
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
