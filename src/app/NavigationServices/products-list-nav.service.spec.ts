import { TestBed } from '@angular/core/testing';

import { ProductsListNavService } from './products-list-nav.service';

describe('ProductsListNavService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductsListNavService = TestBed.get(ProductsListNavService);
    expect(service).toBeTruthy();
  });
});
