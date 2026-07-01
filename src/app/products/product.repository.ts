import { Product, ProductResponse } from './product.model';

const products = [
  {
    id: 1,
    name: 'Hydration Bottle',
    description: 'A suspiciously well-hydrated bottle for Angular developers.',
    price: 24.9,
    category: 'Hydration',
  },
  {
    id: 2,
    name: 'SSR Hoodie',
    description: 'Rendered on the server, worn comfortably on the client.',
    price: 69.9,
    category: 'SSR',
  },
  {
    id: 3,
    name: 'Prerender Mug',
    description: 'Prepared at build time for extremely fast coffee delivery.',
    price: 18.5,
    category: 'Prerender',
  },
  {
    id: 4,
    name: 'CSR Keyboard',
    description: 'Nothing appears until JavaScript arrives, but then it clicks.',
    price: 109,
    category: 'CSR',
  },
] as const;

export function createProductResponse(source: string): ProductResponse {
  return {
    products: [...products],
    generatedAt: new Date().toISOString(),
    source,
  };
}

export function getProductById(id: number): Product | null {
  return products.find((product) => product.id === id) ?? null;
}

export function getProductIds(): number[] {
  return products.map((product) => product.id);
}
