// ==UserScript==
// @icon         https://img.tujidu.com/image/5e7ba0d6b0062.jpg
// @name         （内测已在试用的代码丢失不在维护）刹客网络工具集成Integration of brake shakenetwork tools
// @namespace    https://mp.weixin.qq.com/s/jif5WcnbS2lsQ3ufeikxmg
// @version      0.1.1 20200813
// @description  解除文库网站复制限制，搜索引擎屏蔽广告
// @author       由刹客网络科技提供
// @include     *://wenku.baidu.com/view/*
// @include     *://www.51test.net/show/*
// @include     *://www.xuexi.la/*
// @include     *://www.xuexila.com/*
// @include     *://www.cspengbo.com/*
// @include     *://www.doc88.com/*
// @license     GPL License
// @require     https://cdn.bootcss.com/jquery/2.1.2/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @connect     res.doc88.com
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @match        *://*.baidu.com/*
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @require      https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @require      https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.js
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_info
// @grant        GM_notification
// @grant        GM_getResourceText
// @grant        GM_openInTab
// @grant        GM_download
// @connect      zhihu.com
// @connect      weixin.qq.com
// @connect      dadiyouhui02.cn
// ==/UserScript==
 
(function () {
  'use strict';
  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;
 
    if (!css || typeof document === 'undefined') {
      return;
    }
 
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
 
    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }
 
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }
 
  var css_248z = "#_copy{width:60px;height:30px;background:#4c98f7;color:#fff;position:absolute;z-index:1000;display:flex;justify-content:center;align-items:center;border-radius:3px;font-size:13px;cursor:pointer}div[id^=reader-helper]{display:none!important}";
  styleInject(css_248z);
 
  function initEvent($, ClipboardJS) {
    $("body").on("mousedown", function (e) {
      $("#_copy").remove();
    });
 
    document.oncopy = function () {};
 
    $("body").on("copy", function (e) {
      e.stopPropagation();
      return true;
    });
    ClipboardJS.prototype.on('success', function (e) {
      $("#_copy").html("复制成功");
      setTimeout(function () {
        return $("#_copy").fadeOut(1000);
      }, 1000);
      e.clearSelection();
    });
    ClipboardJS.prototype.on('error', function (e) {
      $("#_copy").html("复制失败");
      setTimeout(function () {
        return $("#_copy").fadeOut(1000);
      }, 1000);
      e.clearSelection();
    });
  }
 
  var path = "";
 
  function init() {
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://res.doc88.com/assets/js/v2.js",
      onload: function onload(response) {
        var view = new Function("var view = " + response.responseText.replace("eval", "") + "; return view;");
        path = /<textarea[\s\S]*?Viewer.([\S]*?)\+[\S]*?\/textarea>/.exec(view())[1];
      }
    });
  }
 
  function getSelectedText() {
    return unsafeWindow.Viewer[path];
  }
 
  var doc88 = {
    init: init,
    getSelectedText: getSelectedText
  };
 
  function initWebsite($, ClipboardJS) {
    if (window.location.href.match(/.*www\.doc88\.com\/.+/)) doc88.init();
  }
 
  function getSelectedText$1() {
    if (window.location.href.match(/.*www\.doc88\.com\/.+/)) return doc88.getSelectedText();
    if (window.getSelection) return window.getSelection().toString();else if (document.getSelection) return document.getSelection();else if (document.selection) return document.selection.createRange().text;
    return "";
  }
 
  (function () {
    var $ = window.$;
    var ClipboardJS = window.ClipboardJS; // https://clipboardjs.com/#example-text
 
    initEvent($, ClipboardJS);
    initWebsite();
    document.addEventListener("mouseup", function (e) {
      var copyText = getSelectedText$1();
      if (copyText) console.log(copyText);else return "";
      $("#_copy").remove();
      var template = "\n            <div id=\"_copy\"\n            style=\"left:".concat(e.pageX + 30, "px;top:").concat(e.pageY, "px;\"\n            data-clipboard-text=\"").concat(copyText, "\">\u590D\u5236</div>\n        ");
      $("body").append(template);
      $("#_copy").on("mousedown", function (event) {
        event.stopPropagation();
      });
      $("#_copy").on("mouseup", function (event) {
        event.stopPropagation();
      });
      new ClipboardJS('#_copy');
    });
  })();
}());
 
