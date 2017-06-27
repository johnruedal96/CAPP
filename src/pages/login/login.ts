import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs'

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
   selector: 'page-login',
   templateUrl: 'login.html',
 })
 export class LoginPage {

   constructor(public navCtrl: NavController, public navParams: NavParams, public menuController: MenuController) {
     menuController.enable(false);
   }

   ionViewDidLoad() {
   }

   goToPage(registro){
     if(registro){
       this.navCtrl.setRoot('RegistroPage');
     }else{
       this.navCtrl.setRoot(TabsPage);
     }
   }

 }
