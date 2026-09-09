import { useMemo } from "react";
import DOMPurify from "dompurify";

function RichTextContent({ html }) {
  const safeHtml = useMemo(() => DOMPurify.sanitize(html), [html]);

  return <div className="post-content" dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}

export default RichTextContent;
