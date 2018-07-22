import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { LoadingController, AlertController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
  	*/
@Injectable()
export class AuthProvider {

  public user: any;
  public urlImagen: string = 'http://www.cappco.com.co/capp_admin/archivos/perfiles/img_user/';
  public imagen: string;

  public urlToken: string;
  public urlLogin: string;
  public urlLogout: string;
  public urlRegister: string;
  public urlActualizar: string;
  public token: string;
  public loader;

  public loginFacebookGoogle;

  constructor(public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public fb: Facebook) {
    this.urlToken = 'http://www.cappco.com.co/api/csrf';
    this.urlLogin = 'http://www.cappco.com.co/login';
    this.urlLogout = 'http://www.cappco.com.co/logout';
    this.urlRegister = 'http://www.cappco.com.co/capp_admin/wscapp/register';
    this.urlActualizar = 'http://www.cappco.com.co/capp_admin/wscapp/actualizarDatos';

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
        // this.extractData(res);
        this.loader.dismiss();
      });
    let loader = this.loader;
    return { post, loader };
  }

  extractData(res) {
    if (res.url == 'http://www.cappco.com.co/inicio') {
      window.localStorage.setItem('token', this.token);
    } else {
      this.presentAlert('Datos invalidos', 'Datos invalidos, por favor intente de nuevo ' + res.url);
    }
    this.loader.dismiss();
  }

  logOut(nav) {
    let loader = this.loadingCtrl.create({
      content: 'Cerrando Sesion...'
    });
    loader.present();
    if (this.loginFacebookGoogle) {
      this.fb.logout();
      this.loginFacebookGoogle = false;
      nav.setRoot('LoginPage');
      window.localStorage.removeItem('loginFacebookGoogle');
      window.localStorage.removeItem('user');
      loader.dismiss();
    } else {
      this.http.get(this.urlLogout)
        .subscribe(
        (res) => {
          window.localStorage.removeItem('CotizacionLista');
          window.localStorage.removeItem('CotizacionEmpresas');
          window.localStorage.removeItem('cotizacionTipoEmpresa');
          window.localStorage.setItem('filtro', 'false');
          this.imagen = null;
          nav.setRoot('LoginPage');
          loader.dismiss();
        },
        (err) => {
          loader.dismiss();
        }
        );
    }
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

  isLogged() {
    return this.http.get('http://www.cappco.com.co/api/user')
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
      message: subTitle,
      buttons: ['Cerrar']
    })
    alert.present();
    setTimeout(() => {
      let hdr = alert.instance.hdrId;
      let desc = alert.instance.descId;
      let head = window.document.getElementById(hdr);
      let msg = window.document.getElementById(desc);
      head.style.textAlign = 'center';
      msg.style.textAlign = 'center';
      head.innerHTML = '<ion-icon name="close" style="color:#f53d3d; text-aling:center; font-size: 3em" role="img" class="icon icon-md ion-md-close" aria-label="close" ng-reflect-name="close"></ion-icon>';
    }, 100)
  }

  actualizarDatos(token, params) {
    let headers = new Headers({
      'X-CSRF-TOKEN': token,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    let options = new RequestOptions({
      headers: headers
    });

    return this.http.post(this.urlActualizar, params, options)
      .map(res => res);
  }

  registrarCredencialesFacebook(token) {
    let headers = new Headers({
      'X-CSRF-TOKEN': token,
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    let options = new RequestOptions({
      headers: headers
    });

    this.token = token;
    // let params = '_token=' + data._token;
    let params = 'nombre=' + this.user.nombre;
    params += '&email=' + this.user.email;
    params += '&id=' + this.user.id;

    return this.http.post(this.urlRegister, params, options);
  }

  getCredencialesFacebook(nav) {
    if (this.loginFacebookGoogle) {
      this.urlImagen = '';
      this.user = JSON.parse(window.localStorage.getItem('user'));
      this.fb.getLoginStatus().then((res) => {
        if (res.status == 'connected') {
          this.fb.api('me?fields=id,name,email,first_name,last_name,picture.width(720).height(720).as(profile_picture)', [])
            .then(profile => {
              this.user.emal = profile['email'];
              this.user.nombre = profile['first_name'] + ' ' + profile['last_name'];
              this.user.imagen = profile['profile_picture']['data']['url'];
            }).catch(() => {
              this.loginFacebookGoogle = false;
            });
        } else{
          nav.setRoot('LoginPage');
        }
      }).catch((err) => {
        console.log(err);
        nav.setRoot('LoginPage');
      });
    }
  }

}
