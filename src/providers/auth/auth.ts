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
  @Injectable()
  export class AuthProvider {

  	public urlToken:string;
  	public urlLogin:string;
    public token:string;
  	public loader;

  	constructor(public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
  		this.urlToken = 'http://www.contactoarquitectonico.com.co/api/csrf';
  		this.urlLogin = 'http://www.contactoarquitectonico.com.co/login';
  	}

  	getToken(){
  		return this.http.get(this.urlToken);
  	}

  	login(data){
      this.presentLoading();
  		let headers = new Headers({
  			'X-CSRF-TOKEN': data._token,
  			'Content-Type': 'application/x-www-form-urlencoded',
  		});
  		let options = new RequestOptions({
  			headers: headers
  		});

  		this.token = data._token;

      let params = '_token='+data._token;
      params = 'email='+data.email;
      params += '&password='+data.password;


      return this.http.post(this.urlLogin, params , options)
      .map(res => this.extractData(res));
    }

    extractData(res){
      if(res.url == 'http://www.contactoarquitectonico.com.co/inicio'){
      // if(res.url == 'http://www.contactoarquitectonico.com.co/'){
        window.localStorage.setItem('token',this.token);
      }else{
        this.presentAlert();
      }
      this.loader.dismiss();
      return res;
    }

    isLogged(){
      if(window.localStorage.getItem('token') != null){
        // Funciona con dispositivos moviles
        this.getUser()
        .subscribe(user => {
          window.localStorage.setItem('user', JSON.stringify(user.text()));
        });

        // //Pruebas de computador
        // let usuario = {
        //   "id": 3,
        //   "nombre": "John Rueda",
        //   "email": "johnruedal96@gmail.com",
        //   "estado": 1,
        //   "foto": 'usuario_3.jpg',
        //   "created_at": "2017-06-27 14:26:55",
        //   "updated_at": "2017-06-29 11:20:24",
        //   "id_perfil": 2
        // }
        // window.localStorage.setItem('user', JSON.stringify(usuario));
        return true;
      }else{
        return false;
      }
    }

    logOut(){
      window.localStorage.removeItem('token');
      return true;
    }

    getUser(){
      return this.http.get('http://www.contactoarquitectonico.com.co/api/user');
    }

    presentLoading() {
      let loader = this.loadingCtrl.create({
        content: "Iniciando Sesion...",
      });
      loader.present();
      this.loader = loader;
    }

    presentAlert() {
      let alert = this.alertCtrl.create({
        title: 'Datos invalidos',
        subTitle: 'Por favor intente de nuevo',
        buttons: ['cerrar']
      });
      alert.present();
    }

  }
