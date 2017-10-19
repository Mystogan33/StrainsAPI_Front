import { Injectable } from '@angular/core';
import { Http /*, Headers , RequestOptions*/} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class StrainsApiProvider {

  constructor(public http: Http) {
    console.log('Hello StrainsApiProvider Provider');
  }

  getAllStrains(): Observable<any> {

    return this.http.get('http://strainapi.evanbusse.com/3RC3bWW/strains/search/all')
    .map(res => res.json());
  }

}
