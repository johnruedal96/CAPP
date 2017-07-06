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
  rootPage:any;

  public pages: Array<{title:string, componet:any, icon:string}>;
  public user:any;
  public login:boolean = false;
  public urlImagen:string = 'http://www.contactoarquitectonico.com.co/capp_admin/archivos/perfiles/img_user/';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, auth: AuthProvider) {

    this.pages = [
      {title: 'Empresas', componet: TabsPage, icon:'construct'},
      {title: 'Mi Perfil', componet:'PerfilPage', icon:'person'},
      {title: 'Datos de envio', componet:'FerreteriaPage', icon:'send'},
      {title: 'Contactenos', componet:'FerreteriaPage', icon:'mail'},
      {title: 'Nosotros', componet:'FerreteriaPage', icon:'information-circle'},
      {title: 'Cerrar sesion', componet:'LoginPage', icon:'power'}
    ];

    if(window.localStorage.getItem('token') != null){
      this.rootPage = TabsPage;
      let user = JSON.parse(window.localStorage.getItem('user'));
      // dispositivos moviles
      this.user = JSON.parse(user);
      // Pruebas computador
      this.user = user;

      this.login = true;
    }else{
      this.rootPage = 'LoginPage';
    }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#333");
      // splashScreen.hide();
      setTimeout(()=>{
        splashScreen.hide();
      },1000)
    });
  }

  goToPage(page){
    this.nav.push(page);
  }
}
