import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  searchbar: string = "";
  isLogged: boolean = false;
  constructor(
    public _appService: AppService,
    private router: Router,
    public authService: AuthService) { }

  ngOnInit(): void {
    let _this = this;
    this._appService.path = "";
    this.authService.isAuthenticated().then((response: any) => {
      if(response.success){
        _this.isLogged = true;
      }
    },(error)=>{
      console.log(error);
    });
    this._appService.refreshCart();
  }

  getQuantityTotal(): number {
    return this._appService.cart_contents.reduce(function(prev: any, cur: any) {return (parseFloat(prev) + parseFloat(cur.quantity)) || 0;}, 0)
  }

  search(search_string: string): any{
    if(search_string.length > 0)
      this.router.navigate(["/search-result/" + search_string.toLowerCase()]);
  }
  logout(): void{
    
  }
}
