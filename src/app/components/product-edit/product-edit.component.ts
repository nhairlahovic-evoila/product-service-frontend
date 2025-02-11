import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-edit',
  standalone: false,
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent implements OnInit {
  productId: number = 0;
  productForm!: FormGroup;
  errorMessage?: string;

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router, private route: ActivatedRoute) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id > 0) {
        this.productId = id;
        this.fetchProduct(id);
      }
    });
  }

  fetchProduct(id: number) {
    this.productService.getProduct(id).subscribe({
      next: crawler => this.updateForm(crawler),
      error: err => console.log(err)
    });
  }

  updateForm(product: Product): void {
    this.productForm.setValue({
      name: product.name,
      description: product.description,
      price: product.price
    });
  }

  isInvalid(inputName: string): boolean | undefined {
    return (this.productForm.get(inputName)?.touched || this.productForm.get(inputName)?.dirty) && !this.productForm.get(inputName)?.valid;
  }

  submitForm(): void {
    if (this.productForm.valid) {
      const productRequest = {
        id: this.productId,
        name: this.productForm.get('name')?.value,
        description: this.productForm.get('description')?.value,
        price: this.productForm.get('price')?.value
      } as Product;

      if (this.productId > 0) {
        this.productService.updateProduct(this.productId, productRequest)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.handleError(err)
          })
      } else {
        this.productService.createProduct(productRequest)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.handleError(err)
          })
      }
    }
  }

  onSaveComplete(): void {
    this.router.navigate(['/products']);
  }

  onBack() {
    this.router.navigate(['/products']);
  }

  handleError(error: HttpErrorResponse): void {
      this.errorMessage = error.error.error;
  }
}
