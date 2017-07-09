import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the WebServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class WebServiceProvider {

	public url:string;
	public urlSearch:string;
	public urlSearchProducto:string;
	public urlProductos:string;

	constructor(public http: Http) {
		this.url = "http://contactoarquitectonico.com.co/capp_admin/wscapp/show/";
		this.urlSearch = "http://contactoarquitectonico.com.co/capp_admin/wscapp/search/";
		this.urlSearchProducto = "http://contactoarquitectonico.com.co/capp_admin/wscapp/searchProducto/";
		this.urlProductos = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/productos/";
	}

	getEmpresas(tipo){
		return this.http.get(this.url+tipo)
		.map(res => res.json())
	}

	search(tipo, name){
		return this.http.get(this.urlSearch+tipo+'/'+name)
		.map(res => res.json())
	}

	searchProducto(tipo, name){
		return this.http.get(this.urlSearchProducto+tipo+'/'+name)
		.map(res => res.json())
	}

	getProductos(tipo){
		return this.http.get(this.urlProductos+tipo)
		.map(res=>res);
	}

}
