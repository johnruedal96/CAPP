import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { AuthProvider } from '../../providers/auth/auth';
import { MyApp } from '../../app/app.component';

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

  public token: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuController: MenuController, public auth: AuthProvider, public app: MyApp, public alertCtrl: AlertController) {
    menuController.enable(false);
  }

  ionViewDidLoad() {

    this.auth.getToken()
      .subscribe(token => {
        this.token = token.text();
      })

  }

  login(formLogin) {
    let respuesta = this.auth.login(formLogin.value);
    respuesta.post
      .subscribe(
      (data) => {
        this.auth.isLogged().subscribe(user => {
          //movil
          if (user.text() != '') {
            this.navCtrl.setRoot(TabsPage);
            this.auth.user = JSON.parse(user.text());
            this.app.login = true;
          }
        });
      },
      (err) => {
        respuesta.loader.dismiss();
        this.presentAlert('Ha ocurrido un error', 'Ha ocurrido un error, por favor intente de nuevo');
      }
      );
  }

  goToPage(registro) {
    if (registro) {
      this.navCtrl.push('RegistroPage');
    } else {
      this.navCtrl.setRoot(TabsPage);
    }
  }

  // showPassword(input){
  //   input.type = input.type === 'password' ?  'text' : 'password';
  //   this.passwordShow = !this.passwordShow;
  //   setTimeout(() => { 
  //     input.setFocus(); 
  //   }, 1);
  // }

  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
				title: title,
				message: subTitle,
				buttons: ['Cerrar']
			})
			alert.present();
			setTimeout(() => {
				let hdr = alert.instance.hdrId;
				let desc = alert.instance.descId;
				let head = window.document.getElementById(hdr);
        let msg = window.document.getElementById(desc);
				head.style.textAlign = 'center';
				msg.style.textAlign = 'center';
				head.innerHTML = '<ion-icon name="close" style="color:#f53d3d; text-aling:center; font-size: 3em !important" role="img" class="icon icon-md ion-md-close" aria-label="close" ng-reflect-name="close"></ion-icon>';
			}, 100)
  }

}
