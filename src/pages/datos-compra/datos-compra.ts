import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';
import { AuthProvider } from '../../providers/auth/auth';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

/**
 * Generated class for the DatosCompraPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-datos-compra',
  templateUrl: 'datos-compra.html',
})
export class DatosCompraPage {

  public lista: any;
  public cliente: number;
  public direcciones: any;
  public direccionSelectedId: any;
  public direccionSelectedName: any;
  public formasPago: any;
  public formasPagoSelectedId: any;
  public formasPagoSelectedName: any;
  public total: number;
  public domicilio_respuesta: string;
  public direccion: string;
  public direccionId: number;
  public cotizacion: number;
  public spinnerDireccion: boolean = true;
  public spinnerPago: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider, public auth: AuthProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController, public storage: LocalStorageProvider) {
    this.cliente = this.navParams.get('cliente');
    this.lista = this.navParams.get('lista');
    this.total = this.navParams.get('total');
    this.domicilio_respuesta = this.navParams.get('domicilio_respuesta');
    this.direccion = this.navParams.get('direccion');
    this.direccionId = this.navParams.get('direccionId');
    this.cotizacion = this.navParams.get('cotizacion');
  }

  ionViewDidLoad() {
    this.getDireccion();
    this.getFormasPago();
    if (!this.storage.desarrollo) {
      this.isLogged();
    }
  }

  isLogged() {
    if (!this.auth.loginFacebookGoogle) {
      this.auth.isLogged()
        .subscribe(res => {
          if (res.text() == '') {
            this.navCtrl.setRoot('LoginPage');
          } else {
            this.auth.user = JSON.parse(res.text());
          }
        });
    }else{
      this.auth.getCredencialesFacebook(this.navCtrl);
    }
  }

  getDireccion() {
    this.spinnerDireccion = true;
    this.ws.getDireccion(this.auth.user.id)
      .subscribe(
      (res) => {
        this.direcciones = res.json();
        this.spinnerDireccion = false;
      }
      )
  }

  getFormasPago() {
    this.spinnerPago = true;
    this.ws.getFormasPago()
      .subscribe(
      (res) => {
        this.formasPago = res.json();
        this.spinnerPago = false;
      }
      )
  }

  changeDireccion(event) {
    this.direcciones.find(
      (element, item) => {
        if (event == element.id) {
          this.direccionSelectedName = element.direccion;
        }
      }
    )
  }

  changeFormaPago(event) {
    this.formasPago.find(
      (element, item) => {
        if (event == element.id) {
          this.formasPagoSelectedName = element.nombre;
        }
      }
    )
  }

  siguiente() {
    let params = {
      direccionNombre: this.direccionSelectedName,
      formaPagoNombre: this.formasPagoSelectedName,
      formaPagoId: this.formasPagoSelectedId,
      productos: this.lista,
      cliente: this.cliente,
      total: this.total,
      cotizacion: this.cotizacion,
      domicilio_respuesta: this.domicilio_respuesta,
      direccion: this.direccion,
      direccionId: this.direccionId
    }
    this.navCtrl.push('ConfirmarCompraPage', params);
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
