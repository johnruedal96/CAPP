import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { LoadingController, AlertController } from 'ionic-angular';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
  	*/
@Injectable()
export class AuthProvider {

  public user: any;

  public urlToken: string;
  public urlLogin: string;
  public urlLogout: string;
  public urlRegister: string;
  public token: string;
  public loader;

  constructor(public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.urlToken = 'http://www.contactoarquitectonico.com.co/api/csrf';
    this.urlLogin = 'http://www.contactoarquitectonico.com.co/login';
    this.urlLogout = 'http://www.contactoarquitectonico.com.co/logout';
    this.urlRegister = 'http://www.contactoarquitectonico.com.co/capp_admin/wscapp/register';
  }

  getToken() {
    return this.http.get(this.urlToken);
  }

  login(data) {
    this.presentLoading();
    let headers = new Headers({
      'X-CSRF-TOKEN': data._token,
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    let options = new RequestOptions({
      headers: headers
    });

    this.token = data._token;

    // let params = '_token=' + data._token;
    let params = 'email=' + data.email;
    params += '&password=' + data.password;

    let post = this.http.post(this.urlLogin, params, options)
      .map(res => {
        this.extractData(res);
      });
    let loader = this.loader;
    return { post, loader };
  }

  extractData(res) {
    if (res.url == 'http://www.contactoarquitectonico.com.co/inicio') {
      window.localStorage.setItem('token', this.token);
    } else {
      this.presentAlert('Datos invalidos', 'Por favor intente de nuevo');
    }
    this.loader.dismiss();
  }

  logOut(nav) {
    let loader = this.loadingCtrl.create({
      content: 'Cerrando Sesion...'
    });
    loader.present();
    this.http.get(this.urlLogout)
      .subscribe(
      (res) => {
        nav.setRoot('LoginPage');
        loader.dismiss();
      },
      (err) => {
        loader.dismiss();
      }
      );
    return true;
  }

  register(data) {
    let headers = new Headers({
      'X-CSRF-TOKEN': data._token,
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    let options = new RequestOptions({
      headers: headers
    });

    this.token = data._token;

    // let params = '_token=' + data._token;
    let params = 'nombre=' + data.nombre;
    params += '&email=' + data.email;
    params += '&password=' + data.password;

    return this.http.post(this.urlRegister, params, options);
  }

  isLogged(nav) {
    return this.http.get('http://www.contactoarquitectonico.com.co/api/user')
      .map(user => user);
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Iniciando Sesion...",
    });
    loader.present();
    this.loader = loader;
  }

  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['cerrar']
    });
    alert.present();
  }

}
