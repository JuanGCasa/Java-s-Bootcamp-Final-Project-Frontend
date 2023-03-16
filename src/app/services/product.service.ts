import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  
  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';
  
  constructor(private httpClient: HttpClient) {  }

  getProductListPaginate(thePage: number, 
                         thePageSize: number,
                         theCategoryId: number): Observable<GetResponseProduct> {

    //build Url based on categoryId, page, and size!
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  } 
 
 
  getProductList(theCategoryId: number): Observable<Product[]> {

    //build Url based on categoryId
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    
    //build Url based on keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductPaginate(thePage: number, 
                        thePageSize: number,
                        theKeyword: string): Observable<GetResponseProduct> {

    //build Url based on keyword, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
    } 

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories() : Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  getProduct(theProductId: number): Observable<Product> {

    //build an URL based on the product id.
    const productUrl = `${this.baseUrl}/${theProductId}`;
    
    return this.httpClient.get<Product>(productUrl);
  }

}

interface GetResponseProduct {
  _embedded: {
    products: Product[];
   },
   page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
   }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
   }
}
