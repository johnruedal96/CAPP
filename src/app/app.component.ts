import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('NAV') nav: Nav;
  rootPage: any;

  public pages: Array<{ title: string, componet: any, icon: string }>;
  public login: boolean = false;
  public urlImagen: string = 'http://www.contactoarquitectonico.com.co/capp_admin/archivos/perfiles/img_user/';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public auth: AuthProvider) {

    this.pages = [
      { title: 'Empresas', componet: TabsPage, icon: 'construct' },
      { title: 'Mi Perfil', componet: 'PerfilPage', icon: 'person' },
      { title: 'Datos de envio', componet: 'FerreteriaPage', icon: 'send' },
      { title: 'Contactenos', componet: 'FerreteriaPage', icon: 'mail' },
      { title: 'Nosotros', componet: 'FerreteriaPage', icon: 'information-circle' },
      { title: 'Cerrar sesion', componet: 'LoginPage', icon: 'power' }
    ];

    platform.ready().then(() => {
      this.isLogged();
      // this.pc();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#333");
      // splashScreen.hide();
      setTimeout(() => {
        splashScreen.hide();
      }, 1000)
    });
  }

  goToPage(page) {
    this.nav.push(page);
  }

  isLogged() {
    this.auth.isLogged(this.nav).subscribe(user => {
      if (user.text() == '') {
        this.nav.setRoot('LoginPage');
      } else {
        this.auth.user = JSON.parse(user.text());
        this.login = true;
        this.nav.setRoot(TabsPage);
      }
    });
  }

  pc() {
    this.auth.isLogged(this.nav).subscribe(user => {
      if (user.text() != '') {
        this.nav.setRoot('LoginPage');
      } else {
        let user = {
          "id": 3,
          "nombre": "John Rueda",
          "email": "johnruedal96@gmail.com",
          "estado": 1,
          "foto": 'usuario_3.jpg',
          "created_at": "2017-06-27 14:26:55",
          "updated_at": "2017-06-29 11:20:24",
          "id_perfil": 2
        }
        this.auth.user = user;
        this.login = true;
        this.nav.setRoot(TabsPage);
      }
    });
  }
}
