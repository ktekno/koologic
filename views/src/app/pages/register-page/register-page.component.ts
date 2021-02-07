import { Component, ElementRef, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  public isSuccess: number = -1;
  first_name: string = "";
  last_name: string = "";
  email: string = "";
  phone_number: string = "";
  password: string = "";
  confirm_password: string = "";

  orig_email: string = "";
  orig_phone_number: string = "";
  constructor(
    private _elementRef : ElementRef,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    let _this = this;
    this.authService.isAuthenticated().then((response: any) => {
      if(response.success){
        _this.router.navigate(["user-info"]);
      }
    });
  }

  registerUser(): void {
    let isValid = true;

    if(this.password != this.confirm_password){
      this._elementRef.nativeElement.querySelector("#password1").style.background = "#f8d7da";
      this._elementRef.nativeElement.querySelector("#password2").style.background = "#f8d7da";
      this._elementRef.nativeElement.querySelector("#password1").scrollIntoView();
      isValid = false;
    }
    
    if(!this.email.match("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")){
      this._elementRef.nativeElement.querySelector("#email").style.background = "#f8d7da";
      this._elementRef.nativeElement.querySelector("#email").scrollIntoView();
      isValid = false;
    }
    if(!this.phone_number.match("^(09|\\+639)\\d{9}$")){
      this._elementRef.nativeElement.querySelector("#phone").style.background = "#f8d7da";
      this._elementRef.nativeElement.querySelector("#phone").scrollIntoView();
      isValid = false;
    }
    
    if(isValid){
      this.spinner.show();
      this.authService.registerUser({
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        password: this.password,
        billing: {
          phone: this.phone_number
        }
      }).subscribe((credInfo: any)=>{
        this.spinner.hide();
        this._elementRef.nativeElement.querySelector("#phone").style.background = "#FFFFFF";
        this._elementRef.nativeElement.querySelector("#email").style.background = "#FFFFFF";
        this._elementRef.nativeElement.querySelector("#password1").style.background = "#FFFFFF";
        this._elementRef.nativeElement.querySelector("#password2").style.background = "#FFFFFF";
        this.isSuccess = 1;
      }, (error) => {
        this.spinner.hide();
        this.isSuccess = 0;
      });
    }
  }
}
