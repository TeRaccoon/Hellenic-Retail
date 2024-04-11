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
  primaryImage: string | null = '';
  zoomFactor: number = 1;
  zoomX: number = 0;
  zoomY: number = 0;

  imageUrl = '';

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.route.params.subscribe(params => {
      const productName = params['productName'];
      this.loadProduct(productName);
    });
  }

  async loadProduct(productName: string) {
    this.dataService.collectData("product-view", productName).subscribe((data: any) => {
      this.product = data;
      this.primaryImage = this.product.primary_image;
      this.loadProductImages(this.product.id);
    });
  }
  async loadProductImages(retailItemID: any) {
    this.dataService.collectData("product-view-images", retailItemID).subscribe((data: any) => {
      this.productImages = data;
    })
  }

  changeImage(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && target.getAttribute('data-image') != null) {
      this.primaryImage = target.getAttribute('data-image');
    }
    const containers = document.querySelectorAll('.sidebar-image-container');
    containers.forEach(d => d.classList.remove('active'));
    const targetParent = target.parentElement;
    if (targetParent != null) {
      targetParent.classList.add('active');
    }
  }
  
  openImage() {
    window.open(this.imageUrl + this.primaryImage, '_blank');
  }

  zoomImage(event: MouseEvent | null) {
    if (event) {
      const container = event.currentTarget as HTMLElement;
      const boundingBox = container.getBoundingClientRect();
      
      const containerX = boundingBox.left + window.scrollX;
      const containerY = boundingBox.top + window.scrollY;
  
      const mouseX = event.clientX - containerX;
      const mouseY = event.clientY - containerY;
  
      const zoomFactor = 1.25;
      this.zoomFactor = zoomFactor;
  
      this.zoomX = (mouseX / boundingBox.width) * zoomFactor * 25 - 25;
      this.zoomY = (mouseY / boundingBox.height) * zoomFactor * 25 - 25;
    }
  }
  

  resetZoom() {
    this.zoomFactor = 1;
    this.zoomX = 0;
    this.zoomY = 0;
  }
}
