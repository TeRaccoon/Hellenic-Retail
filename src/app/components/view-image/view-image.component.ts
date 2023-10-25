import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss']
})
export class ViewImageComponent {
  product: any;
  productImages: any;
  zoomFactor: number = 1;
  zoomX: number = 0;
  zoomY: number = 0;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productName = params['productName'];
      this.loadProduct(productName);
    });
  }

  async loadProduct(productName: string) {
    this.dataService.collectData("product-view", productName).subscribe((data: any) => {
      this.product = data;
      this.loadProductImages(this.product.id);
    });
  }
  async loadProductImages(retailItemID: any) {
    this.dataService.collectData("product-view-images", retailItemID).subscribe((data: any) => {
      this.productImages = data;
    })
  }

  zoomImage(event: MouseEvent | null) {
    if (event) {
      const container = event.currentTarget as HTMLElement;
      const boundingBox = container.getBoundingClientRect();
      
      const containerX = boundingBox.left + window.scrollX;
      const containerY = boundingBox.top + window.scrollY;
  
      const mouseX = event.clientX - containerX;
      const mouseY = event.clientY - containerY;
  
      const zoomFactor = 1.5;
      this.zoomFactor = zoomFactor;
  
      this.zoomX = (mouseX / boundingBox.width) * zoomFactor * 75 - 75;
      this.zoomY = (mouseY / boundingBox.height) * zoomFactor * 75 - 75;
    }
  }
  

  resetZoom() {
    this.zoomFactor = 1;
    this.zoomX = 0;
    this.zoomY = 0;
  }
}
