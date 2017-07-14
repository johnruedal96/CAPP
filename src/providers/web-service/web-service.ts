import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the WebServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class WebServiceProvider {

	public url: string;
	public urlSearch: string;
	public urlSearchProducto: string;
	public urlProductos: string;
	public urlSendCotizacion: string;
	public urlSendCotizacionProducto: string;
	public urlSendCotizacionCliente: string;
	public urlSearchCotizacionUsuario: string;
	public urlGetCotizacion: string;

	constructor(public http: Http) {
		this.url = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/show/";
		this.urlSearch = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/search/";
		this.urlSearchProducto = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/searchProducto/";
		this.urlProductos = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/productos/";
		this.urlSendCotizacion = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/cotizacion";
		this.urlSendCotizacionProducto = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/cotizacionProducto";
		this.urlSendCotizacionCliente = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/cotizacionCliente";
		this.urlSearchCotizacionUsuario = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/buscarCotizacionUsuario/";
		this.urlGetCotizacion = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/getCotizacion/";
	}

	getEmpresas(tipo) {
		return this.http.get(this.url + tipo)
			.map(res => res.json())
	}

	search(tipo, name) {
		return this.http.get(this.urlSearch + tipo + '/' + name)
			.map(res => res.json())
	}

	searchProducto(tipo, name, offset, limit) {
		return this.http.get(this.urlSearchProducto + tipo + '/' + name + '/' + offset + '/' + limit)
			.map(res => res.json())
	}

	getProductos(tipo) {
		return this.http.get(this.urlProductos + tipo)
			.map(res => res);
	}

	getHeader(token){
		let headers = new Headers({
			'X-CSRF-TOKEN': token,
			'Content-Type': 'application/x-www-form-urlencoded',
		});

		return new RequestOptions({
			headers: headers
		});
	}

	sendCotizacion(data, token) {
		let params = 'usuario=' + data.usuario.id;

		let options = this.getHeader(token);
		return this.http.post(this.urlSendCotizacion, params, options)
			.map(res => res)
	}

	saveCotizacionProducto(data, token) {
		let options = this.getHeader(token);
		return this.http.post(this.urlSendCotizacionProducto, data, options)
			.map(res=>res)
	}

	saveCotizacionCliente(data, token) {
		let options = this.getHeader(token);
		return this.http.post(this.urlSendCotizacionCliente, data, options)
			.map(res=>res);
	}

	searchCotizacionUsuario(usuario) {
		return this.http.get(this.urlSearchCotizacionUsuario + usuario)
			.map(res => res);
	}

	getCotizacion(id, estado, cliente) {
		return this.http.get(this.urlGetCotizacion + id + '/' + estado + '/' + cliente)
			.map(res => res)
	}

}
