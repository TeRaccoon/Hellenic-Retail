import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-view-description',
  templateUrl: './view-description.component.html',
  styleUrls: ['./view-description.component.scss']
})
export class ViewDescriptionComponent {
  @Input() description!: string;
}
