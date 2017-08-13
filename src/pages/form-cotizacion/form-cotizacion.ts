import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { WebServiceProvider } from '../../providers/web-service/web-service';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the FormCotizacionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-form-cotizacion',
  templateUrl: 'form-cotizacion.html',
})
export class FormCotizacionPage {

  public producto: any;
  public cantidad: number = 0;
  public unidad: any;
  public unidadId: number;
  public app: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public ws: WebServiceProvider, public platform: Platform, public storage: LocalStorageProvider, public auth: AuthProvider) {
    this.producto = this.navParams.get('producto');
    console.log(this.producto);
    this.unidad = this.producto.unidad;
    this.unidadId = this.producto.unidad_medida;
    console.log(this.unidad, this.unidadId);
    this.app = this.navParams.get('app');
  }

  ionViewDidLoad() {
    this.platform
    this.platform.registerBackButtonAction(() => {
      this.dismiss();
      this.app.buttomBack();
    });
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  changeCantidad(value) {
    if (value) {
      if (this.cantidad > 0) {
        this.cantidad--;
      }
    } else {
      this.cantidad++;
    }
  }

  agregar() {
    let unidad = {
      id: this.unidadId,
      nombre: this.unidad
    };
    let param = {
      producto: this.producto,
      cantidad: this.cantidad,
      unidad: unidad
    };
    this.viewCtrl.dismiss(param);
  }

}
