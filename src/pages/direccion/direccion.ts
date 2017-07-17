import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { WebServiceProvider } from '../../providers/web-service/web-service';

/**
 * Generated class for the DireccionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-direccion',
  templateUrl: 'direccion.html',
})
export class DireccionPage {

  public direcciones: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider, public auth: AuthProvider) {
  }

  ionViewDidLoad() {
    // this.isLogged();
    this.getDireccion();
  }

  isLogged() {
    this.auth.isLogged()
      .subscribe(res => {
        if (res.text() == '') {
          this.navCtrl.setRoot('LoginPage');
        } else {
          this.auth.user = JSON.parse(res.text());

        }
      });
  }

  getDireccion() {
    this.ws.getDireccion(this.auth.user.id)
      .subscribe(
      (res) => {
        this.direcciones = res.json();
      }
      )
  }

}
