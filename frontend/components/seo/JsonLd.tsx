import React from 'react'

interface JsonLdProps {
  data: any
}

/**
 * JsonLd component for injecting structured data safely.
 * Renders an application/ld+json script tag.
 */
export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  if (!data) return null

  // Safely stringify and escape characters to prevent XSS/Injection
  const jsonString = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  )
}
