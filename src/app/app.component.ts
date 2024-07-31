import { Component } from '@angular/core';
import { RenderService } from './services/render.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Hellenic Grocery';
  screenSize: any = {};

  constructor(private renderService: RenderService) {}

  ngOnInit() {
    this.renderService.getScreenSize().subscribe(size => {
      this.screenSize = size;
    });
  }
}
