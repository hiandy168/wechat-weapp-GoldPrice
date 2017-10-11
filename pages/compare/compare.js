Page({
  data: {
    initPriceData: [],
  },
  onLoad: function () {
    this.getJindianInitPrice()
  },
  getJindianInitPrice: function () {
    var that = this;
    for (var k = 0; k < 5; k++) {
      (function (x) {
        wx.request({
          url: 'https://test.hytips.com/wechat/Gold/jindian_price.php',
          data: { id: x + 1 },
          dataType: 'JSONP',
          success: function (res) {
            wx.hideLoading();
            var data0 = JSON.parse(res.data);
            console.log(data0[0])
            var initPriceData0 = that.data.initPriceData;
            initPriceData0.push(data0[0])
            that.setData({
              initPriceData: initPriceData0
            })

            var max = initPriceData0[0].jiage
            var min = initPriceData0[0].jiage
            for (var i = 0; i < initPriceData0.length; i++) {
              if (max < initPriceData0[i].jiage) {
                max = initPriceData0[i].jiage
              }
              if (min > initPriceData0[i].jiage) {
                min = initPriceData0[i].jiage
              }
            }
            
            for (var j = 0; j < initPriceData0.length; j++) {
              initPriceData0[j].percent = 100 - (50 * (max - initPriceData0[j].jiage) / (max - min))
            }
            that.setData({
              initPriceData: initPriceData0
            })
            wx.setStorageSync('initPriceData', initPriceData0)
          }
        });
      })(k)
    }
  },
  selectJindian:function(e){
    console.log(e.currentTarget.dataset.row)
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      //row是指的竖排第几行，又请求数据的先后顺序决定
      //id是指的请求过来的数据的绝对顺序
      url: '../selectJindian/selectJindian?row=' + e.currentTarget.dataset.row + '&id=' + e.currentTarget.dataset.id
    })
  }
})