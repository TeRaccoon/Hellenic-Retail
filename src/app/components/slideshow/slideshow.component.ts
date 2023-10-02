import { Component, OnInit, Renderer2 } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent implements OnInit {
  slideIndex: number = 0;
  timer: Subscription | undefined;
  featuredProducts: any[] = [];

  constructor(private renderer: Renderer2, private dataService: DataService) { }

  ngOnInit() {
    this.startSlideShow();
  }

  ngOnDestroy() {
    this.stopSlideShow();
  }

  selectItem(stockCode: string) {
    if (this.timer) {
      this.timer.unsubscribe();
    }
    // location.href = "view.php";
    localStorage.setItem("stockCode", stockCode);
  }

  startSlideShow() {
    console.log("started");
    this.timer = interval(5000).subscribe(() => {
      this.changeSlide(1);
    });
  }

  stopSlideShow() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }

  changeSlide(n: number) {
    this.showSlide(this.slideIndex += n);
  }

  showSlide(n: number) {
    let slides = this.featuredProducts.length;
  
    if (n >= slides) {
      this.slideIndex = 0;
    } else if (n < 0) {
      this.slideIndex = slides - 1;
    } else {
      this.slideIndex = n;
    }
  }
  async loadSlideShow() {
    this.startSlideShow();
    this.dataService.collectData("featured").subscribe((data: any) => {
      this.featuredProducts = data;
    });
  }
}
