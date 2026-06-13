import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

// Allow safe media embeds (images + <video>) on top of the default safe schema.
const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "video", "source"],
  attributes: {
    ...defaultSchema.attributes,
    video: ["controls", "width", "height", "poster", "loop", "muted", "playsInline", "preload"],
    source: ["src", "type"],
    img: [...(defaultSchema.attributes?.img ?? []), "loading", "alt", "src"],
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
  },
};

/**
 * Renders sanitized markdown. Shared by /blog/[slug] (server) and the drawer (client).
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-portfolio">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, schema]]}
        components={{
          a: ({ ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          img: ({ ...props }) => (
            <img {...props} loading="lazy" className="my-4 w-full rounded-xl" />
          ),
          video: ({ ...props }) => (
            <video {...props} controls className="my-4 w-full rounded-xl" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
