import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-search-result-page',
  templateUrl: './search-result-page.component.html',
  styleUrls: ['./search-result-page.component.css']
})
export class SearchResultPageComponent implements OnInit {

  search_string: any;
  search_results: any;
  constructor(private productService: ProductService, private route: ActivatedRoute, private spinner: NgxSpinnerService) { 
    this.search_string = "";
    this.search_results = [{
      name:"",
      slug:"",
      regular_price:"",
      sale_price:"",
      price:"",
      images:[{
        src:""
      }],
      save_percent: ""
    }];
  }

  ngOnInit(): void {
    this.search_string = this.route.snapshot.paramMap.get('keyword')?.toString();
    this.spinner.show();
    this.productService.getProductSearch(this.search_string).subscribe((prodSearch: any)=>{
      this.search_results = prodSearch;
      this.spinner.hide();
    })  
  }

}
