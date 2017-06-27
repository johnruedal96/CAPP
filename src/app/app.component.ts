import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('NAV') nav: Nav;
  rootPage:any;

  public pages: Array<{title:string, componet:string, icon:string}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    this.pages = [
      {title: 'Mi Perfil', componet:'FerreteriaPage', icon:'person'},
      {title: 'Datos de envio', componet:'FerreteriaPage', icon:'send'},
      {title: 'Contactenos', componet:'FerreteriaPage', icon:'mail'},
      {title: 'Acerca', componet:'FerreteriaPage', icon:'information-circle'},
      {title: 'Cerrar sesion', componet:'LoginPage', icon:'power'}
    ]

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.rootPage = 'LoginPage';
    });
  }

  goToPage(page){
    this.nav.setRoot(page);
  }
}
