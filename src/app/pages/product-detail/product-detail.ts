import { CurrencyPipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, RESPONSE_INIT, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
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
  private readonly title = inject(Title);
  private readonly routeSegments = toSignal(this.route.url, {
    initialValue: this.route.snapshot.url,
  });
  private readonly productSection = computed(() => this.routeSegments()[0]?.path ?? '');

  protected readonly product = signal<Product | null>(null);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly renderMode = computed(() => {
    if (this.productSection() === 'products-csr') return 'CSR';
    if (this.productSection() === 'products-prerender') return 'Prerender';
    return 'SSR';
  });
  protected readonly productsPath = computed(() => `/${this.productSection()}`);

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading.set(true);
          this.failed.set(false);
          this.product.set(null);

          return this.productService.getProduct(Number(params.get('id'))).pipe(
            map((product) => ({ product, failed: false })),
            catchError(() => of({ product: null, failed: true })),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ product, failed }) => {
        this.loading.set(false);
        this.failed.set(failed);
        this.product.set(product);

        if (failed) return;

        if (product) {
          this.setSeo(product);
        } else {
          this.setNotFound();
        }
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
