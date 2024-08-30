import { Component } from '@angular/core';
import { AppService } from 'src/service/app-service.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  isExpanded = false;

  constructor(public toggleService: AppService) {}
  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  
  hideFrontPage(): void {
    this.toggleService.toggle(false);
  }

}
