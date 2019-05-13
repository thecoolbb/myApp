//该文件:根模块  告诉ionic如何组装应用L

//ionic angular的核心文件
import { NgModule, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientJsonpModule, HttpParams } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, NavController, NavParams } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http'
//ionic打包成app以后配置启动画面 以及导航条的服务
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx'
//引入路由配置文件
import { AppRoutingModule } from './app-routing.module';
//引入根组件
import { AppComponent } from './app.component';
import { MapPageModule } from './map/map.module';
@NgModule({
  declarations: [AppComponent], //申明组件
  entryComponents: [],//配置不会在模板中使用的组件
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, MapPageModule], //引入的模块 依赖的模块
  providers: [//配置服务
    StatusBar,
    SplashScreen,
    Geolocation,
    Gyroscope,
    NativeStorage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  httpOptions: any;
  constructor(private nativeStorage: NativeStorage, private http: HttpClient ){
    var username,password;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };
    this.nativeStorage.getItem('username').then(
      data=>{
        username = data;
      },
      error=>console.log(error)
    )
    this.nativeStorage.getItem('password').then(data=>{
      password = password;
    },
    error=>console.log(error)
    )
    let params = new HttpParams()
    .set('username',username)
    .set('password',password);
    this.http.post('http://127.0.0.1:3000/login', params, this.httpOptions).subscribe(response => {
      console.log(response);
    })
  }
}
