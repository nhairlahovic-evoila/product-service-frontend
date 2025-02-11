import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products!: Product[];
  filteredProducts!: Product[];
  filterForm!: FormGroup;

  constructor(private productService: ProductService, private router: Router, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: ['']
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: _products => {
        this.products = _products;
        this.filteredProducts = _products
      },
      error: err => console.log(err)
    });
  }

  deleteProduct(product: Product) {
    const confirmDelete = window.confirm(`Are you sure you want to delete '${product.name}'?`);
    if (confirmDelete) {
      this.productService.deleteProduct(product).subscribe({
        next: () => this.onDelete(),
        error: err => console.log(err)
      });
    }
  }
  
  onDelete(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/products']);
  }

  filter(): void {
    var search = this.filterForm.get('search')?.value;
    if (search) {
      this.filteredProducts = this.products.filter(p => p.name.includes(search));
    }
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filteredProducts = this.products;
  }

}
