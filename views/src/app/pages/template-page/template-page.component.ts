import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-template-page',
  templateUrl: './template-page.component.html',
  styleUrls: ['./template-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TemplatePageComponent implements OnInit {

  header: string = "";
  content: string = "";
  constructor(public blog: BlogService, 
              private router: Router,
              private spinner: NgxSpinnerService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    let template: any = this.route.snapshot.paramMap.get('template')?.toString();
    this.spinner.show();
    this.blog.getPost(template).subscribe(response => {
      this.spinner.hide();
      try{
        this.header = response.post_content[0].title.rendered;
        this.content = response.post_content[0].content.rendered;
      }catch(e){
        this.spinner.hide();
        this.router.navigateByUrl('404/404', { skipLocationChange: true });
      }
    }, error =>{
      this.spinner.hide();
      this.router.navigateByUrl('404/404', { skipLocationChange: true });
    })
  }

}
