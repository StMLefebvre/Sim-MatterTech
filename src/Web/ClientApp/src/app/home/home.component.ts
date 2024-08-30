import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { AppService } from 'src/service/app-service.service';
import { flatMap } from 'rxjs';
import { HomeService } from './home.service';
import { UserVm } from 'src/shared/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  
  currentUser:UserVm
  constructor(public toggleService: AppService
    ,private homeService:HomeService) {

    }

  ngOnInit(): void {
   // throw new Error('Method not implemented.');
   //AppComponent.IsIndex = false;
    this.homeService.getHomeIndex().subscribe({
      next: result => {
        this.currentUser = result
       
        if(result && result.roles) //&& result.Roles.includes('Administrator'))
        {
          this.toggleService.userRoles = result.roles;
        }else
        {
          this.toggleService.userRoles = [];
        }
        
      },
      error: error => console.error(error)
  });

  }


  hideFrontPage(): void {
    this.toggleService.toggle(false);
  }

 

  



}
