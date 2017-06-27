import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';

import { Keyboard } from '@ionic-native/keyboard';

import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the ElectricoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
 	selector: 'page-electrico',
 	templateUrl: 'electrico.html',
 })
 export class ElectricoPage {

 	@ViewChild('searchbar') searchInput: Searchbar;

 	public electricos:any;
	public imagen:string;
	// muestra/oculta la barra de busqueda en el encabezado
 	public busqueda:boolean;
 	// guarda lo escrito en el input de busqueda
 	public txtSearch:string;
 	// indica cuando se realizo una busqueda
 	public loadListSearch:boolean = false;
 	// suscripcion a los metodos del teclado
 	private onHideSubscription: Subscription;

 	constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider, public keyboard:Keyboard) {
 		this.electricos = [];
		this.imagen = "http://www.contactoarquitectonico.com.co/capp_admin/archivos/";
		this.busqueda = false;
 	}

 	ionViewDidLoad() {
 		this.loadEmpresa();
 		// ejecuta la funcion closeSearch() cuando el teclado es cerrado
 		this.onHideSubscription = this.keyboard.onKeyboardHide().subscribe(() => this.closeSearch());
 	}

 	loadEmpresa(){
 		// carga la informacion del web service
 		this.ws.getEmpresas(2)
		.subscribe(electrico => {
			this.electricos = electrico.data;
		});
 	}

 	goToEmpresa(empresa){
 		this.navCtrl.push('EmpresaPage', {empresa:empresa})
 	}

 	inputSearch(){
 		// muestra el input de busqueda y le pone el foco
 		this.busqueda = true;
 		setTimeout(() => {
 			this.searchInput.setFocus();
 		}, 300);
 	}

 	closeSearch(){
 		// si ya se realizo una busqueda, pone el texto del input en blanco
 		// oculta la barra de busqueda
 		// y carga todas las empresas
 		if(!this.loadListSearch){
 			this.txtSearch = '';
 			this.busqueda = false;
 			this.loadEmpresa();
 		}else{
 			// indica que se realizo una busqueda
 			this.loadListSearch = false;
 		}
 	}

 	loadSearch(){
 		if(this.txtSearch != '' && this.txtSearch != undefined){
 			// realiza la busqueda y la muestra en pantalla
 			this.loadListSearch = true;
 			this.ws.search(2,this.txtSearch)
 			.subscribe(
 				(search) => {
 					this.electricos = search.data;
 					this.keyboard.close();
 				},
 				(err)=>{
 					this.electricos = [];
 					this.keyboard.close();
 				}
 			);
 		}

 	}

 	search(event){
 		// si se presiona el boton de buscar (teclado) se ejecuta la funciona
 		if(event == 13){
 			this.loadSearch();
 		}
 	}

 }
