import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';
import { SensorsOriginal, TYPE_SENSOR, Sensors} from '@ionic-native/sensors';
import {DeviceMotionOriginal, DeviceMotionAccelerationData} from '@ionic-native/device-motion'
import {DeviceOrientationOriginal, DeviceOrientationCompassHeading} from '@ionic-native/device-orientation'
import { NavController, AlertController} from "@ionic/angular";
declare var BMap;
declare var AMapLib;

// public navCtrl: NavController, public navParams: NavParams,
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  //百度地图map对象
  map: any;
  //实时位置的point对象，专有百度地图的位置表示对象
  timePoint: any;
  //搜寻图标集
  searchMarkers: any[];
  myGeo: any;
  myIcon: any;
  //厕所图标
  myToilet: any;
  //自己位置显示图标
  marker: any;
  //实时定位对象
  sbuscription: any;
  //控制实时定位对象
  subscription: any;
  //当地Icon
  locationIcon: any;
  //点击位置的对象
  getClickPosition: any;
  //当地的城市
  localCityName: any;
  //前一个定位的点
  previousMarker:null;
  //百度地图步行对象
  walking: any;
  //定义信息框的的选项
  opts: {
    width:200,
    height:100
  };
  //信息框对象
  infoWindow: any;
  //距离表示
  diameterLength:null;
  walkingLength:null;
  //位置表示
  address: '';
  //x轴上的磁场
  xOritention: any;
  oritention: any;
  //sensors
  //一些对象
  deviceMotion: DeviceMotionOriginal;
  deviceOrientation: DeviceOrientationOriginal;
  sensor: SensorsOriginal;
  //各坐标的旋转角度
  xx: any;
  yy: any;
  zz: any;
  tt: any;
  aa: any;
  bb: any;
  cc: any;
  dd: any;
  mm: any;
  nn: any;
  pp: any;
  qq: any;
  @ViewChild('map_container') map_container: ElementRef;

  //构造函数
  constructor(private geolocation: Geolocation, private gyroscope: Gyroscope) {
    //此处请自行放置一个icon文件到 assets/icon目录中
    //将该图标封装到百度地图中
    this.myIcon = new BMap.Icon("assets/icon/position.png", new BMap.Size(15, 22));
    this.myToilet = new BMap.Icon("assets/icon/toilet.png",new BMap.Size(30,42));
  }


  //初始化百度地图的函数与一些变量
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
    var vm = this;
    this.searchMarkers = [];
    this.map = new BMap.Map("map_container", { enableMapClick: false });
    this.map.enableScrollWheelZoom(true);
    this.myGeo = new BMap.Geocoder();
    this.walking = new BMap.WalkingRoute(this.map, { renderOptions: { map: this.map, panel: "r-result", autoViewport: true } });
    var option ={
      locationIcon: this.myIcon
    }
    var geolocationControl = new BMap.GeolocationControl(option);
    // //设置地图显示的城市
    geolocationControl.addEventListener("locationSuccess", function (e) {
      // 定位成功事件
      var address = "";
      if (vm.previousMarker !== null || vm.previousMarker !== undefined) {
        vm.map.removeOverlay(vm.previousMarker);
      }
      vm.previousMarker = e.marker;
      vm.timePoint = new BMap.Point(e.point.lng, e.point.lat); 
      vm.searchNearby();
      //address += e.addressComponent.province;
      vm.localCityName = e.addressComponent.city;
    });
    geolocationControl.addEventListener("locationError", function (e) {
      // 定位失败事件
      alert('定位失败');
    });
    this.map.addControl(geolocationControl);
    this.getLocation();
    // this.getSensors();
    // this.getGyrosocpe();
  }

  //创建infoWindow
  createInfoWindow(){
    
  }

  //传感器
  getSensors(){
    Sensors.enableSensor(TYPE_SENSOR.MAGNETIC_FIELD_UNCALIBRATED);
    this.xOritention = Sensors.getState();
    console.log(this.xOritention);
  }
  //陀螺仪
  getGyrosocpe(){
    let options: GyroscopeOptions = {
      frequency: 1
    }
    //陀螺仪的获取
    this.gyroscope.getCurrent(options)
    .then((orientation: GyroscopeOrientation) => {
      this.xx = "orien-x" + orientation.x;
      this.yy = "orien-y" + orientation.y;
      this.zz = "orien-z" + orientation.z;
      this.tt = "orien-tstmp" + orientation.timestamp;
    });
    //陀螺仪监控
    this.gyroscope.watch()
      .subscribe((orientation:GyroscopeOrientation)=>{
        console.log(orientation.x, orientation.y, orientation.z, orientation.timestamp);
      });
    this.deviceMotion.getCurrentAcceleration().then((acceleration:DeviceMotionAccelerationData)=>{
      this.aa = "acc-x:" + acceleration.x;
      this.bb = "acc-y:" + acceleration.y;
      this.cc = "acc-z:" + acceleration.z;
      this.dd = "acc-tstmp:" + acceleration.timestamp;
    },
    (error: any)=>console.log(error))
    this.deviceOrientation.getCurrentHeading().then(
      (data: DeviceOrientationCompassHeading)=>{
        this.mm = "trueH:" + data.trueHeading;
        this.nn = "magH:" + data.magneticHeading;
        this.pp = "HA:" + data.headingAccuracy;
        this.qq = "tsmp:" + data.timestamp;
      }
    );
  }

  //搜索附近厕所
  searchNearby(){
    var vm = this;
    //移除之前寻找到的图标
    vm.walking.clearResults();
    vm.searchMarkers.forEach((item)=>{
      vm.map.removeOverlay(item);
    });
    var local = new BMap.LocalSearch(vm.map, {
      renderOptions: { map: vm.map, autoViewport: true, selectFirstResult: false }, onSearchComplete: function (result) {
        let location;
        vm.localCityName = result.city;
        for (let i = 0; i < result.Ar.length; i++) {
          location = new BMap.Point(result.Ar[i].point.lng, result.Ar[i].point.lat);
          let marker = new BMap.Marker(location, { icon: vm.myToilet });
          vm.searchMarkers.push(marker);
          vm.map.addOverlay(marker);
          vm.address = result.Ar[i].address;
          marker.addEventListener('click', function () {
            vm.diameterLength = vm.map.getDistance(vm.timePoint, new BMap.Point(result.Ar[i].point.lng, result.Ar[i].point.lat)).toFixed(2);
            vm.walking.clearResults();
            vm.walking.search(vm.timePoint, new BMap.Point(result.Ar[i].point.lng, result.Ar[i].point.lat));
            vm.walking.setMarkersSetCallback(function (pois) {
              for (let i = 0; i < pois.length; i++) {
                vm.map.removeOverlay(pois[i].marker);
              }
            });
            vm.walking.setPolylinesSetCallback(function (poi) {
              vm.walkingLength = poi[0].ag;
              let html = "<div>名称:公共厕所</div>" +
                "<div>直径距离:" + vm.diameterLength + "米</div>" +
                "<div>步行距离:" + vm.walkingLength + "米</div>" +
                "<div>地址:" + vm.address + "</div>";
              vm.infoWindow = new BMap.InfoWindow(html, vm.opts);
              // vm.map.closeInfoWindow();
              marker.openInfoWindow(vm.infoWindow);
            });
            // vm.map.addEventListener('click', function () {
            //   vm.map.closeInfoWindow();
            //   vm.map.removeEventListener('click');
            // })
          })
        }
      }, onMarkersSet: function (pois) {
        for (let i = 0; i < pois.length; i++) {
          vm.map.removeOverlay(pois[i].marker);
        }
      }
    });
    console.log(vm.timePoint);
    local.searchNearby("厕所", vm.timePoint);
  }
  //获取GPS定位函数
  getLocation() {
    //利用geolocation获取位置
    var vm = this;
    this.geolocation.getCurrentPosition().then((resp) => {
      if (resp && resp.coords) {
        let locationPoint = new BMap.Point(resp.coords.longitude, resp.coords.latitude);
        vm.timePoint = locationPoint;
        let convertor = new BMap.Convertor();
        let pointArr = [];
        pointArr.push(locationPoint);
        convertor.translate(pointArr, 1, 5, (data) => {
          if (data.status === 0) {
            if(vm.previousMarker !==null || vm.previousMarker !==undefined)
            {
              vm.map.removeOverlay(vm.previousMarker);
            }
            let marker = vm.marker = new BMap.Marker(data.points[0], { icon: vm.myIcon });
            vm.map.centerAndZoom(data.points[0], 16);
            vm.map.panTo(data.points[0]);
            marker.setPosition(data.points[0]);
            vm.map.addOverlay(marker);
            vm.previousMarker = marker;
          }
        })
        vm.searchNearby();
        var map = vm.map;
      }
      if(this.sbuscription === null || this.sbuscription === undefined)
      {
        this.watchPosition();
      }
    }).catch(e => {
      console.log(e);
    });
    //记录实时定位时保存先前一个marker点，以便更新时删除前一个marker点
    this.map.enableScrollWheelZoom(true);  //启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom(true);
    }

    //实时监控位置函数
    watchPosition(){
      //实时监控位置的移动
      var vm = this;
      this.sbuscription = this.geolocation.watchPosition();
      this.subscription = this.sbuscription.subscribe((data) => { // data can be a set of coordinates,or an error(if an error occurred). 
        // data.coords.latitude 
        // data.coords.longitude
        if (data.coords !== undefined) {
          let point = new BMap.Point(data.coords.longitude,data.coords.latitude);
          let convertor = new BMap.Convertor();
          let pointArr = [];
          pointArr.push(point);
          convertor.translate(pointArr, 1, 5, (data) => {
            if (data.status === 0) {
              vm.map.removeOverlay(vm.previousMarker);
              let marker = vm.marker = new BMap.Marker(data.points[0], { icon: vm.myIcon })
              var map = vm.map;
              var local = new BMap.LocalSearch(vm.map, {
                renderOptions: { map: vm.map, autoViewport: true, selectFirstResult: false }, onSearchComplete: function (result) {
                  let location;
                  for (let i = 0; i < result.Ar.length; i++) {
                    for (let key in result.Ar[i]) {
                      // console.log(result, result.Ar[i][key], key);
                    }
                    location = new BMap.Point(result.Ar[i].point.longitude, result.Ar[i].point.latitude);
                    vm.timePoint = new BMap.Point(result.Ar[i].point.longitude, result.Ar[i].point.latitude);
                    let marker = new BMap.Marker(location, { icon: vm.myToilet });
                    vm.map.addOverlay(marker);
                  }
                }
              });
              // local.searchNearby("厕所", data.points[0]);
              if (vm.previousMarker) {
                vm.map.removeOverlay(vm.previousMarker);
              }
              vm.map.panTo(data.points[0]);
              marker.setPosition(data.points[0]);
              vm.map.addOverlay(marker);
              vm.previousMarker = marker;
            }
          });
        }
      });
    }

    //获取点击的位置
    getClickPostion(){
      this.map.addEventListener("click",function(e){
        this.getClickPostion = e;
      })
    }
    //退出页面时，关闭定位功能
    ngOnInit() {
      this.ionViewDidLoad();
      // this.getClickPostion();
    }
    ionViewDidLeave(){
      if ('unsubscribe' in this.subscription)
      {
        this.subscription.unsubscribe();
      }
    }

}
