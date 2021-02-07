import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public isSuccess: number = -1;

  constructor(
    private _elementRef : ElementRef,
    public authService: AuthService) { }

  ngOnInit(): void {
    
    this.authService.isAuthenticated().then((response: any) => {
      if(response.success){
        location.href = "/user-info";
      } 
    }, (error)=>{
    });
  }

  sendRequest(): void {
    this.authService.forgotPassword({email: this._elementRef.nativeElement.querySelector('.forgot-password-input').value}).subscribe(response => {
      if(response.success){
        this.isSuccess = 1;
      } else {
        this.isSuccess = 0;
      }
    }, error => {
      this.isSuccess = 0;
    })
  }
}
