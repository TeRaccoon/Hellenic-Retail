import { Component } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent {
  faX = faX;

  wishlistProducts = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {

  }

  async loadWishlist() {
    let wishlistProducts = await lastValueFrom(this.dataService.collectData("wishlist-from-email"));
    
  }
}
