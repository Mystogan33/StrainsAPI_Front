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

  isFavorite : boolean = true;
  favorite : Array<any>;
  flavorsList : Array<any>;
  bFavorite : boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public serv : StrainsApiProvider, public loadingCtrl : LoadingController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.favorite = JSON.parse(localStorage.getItem('favorites'));
    this.flavorsList = ['indica','sativa','hybrid'];

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

            this.bFavorite = false;

            for(var i = 0 ; i < this.favorite.length ; i++) {


              if(strain.toLowerCase().trim() == this.favorite[i].toLowerCase().trim()) {
                this.bFavorite = true;
              }

            }

            this.cache.push({name: strain , content: this.response[strain] , favorite : this.bFavorite})

          }

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

  toggleFavorite(strain) {

    if(strain.favorite == true) {

      this.favorite = this.favorite.filter((item) => {
        return (item.toLowerCase().indexOf(strain.name.toLowerCase()) < 0);
      });

      localStorage.setItem('favorites', JSON.stringify(this.favorite));

    } else {
      this.favorite.push(strain.name);
      localStorage.setItem('favorites' , JSON.stringify(this.favorite));
    }

    strain.favorite = !strain.favorite;

  }

  getAllStrains() {

    this.cache = [];

    this.serv.getAllStrains()
    .subscribe(
      (data)=> {

        this.response = data;
        this.DecodedStrains = Object.getOwnPropertyNames(this.response);

        for(let strain of this.DecodedStrains) {

          this.bFavorite = false;

          for(var i = 0 ; i < this.favorite.length ; i++) {


            if(strain.toLowerCase().trim() == this.favorite[i].toLowerCase().trim()) {
              this.bFavorite = true;
            }

          }

          this.cache.push({name: strain , content: this.response[strain] , favorite : this.bFavorite})

          this.filter();

        }

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

    return new Promise((resolve, reject) => {
      let buffer: Array<any> = [];
      let race;
      let x;

      this.refillList();

      if(this.isSativa == true) {

        race = "sativa";
        x = this.cache.filter((item) => {
          return (item.content.race.toLowerCase().indexOf(race.toLowerCase()) > -1);
        });

        x.forEach((item) => {
          buffer.push(item);
        });

      }

      if(this.isHybrid == true) {

        race = "hybrid";
        x = this.cache.filter((item) => {
          return (item.content.race.toLowerCase().indexOf(race.toLowerCase()) > -1);
        });

        x.forEach((item) => {
          buffer.push(item);
        });
      };

      if(this.isIndica == true) {

        race = "indica"
        x = this.cache.filter((item) => {
          return (item.content.race.toLowerCase().indexOf(race.toLowerCase()) > -1);
        });

        x.forEach((item) => {
          buffer.push(item);
        });

      }

      this.items = [];
      buffer.forEach((item) => {
        this.items.push(item);
      });

      this.items.sort((a,b) => {

        return a.content.id - b.content.id;

      });

      resolve(this.items);

    });

  }

  doRefresh(refresher) {

    this.getAllStrains();

    setTimeout(() => {
      refresher.complete();
    }, 2000);

  }


  getItems(ev: any) {

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
