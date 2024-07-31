import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { FormService } from 'src/app/services/form.service';
import { UrlService } from 'src/app/services/url.service'

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

  constructor(private urlService: UrlService, private formService: FormService, private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.imageUrl = this.urlService.getUrl('uploads');;
    this.route.params.subscribe(params => {
      const productName = params['productName'];
      this.loadProduct(productName);
    });
  }

  async loadProduct(productName: string) {
    let product = await lastValueFrom<any>(this.dataService.collectData("product-view", productName));
    if (product['primary_image'] == null) {
      product['primary_image'] = 'placeholder.jpg';
    }
    
    this.product = product;
    this.primaryImage = this.product.primary_image;
    this.productImages = await lastValueFrom(this.dataService.collectData("product-view-images", product.id));
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
  
  openImage(imageLocation: any) {
    this.formService.setImageViewerUrl(this.imageUrl + imageLocation);
    this.formService.showImageViewer();
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

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.imageUrl + 'placeholder.jpg';
  }
}
