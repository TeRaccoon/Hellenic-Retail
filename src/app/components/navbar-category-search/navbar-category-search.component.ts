import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { FormService } from 'src/app/services/form.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-navbar-category-search',
  templateUrl: './navbar-category-search.component.html',
  styleUrls: ['./navbar-category-search.component.scss']
})
export class NavbarCategorySearchComponent {
  faBars = faBars;
  categories: string[] = [];

  constructor(private router: Router, private dataService: DataService, private formService: FormService) { }

  ngOnInit() {
    this.categories = this.dataService.getVisibleCategoryNames();
  }

  goToCategory(category: string) {
    this.dataService.setShopFilter(null);
    this.router.navigate(["/shop/" + category]);
  }
}
