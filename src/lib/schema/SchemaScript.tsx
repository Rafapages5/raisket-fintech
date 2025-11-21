// src/lib/schema/SchemaScript.tsx
// Componente para renderizar Schema.org JSON-LD

interface SchemaScriptProps {
  schema: Record<string, any> | Array<Record<string, any>>;
}

export default function SchemaScript({ schema }: SchemaScriptProps) {
  const schemaString = JSON.stringify(schema, null, 0);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaString }}
    />
  );
}
