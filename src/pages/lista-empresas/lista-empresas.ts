import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';

/**
 * Generated class for the ListaEmpresasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
 	selector: 'page-lista-empresas',
 	templateUrl: 'lista-empresas.html',
 })
 export class ListaEmpresasPage {

 	public empresas:any;
 	public empresasAntiguas:any;
 	public seleccion:any = [];
 	public id:number;
 	public filtro:number = 1;

 	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public ws: WebServiceProvider ) {

 		this.id = navParams.get('id');
 		if(this.id != undefined){
 			this.buscar(this.id);
 		}

 		this.seleccion = navParams.get('tags');
 		if(this.seleccion == undefined){
 			this.seleccion = [];
 		}

 	}

 	ionViewDidLoad() {

 	}

 	dismiss() {
 		let data = {
 			'seleccion': this.seleccion,
 			'id': this.id
 		};
 		this.viewCtrl.dismiss(data);
 	}

 	buscar(id){
 		this.id = id;
 		this.seleccion = [];
 		this.ws.getEmpresas(id)
 		.subscribe(empresas => {
 			this.loadList(empresas.data);
 		})
 	}

 	loadList(empresas){
 		this.empresas = empresas;
 		for (var i = 0; i < empresas.length; ++i) {
 			for (var j = 0; j < this.seleccion.length; ++j) {
 				if(empresas[i].id == this.seleccion[j].id){
 					this.empresas[i].check = true;
 					break;
 				}else{
 					this.empresas[i].check = false;
 				}
 			}
 		}
 	}

 	seleccionar(event, empresa) {
 		if(event){
 			empresa.check = true;
 			this.seleccion.push(empresa);
 		}else{
 			for (var i = 0; i < this.seleccion.length; ++i) {
 				if(empresa.id == this.seleccion[i].id){
 					this.seleccion.splice(i,1);
 				}
 			}
 		}
 	}

 	filtrar(event){
 		if(event == 1){
 			this.empresas = this.empresasAntiguas;
 		}
 		if(event == 2){
 			this.empresasAntiguas = this.empresas;
 			this.empresas = this.seleccion;
 		}
 	}

 }
