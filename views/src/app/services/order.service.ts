import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) { }

  public getOrder(id: number){
    return this.httpClient.get("/order/" + id);
  }
  public getOrderList(page_num: number){
    return this.httpClient.get("/order-list/" + page_num);
  }
  public generateOrder(order: any){
    return this.httpClient.post<any>("/order/new", order);
  }
  public cancelOrder(id: number){
    return this.httpClient.get("/order/cancel/" + id);
  }
}
