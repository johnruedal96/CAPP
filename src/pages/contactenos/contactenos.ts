import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { WebServiceProvider } from '../../providers/web-service/web-service';

/**
 * Generated class for the ContactenosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-contactenos',
  templateUrl: 'contactenos.html',
})
export class ContactenosPage {

  public loader;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public ws: WebServiceProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
  }

  enviar(formContacto) {
    this.loader = this.loadingCtrl.create({
      content: 'Enviando Mensaje'
    });

    this.loader.present();
    formContacto.value.usuario = this.auth.user.id
    this.ws.sendMessage(formContacto.value)
      .subscribe(
      (res) => {
        this.loader.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Mensaje enviado',
          message: 'Mensaje enviado',
          buttons: ['Aceptar']
        })
        alert.present();
        setTimeout(() => {
          let hdr = alert.instance.hdrId;
          let desc = alert.instance.descId;
          let head = window.document.getElementById(hdr);
          let msg = window.document.getElementById(desc);
          head.style.textAlign = 'center';
          msg.style.textAlign = 'center';
          head.innerHTML = '<ion-icon name="checkmark" style="color:#5cb85c; text-aling:center; font-size: 3em !important" role="img" class="icon icon-md ion-md-checkmark" aria-label="checkmark" ng-reflect-name="checkmark"></ion-icon>';
        }, 100);
        this.navCtrl.pop();
      },
      (err) => {
        this.loader.dismiss();
        let alert = this.alertCtrl.create({
          title: 'error',
          message: 'No se ha podido enviar el mensaje',
          buttons: ['Aceptar']
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
      )
  }

}
