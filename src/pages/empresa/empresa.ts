import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { MyApp } from '../../app/app.component';


/**
 * Generated class for the EmpresaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-empresa',
	templateUrl: 'empresa.html',
})
export class EmpresaPage {

	public imagen: string;
	public empresa: string;
	public viewBtnCotizacion:boolean = true;

	constructor(public navCtrl: NavController, public navParams: NavParams, private superTabsCtrl: SuperTabsController, public app: MyApp) {
		this.imagen = "http://www.contactoarquitectonico.com.co/capp_admin/archivos/";
		this.empresa = navParams.get('empresa');
		this.viewBtnCotizacion = navParams.get('viewBtnCotizacion');
		if(this.viewBtnCotizacion == null){
			this.viewBtnCotizacion = true;
		}
	}

	ionViewDidLoad() {
		// this.superTabsCtrl.showToolbar(false);
	}

	cotizar() {
		this.navCtrl.push('CotizacionPage', { empresa: this.empresa });
	}

}
