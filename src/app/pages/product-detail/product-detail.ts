import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, RESPONSE_INIT, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../products/product.model';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly meta = inject(Meta);
  private readonly productService = inject(ProductService);
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  protected readonly product = signal<Product | null>(null);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);

  protected get renderMode(): string {
    if (this.router.url.includes('products-csr')) return 'CSR';
    if (this.router.url.includes('products-prerender')) return 'Prerender';
    return 'SSR';
  }

  protected get productsPath(): string {
    return `/${this.router.url.split('/')[1]}`;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productService
      .getProduct(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.loading.set(false);
          this.product.set(product);

          if (product) {
            this.setSeo(product);
          } else {
            this.setNotFound();
          }
        },
        error: () => {
          this.loading.set(false);
          this.failed.set(true);
        },
      });
  }

  private setSeo(product: Product): void {
    this.title.setTitle(`${product.name} | Angular SSR POC`);
    this.meta.updateTag({ name: 'description', content: product.description });
  }

  private setNotFound(): void {
    this.title.setTitle('Product not found | Angular SSR POC');
    this.meta.updateTag({ name: 'description', content: 'The requested product does not exist.' });

    if (this.responseInit) {
      this.responseInit.status = 404;
    }
  }
}
