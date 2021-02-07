import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  public getProductInfo(slug: string){
    return this.httpClient.get<any>("/product-info/" + slug);
  }
  public getProductInfoById(id: string){
    return this.httpClient.get<any>("/product-info-by-id/" + id);
  }
  public getProductSearch(keyword: string){
    return this.httpClient.get<any>("/product-search/" + keyword);
  }
  public getProductCategory(category: string){
    return this.httpClient.get<any>("/product-category/" + category);
  }
  public getProductNew(days_ago: number){
    return this.httpClient.get<any>("/products-new/" + days_ago);
  }
  public getProductBestSeller(days_ago: number){
    return this.httpClient.get<any>("/products-best-seller");
  }
}
