import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit {

  category: any;
  products: any;
  constructor(private productService: ProductService, private route: ActivatedRoute, private spinner: NgxSpinnerService) {
    
    this.category = "";
    this.products = [{
      name:"",
      slug:"",
      regular_price:"",
      sale_price:"",
      price:"",
      images:[{
        src:""
      }],
      save_percent: "",
      category_name: ""
    }];
   }

  ngOnInit(): void {
    this.products = [];
    let category_string: any = this.route.snapshot.paramMap.get('category')?.toString();

    this.spinner.show();
    this.productService.getProductCategory(category_string).subscribe((prodCat: any)=>{
      if(prodCat.length > 0){
        this.products = prodCat;
        this.category = this.products[0].category_name;
      }
      this.spinner.hide();
    })  
  }

}
