import { Component } from '@angular/core';
import { NavController, NavParams , LoadingController , ToastController } from 'ionic-angular';
import { StrainsApiProvider } from '../../providers/strains-api/strains-api';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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

  isOptions: any = false;
  itemsPage: any = 20;

  isSativa: boolean = true;
  isHybrid: boolean = true;
  isIndica: boolean = true;

  isFavorite: boolean = true;
  favorite: Array<any>;
  flavorsList: Array<any>;
  bFavorite: boolean;
  favoriteEnable: boolean = false;

  loading: any;

  effects: any;
  flavors: any;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public serv : StrainsApiProvider, public loadingCtrl : LoadingController,
    public toastCtrl: ToastController , private iab: InAppBrowser) {

    this.initFavorite();
    this.flavorsList = ['indica','sativa','hybrid'];
    this.getAllEffects();
    this.getAllFlavors();
  }

  ionViewCanEnter() {

    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/img/loading.gif">`
    });

    this.loading.present();

    return new Promise((resolve, reject) => {

      this.cache = [];

      this.serv.getAllStrains().subscribe(
        (data)=> {

          this.response = data;
          this.DecodedStrains = Object.getOwnPropertyNames(this.response);

          for(let strain of this.DecodedStrains) {

            this.bFavorite = false;

            if(this.favorite.length != 0) {

              for(var i = 0 ; i < this.favorite.length ; i++) {


                if(strain.toLowerCase().trim() == this.favorite[i].toLowerCase().trim()) {
                  this.bFavorite = true;
                }

              }
            }

            this.cache.push({name: strain , content: this.response[strain] , favorite : this.bFavorite})

          }

          this.filter();

          this.loading.dismiss();
          resolve(this.items);

        },
        (err)=>{
          alert(err);
        }
      );

    });
  }

  goDetails(strainName : string , race : string) {

    let splitName = strainName.split(" ");
    let name = splitName[0];

    for(var i = 1; i < splitName.length ; i++) {
      name = name+'-'+splitName[i];
    }

    const browser = this.iab.create('https://www.leafly.com/'+race+'/'+name);

  }

  initFavorite() {

    var favoris = JSON.parse(localStorage.getItem('favorites'));
    if(favoris != null) {
      this.favorite = favoris;
    } else {
      this.favorite = [];
    }

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

          if(this.favorite.length != 0) {

            for(var i = 0 ; i < this.favorite.length ; i++) {


              if(strain.toLowerCase().trim() == this.favorite[i].toLowerCase().trim()) {
                this.bFavorite = true;
              }

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

  notImplementedYet() {
    let toast = this.toastCtrl.create({
      message: 'Not implemented yet',
      duration: 2000
    });
    toast.present();
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

      this.filterOnlyFavorite();

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

  toggleOnlyFavorite() {

    this.favoriteEnable = !this.favoriteEnable;
    this.filter();
  }

  filterOnlyFavorite() {

    var x = [];

    if(this.favoriteEnable == true) {

      this.items.forEach((item) => {
        if(item.favorite == true) {

          x.push(item);

        }
      });

      this.items = [];

      x.forEach((item) => {
        this.items.push(item);
      });

    }
  }

  getAllEffects() : any {

    this.serv.getAllEffects()
    .subscribe(
      (data) => {

        this.effects = data;

      },
      (err) => {
        alert(err);
      }
    );

  }

  getPositiveEffects() {

    let positive : Array<any> = [];
    let filter : any = 'positive';

    positive = this.effects.filter((effect) => {
        return (effect.type.toLowerCase().indexOf(filter.toLowerCase()) > -1);
      })

     alert(JSON.stringify(positive));

  }

  getNegativeEffects() {

    let negative : Array<any> = [];
    let filter = 'negative';

    negative = this.effects.filter((effect) => {
      return (effect.type.toLowerCase().indexOf(filter.toLowerCase()) > -1);
    })

    alert(JSON.stringify(negative));

  }

  getMedicalEffects() {

    let medical : Array<any> = [];
    let filter = 'medical';

    medical = this.effects.filter((effect) => {
       return (effect.type.toLowerCase().indexOf(filter.toLowerCase()) > -1);
     })

    alert(JSON.stringify(medical));

  }

  getAllFlavors() {

    this.serv.getAllFlavors().subscribe(
      (data) => {
        this.flavors = data;
      },
      (err) => {

      }
    )
  }

  getFlavors() {
    alert(JSON.stringify(this.flavors));
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

  // itemTapped(event, item) {
  //   // That's right, we're pushing to ourselves!
  //   this.navCtrl.push(ListPage, {
  //     item: item
  //   });
  // }
}
