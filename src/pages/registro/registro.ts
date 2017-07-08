import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController, ToastController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs'
import { AuthProvider } from '../../providers/auth/auth';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the RegistroPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-registro',
	templateUrl: 'registro.html',
})
export class RegistroPage {

	public token: string;

	constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public app: MyApp, public alertCtrl: AlertController, public toastCtrl: ToastController) {
		this.getToken();
	}

	ionViewDidLoad() {
	}

	getToken() {
		this.auth.getToken()
			.subscribe(token => {
				this.token = token.text();
			});
	}

	goToPage(login) {
		if (login) {
			this.navCtrl.setRoot('LoginPage');
		} else {
			this.navCtrl.setRoot(TabsPage);
		}
	}

	register(formRegister) {
		if (formRegister.value.password == formRegister.value.confirmPassword) {
			this.auth.register(formRegister.value)
				.subscribe(
				(res) => {
					this.presentAlert('Usuario Creado', 'ahora puede iniciar sesion', false);
				},
				(err) => {
					this.presentAlert('Ha ocurrido un error', 'Por favor intente de nuevo', true);
				}
				)
		}else{
			let toas = this.toastCtrl.create({
				message:'Las contraseñas no coinciden',
				duration: 3000
			});
			toas.present();
		}
	}

	presentAlert(title, subTitle, error) {
		let text;
		let handler;
		if (error) {
			text = 'Cerrar';
			handler = console.log('error al iniciar sesion');
		} else {
			text = 'Iniciar Sesion';
			handler = this.navCtrl.push('LoginPage');
		}
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: subTitle,
			// buttons: ['cerrar']
			buttons: [
				{
					text: text,
					handler: data => {
						handler
					}
				}
			]
		});
		alert.present();
	}

}
