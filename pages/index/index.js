//index.js  
//获取应用实例  
var app = getApp()
Page({
  data: {
    lunboData: [],  //轮播数据
    jindian: [],
    kw:'',
  },
  onLoad: function () {
    var that = this;
    that.getArcLunbo();
    that.getjindian();
  },
  getjindian: function () {
    var that = this;
    wx.request({
      url: 'https://test.hytips.com/wechat/Gold/jindian.php',
      data: {},
      dataType: 'JSONP',
      success: function (res) {
        var data0 = JSON.parse(res.data);
        that.setData({
          jindian: data0
        })
        //此处是为了保存selectJindian的选中状态,默认为前5个选中
        data0[0].selected = true;
        data0[1].selected = true;
        data0[2].selected = true;
        data0[3].selected = true;
        data0[4].selected = true;
        wx.setStorageSync('jindian', data0)
      }
    });
  },
  getKWindian:function(kw){
    var that = this;
    wx.request({
      url: 'https://test.hytips.com/wechat/Gold/jindian_search.php',
      data: { kw: kw},
      dataType: 'JSONP',
      success: function (res) {
        var data0 = JSON.parse(res.data);
        that.setData({
          jindian: data0
        })
        wx.hideLoading();
      }
    });
  },
  storeKW: function (e) { 
    var that = this;
    that.setData({
      kw: e.detail.value
    })
    if (!e.detail.value){
      this.getKWindian(e.detail.value)
    }
  },
  search: function (e) {
    var that = this;
    wx.showLoading({
      title: '搜索中...',
    })
    this.getKWindian(e.detail.value)
  },
  buttonSearch: function (e) {
    wx.showLoading({
      title: '搜索中...',
    })
    var that = this;
    this.getKWindian(that.data.kw)
  },
  seeDetailPrice:function(e){
    console.log(e)
    var that = this;
    wx.navigateTo({
      url: '../arcdetail/arcdetail?id=' + e.currentTarget.dataset.id
    })
  },
  getArcLunbo: function () {  //请求轮播列表数据
    var that = this;
    wx.request({
      url: 'https://test.hytips.com/wechat/ForexWeb1/forex_news.php',
      data: { typeid: 71, appid: app.globalData.AppID, },
      dataType: 'JSONP',
      success: function (res) {
        var data0 = JSON.parse(res.data);
        that.setData({
          lunboData: data0
        })
      }
    });
  },
  seeLunboDetail: function (e) {  //跳转到轮播详情页
    var that = this;
    wx.setStorageSync('arcObj', that.data.lunboData[e.target.dataset.num])
    wx.navigateTo({
      url: '../lubodetail/lunbodetail'
    })
  },
}) 