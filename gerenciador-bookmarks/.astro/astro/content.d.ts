declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"links": {
"21st-dev-community-components.mdx": {
	id: "21st-dev-community-components.mdx";
  slug: "21st-dev-community-components";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"4devs.mdx": {
	id: "4devs.mdx";
  slug: "4devs";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"8mb-video.mdx": {
	id: "8mb-video.mdx";
  slug: "8mb-video";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"aceternity-ui.mdx": {
	id: "aceternity-ui.mdx";
  slug: "aceternity-ui";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"agentmaker-criador-de-agentes.mdx": {
	id: "agentmaker-criador-de-agentes.mdx";
  slug: "agentmaker-criador-de-agentes";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"agno.mdx": {
	id: "agno.mdx";
  slug: "agno";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"aidrop-news.mdx": {
	id: "aidrop-news.mdx";
  slug: "aidrop-news";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"aiverse-ai-design-playbook.mdx": {
	id: "aiverse-ai-design-playbook.mdx";
  slug: "aiverse-ai-design-playbook";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"akitaonrails.mdx": {
	id: "akitaonrails.mdx";
  slug: "akitaonrails";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"alex-hormozi-ai-persona.mdx": {
	id: "alex-hormozi-ai-persona.mdx";
  slug: "alex-hormozi-ai-persona";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"alt-analise-de-legibilidade-textual.mdx": {
	id: "alt-analise-de-legibilidade-textual.mdx";
  slug: "alt-analise-de-legibilidade-textual";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"appwrite.mdx": {
	id: "appwrite.mdx";
  slug: "appwrite";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"astra-online.mdx": {
	id: "astra-online.mdx";
  slug: "astra-online";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"astro.mdx": {
	id: "astro.mdx";
  slug: "astro";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"autotic.mdx": {
	id: "autotic.mdx";
  slug: "autotic";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"awesome-agent-skills.mdx": {
	id: "awesome-agent-skills.mdx";
  slug: "awesome-agent-skills";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"awesome-claude-skills.mdx": {
	id: "awesome-claude-skills.mdx";
  slug: "awesome-claude-skills";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"awesome-llm-skills.mdx": {
	id: "awesome-llm-skills.mdx";
  slug: "awesome-llm-skills";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"awesome-selfhosted.mdx": {
	id: "awesome-selfhosted.mdx";
  slug: "awesome-selfhosted";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"bentopdf.mdx": {
	id: "bentopdf.mdx";
  slug: "bentopdf";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"blind-text-generator.mdx": {
	id: "blind-text-generator.mdx";
  slug: "blind-text-generator";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"bmad-master-agent-v6.mdx": {
	id: "bmad-master-agent-v6.mdx";
  slug: "bmad-master-agent-v6";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"bmad-method-documentacao.mdx": {
	id: "bmad-method-documentacao.mdx";
  slug: "bmad-method-documentacao";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"bmad-method-greenfield.mdx": {
	id: "bmad-method-greenfield.mdx";
  slug: "bmad-method-greenfield";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"build-your-own-x.mdx": {
	id: "build-your-own-x.mdx";
  slug: "build-your-own-x";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"calculadora-de-precos-de-apis-de-llms.mdx": {
	id: "calculadora-de-precos-de-apis-de-llms.mdx";
  slug: "calculadora-de-precos-de-apis-de-llms";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"chrome-devtools-mcp.mdx": {
	id: "chrome-devtools-mcp.mdx";
  slug: "chrome-devtools-mcp";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"claude-mem.mdx": {
	id: "claude-mem.mdx";
  slug: "claude-mem";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"comparativo-llms.mdx": {
	id: "comparativo-llms.mdx";
  slug: "comparativo-llms";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"comparativo-vibecoding.mdx": {
	id: "comparativo-vibecoding.mdx";
  slug: "comparativo-vibecoding";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"context7-mcp-server.mdx": {
	id: "context7-mcp-server.mdx";
  slug: "context7-mcp-server";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"converter-bytes.mdx": {
	id: "converter-bytes.mdx";
  slug: "converter-bytes";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"convex.mdx": {
	id: "convex.mdx";
  slug: "convex";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"coss-ui-particles.mdx": {
	id: "coss-ui-particles.mdx";
  slug: "coss-ui-particles";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"cult-ui.mdx": {
	id: "cult-ui.mdx";
  slug: "cult-ui";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"daily-foss.mdx": {
	id: "daily-foss.mdx";
  slug: "daily-foss";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"deepwiki.mdx": {
	id: "deepwiki.mdx";
  slug: "deepwiki";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"docling.mdx": {
	id: "docling.mdx";
  slug: "docling";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"expo.mdx": {
	id: "expo.mdx";
  slug: "expo";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"free-for-dev.mdx": {
	id: "free-for-dev.mdx";
  slug: "free-for-dev";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"freeformatter-escape-unescape-tools.mdx": {
	id: "freeformatter-escape-unescape-tools.mdx";
  slug: "freeformatter-escape-unescape-tools";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"gabriel-augusto.mdx": {
	id: "gabriel-augusto.mdx";
  slug: "gabriel-augusto";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"get-shit-done.mdx": {
	id: "get-shit-done.mdx";
  slug: "get-shit-done";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"gitignore.mdx": {
	id: "gitignore.mdx";
  slug: "gitignore";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"gotenberg.mdx": {
	id: "gotenberg.mdx";
  slug: "gotenberg";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"guia-definitivo-do-regex.mdx": {
	id: "guia-definitivo-do-regex.mdx";
  slug: "guia-definitivo-do-regex";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"hacker-news.mdx": {
	id: "hacker-news.mdx";
  slug: "hacker-news";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"hextaui.mdx": {
	id: "hextaui.mdx";
  slug: "hextaui";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"indie-hackers.mdx": {
	id: "indie-hackers.mdx";
  slug: "indie-hackers";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"infisical.mdx": {
	id: "infisical.mdx";
  slug: "infisical";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"invertexto.mdx": {
	id: "invertexto.mdx";
  slug: "invertexto";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"jina-ai-mcp-server.mdx": {
	id: "jina-ai-mcp-server.mdx";
  slug: "jina-ai-mcp-server";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"json-grid-viewer.mdx": {
	id: "json-grid-viewer.mdx";
  slug: "json-grid-viewer";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"json-pizza.mdx": {
	id: "json-pizza.mdx";
  slug: "json-pizza";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"jsonpath-online-evaluator.mdx": {
	id: "jsonpath-online-evaluator.mdx";
  slug: "jsonpath-online-evaluator";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"jwt-io-debugger.mdx": {
	id: "jwt-io-debugger.mdx";
  slug: "jwt-io-debugger";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"llm-pricing-calculator.mdx": {
	id: "llm-pricing-calculator.mdx";
  slug: "llm-pricing-calculator";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"lorem-picsum.mdx": {
	id: "lorem-picsum.mdx";
  slug: "lorem-picsum";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"lucide-icons.mdx": {
	id: "lucide-icons.mdx";
  slug: "lucide-icons";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"marketing-skills.mdx": {
	id: "marketing-skills.mdx";
  slug: "marketing-skills";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"mcp-inspector.mdx": {
	id: "mcp-inspector.mdx";
  slug: "mcp-inspector";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"microsoft-clarity.mdx": {
	id: "microsoft-clarity.mdx";
  slug: "microsoft-clarity";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"mockaroo.mdx": {
	id: "mockaroo.mdx";
  slug: "mockaroo";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"mussum-ipsum.mdx": {
	id: "mussum-ipsum.mdx";
  slug: "mussum-ipsum";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"mxtoolbox-network-tools.mdx": {
	id: "mxtoolbox-network-tools.mdx";
  slug: "mxtoolbox-network-tools";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"n8n-labz.mdx": {
	id: "n8n-labz.mdx";
  slug: "n8n-labz";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"neon-database.mdx": {
	id: "neon-database.mdx";
  slug: "neon-database";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"open-source-alternative.mdx": {
	id: "open-source-alternative.mdx";
  slug: "open-source-alternative";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"openai-tokenizer.mdx": {
	id: "openai-tokenizer.mdx";
  slug: "openai-tokenizer";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"plugin-toolbox-bubble.mdx": {
	id: "plugin-toolbox-bubble.mdx";
  slug: "plugin-toolbox-bubble";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"postgres-sandbox.mdx": {
	id: "postgres-sandbox.mdx";
  slug: "postgres-sandbox";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"postman-supabase-collection.mdx": {
	id: "postman-supabase-collection.mdx";
  slug: "postman-supabase-collection";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"promovaweb.mdx": {
	id: "promovaweb.mdx";
  slug: "promovaweb";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"public-apis.mdx": {
	id: "public-apis.mdx";
  slug: "public-apis";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"r-brdev.mdx": {
	id: "r-brdev.mdx";
  slug: "r-brdev";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"r-selfhosted.mdx": {
	id: "r-selfhosted.mdx";
  slug: "r-selfhosted";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"random-key-generator.mdx": {
	id: "random-key-generator.mdx";
  slug: "random-key-generator";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"react-grab.mdx": {
	id: "react-grab.mdx";
  slug: "react-grab";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"reactbits.mdx": {
	id: "reactbits.mdx";
  slug: "reactbits";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"remotion.mdx": {
	id: "remotion.mdx";
  slug: "remotion";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"respond-io-whatsapp-calculator.mdx": {
	id: "respond-io-whatsapp-calculator.mdx";
  slug: "respond-io-whatsapp-calculator";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"rybbit.mdx": {
	id: "rybbit.mdx";
  slug: "rybbit";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"saas-7d-criador-de-paginas-de-vendas.mdx": {
	id: "saas-7d-criador-de-paginas-de-vendas.mdx";
  slug: "saas-7d-criador-de-paginas-de-vendas";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"saas-7d-criador-de-personas.mdx": {
	id: "saas-7d-criador-de-personas.mdx";
  slug: "saas-7d-criador-de-personas";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"saas-7d-criativos-para-redes-sociais.mdx": {
	id: "saas-7d-criativos-para-redes-sociais.mdx";
  slug: "saas-7d-criativos-para-redes-sociais";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"saas-7d-roteiro-de-webinario.mdx": {
	id: "saas-7d-roteiro-de-webinario.mdx";
  slug: "saas-7d-roteiro-de-webinario";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"screenzy.mdx": {
	id: "screenzy.mdx";
  slug: "screenzy";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"selfhst.mdx": {
	id: "selfhst.mdx";
  slug: "selfhst";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"setuporion.mdx": {
	id: "setuporion.mdx";
  slug: "setuporion";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"shadcn-ui.mdx": {
	id: "shadcn-ui.mdx";
  slug: "shadcn-ui";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"skills-sh.mdx": {
	id: "skills-sh.mdx";
  slug: "skills-sh";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"slash-ai-sdk-elements.mdx": {
	id: "slash-ai-sdk-elements.mdx";
  slug: "slash-ai-sdk-elements";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"sql-to-rest-api-translator.mdx": {
	id: "sql-to-rest-api-translator.mdx";
  slug: "sql-to-rest-api-translator";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"stirling-pdf.mdx": {
	id: "stirling-pdf.mdx";
  slug: "stirling-pdf";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"supabase-wasm-postgresql-no-browser.mdx": {
	id: "supabase-wasm-postgresql-no-browser.mdx";
  slug: "supabase-wasm-postgresql-no-browser";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"supabase.mdx": {
	id: "supabase.mdx";
  slug: "supabase";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"swarmsentinel.mdx": {
	id: "swarmsentinel.mdx";
  slug: "swarmsentinel";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tabnews.mdx": {
	id: "tabnews.mdx";
  slug: "tabnews";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tech-12k-agente-de-precificacao.mdx": {
	id: "tech-12k-agente-de-precificacao.mdx";
  slug: "tech-12k-agente-de-precificacao";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tech-12k-cartas-de-apresentacao.mdx": {
	id: "tech-12k-cartas-de-apresentacao.mdx";
  slug: "tech-12k-cartas-de-apresentacao";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tech-12k-construtor-de-portfolios.mdx": {
	id: "tech-12k-construtor-de-portfolios.mdx";
  slug: "tech-12k-construtor-de-portfolios";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tech-12k-entrevista-de-descoberta.mdx": {
	id: "tech-12k-entrevista-de-descoberta.mdx";
  slug: "tech-12k-entrevista-de-descoberta";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tech-12k-gerador-de-abordagens.mdx": {
	id: "tech-12k-gerador-de-abordagens.mdx";
  slug: "tech-12k-gerador-de-abordagens";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tech-12k-gerador-de-contratos.mdx": {
	id: "tech-12k-gerador-de-contratos.mdx";
  slug: "tech-12k-gerador-de-contratos";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tech-12k-gerador-de-proposta.mdx": {
	id: "tech-12k-gerador-de-proposta.mdx";
  slug: "tech-12k-gerador-de-proposta";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tech-12k-instrategista.mdx": {
	id: "tech-12k-instrategista.mdx";
  slug: "tech-12k-instrategista";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tech-12k-mentor-de-fechamento-de-vendas.mdx": {
	id: "tech-12k-mentor-de-fechamento-de-vendas.mdx";
  slug: "tech-12k-mentor-de-fechamento-de-vendas";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tech-12k-otimizador-de-perfil-profissional.mdx": {
	id: "tech-12k-otimizador-de-perfil-profissional.mdx";
  slug: "tech-12k-otimizador-de-perfil-profissional";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tech-12k-posicionamento-profissional.mdx": {
	id: "tech-12k-posicionamento-profissional.mdx";
  slug: "tech-12k-posicionamento-profissional";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"this-person-does-not-exist.mdx": {
	id: "this-person-does-not-exist.mdx";
  slug: "this-person-does-not-exist";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tldraw.mdx": {
	id: "tldraw.mdx";
  slug: "tldraw";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tool-ui.mdx": {
	id: "tool-ui.mdx";
  slug: "tool-ui";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"tweakcn-theme-editor-para-shadcn-ui.mdx": {
	id: "tweakcn-theme-editor-para-shadcn-ui.mdx";
  slug: "tweakcn-theme-editor-para-shadcn-ui";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"ui-inference-sh.mdx": {
	id: "ui-inference-sh.mdx";
  slug: "ui-inference-sh";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"ui-ux-pro-max-skill.mdx": {
	id: "ui-ux-pro-max-skill.mdx";
  slug: "ui-ux-pro-max-skill";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"variaveis-dinamicas-postman.mdx": {
	id: "variaveis-dinamicas-postman.mdx";
  slug: "variaveis-dinamicas-postman";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"webhook-cool.mdx": {
	id: "webhook-cool.mdx";
  slug: "webhook-cool";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"well-pires.mdx": {
	id: "well-pires.mdx";
  slug: "well-pires";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
"yamllint.mdx": {
	id: "yamllint.mdx";
  slug: "yamllint";
  body: string;
  collection: "links";
  data: InferEntrySchema<"links">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
