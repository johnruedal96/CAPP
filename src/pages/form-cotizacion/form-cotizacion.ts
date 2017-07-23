import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { WebServiceProvider } from '../../providers/web-service/web-service';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public ws: WebServiceProvider) {
    this.producto = this.navParams.get('producto');
  }

  ionViewDidLoad() {
    this.getUnidad();
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

  getUnidad() {
    this.ws.getUnidad()
      .subscribe(
        (res)=>{
          this.unidad = res.json();
        }
      )
  }

  agregar(){
    let unidad = [];
    this.unidad.find((element)=>{
      if(element.id == this.unidadId){
        unidad = element;
      }
    });
    let param = {
      producto: this.producto,
      cantidad: this.cantidad,
      unidad: unidad
    };
    this.viewCtrl.dismiss(param);
  }

}
