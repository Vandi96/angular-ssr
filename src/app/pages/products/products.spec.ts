import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Products } from './products';
import { ProductService } from '../../products/product.service';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [
        provideRouter([]),
        {
          provide: ProductService,
          useValue: {
            getProducts: () =>
              of({ products: [], generatedAt: '2026-07-01T10:00:00.000Z', source: 'Test' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
