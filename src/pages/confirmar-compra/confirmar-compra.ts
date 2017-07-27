import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { WebServiceProvider } from '../../providers/web-service/web-service';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

/**
 * Generated class for the ConfirmarCompraPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-confirmar-compra',
  templateUrl: 'confirmar-compra.html',
})
export class ConfirmarCompraPage {

  public direccionNombre: string;
  public direccionId: number;
  public formaPagoNombre: string;
  public formaPagoId: number;
  public productos: any;
  public cliente: any;
  public total: number;
  public cotizacion: number;
  public loader;
  public disabledButtonEnviar: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider, public auth: AuthProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: LocalStorageProvider) {
    this.direccionNombre = this.navParams.get('direccionNombre');
    this.direccionId = this.navParams.get('direccionId');
    this.formaPagoNombre = this.navParams.get('formaPagoNombre');
    this.formaPagoId = this.navParams.get('formaPagoId');
    this.productos = this.navParams.get('productos');
    this.cliente = this.navParams.get('cliente');
    this.total = this.navParams.get('total');
    this.cotizacion = this.navParams.get('cotizacion');
  }

  ionViewDidLoad() {
    if (!this.storage.desarrollo) {
			this.isLogged();
		}
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

  comprar() {
    this.loader = this.loadingCtrl.create({
      content: 'Registrando compra'
    });
    this.loader.present();
    this.auth.getToken()
      .subscribe(
      (res) => {
        this.sendCompra(res.text());
      },
      (err) => {
        console.log(err);
        this.loader.dismiss();
      }
      )
  }

  sendCompra(token) {
    let data = 'usuario=' + this.auth.user.id;
    data += '&cliente=' + this.cliente;
    data += '&direccion=' + this.direccionId;
    data += '&pago=' + this.formaPagoId;
    this.ws.sendCompra(data, token)
      .subscribe(
      (res) => {
        this.sendCompraProducto(token, res.json().id);
      },
      (err) => {
        console.log(err);
      }
      )
  }

  sendCompraProducto(token, compra) {
    let contador = 0;
    for (let item of this.productos) {
      if (item.cantidad != 0) {
        let data = 'compra=' + compra;
        data += '&producto=' + item.idProducto;
        data += '&cantidad=' + item.cantidad;
        data += '&unidad=' + item.idUnidad;
        data += '&precioUnitario=' + item.precio;
        data += '&precioTotal=' + item.precioTotal;
        data += '&cotizacion=' + this.cotizacion;
        data += '&cliente=' + this.cliente;

        this.ws.sendCompraProducto(data, token)
          .subscribe(
          (res) => {
            contador++;
            if (this.productos.length == contador) {
              this.loader.dismiss();
              let params = {
                tab: 'compras',
                compra: compra
              }
              this.navCtrl.setRoot('PerfilPage', params);
              let alert = this.alertCtrl.create({
                title: 'Compra Registrada',
                subTitle: 'La compra se registro satisfactoriamente en el sistema',
                buttons: [
                  {
                    text: 'Aceptar',
                    role: 'cancel',
                  }
                ]
              });
              alert.present();
            }
          }
          )

      }
    }
  }

  alertCotizacion() {
    this.disabledButtonEnviar = true;
    let alert = this.alertCtrl.create({
      title: 'Comfirmar compra',
      message: 'El tiempo de entrega y el valor del domicilio para cada zona es responsabilidad de la ferreteria. <br><br> <b>CAPP</b> es totalmente gratuito no cobra por el servicio',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.disabledButtonEnviar = false;
          }
        },
        {
          text: 'Comprar',
          handler: () => {
            this.comprar();
          }
        }
      ]
    });
    alert.present();
  }
}
