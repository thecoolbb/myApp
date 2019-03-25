import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
declare var BMap;
declare var AMapLib;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{
  //构造函数
  constructor(private geolocation: Geolocation) {
    //此处请自行放置一个icon文件到 assets/icon目录中
    //将该图标封装到百度地图中
    // this.myIcon = new BMap.Icon("assets/icon/position.png", new BMap.Size(32, 32));
  }


  //初始化百度地图的函数
  ionViewDidLoad() {
    // this.map = new AMap.Map(this.map_container.nativeElement, {
    //   view: new AMap.View2D({//创建地图二维视口
    //   zoom: 11, //设置地图缩放级别
    //   rotateEnable: true,
    //   showBuildingBlock: true
    //   })
    // });
    // AMap.service(["AMap.PlaceSearch"], function () {
    //   //构造地点查询类
    //   var placeSearch = new AMap.PlaceSearch({
    //     type: '厕所', // 兴趣点类别
    //     pageSize: 5, // 单页显示结果条数
    //     pageIndex: 1, // 页码
    //     city: "010", // 兴趣点城市
    //     citylimit: true,  //是否强制限制在设置的城市内搜索
    //     map: this.map, // 展现结果的地图实例
    //     panel: "panel", // 结果列表将在此容器中进行展示。
    //     autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    //   });
    //Amin: !Important:map_container shoud be called here, it can't be inited in constructor, if called in constructor
    //地图初始化
  }
  ionViewDidLeave() {
    //this.sbuscription.unsubscribe();
  }
}
