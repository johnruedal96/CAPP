var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
    */
var AuthProvider = (function () {
    function AuthProvider(http, loadingCtrl, alertCtrl) {
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.urlToken = 'http://www.contactoarquitectonico.com.co/api/csrf';
        this.urlLogin = 'http://www.contactoarquitectonico.com.co/login';
    }
    AuthProvider.prototype.getToken = function () {
        return this.http.get(this.urlToken);
    };
    AuthProvider.prototype.login = function (data) {
        var _this = this;
        this.presentLoading();
        var headers = new Headers({
            'X-CSRF-TOKEN': data._token,
            'Content-Type': 'application/x-www-form-urlencoded',
        });
        var options = new RequestOptions({
            headers: headers
        });
        this.token = data._token;
        var params = '_token=' + data._token;
        params = 'email=' + data.email;
        params += '&password=' + data.password;
        return this.http.post(this.urlLogin, params, options)
            .map(function (res) { return _this.extractData(res); });
    };
    AuthProvider.prototype.extractData = function (res) {
        // if(res.url == 'http://www.contactoarquitectonico.com.co/inicio'){
        if (res.url == 'http://www.contactoarquitectonico.com.co/') {
            window.localStorage.setItem('token', this.token);
        }
        else {
            this.presentAlert();
        }
        this.loader.dismiss();
        return res;
    };
    AuthProvider.prototype.isLogged = function () {
        if (window.localStorage.getItem('token') != null) {
            // // Funciona con dispositivos moviles
            // this.getUser()
            // .subscribe(user => {
            //   window.localStorage.setItem('user', JSON.stringify(user.text()));
            // });
            //Pruebas de computador
            var usuario = {
                "id": 3,
                "nombre": "John Rueda",
                "email": "johnruedal96@gmail.com",
                "estado": 1,
                "foto": 'usuario_3.jpg',
                "created_at": "2017-06-27 14:26:55",
                "updated_at": "2017-06-29 11:20:24",
                "id_perfil": 2
            };
            window.localStorage.setItem('user', JSON.stringify(usuario));
            return true;
        }
        else {
            return false;
        }
    };
    AuthProvider.prototype.logOut = function () {
        window.localStorage.removeItem('token');
        return true;
    };
    AuthProvider.prototype.getUser = function () {
        return this.http.get('http://www.contactoarquitectonico.com.co/api/user');
    };
    AuthProvider.prototype.presentLoading = function () {
        var loader = this.loadingCtrl.create({
            content: "Iniciando Sesion...",
        });
        loader.present();
        this.loader = loader;
    };
    AuthProvider.prototype.presentAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'Datos invalidos',
            subTitle: 'Por favor intente de nuevo',
            buttons: ['cerrar']
        });
        alert.present();
    };
    return AuthProvider;
}());
AuthProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http, LoadingController, AlertController])
], AuthProvider);
export { AuthProvider };
//# sourceMappingURL=auth.js.map