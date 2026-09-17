# Angular SSR POC

Small Angular storefront that compares client rendering, server rendering, and prerendering with the same product data.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:4200/`. The Angular development server uses the Express handler in `src/server.ts` for the local API.

## Rendering routes

| Route | Rendering | What to observe |
| --- | --- | --- |
| `/products-csr` | Client | Product data appears after the browser requests `/api/products`. |
| `/products-ssr` | Server | Product data is included in the response HTML and transferred to the browser during hydration. |
| `/products-prerender` | Prerender | Product data is generated at build time and included in static HTML. |
| `/products-*/:id` | Same mode as its list route | Product details use the same rendering strategy. |
| `/landing`, `/blog`, `/contact` | Prerender | Static page content is ready before JavaScript runs. |
| `/dashboard` | Server | Browser-only values appear after hydration. |

The product and detail services add short delays so the rendering differences are visible. The Express API returns the same four in-memory products. The contact endpoint acknowledges a submission but does not store or send it.

## Production build

```bash
npm run build
npm run serve:ssr:angular-ssr-poc
```

The server listens on port `4000` by default. Set `PORT` to use another port. The build output is written to `dist/angular-ssr-poc/`.
