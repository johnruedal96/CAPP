import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { MyApp } from '../../app/app.component';

import { AuthProvider } from '../../providers/auth/auth';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

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
	public empresa: any;
	public btnCotizar: boolean = true;
	public alert: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, private superTabsCtrl: SuperTabsController, public app: MyApp, public alertCtrl: AlertController, public auth: AuthProvider, public storage: LocalStorageProvider) {
		this.imagen = "http://www.contactoarquitectonico.com.co/capp_admin/archivos/";
		this.empresa = navParams.get('empresa');
		if (this.empresa.tipo == 3) {
			this.btnCotizar = false;
		}
	}

	ionViewDidLoad() {
		this.buttomBack();
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
		} else {
			this.auth.getCredencialesFacebook(this.navCtrl);
		}
	}

	cotizar() {
		this.obtenerCotizacionGuardada();
	}

	obtenerCotizacionGuardada() {
		let lista = JSON.parse(window.localStorage.getItem('CotizacionLista'));
		let empresas = JSON.parse(window.localStorage.getItem('CotizacionEmpresas'));
		let cotizacionTipoEmpresa = Number(window.localStorage.getItem('cotizacionTipoEmpresa'));

		if (lista == null) {
			lista = [];
		}
		if (empresas == null) {
			empresas = [];
		}

		if (cotizacionTipoEmpresa == this.empresa.tipo) {
			this.enviarCotizacion(empresas, lista, true);
		} else {
			this.enviarCotizacion(empresas, lista, false);
		}

		if (empresas.length == 0 && lista.length == 0) {
			this.navCtrl.push('CotizacionPage', { empresa: this.empresa, mantener: false });
		}

	}

	enviarCotizacion(empresas, lista, mantenerProductos) {
		if (empresas.length > 1) {
			this.showAlert(mantenerProductos, true);
		} else if (empresas.length == 1) {
			if (this.empresa.id == empresas[0].id) {
				this.navCtrl.push('CotizacionPage', { empresa: this.empresa, mantener: mantenerProductos });
			} else {
				this.showAlert(mantenerProductos, true);
			}
		} else if (lista.length > 0) {
			if (lista[0].producto.tipo == this.empresa.tipo) {
				this.navCtrl.push('CotizacionPage', { empresa: this.empresa, mantener: mantenerProductos });
			} else {
				this.showAlert(mantenerProductos, false);
			}
		}
	}

	showAlert(mantenerProductos, empresasSeleccionadas) {
		let subtitle = '';
		if (empresasSeleccionadas) {
			subtitle = 'Ya se han agregado empresas a una cotización, ¿desea realizar una cotizacón nueva con la empresa <b>' + this.empresa.nombre + '</b> ?';
		} else {
			subtitle = 'Ya se esta realizando una cotización, ¿desea realizar una nueva?';
		}
		if (mantenerProductos) {
			subtitle += '<br><br><b>NOTA:</b> Los productos agregados a la antigua cotizacón <b>NO</b> se eliminaran';
		} else {
			subtitle += '<br><br><b>NOTA:</b> Se eliminará la antigua cotización';
		}
		this.alert = this.alertCtrl.create({
			title: 'Cotización',
			message: subtitle,
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel'
				},
				{
					text: 'Continuar',
					handler: () => {
						this.navCtrl.push('CotizacionPage', { empresa: this.empresa, mantener: mantenerProductos });
					}
				}
			]
		})
		this.alert.present();
		setTimeout(() => {
			let hdr = this.alert.instance.hdrId;
			let head = window.document.getElementById(hdr);
			head.style.textAlign = 'center';
			head.innerHTML = '<ion-icon name="warning" style="color:#f0ad4e; text-aling:center; font-size: 3em !important" role="img" class="icon icon-md ion-md-warning" aria-label="warning" ng-reflect-name="warning"></ion-icon>';
		}, 100)
	}

	buttomBack() {
		this.app.platform.registerBackButtonAction(() => {
			if (this.alert) {
				this.alert.dismiss();
				this.alert = null;
			} else {
				if (this.app.nav.canGoBack()) {
					this.app.nav.pop();
					this.app.buttomBack();
				}
			}
		});
	}

}
