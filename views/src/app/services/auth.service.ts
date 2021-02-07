import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public isLoggedIn: boolean = false;

    constructor(private httpClient: HttpClient,
        private cookieService: CookieService) { 

        }

    isAuthenticated() {
        let token = this.cookieService.get("token")? this.cookieService.get("token") : "";
        return new Promise(resolve=>{ 
            this.httpClient.post('/auth/isAuthenticated',{}, {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json',
                    Authorization: 'Bearer ' + token
                })
            }).subscribe(result => {
                resolve(result);
            }, error =>{
                //this.cookieService.removeAll();
                resolve(error);
            });
        });
    }

    public authenticateUser(username: string, password: string){
        return this.httpClient.post<any>("/auth", {
            "username": username,
            "password": password
        });
    }

    public getUser(){
        return this.httpClient.get("/auth/user-info");
    }

    public editUser(userInfo: any){
        return this.httpClient.put<any>("/auth/edit", userInfo);
    }

    public registerUser(user_details: any){
        return this.httpClient.post<any>("/auth/new", user_details);
    }

    public forgotPassword(request: any){
        return this.httpClient.post<any>("/verify-email", request);
    }

    public logout(){
        this.cookieService.remove("token");
        this.cookieService.remove("user_id");
        this.cookieService.remove("cart_contents");
        this.httpClient.post<any>("/auth/expire",{},{
            headers:{
                authorization: "Bearer " + this.cookieService.get("token")
            }
        }).subscribe((response)=>{
            window.location.href = "/";
        });
    }
}