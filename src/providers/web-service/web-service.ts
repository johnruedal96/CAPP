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
	public urlSendCompra: string;
	public urlSendCompraProducto: string;
	public urlGetCompras: string;
	public urlGetCompra: string;
	public urlGetDireccion: string;
	public urlGuardarDireccion: string;
	public urlRemoveDireccion: string;
	public urlGetFormasPago: string;
	public urlGetUnidad: string;
	public urlSendMessage: string;

	constructor(public http: Http) {
		// this.url = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/show/";
		this.url = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/getEmpresas/";
		this.urlSearch = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/search/";
		this.urlSearchProducto = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/searchProducto/";
		this.urlProductos = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/productos/";
		this.urlSendCotizacion = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/cotizacion";
		this.urlSendCotizacionProducto = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/cotizacionProducto";
		this.urlSendCotizacionCliente = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/cotizacionCliente";
		this.urlSearchCotizacionUsuario = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/buscarCotizacionUsuario/";
		this.urlGetCotizacion = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/getCotizacion/";
		this.urlSendCompra = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/compra";
		this.urlSendCompraProducto = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/compraProducto";
		this.urlGetCompras = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/getComprasUsuario/";
		this.urlGetCompra = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/getCompra/";
		this.urlGetDireccion = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/getDireccion/";
		this.urlGuardarDireccion = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/guardarDireccion";
		this.urlRemoveDireccion = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/removeDireccion/";
		this.urlGetFormasPago = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/getFormasPago/";
		this.urlGetUnidad = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/getUnidad";
		this.urlSendMessage = "http://www.contactoarquitectonico.com.co/capp_admin/wscapp/sendMenssage";
	}

	getEmpresas(tipo) {
		let date = new Date();
		return this.http.get(this.url + tipo + '/' + date.getDay())
			.map(res => res.json())
	}

	search(tipo, name) {
		let date = new Date();
		return this.http.get(this.urlSearch + tipo + '/' + date.getDay() + '/' + name)
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

	getHeader(token) {
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
			.map(res => res)
	}

	saveCotizacionCliente(data, token) {
		let options = this.getHeader(token);
		return this.http.post(this.urlSendCotizacionCliente, data, options)
			.map(res => res);
	}

	searchCotizacionUsuario(usuario) {
		return this.http.get(this.urlSearchCotizacionUsuario + usuario)
			.map(res => res);
	}

	getCotizacion(id, estado, cliente) {
		return this.http.get(this.urlGetCotizacion + id + '/' + estado + '/' + cliente)
			.map(res => res)
	}

	sendCompra(data, token) {
		let options = this.getHeader(token);
		return this.http.post(this.urlSendCompra, data, options)
			.map(res => res);
	}

	sendCompraProducto(data, token) {
		let options = this.getHeader(token);
		return this.http.post(this.urlSendCompraProducto, data, options)
			.map(res => res);
	}

	getCompras(usuario) {
		return this.http.get(this.urlGetCompras + usuario)
			.map(res => res);
	}

	getCompra(compra) {
		return this.http.get(this.urlGetCompra + compra)
			.map(res => res);
	}

	getDireccion(usuario) {
		return this.http.get(this.urlGetDireccion + usuario)
			.map(res => res);
	}

	guardarDireccion(data, token) {
		let options = this.getHeader(token);
		return this.http.post(this.urlGuardarDireccion, data, options)
			.map(res => res)
	}

	removeDireccion(id) {
		return this.http.get(this.urlRemoveDireccion + id)
			.map(res => res);
	}

	getFormasPago() {
		return this.http.get(this.urlGetFormasPago)
			.map(res => res);
	}

	getUnidad() {
		return this.http.get(this.urlGetUnidad)
			.map(res => res);
	}

	uploadImage(formData,usuario) {
		return this.http.post("http://www.contactoarquitectonico.com.co/capp_admin/wscapp/uploadImagen/"+usuario, formData)
			.map(response => response.text())
	}

	sendMessage(data) {
		return this.http.post(this.urlSendMessage, data)
			.map(res => res);
	}

}
