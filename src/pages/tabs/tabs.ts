import { Component, ElementRef, Renderer } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {

	tab1Root = 'FerreteriaPage';
	tab2Root = 'ElectricoPage';
	tab3Root = 'ServicioPage';
	tab4Root = 'CotizacionPage';

	constructor(public element: ElementRef, public renderer: Renderer, public menuController: MenuController, public auth: AuthProvider, public navCtrl: NavController) {
		menuController.enable(true);
	}

	isAuth() {
		// this.auth.isLogged(this.navCtrl).subscribe(user => {
		// 	// Movil
		// 	if (user.text() == '') {
		// 		this.navCtrl.setRoot('LoginPage');
		// 	} else {
		// 		this.auth.user = JSON.parse(user.text());
		// 	}
		// });
	}


// // para iconos .png	
// 	ionViewDidLoad() {
// 		let content = this.setIcon('ferreteria');
// 		this.loadIcon(content, 'assets/icon/icon_ferreterias.png');

// 		content = this.setIcon('servicio');
// 		this.loadIcon(content, 'assets/icon/icon_servicios.png');

// 		content = this.setIcon('electrico');
// 		this.loadIcon(content, 'assets/icon/icon_ferreelectricos.png');
// 	}

// 	setIcon(icon) {
// 		// icono android
// 		let content = this.element.nativeElement.getElementsByClassName('ion-md-' + icon)[0];

// 		if (content == undefined) {
// 			// icono ios
// 			content = this.element.nativeElement.getElementsByClassName('ion-ios-' + icon)[0];
// 			if (content == undefined) {
// 				// icono ios-outline
// 				content = this.element.nativeElement.getElementsByClassName('ion-ios-' + icon + '-outline')[0];
// 			}
// 		}

// 		return content;
// 	}

// 	loadIcon(content, url) {
// 		this.renderer.setElementStyle(content, 'background-image', 'url(' + url + ')');
// 		this.renderer.setElementStyle(content, 'width', '24px');
// 		this.renderer.setElementStyle(content, 'height', '24px');
// 		this.renderer.setElementStyle(content, 'background-size', 'contain');
// 		this.renderer.setElementStyle(content, 'background-repeat', 'no-repeat');
// 	}
}
