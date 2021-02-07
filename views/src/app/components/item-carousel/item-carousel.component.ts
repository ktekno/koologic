import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AppService } from '../../app.service'; 

@Component({
  selector: 'app-item-carousel',
  templateUrl: './item-carousel.component.html',
  styleUrls: ['./item-carousel.component.css']
})
export class ItemCarouselComponent implements OnInit {
  @Input() navParams: any = [];
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<img src=assets/img/left-arrow.png>', '<img src=assets/img/right-arrow.png>'],
    responsive: {
      0: {
        items: 1
      },
      200: {
        items: 2
      },
      640: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }
  constructor(public _appService: AppService) { }

  ngOnInit(): void {
    
  }

}
