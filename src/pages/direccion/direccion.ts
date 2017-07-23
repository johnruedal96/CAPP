import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider, public auth: AuthProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
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

  eliminarDireccion(direccion) {
    let alert = this.alertCtrl.create({
      message: 'Va a eliminar la dirección: <br><b>' + direccion.direccion + '</b><br>¿Desea Continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: () => {
            let loader = this.loadingCtrl.create({
              content: 'Eliminando'
            });
            loader.present();
            this.ws.removeDireccion(direccion.id)
              .subscribe(
              (res) => {
                this.getDireccion();
                loader.dismiss();
              },
              (err) => {
                loader.dismiss();
                this.alertError('Eliminaba la dirección');
              }
              )
          }
        }
      ]
    });

    alert.present();
  }

  showPromptDireccion() {
    let alert = this.alertCtrl.create({
      title: 'Nueva Dirección',
      inputs: [
        {
          name: 'direccion',
          placeholder: 'dirección'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: data => {
            if (data.direccion.trim().length > 0) {
              this.guardarDireccion(data.direccion);
            } else {
              this.toastCtrl.create({
                message: 'Digite una dirección',
                position: 'botton',
                showCloseButton: true,
                closeButtonText: 'Ok',
                duration: 5000
              }).present();
            }
          }
        }
      ]
    });
    alert.present();
  }

  guardarDireccion(direccion) {
    let data = 'direccion=' + direccion;
    data += '&usuario=' + this.auth.user.id;
    let loader = this.loadingCtrl.create({
      content: 'Guardando'
    });
    loader.present();
    this.auth.getToken()
      .subscribe(
      (res) => {
        this.ws.guardarDireccion(data, res.text())
          .subscribe(
          (res) => {
            this.getDireccion();
            loader.dismiss();
          },
          (err) => {
            loader.dismiss();
            this.alertError('guardaba la dirección');
          }
          )
      },
      (err) => {
        console.log(err);
      }
      )
  }

  alertError(error) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Ha ocurrido un error mientras se ' + error,
      buttons: ['Aceptar']
    });

    alert.present();
  }

}
