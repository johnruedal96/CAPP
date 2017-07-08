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

    this.auth.logOut();

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
        this.auth.isLogged(this.navCtrl).subscribe(user => {
          //movil
          if (user.text() != '') {
            this.navCtrl.setRoot(TabsPage);
            this.auth.user = JSON.parse(user.text());
            this.app.login = true;
          }
          // pc
          // if (user.text() == '') {
          //   this.navCtrl.setRoot(TabsPage);
          // }
        });
      },
      (err) => {
        respuesta.loader.dismiss();
        this.presentAlert('Ha ocurrido un error', 'Por favor intente de nuevo');
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
      subTitle: subTitle,
      buttons: ['cerrar']
    });
    alert.present();
  }

}
