import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { AppService } from 'src/service/app-service.service';
import { flatMap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  constructor(public toggleService: AppService) {}

  ngOnInit(): void {
   // throw new Error('Method not implemented.');
   //AppComponent.IsIndex = false;
  }


  hideFrontPage(): void {
    this.toggleService.toggle(false);
  }

 

  



}
