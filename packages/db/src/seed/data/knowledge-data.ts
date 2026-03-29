import { randomUUID } from 'crypto';

export const knowledgeData = [
  {
    title: 'Next.js App Router Data Fetching',
    sourceType: 'official_docs',
    technology: 'Next.js 14',
    contentSummary: 'Server components fetch data intrinsically via async/await, eliminating the need for getServerSideProps.',
    content: `Server Components allow you to fetch data natively using standard async/await syntax directly within the component body. This removes the distinction between server-side fetching APIs (like getServerSideProps) and the component itself. Features include automatic fetch caching, deduplication, and streaming. Always use standard fetch() where possible directly in the server component.`,
  },
  {
    title: 'Drizzle ORM Relational Queries',
    sourceType: 'official_docs',
    technology: 'Drizzle ORM',
    contentSummary: 'Drizzle ORM relational queries provide a Prisma-like interface for deeply nested joins with type safety.',
    content: `Drizzle ORM relational queries let you fetch nested graph records via db.query.tableName.findMany({ with: { relationName: true } }). This abstracts away raw LEFT JOIN syntax. You must define schema relations() alongside your tables for this to work natively. Performance penalty is minimal since Drizzle compiles it down to a lateral join natively in Postgres.`,
  },
  {
    title: 'Postgres pgvector ivfflat limits',
    sourceType: 'github_issue',
    technology: 'Postgres pgvector',
    contentSummary: 'IVFFlat indexes should only be created once the table contains data.',
    content: `When creating IVFFlat indexes in pgvector, do not build the index when the table is empty. The clustering centers (lists) are determined using k-means based on data existing at the time of index creation. Wait until you have at least a few thousand records before creating the index to ensure proper recall rates.`,
  },
  {
    title: 'Tailwind CSS Grid Templates',
    sourceType: 'blog_post',
    technology: 'Tailwind CSS',
    contentSummary: 'Advanced grid templates utilizing arbitrary values and subgrid.',
    content: `Using Tailwind CSS for complex grid layouts often requires arbitrary values. You can construct a layout using grid-cols-[1fr_minmax(auto,600px)_1fr] to perfectly clamp interior content. Tailwind v3.4+ introduces grid-cols-subgrid which aligns nested items perfectly with their parent's tracks.`,
  },
  {
    title: 'React Server Actions Mutations',
    sourceType: 'official_docs',
    technology: 'React',
    contentSummary: 'Server actions must be used with useTransition for programmatic optimistic updates.',
    content: `React Server Actions provide RPC-style mutations. When invoking a server action from a client component without a standard HTML form, wrap it in a useTransition hook. This is critical for getting pending states, preventing race conditions, and handling errors gracefully.`,
  },
  {
    title: 'Stripe Webhook Signature Verification',
    sourceType: 'official_docs',
    technology: 'Stripe Node SDK',
    contentSummary: 'Next.js API routes require raw body parsing for Stripe webhooks.',
    content: `In the Next.js App Router, to verify a Stripe webhook signature (stripe.webhooks.constructEvent), you must extract the raw buffer from the incoming Request. You can achieve this using req.text() and passing the raw text to constructEvent along with the stripe-signature header.`,
  },
  {
    title: 'Zustand State Slices',
    sourceType: 'github_readme',
    technology: 'Zustand',
    contentSummary: 'Slice pattern in Zustand prevents monolithic store files.',
    content: `Zustand officially recommends the slice pattern for massive stores. define individual slice creators like createAuthSlice and createUISlice, and merge them in a master bound store: create<MasterState>()((...a) => ({ ...createAuthSlice(...a), ...createUISlice(...a) })).`,
  },
  {
    title: 'React Hook Form with Zod Resolvers',
    sourceType: 'official_docs',
    technology: 'React Hook Form',
    contentSummary: 'Schema validation integration best practices.',
    content: `Using the @hookform/resolvers/zod library enforces completely type-safe forms. Define your Zod schema first, infer its type (z.infer<typeof schema>), and pass the schema to the useForm({ resolver: zodResolver(schema) }). Note: async refinements run only when synchronous checks pass.`,
  },
  {
    title: 'Next.js Parallel Intercepting Routes',
    sourceType: 'official_docs',
    technology: 'Next.js 14',
    contentSummary: 'Modal handling using @modal and (..) routes.',
    content: `Intercepting routes combined with parallel routes enables the creation of modals that maintain their own URL structure. A route named @modal/(..)photo/[id] intercepts the navigation to /photo/:id allowing it to be overlaid on top of the parent context without causing a hard page reload.`,
  },
  {
    title: 'Hono Edge Routing',
    sourceType: 'official_docs',
    technology: 'Hono',
    contentSummary: 'Hono uses RegExpRouter internally for lightning fast edge resolves.',
    content: `Hono is a specialized web framework for the Edge. It uses a custom RegExpRouter that converts all route definitions into a single massive regular expression, preventing sequential lookup times (O(n)). Always utilize app.route() middleware to chain logic instead of explicit switch statements.`,
  }
];
