import { Component, ElementRef, Renderer } from '@angular/core';
import { MenuController, NavController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {

	tab1Root = 'FerreteriaPage';
	tab2Root = 'ElectricoPage';
	tab3Root = 'ServicioPage';
	tab4Root = 'CotizacionPage';

	constructor(public element: ElementRef, public renderer: Renderer, public menuController: MenuController, public auth: AuthProvider, public navCtrl: NavController, public alertCtrl: AlertController, public storage: LocalStorageProvider) {
		menuController.enable(true);
		// this.isLogged();
	}

	isLogged() {
		this.auth.isLogged().subscribe(user => {
			if (user.text() == '') {
				this.navCtrl.setRoot('LoginPage');
			} else {
				this.auth.user = JSON.parse(user.text());
			}
		});
	}

	onTabSelect(event) {
		// this.isLogged();
		if (event.index == 3) {
			this.storage.empresaId = Number(window.localStorage.getItem('cotizacionTipoEmpresa'));
			if (this.storage.empresaId == undefined || this.storage.empresaId == 0) {
				let alert = this.alertCtrl.create({
					subTitle: 'Seleccione el tipo de empresa',
					inputs: [
						{
							type: 'radio',
							label: 'Ferreterias',
							value: '1',
							handler: (event) => {
								alert.dismiss();
								this.storage.empresaId = event.value;
								window.localStorage.setItem('cotizacionTipoEmpresa', this.storage.empresaId.toLocaleString());
							}
						},
						{
							type: 'radio',
							label: 'Electricos',
							value: '2',
							handler: (event) => {
								alert.dismiss();
								this.storage.empresaId = event.value;
								window.localStorage.setItem('cotizacionTipoEmpresa', this.storage.empresaId.toLocaleString());
							}
						},
						{
							type: 'radio',
							label: 'Servicios',
							value: '3',
							handler: (event) => {
								alert.dismiss();
								this.storage.empresaId = event.value;
								window.localStorage.setItem('cotizacionTipoEmpresa', this.storage.empresaId.toLocaleString());
							}
						}
					],
					buttons: [
						{
							text: 'Cancelar',
							role: 'cancel'
						}
					]
				});
				alert.present();
			}
		}
	}
}
