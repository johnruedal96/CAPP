var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthProvider } from '../providers/auth/auth';
var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen, auth) {
        this.login = false;
        this.urlImagen = 'http://www.contactoarquitectonico.com.co/capp_admin/archivos/perfiles/img_user/';
        this.pages = [
            { title: 'Empresas', componet: TabsPage, icon: 'construct' },
            { title: 'Mi Perfil', componet: 'PerfilPage', icon: 'person' },
            { title: 'Datos de envio', componet: 'FerreteriaPage', icon: 'send' },
            { title: 'Contactenos', componet: 'FerreteriaPage', icon: 'mail' },
            { title: 'Nosotros', componet: 'FerreteriaPage', icon: 'information-circle' },
            { title: 'Cerrar sesion', componet: 'LoginPage', icon: 'power' }
        ];
        if (window.localStorage.getItem('token') != null) {
            this.rootPage = TabsPage;
            var user = JSON.parse(window.localStorage.getItem('user'));
            // // dispositivos moviles
            // this.user = JSON.parse(user);
            // Pruebas computador
            this.user = user;
            this.login = true;
        }
        else {
            this.rootPage = 'LoginPage';
        }
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            statusBar.backgroundColorByHexString("#F57C00");
            // splashScreen.hide();
            setTimeout(function () {
                splashScreen.hide();
            }, 1000);
        });
    }
    MyApp.prototype.goToPage = function (page) {
        this.nav.setRoot(page);
    };
    return MyApp;
}());
__decorate([
    ViewChild('NAV'),
    __metadata("design:type", Nav)
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Component({
        templateUrl: 'app.html'
    }),
    __metadata("design:paramtypes", [Platform, StatusBar, SplashScreen, AuthProvider])
], MyApp);
export { MyApp };
//# sourceMappingURL=app.component.js.map