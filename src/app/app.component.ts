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
  subTopic = [];
  topic = [];
  sampleData;
  constructor(private getDataService: UmbracoDataService) { }

  ngOnInit() {
    this.getUmbracoData();
    this.getdropdownList();
    this.getSample();
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
      this.topic = this.dropdownList.topic;
      this.subTopic = this.dropdownList.subTopic;
      console.log('dropdown', this.dropdownOptions);
      console.log('submenu', this.subTopic);

    })
  }

  getSample() {
    this.getDataService.getSampleData().subscribe(data => {
      this.sampleData = data['topics'];
      console.log(data);
    })
  }

}
