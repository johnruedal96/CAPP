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

	constructor(public http: Http) {
		this.url = "http://contactoarquitectonico.com.co/capp_admin/wscapp/show/";
	}

	getEmpresas(tipo){
		return this.http.get(this.url+tipo)
		.map(res => res.json())
	}

}
