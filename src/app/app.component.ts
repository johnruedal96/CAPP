import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { AuthProvider } from '../providers/auth/auth';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('NAV') nav: Nav;
  rootPage: any;

  public pages: Array<{ title: string, componet: any, icon: string, param: {} }>;
  public login: boolean = false;
  public alert;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public auth: AuthProvider, public alertCtrl: AlertController, public storage: LocalStorageProvider) {

    this.pages = [
      { title: 'Empresas', componet: TabsPage, icon: 'construct', param: { 'nav': this.nav } },
      { title: 'Mi Perfil', componet: 'PerfilPage', icon: 'person', param: {} },
      { title: 'Cotizar', componet: TabsPage, icon: 'cart', param: { 'cotizacion': true } },
      { title: 'Datos de envio', componet: 'DireccionPage', icon: 'send', param: {} },
      { title: 'Contactenos', componet: 'ContactenosPage', icon: 'mail', param: {} }
      // { title: 'Contactenos', componet: 'FormCotizacionPage', icon: 'mail' }
    ];

    platform.ready().then(() => {
      if (storage.desarrollo) {
        this.pc();
      } else {
        this.isLogged();
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#333");
      // splashScreen.hide();
      setTimeout(() => {
        splashScreen.hide();
      }, 1000)

      this.buttomBack();
    });
  }

  buttomBack() {
    this.platform.registerBackButtonAction(() => {
      if (this.nav.canGoBack()) {
        this.nav.pop();
      } else {
        if (this.alert) {
          this.alert.dismiss();
          this.alert = null;
        } else {
          this.showAlert();
        }
      }
    });
  }

  showAlert() {
    this.alert = this.alertCtrl.create({
      title: 'CAPP se cerrará',
      subTitle: '¿Desea permanecer en la aplicación?',
      buttons: [
        {
          text: 'salir',
          handler: data => {
            this.platform.exitApp();
          }
        },
        {
          text: 'No salir',
          role: 'cancel',
        }
      ]
    });
    this.alert.present();
  }

  goToPage(page, param) {
    if (page == TabsPage) {
      this.nav.setRoot(page, param);
    } else {
      this.nav.push(page);
    }
  }

  isLogged() {
    this.auth.loginFacebookGoogle = window.localStorage.getItem('loginFacebookGoogle');

    if (this.auth.loginFacebookGoogle == null) {
      this.auth.loginFacebookGoogle = false;
    } else if (this.auth.loginFacebookGoogle == 'true') {
      this.auth.loginFacebookGoogle = true
    } else {
      this.auth.loginFacebookGoogle = false;
    }

    if (!this.auth.loginFacebookGoogle) {
      this.auth.isLogged().subscribe(
        (user) => {
          if (user.text() == '') {
            this.nav.setRoot('LoginPage');
          } else {
            this.auth.user = JSON.parse(user.text());
            this.login = true;
            this.nav.setRoot(TabsPage);
          }
        },
        (err) => {
          this.rootPage = 'NoInternetPage';
        }
      );
    } else {
      this.auth.getCredencialesFacebook(this.nav);
      this.login = true;
      this.nav.setRoot(TabsPage);
    }
  }

  pc() {
    let user = {
      "id": 3,
      "nombre": "John Rueda",
      "email": "johnruedal96@gmail.com",
      "estado": 1,
      "imagen": 'usuario_3.jpg',
      "created_at": "2017-06-27 14:26:55",
      "updated_at": "2017-06-29 11:20:24",
      "id_perfil": 2
    }
    this.auth.user = user;
    this.login = true;
    this.nav.setRoot(TabsPage);
    // this.nav.setRoot('LoginPage');
  }
}
