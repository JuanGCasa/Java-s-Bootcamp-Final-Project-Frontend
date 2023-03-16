import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{

  products: Product[] = [];
  currentCategoryId: number=1;
  previousCategoryId: number=1;
  currentCategoryName: string="";
  searchMode: boolean=false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number =10;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  constructor(private productService: ProductService, 
              private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
    this.listProducts();
  });
}

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }

    
  }

  handleSearchProducts(){
    
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //if we have a different keyword than previous
    //the set thePageNumber = 1

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePagenumber=${this.thePageNumber}`);

    //search for products using the keyword
    this.productService.searchProductPaginate(this.thePageNumber -1,
                                              this.thePageSize,
                                              theKeyword).subscribe(this.processResult());

  }

  handleListProducts(){

        //check if "id" parameter is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

        if (hasCategoryId){
          //getthe "id" param string. convert string to a number using the "+" symbol
          this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    
          this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
        }
        else{
          this.currentCategoryId = 1;
          this.currentCategoryName = 'Books';
        }
    
        //check if we have a category than previous.

        //if we have different category id than previous then we set thePageNumber = 1.
        if(this.previousCategoryId != this.currentCategoryId) {
          this.thePageNumber = 1;
        }

        this.previousCategoryId = this.currentCategoryId;

        console.log(`currentCategoryId=${this.currentCategoryId}, thePagenumber=${this.thePageNumber}`);


        //get the product list for the Category id!
        this.productService.getProductListPaginate(this.thePageNumber -1,
                                                  this.thePageSize,
                                                  this.currentCategoryId).subscribe(this.processResult());

  }

  processResult(){
    return(data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number +1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

}
