/**
 * 搜索设备界面
 */
Page({
  data: {
    logs: '',
    list:[],
    dis:false
  },
  onLoad: function () {

  },
  onShow:function(){
 
  },
  //判断蓝牙是否可用 
  openBle: function(){
    var _this = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log(res);
        _this.setData({
          logs:res.errMsg
        });
      },
      fail: function (res) {
        wx.showModal({
          content: '请开启手机蓝牙后再试'
        })
      }
    })
  },
  searchBle:function(){
    var that = this;
    var arr = [];
    that.setData({
      dis:true
    });
    //开始搜索蓝牙
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        console.log('search', res)
      },
      fail:function(res){
        console.log('search', res)
        that.setData({
          dis: false
        });
      }
    })
    //发现设备
    wx.getBluetoothDevices({
      success: function (res) {
        console.log('发现设备', res)
        if (res.devices[0]) {
          console.log(that.ab2hext(res.devices[0].advertisData))
        }
      }
    })
    //监听发现设备
    wx.onBluetoothDeviceFound(function (devices) {
      console.log('发现设备:', devices.devices[0].deviceId)
      that.data.list.push(devices.devices[0].deviceId);
      
      for (let i = 0; i < devices.devices.length; i++) {
        arr.push(devices.devices[i].deviceId);
        //检索指定设备
        if (devices.devices[i].deviceId == 'ED:67:37:4D:EA:77') {
          console.log(devices.devices[i].advertisServiceUUIDs);
          // 长震动
          wx.vibrateLong({});
          //关闭搜索
          wx.stopBluetoothDevicesDiscovery();
          console.log('已找到指定设备:', devices.devices[i].deviceId);
          //关闭搜索
          wx.stopBluetoothDevicesDiscovery();
          //关闭蓝牙
          wx.closeBluetoothAdapter({
            success: function (res) {
              console.log('关闭小程序蓝牙!');
            },
          });
          that.setData({
            dis: false,
            logs: ''
          });
        }
        that.setData({
          list: arr
        });
      }
    })
   
  },
  topenBle:function(){
    var _this = this;
    setTimeout(function(){
      _this.searchBle();
    },10000);
  },
  ab2hext: function (buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  }
})
