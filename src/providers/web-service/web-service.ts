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

	constructor(public http: Http) {
		this.url = "http://contactoarquitectonico.com.co/capp_admin/wscapp/show/";
		this.urlSearch = "http://contactoarquitectonico.com.co/capp_admin/wscapp/search/";
	}

	getEmpresas(tipo){
		return this.http.get(this.url+tipo)
		.map(res => res.json())
	}

	search(tipo, name){
		return this.http.get(this.urlSearch+tipo+'/'+name)
		.map(res => res.json())
	}

}
