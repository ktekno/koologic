import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-diy-page',
  templateUrl: './diy-page.component.html',
  styleUrls: ['./diy-page.component.css']
})
export class DiyPageComponent implements OnInit {

  hardwarePostPage: number = 1;
  softwarePostPage: number = 1;
  hybridPostPage: number = 1;
  hardwareTotalPage: number = 1;
  softwareTotalPage: number = 1;
  hybridTotalPage: number = 1;
  hardwarePostList: any = [];
  softwarePostList: any = [];
  hybridPostList: any = [];
  constructor(
    private spinner: NgxSpinnerService,
    private blogService: BlogService) { }

  ngOnInit(): void {
    let count = 0;
    this.spinner.show();
    this.blogService.getPostsByCategory("hardware-project","1").subscribe((pageInfo: any)=>{
      this.hardwarePostList = pageInfo.post_list;
      console.log(this.hardwarePostList);
      this.hardwareTotalPage = pageInfo.total_page;
      count++;
      if(count == 3)
        this.spinner.hide();
    }, error => {
      count++;
      if(count == 3)
        this.spinner.hide();
    });

    this.blogService.getPostsByCategory("software-project","1").subscribe((pageInfo: any)=>{
      this.softwarePostList = pageInfo.post_list;
      this.softwareTotalPage = pageInfo.total_page;
      count++;
      if(count == 3)
        this.spinner.hide();
    }, error => {
      count++;
      if(count == 3)
        this.spinner.hide();
    });

    this.blogService.getPostsByCategory("hybrid-project","1").subscribe((pageInfo: any)=>{
      this.hybridPostList = pageInfo.post_list;
      this.hybridTotalPage = pageInfo.total_page;
      count++;
      if(count == 3)
        this.spinner.hide();
    }, error => {
      count++;
      if(count == 3)
        this.spinner.hide();
    });
  }

  moveHardwarePage(direction: string): void{
    if(direction == "next")
      this.hardwarePostPage++;
    if(direction == "prev")
      this.hardwarePostPage--;
    this.blogService.getPostsByCategory("hardware-project",this.hardwarePostPage.toString()).subscribe((pageInfo: any)=>{
      this.hardwarePostList = pageInfo.post_list;
      this.hardwareTotalPage = pageInfo.total_page;
    });
  }

  moveSoftwarePage(direction: string): void{
    if(direction == "next")
      this.softwarePostPage++;
    if(direction == "prev")
      this.softwarePostPage--;
    this.blogService.getPostsByCategory("software-project",this.softwarePostPage.toString()).subscribe((pageInfo: any)=>{
      this.softwarePostList = pageInfo.post_list;
      this.softwareTotalPage = pageInfo.total_page;
    });
  }
  
  moveHybridPage(direction: string): void{
    if(direction == "next")
      this.hybridPostPage++;
    if(direction == "prev")
      this.hybridPostPage--;
    this.blogService.getPostsByCategory("hybrid-project",this.hybridPostPage.toString()).subscribe((pageInfo: any)=>{
      this.hybridPostList = pageInfo.post_list;
      this.hybridTotalPage = pageInfo.total_page;
    });
  }
}
