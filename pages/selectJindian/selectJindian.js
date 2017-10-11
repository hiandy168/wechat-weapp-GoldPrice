Page({
  data: {
    compareRow: null, //row是指的compare页面竖排第几行，又请求数据的先后顺序决定
    compareId: null, //id是指的compare页面请求过来的数据的绝对顺序
    jindianList: null,
    selectedItem: null,
  },
  onLoad: function (options) {
    var that = this;
    var jindianList = wx.getStorageSync('jindian')
    that.setData({
      compareRow: options.row,  //存储compare传过来的数据
      compareId: options.id - 1,  //存储compare传过来的数据,id-1是因为id从1开始的
      jindianList: jindianList
    })
  },
  //搜索功能
  storeKW:function(e){
    var that = this;
    var jindianList0 = wx.getStorageSync('jindian');//每次都从缓存中取最完整的数据
    let jindianList1=[];
    for(var i=0;i<jindianList0.length;i++){
      if (jindianList0[i].name.indexOf(e.detail.value)>=0){ //循环匹配关键字
        jindianList1.push(jindianList0[i])
      }
    }
    that.setData({
      jindianList: jindianList1
    })
  },
  gotoCompare: function (e) {
    var that = this;
    /*取消原来的√，添加新的√*/
    var jindianList = wx.getStorageSync('jindian');
    jindianList[that.data.compareId].selected = false;
    jindianList[e.currentTarget.dataset.selectnum].selected = true;
    wx.setStorageSync('jindian', jindianList) //缓存更新打钩后的数据
    that.setData({
      jindianList: jindianList
    })
    //计算百分比数据并更新compare页的initPriceData数据，
    var pages = getCurrentPages();  //获取全部页面实例
    var prevPage = pages[pages.length - 2];  //上一个页面
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'https://test.hytips.com/wechat/Gold/jindian_price.php',
      data: { id: jindianList[e.currentTarget.dataset.selectnum].id },
      dataType: 'JSONP',
      success: function (res) {
        var data0 = JSON.parse(res.data); //获取当前点击金店的详情数据
        var initPriceData0 = wx.getStorageSync('initPriceData')  //取出比价的基础数据
        initPriceData0[that.data.compareRow] = data0[0]  //更新比价的基础数据
        //更新百分比数据
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
        wx.setStorageSync('initPriceData', initPriceData0)//将更新后的数据缓存起来，便于下次在此基础上使用
        prevPage.setData({
          initPriceData: initPriceData0
        })
        wx.hideLoading();
        //返回上一页
        wx.navigateBack()
      }
    });
  },
})
