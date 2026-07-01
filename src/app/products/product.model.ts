export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface ProductResponse {
  products: Product[];
  generatedAt: string;
  source: string;
}
