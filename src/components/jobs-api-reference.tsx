import specJson from "../../public/openapi/jobs.json";
import examplesJson from "@/content/jobs-response-examples.json";
import { jobsOperations } from "@/content/jobs";
import { CodeBlock } from "@/components/code-block";

type Schema = { $ref?: string; type?: string | string[]; description?: string; properties?: Record<string, Schema>; items?: Schema; anyOf?: Schema[]; enum?: string[]; default?: unknown; maximum?: number; minimum?: number; maxLength?: number; format?: string; required?: string[] };
type Operation = { summary: string; description: string; parameters?: { name: string; in: string; required: boolean; description: string; schema: Schema }[]; responses: Record<string, { description: string; content?: { "application/json": { schema: Schema } } }> };
const spec = specJson as unknown as { paths: Record<string,{get:Operation}>; components: { schemas: Record<string,Schema> } };
const examples = examplesJson as Record<string, unknown>;
function resolve(schema: Schema): Schema { return schema.$ref ? spec.components.schemas[schema.$ref.split("/").at(-1)!] : schema; }
function typeLabel(schema: Schema): string { return schema.$ref?.split("/").at(-1) ?? (schema.anyOf ? schema.anyOf.map(typeLabel).join(" | ") : Array.isArray(schema.type) ? schema.type.join(" | ") : schema.type === "array" ? `${typeLabel(schema.items!)}[]` : schema.type ?? "object"); }
function fields(schema: Schema, prefix = "", depth = 0): { name: string; type: string; description: string }[] {
 const resolved = resolve(schema);
 if (resolved.type === "array" && resolved.items) return fields(resolved.items, `${prefix}[]`, depth);
 if (!resolved.properties || depth > 2) return [];
 return Object.entries(resolved.properties).flatMap(([key,value]) => { const name = prefix ? `${prefix}.${key}` : key; return [{name,type:typeLabel(value),description:value.description ?? resolve(value).description ?? "See response schema."}, ...fields(value,name,depth+1)]; });
}
export function JobsApiReference() {
 const routes = [...jobsOperations, {id:"public-overview",path:"/v1/public/overview",title:"Public overview",scope:"No key required",credits:"0",description:"Public aggregate catalogue counts."}, {id:"public-search",path:"/v1/public/search",title:"Public catalogue preview",scope:"No key required",credits:"0",description:"Strictly limited public samples and aggregates."}];
 return <>{routes.map(route => {
  const op = spec.paths[route.path].get;
  const schema = op.responses["200"].content!["application/json"].schema;
  const request = route.path.includes("{id}") ? route.path.replace("{id}", "$JOB_ID") : route.path.replace("{domain}", "$COMPANY_DOMAIN");
  const query = route.id === "search" ? '?q=software%20engineer&limit=5' : ["list","company-jobs","history"].includes(route.id) ? '?limit=5' : "";
  const curl = `curl "https://data.exende.dev${request}${query}"${route.id.startsWith("public-") ? "" : ' -H "Authorization: Bearer $EXENDE_API_KEY"'}`;
  return <section id={route.id} key={route.id} className="surface-rule mt-12 pt-8">
   <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">{route.title}</h2>
   <p className="mt-4 font-mono text-xs leading-7 text-[var(--color-accent)]">GET {route.path}</p><p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{op.description}</p>
   <CodeBlock code={curl} language="bash" title={route.path.includes("{") ? "Set JOB_ID or COMPANY_DOMAIN from a returned record" : "Example request"} />
   {op.parameters?.length ? <div className="mt-5 overflow-x-auto"><table className="spec-table"><thead><tr><th>Parameter</th><th>Type / location</th><th>Meaning</th></tr></thead><tbody>{op.parameters.map(param => <tr key={`${param.in}:${param.name}`}><td><code>{param.name}</code>{param.required ? " (required)" : ""}</td><td>{typeLabel(param.schema)} / {param.in}</td><td>{param.description}{param.schema.maxLength ? ` Maximum length: ${param.schema.maxLength}.` : ""}{param.schema.maximum ? ` Maximum: ${param.schema.maximum}.` : ""}{param.schema.minimum ? ` Minimum: ${param.schema.minimum}.` : ""}{param.schema.format ? ` Format: ${param.schema.format}.` : ""}{param.schema.enum ? ` Values: ${param.schema.enum.join(", ")}.` : ""}</td></tr>)}</tbody></table></div> : <p className="mt-4 text-sm text-[var(--color-muted)]">No query parameters.</p>}
   <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">200 response: {op.responses["200"].description}</p>
   <details id={route.id === "search" ? "response" : undefined} className="mt-5" open={route.id === "search"}><summary className="cursor-pointer text-sm text-[var(--color-accent)]">Response fields and full structural example</summary><div  className="mt-5 overflow-x-auto"><table className="spec-table"><thead><tr><th>Field</th><th>Type</th><th>Meaning</th></tr></thead><tbody>{fields(schema).map(field => <tr key={field.name}><td><code>{field.name}</code></td><td>{field.type}</td><td>{field.description}</td></tr>)}</tbody></table></div><p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">Structural example only. Placeholder names, IDs, dates, and counts illustrate the shape; these are not live catalogue records.</p><CodeBlock code={JSON.stringify(examples[route.path],null,2)} language="json" title="Structural example — not live data" /></details>
   <p className="mt-5 text-xs leading-7 text-[var(--color-muted)]">Common errors: {Object.keys(op.responses).filter(status=>status!=="200").join(", ")}. See Errors & rate limits below for handling.</p>
  </section>;
 })}</>;
}
