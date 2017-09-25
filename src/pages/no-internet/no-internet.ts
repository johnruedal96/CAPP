import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the NoInternetPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-no-internet',
  templateUrl: 'no-internet.html',
})
export class NoInternetPage {

  public showSpiner: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public app: MyApp) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NoInternetPage');
  }

  reconectar() {
    this.showSpiner = true;
    this.auth.getToken()
      .subscribe(
      (data) => {
        this.isLogged();
      },
      (err)=>{
        this.showSpiner = false;
      }
      )
  }

  isLogged() {
		if (!this.auth.loginFacebookGoogle) {
			this.auth.isLogged().subscribe(user => {
				if (user.text() == '') {
					this.app.rootPage = 'LoginPage';
				} else {
          this.app.rootPage = TabsPage;
					this.auth.user = JSON.parse(user.text());
				}
			});
		}else{
			this.auth.getCredencialesFacebook(this.navCtrl);
		}
	}

}
