import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../app.service'; 
import { CookieService } from 'ngx-cookie';
 

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  username: string = "";
  password: string = "";
  invalid: boolean = false;

  constructor(
              public _appService: AppService,
              public authService: AuthService, 
              private cookieService: CookieService,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) { 

  }

  ngOnInit(): void {
    this.spinner.show();
    this.authService.isAuthenticated().then((response: any) => {
      this.spinner.hide();
      if(response.success){
        this.router.navigate(['home']);
      } else {
        this.cookieService.remove("token");
        this.cookieService.remove("user_id");
      }
    }, (error)=>{
      this.spinner.hide();
    });
  }

  login(){
    this.invalid = false;
    this.spinner.show();
    this.authService.authenticateUser(this.username, this.password).subscribe((credInfo: any)=>{
      this.cookieService.put("token", credInfo.token);
      this.cookieService.put("user_id", credInfo.user_id);
      this.cookieService.putObject("cart_contents", credInfo.cart_contents);
      this._appService.refreshCart();
      this.spinner.hide();
      //this.router.navigate(['user-info']);
      this.route.queryParams.subscribe(params => {
        this.invalid = false;
          if(params['path'] == "cart")
            window.location.href = "/cart";
          else if(params['path'] == "checkout")
            window.location.href = "/checkout";
          else 
            window.location.href = "/user-info";
      });
    }, (error) => {
      this.spinner.hide();
      this.cookieService.remove("token");
      this.cookieService.remove("user_id");
      console.log(error.error);
      this.invalid = true;
    })
  }
}
