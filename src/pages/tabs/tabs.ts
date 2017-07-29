import { Component, ElementRef, Renderer, ViewChild } from '@angular/core';
import { MenuController, NavController, AlertController, Platform, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

import { SuperTabs } from 'ionic2-super-tabs';

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {

	tab1Root = 'FerreteriaPage';
	tab2Root = 'ElectricoPage';
	tab3Root = 'ServicioPage';
	tab4Root = 'CotizacionPage';

	public tabSelected: string = "0";

	constructor(public element: ElementRef, public renderer: Renderer, public menuController: MenuController, public auth: AuthProvider, public navCtrl: NavController, public alertCtrl: AlertController, public storage: LocalStorageProvider, public platform: Platform, public navParams: NavParams) {
		menuController.enable(true);
		if (!storage.desarrollo) {
			this.isLogged();
		}

		if (this.navParams.get('cotizacion')) {
			this.tabSelected = '3';
			this.showSelectEmpresa();
		}
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
		if (!this.storage.desarrollo) {
			this.isLogged();
		}
		if (event.index == 3) {
			this.showSelectEmpresa();
		}
	}

	showSelectEmpresa() {
		this.storage.empresaId = Number(window.localStorage.getItem('cotizacionTipoEmpresa'));
		if (this.storage.empresaId == undefined || this.storage.empresaId == 0) {
			window.localStorage.setItem('filtro', 'true');
			this.storage.filtro = true;
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
