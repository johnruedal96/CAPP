import { Component, ElementRef, Renderer } from '@angular/core';
import { MenuController, NavController, AlertController, Platform, NavParams } from 'ionic-angular';
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

	public tabSelected: string = "0";
	public nav: any;
	public alert: any;
	public alertCerrar: any;

	constructor(public element: ElementRef, public renderer: Renderer, public menuController: MenuController, public auth: AuthProvider, public navCtrl: NavController, public alertCtrl: AlertController, public storage: LocalStorageProvider, public platform: Platform, public navParams: NavParams) {
		menuController.enable(true);
		if (!storage.desarrollo) {
			this.isLogged();
		}

		if (this.navParams.get('cotizacion')) {
			this.tabSelected = '3';
			this.showSelectEmpresa();
		}

		this.nav = this.navParams.get('app');
	}

	isLogged() {
		if (!this.auth.loginFacebookGoogle) {
			this.auth.isLogged().subscribe(user => {
				if (user.text() == '') {
					this.navCtrl.setRoot('LoginPage');
				} else {
					this.auth.user = JSON.parse(user.text());
				}
			});
		}else{
			this.auth.getCredencialesFacebook(this.navCtrl);
		}
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
		if (this.storage.productos == 0) {
			this.alert = this.alertCtrl.create({
				subTitle: 'Seleccione el tipo de empresa',
				inputs: [
					{
						type: 'radio',
						label: 'Ferreterias',
						value: '1',
						handler: (event) => {
							this.alert.dismiss();
							this.storage.empresaId = event.value;
							window.localStorage.setItem('cotizacionTipoEmpresa', this.storage.empresaId.toLocaleString());
						}
					},
					{
						type: 'radio',
						label: 'Electricos',
						value: '2',
						handler: (event) => {
							this.alert.dismiss();
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
			this.alert.present();

			this.buttomBack()
		}

	}

	buttomBack() {
		this.platform.registerBackButtonAction(() => {
			if (this.alertCerrar) {
				this.alertCerrar.dismiss();
				this.alertCerrar = null;
			} else if (this.alert) {
				this.alert.dismiss();
				this.alert = null;
			} else {
				this.showAlert();
			}
		});
	}

	showAlert() {
		this.alertCerrar = this.alertCtrl.create({
			title: 'CAPP se cerrará',
			subTitle: '¿Desea permanecer en la aplicación?',
			buttons: [
				{
					text: 'salir',
					handler: data => {
						this.platform.exitApp();
					}
				},
				{
					text: 'No salir',
					role: 'cancel',
				}
			]
		});
		this.alertCerrar.present();
	}
}
