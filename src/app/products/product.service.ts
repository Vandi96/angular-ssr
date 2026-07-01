import {
  inject,
  Injectable,
  makeStateKey,
  PendingTasks,
  PLATFORM_ID,
  REQUEST,
  TransferState,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, defer, delay, finalize, Observable, of, tap, throwError } from 'rxjs';
import { Product, ProductResponse } from './product.model';
import { createProductResponse, getProductById } from './product.repository';

const PRODUCTS_STATE_KEY = makeStateKey<ProductResponse>('products');

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly pendingTasks = inject(PendingTasks);
  private readonly request = inject(REQUEST, { optional: true });
  private readonly transferState = inject(TransferState);

  getProducts(): Observable<ProductResponse> {
    if (isPlatformBrowser(this.platformId)) {
      const transferredProducts = this.transferState.get(PRODUCTS_STATE_KEY, null);

      if (transferredProducts) {
        this.transferState.remove(PRODUCTS_STATE_KEY);
        return of(transferredProducts);
      }

      return this.http.get<ProductResponse>('/api/products');
    }

    const response = createProductResponse(
      `Angular server (${new URL(this.request?.url ?? 'http://localhost').pathname})`,
    );

    return defer(() => {
      const completeTask = this.pendingTasks.add();

      return of(response).pipe(
        delay(900),
        tap((products) => this.transferState.set(PRODUCTS_STATE_KEY, products)),
        finalize(completeTask),
      );
    });
  }

  getProduct(id: number): Observable<Product | null> {
    const stateKey = makeStateKey<Product | null>(`product-${id}`);

    if (isPlatformBrowser(this.platformId)) {
      if (this.transferState.hasKey(stateKey)) {
        const transferredProduct = this.transferState.get(stateKey, null);
        this.transferState.remove(stateKey);
        return of(transferredProduct);
      }

      return this.http.get<Product>(`/api/products/${id}`).pipe(
        catchError((error: { status?: number }) =>
          error.status === 404 ? of(null) : throwError(() => error),
        ),
      );
    }

    const product = getProductById(id);

    return defer(() => {
      const completeTask = this.pendingTasks.add();

      return of(product).pipe(
        delay(500),
        tap((result) => this.transferState.set(stateKey, result)),
        finalize(completeTask),
      );
    });
  }
}
