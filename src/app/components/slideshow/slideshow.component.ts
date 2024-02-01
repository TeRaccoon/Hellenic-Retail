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
  imageNames: any[] = [];
  imageUrl = '';

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.loadSlideShow();
  }

  ngOnDestroy() {
    this.stopSlideShow();
  }

  selectItem(stockCode: string) {
    if (this.timer) {
      this.timer.unsubscribe();
    }
    localStorage.setItem("stockCode", stockCode);
  }

  startSlideShow() {
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
    let slides = this.imageNames.length;
  
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
    this.dataService.collectData("home-slideshow").subscribe((data: any) => {
      this.imageNames = data;
    });
  }
}
