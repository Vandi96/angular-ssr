import { RenderMode, ServerRoute } from '@angular/ssr';
import { getProductIds } from './products/product.repository';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'landing',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'blog',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'contact',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'products-csr',
    renderMode: RenderMode.Client,
  },
  {
    path: 'products-csr/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'products-ssr',
    renderMode: RenderMode.Server,
  },
  {
    path: 'products-ssr/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'products-prerender',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'products-prerender/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return getProductIds().map((id) => ({ id: String(id) }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