(function() {
    'use strict';
    var mmmjhy=0;
		var zkddomain = document.domain;
		var zkdurldomain = location.href;
if(zkddomain.indexOf(".ctyun.cn") >= 0 || zkddomain.indexOf("cloud.189.cn") >= 0) {
return;
}
if(zkddomain.indexOf("greasyfork.org") <= 0 ) {
delgoogle();
delzhihu();
delbaidu();
del360();
 if($("iframe").length>0  ){
 $("iframe").each(function(){
 	 if($(this).src ){
if ($(this).src.indexOf('pos.baidu.com') >=0) {
 $(this).remove();
}
}
  });
}
setTimeout(function(){
$("div").each(function(){
 
      if ($(this).attr("data-type")=="GoogleRender"){
 
  $(this).remove();
  }
});
delgoogle();
delzhihu();
delbaidu();
del360();
 $("iframe").each(function(){
 	 	 if($(this).src ){
if ($(this).src.indexOf('pos.baidu.com') >=0 ) {
 $(this).remove();
}
}
  });
 
},3000);
 
var ref = "";
 
ref = setInterval(function(){
    delgoogle();
},2000);
 
function delgoogle() {
	if(zkddomain.indexOf(".op.gg") > 0 ) {
 $(".vm-placement").remove();
}
	$("ins").remove();
	var x = document.getElementsByClassName("ad");
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
 
	var y = document.getElementsByClassName("adsbygoogle");
	var j;
	for (j = 0; j < y.length; j++) {
		y[j].style.display = "none";
	}
 
	$(".adsbygoogle").remove();
 
 
 
$("script").each(function(){
 
if($(this).attr("src")){
let googads=$(this).attr("src");
 if (googads.indexOf('adsbygoogle.js') >=0 || googads.indexOf('g.doubleclick.net') >=0){
$(this).remove();
}
}
  });
 $("div").each(function(){
 $(this).attr("id");
if($(this).attr("id")){
let googsrcid=$(this).attr("id");
 if (googsrcid.indexOf('google_ads') >=0){
$(this).remove();
}
}
 if($(this).attr("data-google-query-id")){
$(this).remove();
}
  });
 
 
 
}
 
function delzhihu() {
 
$(".Pc-feedAd").remove();
$(".Banner-adsense").remove();
 
$("img").each(function(){
 
      if ($(this).attr("alt")=="广告"){
 
  $(this).remove();
 
  }
});
}
}
 
function del360() {
	 if($("iframe").length>0  ){
 $("iframe").each(function(){
if($(this).src ){
console.log($(this).src)
}
  });
}
 
   if(zkddomain.indexOf('360kan.com') > 0 ){
 
   	   $("li").each(function(){
 	 	 if ($(this).attr("data-clicklog") ){
 	 	 	 $(this).remove();
 	 	 }
   })
    }
	   if (zkddomain.indexOf('so.com') > 0 && zkdurldomain.indexOf('so.com/s') > 0){
	   	   $("#e_idea_pp").remove();
	   	    $("#side").remove();
	   	    $("#mohe-360pic_sad--normal").remove();
	   	     $("#e_map_idea").remove();
	   	      $("#e_idea_pp_vip_bottom").remove();
 
 
 
	   }
	   	   if(zkddomain.indexOf('so.com') > 0 ){
 
	   	   $(".aside").remove();
 
	   	   	    $("#js-bussiness-bot-list").remove();
	   	      $("#js-mod-fixed-inn").remove();
	   	        $("#e_idea_wenda_leftBox").remove();
 
	}
}
 
   if(zkdurldomain.indexOf('www.baidu.com/s') > 0){
 
         setInterval(function(){
     delbaidu()
       },2000);
           }
 
 
function delbaidu() {
 
   if(zkddomain.indexOf("baidu.com") > 0 ) {
   if(zkdurldomain.indexOf('www.baidu.com/s') > 0){
        $("[cmatchid]").remove();
        $("#content_right").remove();
 
   if(zkdurldomain.indexOf("sf/vsearch") < 0 ) {
        $("#content_left").find("div:eq(0)").each(function() {
            var id = String($(this).attr("id"));
            if (id == "undefined") {
                $(this).remove();
            }
        })
    }
        setTimeout(function(){
            $("span").each(function() {
                if ($(this)[0].innerHTML == '广告') {
 
                    $(this).parent().parent().remove();
                }
            })
        }, 3000);
 
}
 
    if(zkdurldomain.indexOf('zhidao.baidu.com') > 0){
        $(".shop-entrance").remove();
        $(".activity-entry").remove();
        $(".task-list-button").remove();
    }
    if(zkdurldomain.indexOf('zhidao.baidu.com/search') > 0){
        $(".bannerdown").remove();
        $(".aside.fixheight").remove();
        $(".wgt-bottom-ask").remove();
 
        $(".leftup").remove();
        $(".wgt-iknow-special-business").remove();
    }
    if(zkdurldomain.indexOf('zhidao.baidu.com/question') > 0){
    	$(".grid-r.qb-side").remove();
        $(".wgt-ads").remove();
        $(".wgt-bottom-union").remove();
        $(".adTopImg").remove();
        $(".exp-topwld-tip").remove();
        $("#wgt-ecom-banner").remove();
        $("#wgt-ecom-right").remove();
        $(".question-number-text-chain").remove();
        setTimeout(function(){
            $(".ec-pc_mat_coeus__related_link_text-content").remove();
        }, 1000);
    }
 
 
    if(zkdurldomain.indexOf('baike.baidu.com') > 0){
        setTimeout(function(){
            $("#navbarAdNew").remove();
            $(".userbar_mall").remove();
        }, 1000);
    }
    if(zkdurldomain.indexOf('baike.baidu.com/item') > 0){
 
        $(".before-content").remove();
        $(".configModuleBanner").remove();
        setTimeout(function(){
            $(".topA").remove();
            $(".right-ad").remove();
            $(".lemmaWgt-promotion-vbaike").remove();
            $(".lemmaWgt-promotion-slide").remove();
            $("#side_box_unionAd").remove();
        }, 1000);
    }
 
 
    if(zkdurldomain.indexOf('wenku.baidu.com') > 0){
        $(".banner-ad").remove();
        $(".ad-box").remove();
        $("#banurl").remove();
        $("#my-wkHome-vip-tips").parent().remove();
        $(".vip-card").remove();
        setTimeout(function(){
            $(".zsj-topbar").remove();
            $(".lastcell-dialog").remove();
            $(".zsj-toppos").remove();
        }, 1000);
    }
    if(zkdurldomain.indexOf('wenku.baidu.com/search') > 0){
        $("#fengchaoad").remove();
        $(".yuedu-recommend-wrap").remove();
        $(".search-aside-adWrap").remove();
    }
    if(zkdurldomain.indexOf('wenku.baidu.com/view') > 0){
    	 $(".hx-bottom-wrapper").remove();
        $(".relative-recommend-wrapper").remove();
        $(".fc-container").remove();
        $("#ggbtm").parent().remove();
        $(".union-ad-bottom").remove();
        $(".ad-vip-close-bottom").remove();
    	   $(".operation-wrapper").remove();
        $(".relative-course-wrapper").remove();
        $(".hot-search-wrapper").remove();
        $(".hx-right-wrapper").remove();
        $("#relative-videos-wrap").remove();
        $(".add-has-money-pay").remove();
        $(".wk-color-vip-red").parent().parent().remove();
        $(".vip-tips-wrap").parent().remove();
        $(".top-ads-banner-wrap").remove();
        setTimeout(function(){
            $(".wangpan-tip").remove();
            $(".new-user-discount-tip").remove();
            $(".pay-vip-btn-wrap").remove();
            $(".relative-doc-ad-wrapper").remove();
        }, 1000);
        setInterval(function(){
            $(".view-like-recom-fc").remove();
        }, 1000);
    }
 
 
    if(zkdurldomain.indexOf('image.baidu.com/search/index') > 0){
 
        $("#pnlBeforeContent").remove();
        setInterval(function(){
            $(".fcImgli").remove();
        }, 1000);
    }
    if(zkdurldomain.indexOf('image.baidu.com/search/detail') > 0){
        $(".text-link-ads").remove();
        $(".rsresult-card").remove();
        $("#adCard").remove();
    }
 
 
    if(zkdurldomain.indexOf('tieba.baidu.com/f/search') > 0){
        $(".s_aside").remove();
    }
    if(zkdurldomain.indexOf('tieba.baidu.com/f?') > 0){
        setInterval(function(){
            $("span:contains('广告')").parent().parent().parent().parent().parent().remove();
        }, 1000);
 
         $("div").each(function(){
var fds=$(this).attr("title");
if (fds =="广告") {
var sda=$(this).parent().parent().parent();
if(sda.prop("tagName").toLowerCase()=="li"){
 $(sda).remove();
}
 
}
  });
 $("span").each(function(){
var fds=$(this).text();
if (fds =="广告") {
var sda=$(this).parent().parent().parent().parent().parent();
if(sda.prop("tagName").toLowerCase()=="li"){
 $(sda).remove();
}
 
}
  });
 
    }
    if(zkdurldomain.indexOf('tieba.baidu.com/p') > 0){
           	 if($(".label_text").length>0  ){
            setInterval(function(){
                 $(".label_text").each(function(){
var ggzx=$(this).text();
	 console.log(ggzx)
	 if (ggzx.indexOf("广告") != -1) {
   $(this).parent().parent().parent().html("广告已自动屏蔽");
}
  });
        }, 1000);
    }
    }
 
 
    if(zkdurldomain.indexOf('map.baidu.com/search') > 0){
 
        setInterval(function(){
            $(".damoce-search-item.damoce-search-item-nopoi").remove();
        }, 1000);
    }
 
 
    if(zkdurldomain.indexOf('jingyan.baidu.com/search') > 0){
        $(".ec_ad").parent().remove();
    }
    if(zkdurldomain.indexOf('jingyan.baidu.com/article') > 0){
        $("#fresh-share-exp-e").remove();
        $(".wgt-income-money").remove();
        $(".aside-pro-container").remove();
        $("#bottom-ads-container").remove();
        $(".magzine-list").remove();
    }
 
 
 
    if(zkdurldomain.indexOf('video.baidu.com') > 0 || zkdurldomain.indexOf('v.baidu.com') > 0){
        setTimeout(function(){
        	 $("#PCallpagesidebar1").remove();
            $("#PCallpagesidebar2").remove();
            $(".bdvideo-adver-carousel").parent().remove();
            $("div[id*='adone']").remove();
            $("div[id*='adtwo']").remove();
            $("#pallcommoncolumnad").remove();
            $("#index_right_top").remove();
            $("#qzfcadid").remove();
            $("#pcshortchannelTopRight").remove();
            $("#__lawnImageContainer").parent().parent().remove();
 
            $("#detail_adm_right").remove();
            $(".ctt-adver1-banner").remove();
            $("div[id*='PCDetailPageTopRightList']").remove();
 
 
        }, 1000);
        setInterval(function(){
        	   $("div[id*='channelBannerAdver']").remove();
            $("div[id*='channelColumn']").parent().remove();
            $("div[id*='ChannelColumn']").parent().remove();
            $("div[id*='pc']").remove();
            $("div[id*='PC']").remove();
            $("div[id*='adv-carousel-item']").parent().remove();
            $("[id*='FeedAdSys']").remove();
            $("div[id*='TabAd']").remove();
            $(".section-ad").remove();
            $(".full-collunm-ad").remove();
 
 
 
        }, 1000);
    }
    if(zkdurldomain.indexOf('video.baidu.com/v') > 0 || zkdurldomain.indexOf('v.baidu.com/v') > 0){
 
        $(".top-ad-cont").remove();
        setTimeout(function(){
 
            $("div[id*='searchMoreLong']").remove();
            $("#searchPagefeedBanner").remove();
            $(".side-content").remove();
            $("#psBottomColumn").parent().remove();
        }, 1000);
        setInterval(function(){
 
            $("#searchResultAdOne").remove();
            $("#searchHotShortSeven").remove();
            $("#searchHotShortSevenTwo").remove();
        }, 1000);
    }
    if(zkdurldomain.indexOf('www.baidu.com/sf/vsearch') > 0){
 
        $("#s_tab").next().next().each(function() {
            var id = String($(this).attr("id"));
            if (id == "undefined") {
                $(this).remove();
            }
        })
    }
 }
  }
    })();
