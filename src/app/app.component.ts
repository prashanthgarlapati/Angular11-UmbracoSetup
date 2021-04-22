import { Component, OnInit } from '@angular/core';
import { UmbracoDataService } from './services/umbracoData.service';
import { UmbracoData, UmbracoDropdown } from './umbracoData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular11';
  umbracoData: UmbracoData;
  dropdownList: UmbracoDropdown;
  dropdownOptions = [];
  submenu = [];
  constructor(private getDataService: UmbracoDataService) { }

  ngOnInit() {
    this.getUmbracoData();
    this.getdropdownList();
  }

  getUmbracoData() {
    this.getDataService.getRequest().subscribe(data => {
      this.umbracoData = data;
      console.log(this.umbracoData);
    })
  }

  getdropdownList() {
    this.getDataService.getdropdownList().subscribe(data => {
      this.dropdownList = data;
      this.dropdownOptions = this.dropdownList.menu;
      this.submenu = this.dropdownList.sublist;
      console.log('dropdown', this.dropdownOptions);
      console.log('submenu', this.submenu);

    })
  }

}
