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
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AuthProvider } from '../../providers/auth/auth';
import { MyApp } from '../../app/app.component';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var LoginPage = (function () {
    function LoginPage(navCtrl, navParams, menuController, auth, app) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.menuController = menuController;
        this.auth = auth;
        this.app = app;
        this.passwordShow = false;
        menuController.enable(false);
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.auth.logOut();
        this.auth.getToken()
            .subscribe(function (token) {
            _this.token = token.text();
        });
    };
    LoginPage.prototype.login = function (formLogin) {
        var _this = this;
        this.auth.login(formLogin.value)
            .subscribe(function (data) {
            if (_this.auth.isLogged()) {
                var user = JSON.parse(window.localStorage.getItem('user'));
                // // Dispositivos moviles
                // this.app.user = JSON.parse(user);
                // Pruebas computador
                _this.app.user = user;
                _this.navCtrl.setRoot(TabsPage);
                _this.app.login = true;
            }
        });
    };
    LoginPage.prototype.goToPage = function (registro) {
        if (registro) {
            this.navCtrl.push('RegistroPage');
        }
        else {
            this.navCtrl.setRoot(TabsPage);
        }
    };
    return LoginPage;
}());
LoginPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-login',
        templateUrl: 'login.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams, MenuController, AuthProvider, MyApp])
], LoginPage);
export { LoginPage };
//# sourceMappingURL=login.js.map