// ==用户脚本==
// @name         全自动批量删除新浪微博
// @namespace https://mp.weixin.qq.com/s/jif5WcnbS2lsQ3ufeikxmg
// @版本 0.1
// @description  全自动批量清理微博已发的条数，是目前有效批量删除的办法
// @author       由刹客网络科技提供 这是公众号文章https://mp.weixin.qq.com/s/jif5WcnbS2lsQ3ufeikxmg
// @match https://*.weibo.com/*
// @include https://weibo.com/*
// @include https://*.weibo.com/*
// @include https://weibo.com/a/bind/*
// @include https://account.weibo.com/*
// @include https://kefu.weibo.com/*
// @include https://photo.weibo.com/*
// @include https://security.weibo.com/*
// @include https://verified.weibo.com/*
// @include https://vip.weibo.com/*
// @include https://open.weibo.com/*
// @grant 无
// ==/用户脚本==
 
(函数() { 
    '使用严格' ;
变量s =文档。createElement ( '脚本' );
小号_ 设置属性(
  'src' ,
  'https://lib.sinaapp.com/js/jquery/2.0.3/jquery-2.0.3.min.js'
);
小号_ 加载=函数（）{  
     设置间隔（函数（）{ 
          if (! $ ( 'a[action-type="feed_list_delete"]' )) {  
              $ （'a.next' ）。点击（）；
          }其他{  
              $ ( 'a[action-type="feed_list_delete"]' )[ 0 ]。点击（）；
              $ ( 'a[action-type="ok"]' )[ 0 ]。点击（）；
         }
 
          $ （'html，正文' ）。animate ({ scrollTop : $ ( document ). height () }, 'slow' );  
     }, 500);
};
文件。头。appendChild ( s );
})();
