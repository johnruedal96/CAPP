import { Component, ElementRef, Renderer } from '@angular/core';

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {

	tab1Root = 'FerreteriaPage';
	tab2Root = 'ElectricoPage';
	tab3Root = 'ServicioPage';

	constructor(public element:ElementRef, public renderer:Renderer ) {

	}

	ionViewDidLoad(){
		let content = this.setIcon('ferreteria');
		this.loadIcon(content,'assets/icon/icon_ferreterias.png');

		content = this.setIcon('servicio');
		this.loadIcon(content,'assets/icon/icon_servicios.png');

		content = this.setIcon('electrico');
		this.loadIcon(content,'assets/icon/icon_ferreelectricos.png');
	}

	setIcon(icon){
		// icono android
		let content = this.element.nativeElement.getElementsByClassName('ion-md-'+icon)[0];

		if(content == undefined){
			// icono ios
			content = this.element.nativeElement.getElementsByClassName('ios-add-'+icon)[0];
			if(content == undefined){
				// icono ios-outline
				content = this.element.nativeElement.getElementsByClassName('ios-add-outline-'+icon)[0];
			}
		}

		return content;
	}

	loadIcon(content, url){
		this.renderer.setElementStyle(content, 'background-image', 'url('+url+')');
		this.renderer.setElementStyle(content, 'width', '24px');
		this.renderer.setElementStyle(content, 'height', '24px');
		this.renderer.setElementStyle(content, 'background-size', 'contain');
		this.renderer.setElementStyle(content, 'background-repat', 'norepeat');
	}
}
