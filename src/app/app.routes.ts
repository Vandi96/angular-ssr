import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', loadComponent: () => import('./pages/landing/landing').then(m => m.Landing) },
  { path: 'products-csr', loadComponent: () => import('./pages/products/products').then(m => m.Products) },
  { path: 'products-csr/:id', loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail) },
  { path: 'products-ssr', loadComponent: () => import('./pages/products/products').then(m => m.Products) },
  { path: 'products-ssr/:id', loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail) },
  { path: 'products-prerender', loadComponent: () => import('./pages/products/products').then(m => m.Products) },
  { path: 'products-prerender/:id', loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'blog', loadComponent: () => import('./pages/blog/blog').then(m => m.Blog) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.Contact) },
];
