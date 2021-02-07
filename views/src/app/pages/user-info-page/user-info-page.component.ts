import { Component, ElementRef, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-info-page',
  templateUrl: './user-info-page.component.html',
  styleUrls: ['./user-info-page.component.css']
})
export class UserInfoPageComponent implements OnInit {

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
    public authService: AuthService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.authService.getUser().subscribe((credInfo: any)=>{
      this.first_name = credInfo.first_name;
      this.last_name = credInfo.last_name;
      this.email = this.orig_email = credInfo.email;
      this.phone_number = this.orig_phone_number = credInfo.billing.phone;
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
    });
  }

  updateUser(): void {
    let isValid = true;

    if(this.password != this.confirm_password){
      this._elementRef.nativeElement.querySelector("#password1").style.background = "#f8d7da";
      this._elementRef.nativeElement.querySelector("#password2").style.background = "#f8d7da";
      this._elementRef.nativeElement.querySelector("#password1").scrollIntoView();
      isValid = false;
    }
    
    if(this.email != this.orig_email && !this.email.match("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")){
      this._elementRef.nativeElement.querySelector("#email").style.background = "#f8d7da";
      this._elementRef.nativeElement.querySelector("#email").scrollIntoView();
      isValid = false;
    }
    if(this.phone_number != this.orig_phone_number && !this.phone_number.match("^(09|\\+639)\\d{9}$")){
      this._elementRef.nativeElement.querySelector("#phone").style.background = "#f8d7da";
      this._elementRef.nativeElement.querySelector("#phone").scrollIntoView();
      isValid = false;
    }
    
    if(isValid){
      this.spinner.show();
      this.authService.editUser({
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
