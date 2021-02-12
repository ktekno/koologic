import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomePageComponent implements OnInit {

  public carouselImages = [
    "https://www.e-gizmo.net/oc/image/cache/catalog/0layout/homepage/banner/raspi4-800x500.jpg",
    "https://www.e-gizmo.net/oc/image/cache/catalog/0layout/homepage/banner/raspi4-800x500.jpg",
    "https://www.e-gizmo.net/oc/image/cache/catalog/0layout/homepage/banner/raspi4-800x500.jpg"
  ]
  public newArrivals = [{
    itemClassificationBadge: "New Arrival",
    itemClassification: "new-arival",
    imgSrc:"",
    priceBadge: "₱10,000.00",
    titleSpecs: "SPECS",
    subSpecs: `Specs Specs Specs<br>Specs Specs Specs`,
    slug: ""
  }];
  
  public bestSellerProducts = [{
    itemClassificationBadge: "Sale 50% off",
    itemClassification: "discount",
    imgSrc: "/assets/temp-img/lenovo.png",
    priceBadge: "₱10,000.00",
    titleSpecs: "SPECS2",
    subSpecs: `Specs Specs Specs<br>Specs Specs Specs`,
    slug: ""
  }];

  constructor(private productService: ProductService, 
    private spinner: NgxSpinnerService) { 
    this.newArrivals = [];
    this.bestSellerProducts = [];
  }

  ngOnInit(): void {
    let count = 0;
    this.spinner.show();
    this.productService.getProductNew(25).toPromise().then((prodList: any)=>{
      prodList.forEach((prod: any) => {
        this.newArrivals.push({
          itemClassificationBadge: "New Arrival",
          itemClassification: "new-arrival",
          imgSrc: prod.images[0]? prod.images[0].src : "",
          priceBadge: (parseFloat(prod.price) || 0) + "",
          titleSpecs: prod.name,
          subSpecs: ``,
          slug: prod.slug
        })
      });
      count++;
      if(count >= 2)
        this.spinner.hide();
    }, (error) => {
      count++;
      if(count >= 2)
        this.spinner.hide();

    });
    this.productService.getProductNew(25).toPromise().then((prodList: any)=>{
      prodList.forEach((prod: any) => {
        this.newArrivals.push({
          itemClassificationBadge: "Featured Products",
          itemClassification: "discount",
          imgSrc: prod.images[0]? prod.images[0].src : "",
          priceBadge: (parseFloat(prod.price) || 0) + "",
          titleSpecs: prod.name,
          subSpecs: ``,
          slug: prod.slug
        })
      });
      count++;
      if(count >= 2)
        this.spinner.hide();
    }, (error) => {
      count++
      if(count >= 2)
        this.spinner.hide();
    });
  }

}
