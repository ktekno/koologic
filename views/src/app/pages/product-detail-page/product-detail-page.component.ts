import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { AppService } from '../../app.service'; 

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.css']
})
export class ProductDetailPageComponent implements OnInit {
  prod_id: any;
  slug: any;
  name: any;
  price: any;
  regular_price: any;
  sale_price: any;
  hasDiscount: boolean;
  discount: number;
  variations: any;
  variationIds: any;
  variant: any;
  short_info: any;
  description: any;
  images: any;
  carouselImages: any;
  date_created: any;
  save_percent: any;
  quantity: any;
  constructor(private productService: ProductService, 
              private route: ActivatedRoute, 
              private spinner: NgxSpinnerService,
              public _appService: AppService) {             
    this.slug = "";  
    this.discount = 0;
    this.hasDiscount = false;
    this.variationIds = [];
    this.variations = [];
  }

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug')?.toString();
    this.spinner.show();    
    this.quantity = 1;
    this.productService.getProductInfo(this.slug).subscribe((prodInfo: any)=>{
      this.prod_id = prodInfo.id;
      this.name = prodInfo.name;
      this.regular_price = (parseFloat(prodInfo.regular_price) || 0);
      this.sale_price = (parseFloat(prodInfo.sale_price) || 0);
      this.price = (parseFloat(prodInfo.sale_price) || 0) == 0 && (parseFloat(prodInfo.regular_price) || 0) == 0? (parseFloat(prodInfo.price) || 0).toFixed(2) : parseFloat(prodInfo.sale_price).toFixed(2);
      this.discount = (parseFloat(prodInfo.regular_price) || 0) - (parseFloat(prodInfo.sale_price)||0);
      this.variationIds = prodInfo.variations.length > 0? prodInfo.variations : [];
      this.variations = prodInfo.attributes.length > 0? prodInfo.attributes[0].options : [];
      this.variant = this.variationIds.length > 0? this.variationIds[0] : this.prod_id;
      this.short_info = prodInfo.short_description;
      this.images = prodInfo.images;
      this.carouselImages = [];
      this.description = prodInfo.description;
      this.hasDiscount = this.discount != 0 && this.discount != this.price;
      this.save_percent = (parseFloat(prodInfo.sale_price) || 0) == 0? 0 : (((parseFloat(prodInfo.regular_price) || 0) - (parseFloat(prodInfo.sale_price) || 0))*100/(parseFloat(prodInfo.regular_price))).toFixed(2);
      this.date_created = prodInfo.date_created;
      for(let i = 0; i < prodInfo.images.length; i+=4){
          this.carouselImages.push([
            prodInfo.images[i],
            i+1 < prodInfo.images.length? prodInfo.images[i+1] : {},
            i+2 < prodInfo.images.length? prodInfo.images[i+2] : {},
            i+3 < prodInfo.images.length? prodInfo.images[i+3] : {}
          ]);
      }
      this.spinner.hide();
    })  
  }

  addToCart(): void{
    let daysPassed = (new Date().getTime() - new Date(this.date_created).getTime())/(1000*60*60*24);
    this.spinner.show();
    this.productService.getProductInfoById(this.variant).subscribe((prodInfo: any)=>{
      this.spinner.hide();
      prodInfo.save_percent = (parseFloat(prodInfo.sale_price) || 0) == 0? 0 : (((parseFloat(prodInfo.regular_price) || 0) - (parseFloat(prodInfo.sale_price) || 0))*100/(parseFloat(prodInfo.regular_price))).toFixed(2);
      this._appService.addToCart({
        prod_id: prodInfo.id,
        itemClassificationBadge: daysPassed < 10? "New Arrival" : prodInfo.save_percent != 0? "Save " + prodInfo.save_percent + "%": "",
        itemClassification: daysPassed < 10? "new-arrival" : prodInfo.save_percent != 0? "discount": "" ,
        imgSrc: this.carouselImages[0][0].src,
        regularPrice: prodInfo.sale_price != ""? prodInfo.regular_price : prodInfo.price,
        discountedPrice: prodInfo.sale_price,
        priceBadge: parseFloat(prodInfo.price).toFixed(2),
        titleSpecs: prodInfo.name,
        quantity: this.quantity,
        subSpecs: ``,
        url: "/product/" + this.slug
      })
      this._appService.openCart();
    });
  }
  

  changeVariant(value: any): void{
    this.variant = value;
    this.productService.getProductInfoById(this.variant).subscribe((prodInfo: any)=>{
      this.prod_id = prodInfo.id;
      this.name = prodInfo.name;
      this.regular_price = (parseFloat(prodInfo.regular_price) || 0);
      this.sale_price = (parseFloat(prodInfo.sale_price) || 0);
      this.price = (parseFloat(prodInfo.sale_price) || 0) == 0 && (parseFloat(prodInfo.regular_price) || 0) == 0? (parseFloat(prodInfo.price) || 0).toFixed(2) : parseFloat(prodInfo.sale_price).toFixed(2);
      this.discount = (parseFloat(prodInfo.regular_price) || 0) - (parseFloat(prodInfo.sale_price)||0);
      this.hasDiscount = this.discount != 0 && this.discount != this.price;
      this.save_percent = (parseFloat(prodInfo.sale_price) || 0) == 0? 0 : (((parseFloat(prodInfo.regular_price) || 0) - (parseFloat(prodInfo.sale_price) || 0))*100/(parseFloat(prodInfo.regular_price))).toFixed(2);
      this.date_created = prodInfo.date_created;
      for(let i = 0; i < prodInfo.images.length; i+=4){
          this.carouselImages.push([
            prodInfo.images[i],
            i+1 < prodInfo.images.length? prodInfo.images[i+1] : {},
            i+2 < prodInfo.images.length? prodInfo.images[i+2] : {},
            i+3 < prodInfo.images.length? prodInfo.images[i+3] : {}
          ]);
      }
    })
  }

  changeQty(value: number): void {
    this.quantity = value;
  }

}
