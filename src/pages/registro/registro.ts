import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs'

/**
 * Generated class for the RegistroPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
 	selector: 'page-registro',
 	templateUrl: 'registro.html',
 })
 export class RegistroPage {

 	constructor(public navCtrl: NavController, public navParams: NavParams) {
 	}

 	ionViewDidLoad() {
 	}

 	goToPage(login){
 		if(login){
 			this.navCtrl.setRoot('LoginPage');
 		}else{
 			this.navCtrl.setRoot(TabsPage);
 		}
 	}

 }
