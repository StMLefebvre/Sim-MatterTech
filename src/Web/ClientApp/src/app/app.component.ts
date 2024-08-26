import { Component, Input } from '@angular/core';
import { AppService } from 'src/service/app-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'app';
  //static IsIndex:boolean = true;

  constructor(public toggleService: AppService) {}
  get isIndex(): boolean {
    return AppService.getValue();
  }
}
