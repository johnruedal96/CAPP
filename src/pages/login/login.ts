import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { AuthProvider } from '../../providers/auth/auth';
import { MyApp } from '../../app/app.component';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public token: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuController: MenuController, public auth: AuthProvider, public app: MyApp, public alertCtrl: AlertController, public fb: Facebook) {
    menuController.enable(false);
  }

  ionViewDidLoad() {

    this.auth.getToken()
      .subscribe(token => {
        this.token = token.text();
      });
  }

  login(formLogin) {
    let respuesta = this.auth.login(formLogin.value);
    respuesta.post
      .subscribe(
      (data) => {
        this.auth.isLogged().subscribe(user => {
          //movil
          if (user.text() != '') {
            this.navCtrl.setRoot(TabsPage);
            this.auth.user = JSON.parse(user.text());
            this.app.login = true;
            this.auth.urlImagen = 'http://cappco.com.co/capp_admin/archivos/perfiles/img_user/';
            window.localStorage.setItem('token', this.auth.token);
          }else{
            this.presentAlert('Datos invalidos', 'Datos invalidos, por favor intente de nuevo');
          }
        });
      },
      (err) => {
        respuesta.loader.dismiss();
        this.presentAlert('Ha ocurrido un error', 'Ha ocurrido un error, por favor intente de nuevo');
      }
      );
  }

  loginWithFacebook() {
    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        this.fb.api('me?fields=id,name,email,first_name,last_name,picture.width(720).height(720).as(profile_picture)', [])
          .then(profile => {
            let user = {
              email: profile['email'],
              id: profile['id'],
              nombre: profile['first_name'] + ' ' + profile['last_name'],
              imagen: profile['profile_picture']['data']['url']
            }
            this.auth.user = user;
            this.app.login = true;
            this.auth.loginFacebookGoogle = true;
            this.auth.urlImagen = '';
            this.navCtrl.setRoot(TabsPage);
            window.localStorage.setItem('loginFacebookGoogle', 'true');
            window.localStorage.setItem('user', JSON.stringify(this.auth.user));

            this.auth.getToken()
              .subscribe(
              (token) => {
                this.auth.registrarCredencialesFacebook(token.text())
                  .subscribe(
                  (res) => {
                    this.auth.user.id = res.json().id;
                    window.localStorage.setItem('user', JSON.stringify(this.auth.user));
                  },
                  (err) => {
                    this.app.login = false;
                    this.navCtrl.setRoot('LoginPage');
                    this.auth.loginFacebookGoogle = false;
                  }
                  );
              }
              )
          })
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  goToPage(registro) {
    if (registro) {
      this.navCtrl.push('RegistroPage');
    } else {
      this.navCtrl.setRoot(TabsPage);
    }
  }

  // showPassword(input){
  //   input.type = input.type === 'password' ?  'text' : 'password';
  //   this.passwordShow = !this.passwordShow;
  //   setTimeout(() => { 
  //     input.setFocus(); 
  //   }, 1);
  // }

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
      head.innerHTML = '<ion-icon name="close" style="color:#f53d3d; text-aling:center; font-size: 3em !important" role="img" class="icon icon-md ion-md-close" aria-label="close" ng-reflect-name="close"></ion-icon>';
    }, 100)
  }

}
