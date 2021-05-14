import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { UmbracoData, UmbracoDropdown } from '../umbracoData';


@Injectable({
  providedIn: 'root'
})
export class UmbracoDataService {
  private getUrl = `https://cdn.umbraco.io/content/fff351dc-4c7e-44dd-baa1-adf672f573ab`;
  private getDropdownList = `https://cdn.umbraco.io/content/72add90a-2a08-429a-a2d6-4ddd21d9e692`;
  private testGraphQL = `https://cdn.umbraco.io/content/8fa4f626-23f2-4633-a9db-4a81627c811e`;
  httpOptions = {
    headers: new HttpHeaders({
      'Umb-Project-Alias': 'umbracodemo'
    })
  };

  constructor(private httpClient: HttpClient) { }

  getRequest() {
    return this.httpClient.get<UmbracoData>(this.getUrl, this.httpOptions);
  }

  getdropdownList() {
    return this.httpClient.get<UmbracoDropdown>(this.getDropdownList, this.httpOptions)
  }

  getSampleData() {
    return this.httpClient.get(this.testGraphQL, this.httpOptions)

  }

}
