import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private httpClient: HttpClient) { }

  public getPostsByCategory(category: string, page: string){
    return this.httpClient.get<any>("/posts/" + category + "/" + page);
  }
  public getPost(slug: string){
    return this.httpClient.get<any>("/post/" + slug);
  }
}
