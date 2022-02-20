import React, { useEffect, useState } from 'react'

export function useParseContent(text: string): Array<JSX.Element> {

  const [content, setContent] = useState<any>(getContent(text));

  useEffect(() => {
    setContent(getContent(text));
  }, [text])

  return content;
}

function getContent(str: string): Array<JSX.Element> {
  return parseContent(str).map((t: string, i: number) => <div key={`post_render_${i}`}>{t}</div>);
}
function parseContent(str: string): Array<string> {
  if (!str) return [];

  const text = str.replace(/<p>/g, "");
  const content = text.split(/(<\/p>)/g);
  return content.length > 0 ? content : [];
}
