import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/Product';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-product-index',
  templateUrl: './product-index.component.html',
  styleUrls: ['./product-index.component.css']
})
export class ProductIndexComponent implements OnInit {

  constructor(private _productService: ProductsService) { }

  columnNames = ['details', 'ProductId', 'ProductName', 'ProductUpc', 'ProductPrice', 'ProductCategory', 'ProductDescription', 'buttons'];
  dataSource: MatTableDataSource<Product>;

  ngOnInit() {
    this._productService.getProducts().subscribe((products: Product[]) => {
      this.dataSource = new MatTableDataSource<Product>(products);
    });
  }
}
