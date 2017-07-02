var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the PerfilPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var PerfilPage = (function () {
    function PerfilPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.urlImagen = 'http://www.contactoarquitectonico.com.co/capp_admin/archivos/perfiles/img_user/';
        this.myProfile = 'profile';
        var user = JSON.parse(window.localStorage.getItem('user'));
        // Funciona con dispositivos moviles
        // user = JSON.parse(user);
        this.user = user;
    }
    PerfilPage.prototype.ionViewDidLoad = function () {
    };
    return PerfilPage;
}());
PerfilPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-perfil',
        templateUrl: 'perfil.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams])
], PerfilPage);
export { PerfilPage };
//# sourceMappingURL=perfil.js.map