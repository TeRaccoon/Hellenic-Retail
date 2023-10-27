import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faHeart, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsComponent {
  faHeart = faHeart;
  faEye = faEye;
  faClipboard = faClipboard;
  
  product: any;
  fullPath: string = '';
  oldPrice: (number | null) = null;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router, private clipboard: Clipboard) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productName = params['productName'];
      this.fullPath = decodeURI(this.router.url);
      this.loadProduct(productName);
    });
  }

  share(option: string) {
    switch(option) {
      case 'clipboard':
        this.clipboard.copy(textToCopy);
        break;
    }
  }

  async loadProduct(productName: string) {
    this.dataService.collectData("product-view-details", productName).subscribe((data: any) => {
      this.product = data;

      if (this.product.discount && this.product.discount != null) {
        this.oldPrice = this.product.price * ((100 - this.product.discount) / 100);
      }
      console.log(data);
    });
  }
}
