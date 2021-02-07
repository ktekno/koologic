import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpClient: HttpClient) { }

  public getPoints(){
    return this.httpClient.get<any>("/cart/check-points");
  }

  public updateCart(cart_content: any){
    return this.httpClient.put<any>("/cart/update", cart_content);
  }
  
  public clearCart(){
    return this.httpClient.delete<any>("/cart/clear",{});
  }
 
  public removeFromCart(prod_id: number){
    return this.httpClient.delete<any>("/cart/" + prod_id,{});
  }
}
