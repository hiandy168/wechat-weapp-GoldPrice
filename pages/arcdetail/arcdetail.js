var app = getApp()
Page({
    data: {
        data:[]
    },
    onLoad: function (options) {
      var that = this;
      var id = options.id;
      wx.showLoading({
        title: '加载中',
      });
      wx.request({
        url: 'https://test.hytips.com/wechat/Gold/jindian_price.php',
        data: {id: id},
        dataType: 'JSONP',
        success: function (res) {
          wx.hideLoading();
          var data0 = JSON.parse(res.data);
          console.log(data0);
          that.setData({
            data:data0
          })
        }
      });
    },
})
