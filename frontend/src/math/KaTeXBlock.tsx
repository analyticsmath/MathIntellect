import { useMemo } from "react"
import katex from "katex"

interface KaTeXBlockProps {
  math: string
  display?: boolean
  className?: string
}

export function KaTeXBlock({ math, display = true, className = "" }: KaTeXBlockProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: display,
        throwOnError: false
      })
    } catch {
      return math
    }
  }, [math, display])

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
