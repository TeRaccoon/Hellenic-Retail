import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {
  category: string = '';
  products: any[] = [];

  constructor(private dataService: DataService, private router: ActivatedRoute) {}

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.category = params['category'];
      this.loadProductGrid();
    });
  }

  loadProductGrid() {
    this.dataService.collectData("items-category", this.category).subscribe((data: any) => {
      this.products = data;
    });
  }
}
