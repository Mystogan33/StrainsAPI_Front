import { Injectable } from '@angular/core';
import { Http /*, Headers , RequestOptions*/} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class StrainsApiProvider {

  private apiKey : any = "wIsOW7z";

  constructor(public http: Http) {
    console.log('Hello StrainsApiProvider Provider');
  }

  getApiKey() {
    return this.apiKey;
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  getAllStrains(): Observable<any> {

    return this.http.get('http://strainapi.evanbusse.com/'+this.apiKey+'/strains/search/all')
    .map(res => res.json());
  }

  getAllFlavors(): Observable<any> {
    return this.http.get('http://strainapi.evanbusse.com/'+this.apiKey+'/searchdata/effects')
    .map(res => res.json());
  }

  getAllEffects(): Observable<any> {
    return this.http.get('http://strainapi.evanbusse.com/'+this.apiKey+'/searchdata/flavors')
    .map(res => res.json());
  }

}
