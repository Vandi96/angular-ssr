import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ProductResponse } from '../../products/product.model';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-products',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly routeSegments = toSignal(this.route.url, {
    initialValue: this.route.snapshot.url,
  });
  private readonly productSection = computed(() => this.routeSegments()[0]?.path ?? '');

  protected readonly response = signal<ProductResponse | null>(null);
  protected readonly error = signal(false);
  protected readonly renderMode = computed(() => {
    if (this.productSection() === 'products-csr') return 'CSR';
    if (this.productSection() === 'products-prerender') return 'Prerender';
    return 'SSR';
  });

  protected detailPath(id: number): string[] {
    return ['/', this.productSection(), String(id)];
  }

  public ngOnInit(): void {
    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.response.set(response),
        error: () => this.error.set(true),
      });
  }
}
