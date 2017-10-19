import { Component } from '@angular/core';
import { NavController, NavParams , LoadingController } from 'ionic-angular';
import { StrainsApiProvider } from '../../providers/strains-api/strains-api';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<any>;
  cache: Array<any>;
  DecodedStrains: any;
  response: any;
  p: number = 1;

  isOptions : any = false;
  itemsPage : any = 20;

  isSativa : boolean = true;
  isHybrid : boolean = true;
  isIndica : boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public serv : StrainsApiProvider, public loadingCtrl : LoadingController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

  }

  ionViewCanEnter() {

    return new Promise((resolve, reject) => {

      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src="assets/img/loading.gif">`
      });

      loading.present();

      this.cache = [];

      this.serv.getAllStrains().subscribe(
        (data)=> {

          this.response = data;
          this.DecodedStrains = Object.getOwnPropertyNames(this.response);

          for(let strain of this.DecodedStrains) {
            this.cache.push({name: strain , content: this.response[strain]})
          }

          this.refillList();
          this.filter();

            loading.dismiss();
            resolve(this.items);

        },
        (err)=>{
          alert(err);
        }
      );

    });
  }

  getAllStrains() {

    this.cache = [];

    this.serv.getAllStrains()
    .subscribe(
      (data)=> {

        this.response = data;
        this.DecodedStrains = Object.getOwnPropertyNames(this.response);

        for(let strain of this.DecodedStrains) {
          this.cache.push({name: strain , content: this.response[strain]})
        }

        this.refillList();
        this.filter();

      },
      (err)=>{
        alert(err);
      }
    );

  }

  refillList() {
    this.items = this.cache;
  }

  toggleToolbar() {
    this.isOptions = !this.isOptions;
  }

  filter() {

    let race: string;
    let buffer: Array<any> = [];
    this.items = [];

    if(this.isHybrid == true) {
      race = "hybrid";
      buffer = this.cache.filter((item) => {
        return (item.content.race.toLowerCase().indexOf(race.toLowerCase()) > -1);
      });

      buffer.forEach((item) => {
        this.items.push(item);
      });

    }

    if(this.isSativa == true) {
      race = "sativa";
      buffer = this.cache.filter((item) => {
        return (item.content.race.toLowerCase().indexOf(race.toLowerCase()) > -1);
      });

      buffer.forEach((item) => {
        this.items.push(item);
      });

    }

    if(this.isIndica == true) {
      race = "indica";
      buffer = this.cache.filter((item) => {
        return (item.content.race.toLowerCase().indexOf(race.toLowerCase()) > -1);
      });

      buffer.forEach((item) => {
        this.items.push(item);
      });

    }

    this.items.sort((a,b) => {

      return a.content.id - b.content.id;

    });

  }

  getItems(ev: any) {

    this.refillList();
    this.filter();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })

    }

  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }
}
