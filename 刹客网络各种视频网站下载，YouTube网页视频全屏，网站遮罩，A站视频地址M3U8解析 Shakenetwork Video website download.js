// ==UserScript==
// @icon         https://img.tujidu.com/image/5e7ba0d6b0062.jpg
// @name         （内测已在试用的代码丢失不在维护）刹客网络各种视频网站下载，YouTube网页视频全屏，网站遮罩，A站视频地址M3U8解析 Shakenetwork Video website download
// @namespace    https://mp.weixin.qq.com/s/jif5WcnbS2lsQ3ufeikxmg
// @version      0.1.3.2020813
// @description  知乎视频下载、YouTube视频下载、instagram图片视频下载，带网页全屏、油管遮罩层，instagram图片视频下载2，新浪微博内容批量提取文本，B站相册图片下载，新浪微博视图片下载，A站视频地址M3U8解析。
// @author       由刹客网络科技提供。
// @match        https://video.zhihu.com/video*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @connect       zhihu.com
// @namespace          https://github.com/HayaoGai
// @match              https://www.instagram.com/*
// @include      https://space.bilibili.com/*
// @require      https://greasyfork.org/scripts/402652-aria2-rpc-edit-use-gm-xmlhttprequest/code/Aria2%20RPC%20Edit%20(use%20GM_xmlhttpRequest).js?version=801673
// @resource     BiliUI-style  https://cdn.jsdelivr.net/gh/Sonic853/Static_library/BiliUI-style.min.css?t=20200506001
// @run-at       document-end
// @license      MIT License
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @match        https://weibo.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @license      MIT License
// @run-at       document-end
// @connect      *://*.sinaimg.cn
// @match              https://*.instagram.com/*
// @grant              GM_setValue
// @grant              GM_getValue
// @require            https://code.jquery.com/jquery-3.5.1.min.js
// @compatible         firefox >=52
// @compatible         chrome >=55
// @license            MIT
// @run-at              document-end
// @include      *://www.acfun.cn/v/ac*
// @include      *://www.acfun.cn/bangumi/aa*
// @exclude      *://*.eggvod.cn/*
// @license      MIT License
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @license MIT https://opensource.org/licenses/MIT
// @match          *://*.youtube.com/*
// @match        https://*.youtube.com/*
// @require      https://unpkg.com/vue@2.6.10/dist/vue.js
// @require      https://unpkg.com/xfetch-js@0.3.4/xfetch.min.js
// @require      https://unpkg.com/@ffmpeg/ffmpeg@0.6.1/dist/ffmpeg.min.js
// @require      https://bundle.run/p-queue@6.3.0
// @grant        GM_xmlhttpRequest
// @connect      googlevideo.com
// @compatible   firefox >=52
// @compatible   chrome >=55
// @license      MIT
// @require      https://bundle.run/p-queue@6.3.0
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @license      MIT
// @match               https://www.youtube.com/*
// @grant               GM_getValue
// @grant               GM_setValue
// ==/UserScript==
 
 
 
(function() {
    'use strict';
 
    const DEV_Log = Boolean(localStorage.getItem("Dev-853"));
    const localItem = "Lab8A";
    const NAME = "相册下载";
    const Console_log = function(text){
        let d = new Date().toLocaleTimeString();
        console.log("["+NAME+"]["+d+"]: "+text);
    };
    const Console_Devlog = function(text){
        let d = new Date().toLocaleTimeString();
        DEV_Log&&(console.log("["+NAME+"]["+d+"]: "+text));
    };
    const Console_error = function(text){
        let d = new Date().toLocaleTimeString();
        console.error("["+NAME+"]["+d+"]: "+text);
    };
 
    if(typeof GM_xmlhttpRequest === 'undefined' && typeof GM_registerMenuCommand === 'undefined' && typeof GM_setValue === 'undefined' && typeof GM_getValue === 'undefined' && typeof GM_addStyle === 'undefined'){
        Console_error("GM is no Ready.");
    }else{
        Console_log("GM is Ready.");
    };
 
    let BLab8A = class{
        constructor(){
            this.data = this.load();
        }
        load(){
            Console_log("正在加载数据");
            if (typeof GM_getValue !== 'undefined') {
                let gdata = JSON.parse(GM_getValue(localItem,"{\"IP\":\"127.0.0.1\",\"Port\":6800,\"dir\":\"E:\\\\Aria2Down\\\\BiliAlbum\"}"));
                return gdata;
            }else{
                let ldata = JSON.parse(localStorage.getItem(localItem) === null ? "{\"IP\":\"127.0.0.1\",\"Port\":6800,\"dir\":\"E:\\\\Aria2Down\\\\BiliAlbum\"}" : localStorage.getItem(localItem));
                return ldata;
            }
        };
        save(d){
            Console_log("正在保存数据");
            d===undefined?(d = this.data):(this.data = d);
            typeof GM_getValue != 'undefined'?GM_setValue(localItem,JSON.stringify(d)):localStorage.setItem(localItem,JSON.stringify(d));
            return this;
        };
        set_aria2Client(d){
            d===undefined?(d = this.data):(this.data = d);
            aria2Client = new Aria2({ host:d.IP,port:d.Port });
        }
    };
    let bLab8A = new BLab8A();
    let aria2Client = new Aria2({ host:bLab8A.data.IP,port:bLab8A.data.Port });
    let addToAria = function(url, filename, referer, cookie, headers, callback, errorcallback){
        // Console_Devlog(bLab8A.data.dir+(!bLab8A.data.dir.endsWith("\\")?"\\":"")+uFA.uid);
        let ariaParam = {
			dir: bLab8A.data.dir+(!bLab8A.data.dir.endsWith("\\")?"\\":"")+uFA.uid,
			out: filename,
			referer: referer || location.href,
			'user-agent': navigator.userAgent,
			header: headers || []
		};
 
		if(cookie === true)cookie = document.cookie;
        cookie&&ariaParam.header.push ('Cookie: ' + cookie);
 
        aria2Client.addUri(url,ariaParam,()=>{
            Console_Devlog("发送到Aria2成功。");
            callback;
        },()=>{
            Console_error("发送到Aria2失败。");
            lists.Set("发送到Aria2失败。");
            errorcallback;
        });
    };
 
    !DEV_Log&&GM_addStyle(GM_getResourceText("BiliUI-style"));
    let HTTPsend = function(url, method, Type, successHandler, errorHandler) {
        if (typeof GM_xmlhttpRequest != 'undefined') {
            GM_xmlhttpRequest({
                method:method,
                url:url,
                responseType:Type,
                onerror:function(response){
                    Console_Devlog(response.status);
                    errorHandler && errorHandler(response.status);
                },
                onload:function(response){
                    let status;
                    if(response.readyState == 4){
                        status = response.status;
                        if (status == 200) {
                            Console_Devlog(response.response);
                            successHandler && successHandler(response.response);
                        } else {
                            Console_Devlog(status);
                            errorHandler && errorHandler(status);
                        }
                    }
                },
            });
        }else{
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.withCredentials = true;
            xhr.responseType = Type;
            xhr.onreadystatechange = function() {
                let status;
                if (xhr.readyState == 4) {
                    status = xhr.status;
                    if (status == 200) {
                        Console_log(xhr.response);
                        successHandler && successHandler(xhr.response);
                    } else {
                        Console_log(status);
                        errorHandler && errorHandler(status);
                    }
                }
            };
            xhr.send();
        }
    };
    let loadToBlob = function(url, callback) {
        HTTPsend(url,"GET","blob",(result)=>{
            callback && callback(result);
        },()=>{
            callback && callback(false)
        });
    };
    let JSON_parse = function(data){
        let rdata;
        try {
            rdata = JSON.parse(data);
        } catch (error){
            Console_Devlog("JSON已解析，直接跳过");
            rdata = result;
        }
        return rdata;
    }
    let getType = function(file){
        let filename=file;
        let index1=filename.lastIndexOf(".");
        let index2=filename.length;
        let type=filename.substring(index1,index2);
        return type;
    };
    let getFileName = function(file) {
        let str = file;
        str = str.substring(str.lastIndexOf("/") + 1);
        return str;
    }
    let MBBtn = function(disabled){
        document.getElementById("Bili8-UI").getElementsByClassName("MBSendToAria")[0].disabled = !disabled;
        document.getElementById("Bili8-UI").getElementsByClassName("MBBlobDown")[0].disabled = !disabled;
    };
    let CreactUI = function(){
        if(document.getElementById("Bili8-UI")){
            lists.Set("加载中。。。");
            lists.BG("normal");
            document.getElementById("Bili8-UI").style.display = "block";
        }else{
            let Panel_ui = document.createElement("div");
            Panel_ui.classList.add("Bili8-UI","Panel");
            Panel_ui.id = "Bili8-UI";
 
            let PanelClose_ui = document.createElement("button");
            PanelClose_ui.classList.add("Close");
            PanelClose_ui.innerText = "关闭";
 
            let MainList_ui = document.createElement("div");
            MainList_ui.classList.add("MainList");
 
            let List_ui = document.createElement("textarea");
            List_ui.classList.add("List");
            List_ui.readOnly = true;
            List_ui.innerText = "加载中。。。";
 
            let MainBottom_ui = document.createElement("div");
            MainBottom_ui.classList.add("MainBottom");
 
            let IPInput_ui = document.createElement("input");
            IPInput_ui.title = "[Aria2]设置ip或域名（不带http和https）";
            IPInput_ui.placeholder = "设置ip或域名（不带http和https）";
            IPInput_ui.type = "text";
            IPInput_ui.value = bLab8A.data.IP;
            IPInput_ui.classList.add("MBtn","MBIP");
 
            let PortInput_ui = document.createElement("input");
            PortInput_ui.title = "[Aria2]设置端口";
            PortInput_ui.placeholder = "设置端口";
            PortInput_ui.type = "number";
            PortInput_ui.min = "1";
            PortInput_ui.max = "65536";
            PortInput_ui.value = bLab8A.data.Port;
            PortInput_ui.classList.add("MBtn","MBPort");
 
            let DirInput_ui = document.createElement("input");
            DirInput_ui.title = "[Aria2]设置路径";
            DirInput_ui.placeholder = "设置路径";
            DirInput_ui.type = "text";
            DirInput_ui.value = bLab8A.data.dir;
            DirInput_ui.classList.add("MBtn","MBDir");
 
            let SendToAria_ui = document.createElement("button");
            SendToAria_ui.classList.add("MBtn","MBSendToAria");
            SendToAria_ui.innerText = "发送到Aria2";
            SendToAria_ui.disabled = true;
 
            let BlobDown_ui = document.createElement("button");
            BlobDown_ui.classList.add("MBtn","MBBlobDown");
            BlobDown_ui.innerText = "浏览器打包下载";
            BlobDown_ui.title = "将会消耗大量的内存！";
            BlobDown_ui.disabled = true;
 
            Panel_ui.appendChild(PanelClose_ui);
            MainList_ui.appendChild(List_ui);
            Panel_ui.appendChild(MainList_ui);
            MainBottom_ui.appendChild(IPInput_ui);
            MainBottom_ui.appendChild(PortInput_ui);
            MainBottom_ui.appendChild(DirInput_ui);
            MainBottom_ui.appendChild(SendToAria_ui);
            MainBottom_ui.appendChild(BlobDown_ui);
            Panel_ui.appendChild(MainBottom_ui);
            document.body.appendChild(Panel_ui);
 
            SendToAria_ui.addEventListener("click",()=>{
                if(!uFA.DownSend){
                    bLab8A.data.IP = IPInput_ui.value;
                    bLab8A.data.Port = Number(PortInput_ui.value);
                    bLab8A.data.dir = DirInput_ui.value;
                    bLab8A.save().set_aria2Client();
                    uFA.indexA = 0;
                    uFA.HaveDownFail = false;
                    MBBtn(false);
                    lists.BG("running");
                    uFA.send_aria2();
                }else{
                    lists.Set("请求已经发送过去了，请勿重复点击！");
                }
            });
            BlobDown_ui.addEventListener("click",()=>{
                if(!uFA.DownSend){
                    zip = new JSZip();
                    uFA.indexA = 0;
                    uFA.HaveDownFail = false;
                    MBBtn(false);
                    lists.BG("running");
                    uFA.send_blob();
                }else{
                    lists.Set("请求已经发送过去了，请勿重复点击！");
                }
            });
            PanelClose_ui.addEventListener("click",()=>{
                document.getElementById("Bili8-UI").style.display = "none";
            });
        }
    };
    let CreactMenu = function(){
        let Creact_G = function(Mode){
            uFA.Mode = Mode;
            uFA.index = 0;
            uFA.all_count = 0;
            CreactUI();
            uFA.load_all_count();
            let t2 = setInterval(()=>{
                let index = uFA.index;
                if(index++>=uFA.all_count&&uFA.all_count!=0){
                    let obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
                    lists.Clear(obj);
                    uFA.imglist.forEach(element => {
                        lists.Add(element.url,obj);
                    });
                    MBBtn(true);
                    clearInterval(t2);
                }
            },100);
        }
        GM_registerMenuCommand("下载相册",()=>{Creact_G(0)});
        GM_registerMenuCommand("下载视频封面",()=>{Creact_G(1)});
        GM_registerMenuCommand("下载头像、头图、直播封面、直播壁纸",()=>{Creact_G(2)});
    };
    let BG_Default = [
        "1780c98271ead667b2807127ef807ceb4809c599.png",
        "e7f98439ab7d081c9ab067d248e1780bd8a72ffc.jpg",
        "f49642b3683a08e3190f29d5a095386451f8952c.jpg",
        "cd52d4ac1d336c940cc4958120170f7928d9e606.png",
        "70ce28bcbcb4b7d0b4f644b6f082d63a702653c1.png",
        "3ab888c1d149e864ab44802dea8c1443e940fa0d.png",
        "6e799ff2de2de55d27796707a283068d66cdf3f4.png",
        "24d0815514951bb108fbb360b04a969441079315.png",
        "0ad193946df21899c6cc69fc36484a7f96e22f75.png",
        "265ecddc52d74e624dc38cf0cff13317085aedf7.png",
        "6a1198e25f8764bd30d53411dac9fdf840bc3265.png",
        "9ccc0447aebf0656809b339b41aa5b3705f27c47.png",
        "8cd85a382756ab938df23a856017abccd187188e.png",
        "e22f5b8e06ea3ee4de9e4da702ce8ef9a2958f5a.png",
        "c919a9818172a8297f8b0597722f96504a1e1d88.png",
        "87277d30cd19edcec9db466a9a3e556aeb0bc0ed.png",
        "44873d3568bdcb3d850d234e02a19602972450f1.png",
        "cb1c3ef50e22b6096fde67febe863494caefebad.png"
    ];
    let List = class{
        Get(obj){
            if(obj === undefined){
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
            }
            obj.innerHTML;
        };
        Set(text,obj){
            if(obj === undefined){
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
            }
            obj.innerHTML = text;
        };
        Add(text,obj){
            if(obj === undefined){
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
            }
            if(obj.innerHTML == ""){
                obj.innerHTML = text;
            }else{
                obj.innerHTML += "\n" + text;
            }
        };
        Clear(obj){
            if(obj === undefined){
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
            }
            obj.innerHTML = "";
        };
        BG(status,obj){
            if(obj === undefined){
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
            }
            let color = "#FFFFFF";
            switch (status) {
                case "normal":
                    color = "#FFFFFF";
                    break;
                case "running":
                    color = "#FFCC80";
                    break;
                case "success":
                    color = "#91FFC2";
                    break;
                case "error":
                    color = "#F45A8D";
                    break;
                default:
                    color = "#FFFFFF";
                    break;
            }
            obj.style.backgroundColor = color;
        }
    };
    let UFA = class{
        constructor(uid,all_count){
            this.uid = uid;
            this.name = "";
            this.all_count = all_count;
            this.imglist = [];
            this.index = 0;
            this.indexA = 0;
            this.DownSend = false;
            this.HaveDownFail = false;
            this.Mode = 0;// 0：相册 1：视频
            if(uid === undefined){
                this.uid = this.load_uid()
            }
        };
        load_uid(){
            return window.location.pathname.split("/")[1];
        };
        load_all_count(uid,Mode){
            if(uid === undefined){
                uid = this.uid;
            }
            if(Mode === undefined){
                Mode = this.Mode;
            }
            if (Mode == 0) {
                HTTPsend("https://api.vc.bilibili.com/link_draw/v1/doc/upload_count?uid="+uid,"GET","",(result)=>{
                    let rdata = JSON_parse(result);
                    if(rdata.code == 0){
                        if (rdata.data.all_count != 0) {
                            this.set_all_count(rdata.data.all_count,Mode);
                        }else{
                            Console_log("空的");
                            lists.Set("空的");
                        }
                    }else{
                        Console_error(result);
                    }
                });
            }else if(Mode == 1){
                HTTPsend("https://api.bilibili.com/x/space/navnum?mid="+uid,"GET","",(result)=>{
                    let rdata = JSON_parse(result);
                    if(rdata.code == 0){
                        if (rdata.data.video != 0) {
                            this.set_all_count(rdata.data.video,Mode);
                        }else{
                            Console_log("空的");
                            lists.Set("空的");
                        }
                    }else{
                        Console_error(result);
                    }
                });
            }else if(Mode == 2){
                this.index = 0;
                this.imglist = [];
                HTTPsend("https://api.bilibili.com/x/space/acc/info?mid="+this.uid,"GET","",(result)=>{
                    let rdata = JSON_parse(result);
                    if(rdata.code == 0){
                        this.name = rdata.data.name;
                        let face = rdata.data.face;
                        let bg = rdata.data.top_photo;
                        // let time = Math.round(new Date().getTime()/1000).toString();
                        HTTPsend("https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld?mid="+this.uid,"GET","",(result2)=>{
                            let rdata2 = JSON_parse(result2);
                            if(rdata2.code == 0){
                                if (rdata2.data.roomid != 0) {
                                    HTTPsend("https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id="+rdata2.data.roomid,"GET","",(result3)=>{
                                        let rdata3 = JSON_parse(result3);
                                        if(rdata3.code == 0){
                                            let cover = rdata3.data.room_info.cover;
                                            let background = rdata3.data.room_info.background;
                                            this.all_count = 1;
                                            this.add_img_FBLB(face,"face_"+getFileName(face));
                                            if (BG_Default.indexOf(getFileName(bg)) == -1) {
                                                this.all_count++;
                                                this.add_img_FBLB(bg,"bg_"+getFileName(bg));
                                            }
                                            if (cover != "") {
                                                this.all_count++;
                                                this.add_img_FBLB(cover,"livecover_"+getFileName(cover));
                                            }
                                            if (background != ""&&!(background.startsWith("http://static.hdslb.com/live-static/images/bg/")||background.startsWith("https://static.hdslb.com/live-static/images/bg/"))) {
                                                this.all_count++;
                                                this.add_img_FBLB(background,"livebg_"+getFileName(background));
                                            }
                                            this.index = this.all_count;
                                        }else{
                                            Console_error(result3);
                                        }
                                    });
                                }else{
                                    this.all_count = 1;
                                    this.add_img_FBLB(face,"face_"+getFileName(face));
                                    if (BG_Default.indexOf(getFileName(bg)) == -1) {
                                        this.all_count++;
                                        this.add_img_FBLB(bg,"bg_"+getFileName(bg));
                                    }
                                    this.index = this.all_count;
                                }
                            }else{
                                Console_error(result2);
                            }
                        });
                    }else{
                        Console_error(result);
                    }
                });
            }
        };
        set_all_count(all_count,Mode){
            if(all_count != undefined){
                this.all_count = all_count
            }
            if(Mode === undefined){
                Mode = this.Mode;
            }
            this.load_img_list(this.uid,this.all_count,Mode);
        };
        load_img_list(uid,all_count,Mode){
            if(uid === undefined){
                uid = this.uid;
            }
            if(all_count === undefined){
                all_count = this.all_count;
            }
            if(Mode === undefined){
                Mode = this.Mode;
            }
            if (Mode == 0) {
                setTimeout(()=>{
                    HTTPsend("https://api.vc.bilibili.com/link_draw/v1/doc/doc_list?uid="+uid+"&page_num=0&page_size="+all_count+"&biz=all","GET","",(result)=>{
                        let rdata = JSON_parse(result);
                        if(rdata.code == 0){
                            this.imglist = [];
                            this.index = 0;
                            rdata.data.items.forEach(element => {
                                if(element.count == 1){
                                    this.add_img(element.pictures[0].img_src,element.doc_id,0);
                                    this.index++;
                                }else if(element.count == element.pictures.length){
                                    let cou = 0;
                                    element.pictures.forEach(element2 => {
                                        this.add_img(element2.img_src,element.doc_id,cou);
                                        cou++;
                                    });
                                    this.index++;
                                }else{
                                    this.load_img_detail(element.doc_id);
                                }
                            });
                            setTimeout(()=>{Console_log("加载完成，有"+this.imglist.length+"个图片。");},1000);
                        }else{
                            Console_error(result);
                        }
                    });
                });
            }else if(Mode == 1){
                setTimeout(()=>{
                    let z = 1;
                    if (all_count>30) {
                        z = Math.ceil(all_count/30);
                    }
                    this.imglist = [];
                    this.index = 0;
                    for (let i = 1; i <= z; i++) {
                        HTTPsend("https://api.bilibili.com/x/space/arc/search?mid="+uid+"&ps=30&tid=0&pn="+i+"&keyword=&order=pubdate","GET","",(result)=>{
                            let rdata = JSON_parse(result);
                            if(rdata.code == 0){
                                rdata.data.list.vlist.forEach(element => {
                                    if (element.pic.startsWith("//")) {
                                        this.add_img_video("https:"+element.pic,element.aid);
                                    }else if (element.pic.startsWith("http:")||element.pic.startsWith("https:")) {
                                        this.add_img_video(element.pic,element.aid);
                                    }else{
                                        this.add_img_video(element.pic,element.aid);
                                    }
                                    this.index++;
                                });
                            }else{
                                Console_error(result);
                            }
                            i==z&&setTimeout(()=>{Console_log("加载完成，有"+all_count+"个图片。");},1000);
                        });
                    }
                });
            }
        };
        load_img_detail(doc_id){
            HTTPsend("https://api.vc.bilibili.com/link_draw/v1/doc/detail?doc_id="+doc_id,"GET","",(result)=>{
                let rdata = JSON_parse(result);
                if(rdata.code == 0){
                    let cou = 0;
                    rdata.data.item.pictures.forEach(element => {
                        this.add_img(element.img_src,doc_id,cou);
                        cou++;
                    });
                    this.index++;
                }else{
                    Console_error(result);
                }
            });
 
        };
        add_img(url,doc_id,cou){
            this.imglist.push({url:url,doc_id:doc_id,cou:cou});
        };
        add_img_video(url,aid){
            this.imglist.push({url:url,aid:aid});
        }
        add_img_FBLB(url,name){
            this.imglist.push({url:url,name:name});
        }
        send_aria2(){
            this.DownSend = true;
            let indexA = this.indexA;
            indexA++;
            Console_Devlog(indexA+"，"+this.imglist.length);
            if(indexA<=this.imglist.length){
                Console_Devlog("正在发送第"+indexA+"张图片。");
                lists.Set("正在发送第"+indexA+"张图片。");
                if(this.Mode == 0){
                    let url = this.imglist[this.indexA].url;
                    let doc_id = this.imglist[this.indexA].doc_id.toString();
                    let cou = this.imglist[this.indexA].cou.toString()
                    setTimeout(()=>{
                        addToAria([url],doc_id+"_"+cou+getType(url),"https://h.bilibili.com/"+doc_id,true,[],()=>{
                        },()=>{
                            Console_error("发送到Aria2失败了，请检查相关设置吧。。。。");
                            lists.Set("发送到Aria2失败了，请检查相关设置吧。。。。");
                        });
                        uFA.indexA++;
                        uFA.send_aria2();
                    },5);
                }else if(this.Mode == 1){
                    let url = this.imglist[this.indexA].url;
                    let aid = this.imglist[this.indexA].aid.toString();
                    setTimeout(()=>{
                        addToAria([url],"av"+aid+getType(url),"https://space.bilibili.com/"+this.uid+"/video",true,[],()=>{
                        },()=>{
                            Console_error("发送到Aria2失败了，请检查相关设置吧。。。。");
                            lists.Set("发送到Aria2失败了，请检查相关设置吧。。。。");
                        });
                        uFA.indexA++;
                        uFA.send_aria2();
                    },5);
                }else if(this.Mode == 2){
                    let url = this.imglist[this.indexA].url;
                    let name = this.imglist[this.indexA].name;
                    setTimeout(()=>{
                        addToAria([url],name,"https://space.bilibili.com/"+this.uid+"/video",true,[],()=>{
                            // bug: 此处没法执行callback
                        },()=>{
                            Console_error("发送到Aria2失败了，请检查相关设置吧。。。。");
                            lists.Set("发送到Aria2失败了，请检查相关设置吧。。。。");
                        });
                        uFA.indexA++;
                        uFA.send_aria2();
                    },5);
                }
            }else{
                this.DownSend = false;
                MBBtn(true);
                Console_log("发送完成。");
                lists.Set("发送完成。");
                lists.BG("success");
            }
        };
        send_blob(){
            this.DownSend = true;
            let indexA = this.indexA;
            indexA++;
            if(indexA<=this.imglist.length){
                Console_Devlog("正在获取第"+indexA+"张图片。");
                lists.Set("正在获取第"+indexA+"张图片。");
                if (this.Mode == 0) {
                    let url = this.imglist[this.indexA].url;
                    let doc_id = this.imglist[this.indexA].doc_id.toString();
                    let cou = this.imglist[this.indexA].cou.toString()
                    setTimeout(()=>{
                        loadToBlob(url,(blobFile)=>{
                            if (blobFile) {
                                zip.file(doc_id+"_"+cou+getType(url),blobFile,{binary:true});
                                this.indexA++;
                                uFA.send_blob();
                            }else{
                                this.HaveDownFail = true;
                                Console_error("相簿 https://h.bilibili.com/"+doc_id+" 下的第 "+cou+" 张图片下载失败了。。。");
                                this.indexA++;
                                uFA.send_blob();
                            }
                        });
                    },5);
                } else if(this.Mode == 1) {
                    let url = this.imglist[this.indexA].url;
                    let aid = this.imglist[this.indexA].aid.toString();
                    setTimeout(()=>{
                        loadToBlob(url,(blobFile)=>{
                            if (blobFile) {
                                zip.file("av"+aid+getType(url),blobFile,{binary:true});
                                this.indexA++;
                                uFA.send_blob();
                            }else{
                                this.HaveDownFail = true;
                                Console_error("视频 https://www.bilibili.com/video/av"+aid+" 的封面下载失败了。。。");
                                this.indexA++;
                                uFA.send_blob();
                            }
                        });
                    },5);
                } else if(this.Mode == 2){
                    let url = this.imglist[this.indexA].url;
                    let name = this.imglist[this.indexA].name;
                    setTimeout(()=>{
                        loadToBlob(url,(blobFile)=>{
                            if (blobFile) {
                                zip.file(name,blobFile,{binary:true});
                                this.indexA++;
                                uFA.send_blob();
                            }else{
                                this.HaveDownFail = true;
                                Console_error("视频 https://www.bilibili.com/video/av"+aid+" 的封面下载失败了。。。");
                                this.indexA++;
                                uFA.send_blob();
                            }
                        });
                    },5);
                }
            }else{
                HTTPsend("https://api.bilibili.com/x/space/acc/info?mid="+uFA.uid,"GET","",(result)=>{
                    let rdata = JSON_parse(result);
                    if(rdata.code == 0){
                        this.name = rdata.data.name;
                        let name = this.name;
                        zip.generateAsync({type:"blob"}).then((content)=>{
                            // see FileSaver.js
                            let zipname = name+"_"+this.uid;
                            if(this.Mode == 0){
                                zipname += "_相册";
                            }else if (this.Mode == 1) {
                                zipname += "_视频封面";
                            }else if (this.Mode == 2){
                                zipname += "_头图及壁纸";
                            }
                            Console_log("正在打包成 "+zipname+".zip 中");
                            lists.Set("正在打包成 "+zipname+".zip 中");
                            let a = document.createElement('a');
                            a.innerHTML = zipname;
                            a.download = zipname;
                            a.href = URL.createObjectURL(content);
                            a.addEventListener("click",function(){document.body.removeChild(a)});
                            document.body.appendChild(a);
                            a.click();
                            this.DownSend = false;
                            MBBtn(true);
                            if(!this.HaveDownFail){
                                lists.Set("打包 "+zipname+".zip 完成。");
                                lists.BG("success");
                            }else{
                                lists.Set("打包 "+zipname+".zip 完成，但有些文件下载失败了，详细请查看控制台orz");
                                lists.BG("error");
                            }
                        });
                    }else{
                        Console_error(result);
                    }
                });
            }
        }
    }
    let zip = new JSZip();
    let uFA = new UFA();
    CreactMenu();
    CreactUI();
    document.getElementById("Bili8-UI").style.display = "none";
    let lists = new List();
})();
(function() {
    'use strict';
 
    $("body").append("<button id='btn' style='position:fixed;left:5px;top:200px;z-index:999999'>提取</button>");
 
    $("#btn").click(function() {
		var str = "";
		$(".WB_detail").each(function() {
			str += $(this).find(".WB_from .S_txt2:first").text().trim() + "<br>";
            str += $(this).find(".WB_text").text().trim() + "<br>";
		});
        window.open().document.write(str);
    });
 
})();
(function() {
 
   var doDownload = function(blob, filename) {
       var a = document.createElement('a');
       a.download = filename;
       a.href = blob;
       a.click();
  }
 
  var download = function (url, filename) {
     if (!filename) filename = url.split('\\').pop().split('/').pop();
     fetch(url, {
        headers: new Headers({
          'Origin': location.origin
      }),
       mode: 'cors'
     })
    .then(response => response.blob())
    .then(blob => {
      let blobUrl = window.URL.createObjectURL(blob);
      doDownload(blobUrl, filename);
    })
    .catch(e => {console.error(e); return false;});
 
    return true;
  }
 
  var toast = function(text, duration) {
     if(isNaN(duration)) duration = 1500;
      let _toast = document.createElement('div');
      _toast.innerText = text;
      _toast.style.cssText = 'width: 60%; height:50px; line-height: 50px; min-width:100px;text-align: center; font-size: 15px;' +
      'position: fixed; top: 60%; left: 40%; background: rgb(0,0,0); color:rgb(255,255,255); opacity:0.75; z-index: 999';
      document.body.children[0].appendChild(_toast);
 
      _toast.style.transition = 'all 0.7s';
      _toast.style.webkitTransition = 'all 0.7s';
 
      setTimeout(function() {
          _toast.style.opacity = 0;
          setTimeout(()=> { document.body.children[0].removeChild(_toast);},700);
 
      }, duration);
  }
 
  var globalValue = "";
  var inputBoxDict = new Map();
  var proceedList = new WeakSet();
  var imgPathReg = new RegExp("(https://[\\S]+/)([\\S]+)(/[\\S]+)");
 
  var buttonOnClick = function(e) {
      let buttonData = inputBoxDict.get(this); // path
      let inputName = this.previousSibling.value && this.previousSibling.value.split('@')[0];
 
      let fileName = (inputName && inputName + '_') + 'wb_' + buttonData[0] + '_' + buttonData[1];
 
      var imgList = this.parentNode.parentNode.getElementsByClassName('media_box')[0].children[0].children; // media_box > ul >li
      let pages = this.previousSibling.value.split('@')[1];
      let temp = /[0-9]*/.exec(pages);
      pages = temp && temp[0];
      let mask = new Uint8Array(imgList.length);
      if(!pages){
         mask.fill(1);
      }
      else {
        console.log(pages, '_', pages.length);
        for(var i = 0; i < pages.length; i++) {
          let num = pages[i] - 1;
          if(num > mask.length || num < 0) continue;
          mask[num] = 1;
        }
      }
      console.log(mask);
      let firstMediaClass = imgList[0].classList[0];
      if(firstMediaClass === 'WB_video') {
          let videoElem = imgList[0].getElementsByTagName('video')[0];
          let result = download(videoElem.src, fileName);
          if(result === false) {toast('下载出错，详见控制台');}
          else {toast('下载开始');}
          return;
      }
      var failedList = [];
      for(var j = 0; j < imgList.length; j++) {
          if(mask[j] === 0) continue;
          let result = true;
          let child = imgList[j].children[0];
          var imgsrc = '';
          if(child.tagName === 'IMG') {
              imgsrc = child.src.replace(imgPathReg,'$1large$3'); // replace ....sinaming.cn/XXX/YYY.jpg' with '...sinaimg.cn/large/YYY.jpg'
              result = download(imgsrc, fileName + '_' + j);
          }
          else {
              imgsrc = child.children[0].src.replace(imgPathReg, '$1large$3');
              result = download(imgsrc, fileName + '_' + j + '.gif');
          }
          if(result === false) failedList.push(j+1);
      }
      if(failedList.length !== 0) {
         toast('第 ' + failedList + ' 下失败，详见控制台');
      }
      else {
         toast('全部下载开始');
      }
  }
 
  var getWeiboPath = function(media_box) {
      var path = "";
      if(media_box.parentNode.nextElementSibling &&
           media_box.parentNode.nextElementSibling.classList.contains('WB_func')) {
         path = media_box.parentNode.nextElementSibling.children[0].children[0].children[0].children[0].children[0].href;
         // let date = media_box.parentNode.nextElementSibling.children[0].children[0].children[0].children[0].children[0].title;
         path = path.split("?")[0].split("/").slice(3,5);
      }
      else {
         path = media_box.parentNode.parentNode.children[1].children[0].href;
         path = path.split("?")[0].split("/").slice(3,5);
 
      }
      return path;
 
  }
 
  var addFunction = function(){
        var lists = document.getElementsByClassName('media_box');
        console.log('media_box list.length = ' + lists.length);
        for( var i = 0; i < lists.length; i++) {
            var list = lists[i].parentNode.parentNode.children[1];
            if(proceedList.has(list)) {
               continue;
            }
            proceedList.add(list);
            var inputBox = document.createElement('input');
            inputBox.style.width = '20%';
            inputBox.style.height = '70%';
            inputBox.style.float = "right";
            inputBox.style.marginLeft = '5px';
            inputBox.style.opacity = "0.2";
 
            var button = document.createElement('a');
            button.setAttribute('class','S_txt2');
            button.innerText = '下载图片';
            button.href = 'javascript:void(0)';
            button.input = inputBox;
 
            var path = getWeiboPath(lists[i]);
            button.onclick = buttonOnClick;
            button.style.float = "right";
 
            inputBoxDict.set(button,path);
 
            list.appendChild(inputBox);
            list.appendChild(button);
        }
    }
    window.addEventListener ("load", ()=>{
                             setTimeout(addFunction,1000);
    });
 
   (function () {
    var DOMObserverTimer = false;
    var DOMObserverConfig = {
      attributes: true,
      childList: true,
      subtree: true
    };
    var DOMObserver = new MutationObserver(function () {
      if (DOMObserverTimer !== 'false') {
        clearTimeout(DOMObserverTimer);
      }
      DOMObserverTimer = setTimeout(function () {
        DOMObserver.disconnect();
        addFunction();
        DOMObserver.observe(document.body, DOMObserverConfig);
      }, 1000);
    });
    DOMObserver.observe(document.body, DOMObserverConfig);
  }) ();
 
})();
(function() {
    'use strict';
    GM_setValue('dialog',true);
    GM_setValue('URLs',location.href);
    var $ = window.jQuery;
    var timer = setInterval(function(){
        GM_setValue('oldHeight',$(document).height());
        if(GM_getValue('URLs') != location.href && $('div.PdwC2.fXiEu.s2MYR').length && onChangeURL()){
            console.log('isDialog');
            onReadyMyDW(false);
            GM_setValue('URLs',location.href);
        }
        if($('article ._97aPb[data-snig="canDownload"]').length==0 && onChangeURL() && !$('div._2dDPU[role="dialog"]').length){
            console.log(true);
            onReadyMyDW(true);
        }
        if($('div#react-root section._9eogI._01nki.lXJWB').length && onChangeStoryURL()){
            onStoryDW(false);
        }
        else{
            $('.IG_DWSTORY').remove();
        }
        if(!$('.AutoDownload_dom').length){
            var ckValue = (GM_getValue('AutoDownload'))?'checked':'';
            $('body .ctQZg').append('<div class="AutoDownload_dom" style="position: absolute;left:15px;top:0px;padding:6px;line-height:1;background:#fff;border-radius: 50%;"><label title="Checking it will direct download current photos in the posts." style="cursor:help;"><input type="checkbox" value="1" class="AutoDownload" name="AutoDownload" '+ckValue+' />DDL</label></div>');
        }
 
    },500);
    $(document).scroll(function(){
        if(GM_getValue('oldHeight') != $(this).height()){
            console.log('onChange');
            onReadyMyDW();
        }
    });
    function onStoryDW(a){
        if(a){
            if($('video.y-yJ5').length){
                window.open($('video.y-yJ5 source').attr('src')+'&dl=1');
            }
            else{
                window.open($('img.y-yJ5').attr('src')+'&dl=1');
            }
        }
        else{
            var style = "position: absolute;right:-40px;top:15px;padding:5px;line-height:1;background:#fff;border-radius: 5px;cursor:pointer;";
            if(!$('.IG_DWSTORY').length){
                $('div#react-root section._8XqED').append('<div class="IG_DWSTORY" style="'+style+'"><svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64    c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472    c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z"/></g></g><g><g><path d="M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z"/></g></g></div>')
            }
        }
    }
    function onChangeURL(){
        var reA = /^(https:\/\/www.instagram.com\/p\/)/g;
        var reB = /^(https:\/\/www.instagram.com\/)$/g;
        var URLs = location.href;
        if(URLs.match(reA) || URLs.match(reB)){
            return true;
        }
    }
    function onChangeStoryURL(){
        var re = /^(https:\/\/www.instagram.com\/stories\/)/g;
        var URLs = location.href;
        if(URLs.match(re)){
            return true;
        }
    }
    function onReadyMyDW(NoDialog){
        if(!NoDialog){
            $('article ._97aPb').each(function(){
                $(this).removeAttr('data-snig');
                $(this).unbind('click');
            });
            $('.SNKMS_IG_DW_MAIN,.SNKMS_IG_DW_MAIN_VIDEO').remove();
        }
        $('article ._97aPb').each(function(){
            if(!$(this).attr('data-snig')){
                var style = "position: absolute;right:15px;top:15px;padding:6px;line-height:1;background:#fff;border-radius: 50%;cursor:pointer;";
                $(this).append('<div title="Download" class="SNKMS_IG_DW_MAIN" style="'+style+'"><svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64    c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472    c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z"/></g></g><g><g><path d="M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z"/></g></g></div>');
                $(this).on('click','.SNKMS_IG_DW_MAIN',function(e){
                    GM_setValue('Index',0);
                    IG_createDM(GM_getValue('AutoDownload'));
 
                    var style = 'margin:5px 0px;padding:5px 0px;color:#111;font-size:1rem;line-height:1rem;text-align:center;border:1px solid #000;border-radius: 5px;';
                    var i = 0;
                    $(this).parent().find('video.tWeCl').each(function(){
                        i++;
                        GM_setValue('Index',GM_getValue('Index')+1);
                        console.log($(this).attr('src'));
                        $('.IG_SN_DIG .IG_SN_DIG_MAIN').append('<a data-globalIndex="'+GM_getValue('Index')+'" style="'+style+'" target="_blank" href="'+$(this).attr('src')+'&dl=1"><img width="100" src="'+$(this).next().attr('src')+'" /><br/>Video '+i+'</a>');
 
                    });
                    var n = 0;
                    $(this).parent().find('.FFVAD').each(function(){
                        n++;
                        GM_setValue('Index',GM_getValue('Index')+1);
                        console.log($(this).attr('src'));
                        $('.IG_SN_DIG .IG_SN_DIG_MAIN').append('<a data-globalIndex="'+GM_getValue('Index')+'" style="'+style+'" target="_blank" href="'+$(this).attr('src')+'&dl=1"><img width="100" src="'+$(this).attr('src')+'" /><br/>Image '+n+'</a>');
                    });
                    if(GM_getValue('AutoDownload')){
                        GM_setValue('GB_Index',0);
                        var LeftButton = $(this).parent().find('button.POSa_').length;
                        var RightButton = $(this).parent().find('button._6CZji').length;
 
                        if(LeftButton && !RightButton){
                            GM_setValue('GB_Index',2);
                        }
                        else if(!LeftButton && RightButton){
                            GM_setValue('GB_Index',1);
                        }
                        else if(!LeftButton && !RightButton){
                            GM_setValue('GB_Index',1);
                        }
                        else{
                            GM_setValue('GB_Index',2);
                        }
                        window.open($('.IG_SN_DIG').find('a[data-globalindex="'+GM_getValue('GB_Index')+'"]').attr('href'));
 
                        $('.IG_SN_DIG').remove();
                    }
                });
                $(this).attr('data-snig','canDownload');
            }
        });
    }
    function IG_createDM(a){
        var style = (!a)?"position: fixed;left: 0px;right: 0px;bottom: 0px;top: 0px;":"display:none;";
        $('body').append('<div class="IG_SN_DIG" style="'+style+';z-index: 500;"><div class="IG_SN_DIG_BG" style="'+style+'z-index:502;background: rgba(0,0,0,.75);"></div><div class="IG_SN_DIG_MAIN" style="z-index: 510;padding:10px 15px;top:7%;position: absolute;left: 50%;transform: translateX(-50%);width: 500px;min-height: 200px;background:#fff;border-radius: 15px;"></div></div>');
        $('.IG_SN_DIG .IG_SN_DIG_MAIN').append('<div style="position:relative;height:36px;line-height:36px;">Alt+Q [Close]<svg width="26" height="26" class="IG_SN_DIG_BTN" style="cursor:pointer;position:absolute;right:0px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 492 492"  xml:space="preserve"><g><g><path d="M300.188,246L484.14,62.04c5.06-5.064,7.852-11.82,7.86-19.024c0-7.208-2.792-13.972-7.86-19.028L468.02,7.872    c-5.068-5.076-11.824-7.856-19.036-7.856c-7.2,0-13.956,2.78-19.024,7.856L246.008,191.82L62.048,7.872    c-5.06-5.076-11.82-7.856-19.028-7.856c-7.2,0-13.96,2.78-19.02,7.856L7.872,23.988c-10.496,10.496-10.496,27.568,0,38.052    L191.828,246L7.872,429.952c-5.064,5.072-7.852,11.828-7.852,19.032c0,7.204,2.788,13.96,7.852,19.028l16.124,16.116    c5.06,5.072,11.824,7.856,19.02,7.856c7.208,0,13.968-2.784,19.028-7.856l183.96-183.952l183.952,183.952    c5.068,5.072,11.824,7.856,19.024,7.856h0.008c7.204,0,13.96-2.784,19.028-7.856l16.12-16.116    c5.06-5.064,7.852-11.824,7.852-19.028c0-7.204-2.792-13.96-7.852-19.028L300.188,246z"/></g></g></svg></div>');
    }
    $(function(){
        onReadyMyDW();
        $('body').on('click','.IG_SN_DIG_BTN,.IG_SN_DIG_BG',function(){
            $('.IG_SN_DIG').remove();
        });
        $(window).keydown(function(e){
            if (e.keyCode == '81' && e.altKey){
                $('.IG_SN_DIG').remove();
                e.preventDefault();
            }
        });
        $('body').on('click','.AutoDownload',function(){
            if($('.AutoDownload:checked').length){
                GM_setValue('AutoDownload',true);
            }
            else{
                GM_setValue('AutoDownload',false);
            }
        });
        $('body').on('click','.IG_DWSTORY',function(){
            onStoryDW(true);
        });
    });
 
})();
(function() {
    'use strict';
    const iconDownload = `<svg width="24" height="24" viewBox="0 0 512 512"><g><g><path d="M472,313v139c0,11.028-8.972,20-20,20H60c-11.028,0-20-8.972-20-20V313H0v139c0,33.084,26.916,60,60,60h392 c33.084,0,60-26.916,60-60V313H472z"></path></g></g><g><g><polygon points="352,235.716 276,311.716 276,0 236,0 236,311.716 160,235.716 131.716,264 256,388.284 380.284,264"></polygon></g></g></svg>`;
    const iconNewtab = `<svg width="24" height="24" viewBox="0 0 482.239 482.239"><path d="m465.016 0h-344.456c-9.52 0-17.223 7.703-17.223 17.223v86.114h-86.114c-9.52 0-17.223 7.703-17.223 17.223v344.456c0 9.52 7.703 17.223 17.223 17.223h344.456c9.52 0 17.223-7.703 17.223-17.223v-86.114h86.114c9.52 0 17.223-7.703 17.223-17.223v-344.456c0-9.52-7.703-17.223-17.223-17.223zm-120.56 447.793h-310.01v-310.01h310.011v310.01zm103.337-103.337h-68.891v-223.896c0-9.52-7.703-17.223-17.223-17.223h-223.896v-68.891h310.011v310.01z"></path></svg>`;
    let currentUrl = document.location.href;
    let updating = false;
 
    init(10);
 
    locationChange();
 
    window.addEventListener("scroll", update);
 
    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(addButton, 500 * i);
            setTimeout(checkSort, 500 * i);
        }
    }
 
    function addButton() {
        document.querySelectorAll("section.ltpMr.Slqrh:not(.section-set)").forEach(panel => {
            panel.classList.add("section-set");
            const isFirefox = typeof InstallTrigger !== 'undefined';
            if (!isFirefox) setButton(panel, "download-set", iconDownload);
            setButton(panel, "newtab-set", iconNewtab);
        });
    }
 
    function checkSort() {
        document.querySelectorAll("section.ltpMr.Slqrh.section-set").forEach(function(panel) {
            const count = panel.childElementCount;
            const penultimate = panel.children[count - 2];
            if (!penultimate.className.includes("wpO6b")) return;
            const custom = panel.querySelector(".dCJp8");
            panel.insertBefore(penultimate, custom);
        });
    }
 
    function setButton(panel, myClass, icon) {
        const button = document.createElement("button");
        button.className = `dCJp8 afkep ${myClass}`;
        button.innerHTML = icon;
        button.addEventListener("click", onClick);
        panel.lastElementChild.before(button);
    }
 
    function onClick() {
        const parent = this.closest(".eo2As").previousElementSibling;
        const single = !parent.querySelectorAll("._3eoV-.IjCL9").length;
        // photo: .FFVAD
        // video: video
        const files = !!parent.querySelectorAll(".FFVAD").length ? parent.querySelectorAll(".FFVAD") : parent.querySelectorAll("video");
        const link = single ? files[0].src : detectIndex(parent, files);
        download(this.className.includes("download"), link, this.closest("article"));
    }
 
    function detectIndex(parent, files) {
        const prev = parent.querySelectorAll(".POSa_").length;
        const next = parent.querySelectorAll("._6CZji").length;
        if (!prev && !!next) return files[0].src;
        else return files[1].src;
    }
 
    function download(isDownload, link, article) {
        if (isDownload) {
            fetch(link).then(t => {
                return t.blob().then(b => {
                    const a = document.createElement("a");
                    const name = `${getUser(article)}_${getTime(article)}${getIndex(article)}`;
                    a.href = URL.createObjectURL(b);
                    a.setAttribute("download", name);
                    a.click();
                });
            });
        } else {
            const tab = window.open(link, '_blank');
            tab.focus();
        }
    }
    function getUser(article) {
        return article.querySelector(".e1e1d a").innerText.replace(".", "-");
    }
 
    function getTime(article) {
        const date = article.querySelector("time").dateTime.split(/[-,T]/);
        return `${date[0]}${date[1]}${date[2]}`;
    }
 
    function getIndex(article) {
        const index = article.querySelectorAll(".Yi5aA");
        if (index.length > 1) {
            // multiple
            return `-${[...index].findIndex(index => index.classList.contains("XCodT")) + 1}`;
        } else {
            // single
            return "";
        }
    }
 
    function update() {
        if (updating) return;
        updating = true;
        init(3);
        setTimeout(() => { updating = false; }, 1000);
    }
 
    function locationChange() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (currentUrl != document.location.href) {
                    currentUrl = document.location.href;
                    init(10);
                }
            });
        });
        const target = document.querySelector("body");
        const config = { childList: true, subtree: true };
        observer.observe(target, config);
    }
 
})();
    ;(() => {
  const gv = {
    isFull: false,
    isIframe: false,
    autoCheckCount: 0,
  }
 
  const html5Rules = {
    "www.acfun.cn": [".player-container .player"],
    "www.bilibili.com": ["#bilibiliPlayer"],
    "www.douyu.com": ["#js-player-video-case"],
    "www.huya.com": ["#videoContainer"],
    "www.twitch.tv": [".player"],
    "www.youtube.com": ["#movie_player"],
    "www.yy.com": ["#player"],
    "*weibo.com": ['[aria-label="Video Player"]', ".html5-video-live .html5-video"],
    "v.huya.com": ["#video_embed_flash>div"],
  }
  const generalPlayerRules = [".dplayer", ".video-js", ".jwplayer", "[data-player]"]
 
  if (window.top !== window.self) {
    gv.isIframe = true
  }
 
  if (navigator.language.toLocaleLowerCase() == "zh-cn") {
    gv.btnText = {
      max: "网页全屏",
      pip: "画中画",
      tip: "Iframe内视频，请用鼠标点击视频后重试",
    }
  } else {
    gv.btnText = {
      max: "Maximize",
      pip: "PicInPic",
      tip: "Iframe video. Please click on the video and try again",
    }
  }
 
  const tool = {
    print(log) {
      const now = new Date()
      const year = now.getFullYear()
      const month = (now.getMonth() + 1 < 10 ? "0" : "") + (now.getMonth() + 1)
      const day = (now.getDate() < 10 ? "0" : "") + now.getDate()
      const hour = (now.getHours() < 10 ? "0" : "") + now.getHours()
      const minute = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes()
      const second = (now.getSeconds() < 10 ? "0" : "") + now.getSeconds()
      const timenow = "[" + year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + "]"
      console.log(timenow + "[Maximize Video] > " + log)
    },
    getRect(element) {
      const rect = element.getBoundingClientRect()
      const scroll = tool.getScroll()
      return {
        pageX: rect.left + scroll.left,
        pageY: rect.top + scroll.top,
        screenX: rect.left,
        screenY: rect.top,
      }
    },
    isHalfFullClient(element) {
      const client = tool.getClient()
      const rect = tool.getRect(element)
      if (
        (Math.abs(client.width - element.offsetWidth) < 21 && rect.screenX < 20) ||
        (Math.abs(client.height - element.offsetHeight) < 21 && rect.screenY < 10)
      ) {
        if (
          Math.abs(element.offsetWidth / 2 + rect.screenX - client.width / 2) < 21 &&
          Math.abs(element.offsetHeight / 2 + rect.screenY - client.height / 2) < 21
        ) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    isAllFullClient(element) {
      const client = tool.getClient()
      const rect = tool.getRect(element)
      if (
        Math.abs(client.width - element.offsetWidth) < 21 &&
        rect.screenX < 20 &&
        Math.abs(client.height - element.offsetHeight) < 21 &&
        rect.screenY < 10
      ) {
        return true
      } else {
        return false
      }
    },
    getScroll() {
      return {
        left: document.documentElement.scrollLeft || document.body.scrollLeft,
        top: document.documentElement.scrollTop || document.body.scrollTop,
      }
    },
    getClient() {
      return {
        width: document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth : document.body.clientWidth,
        height: document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight,
      }
    },
    addStyle(css) {
      const style = document.createElement("style")
      style.type = "text/css"
      const node = document.createTextNode(css)
      style.appendChild(node)
      document.head.appendChild(style)
      return style
    },
    matchRule(str, rule) {
      return new RegExp("^" + rule.split("*").join(".*") + "$").test(str)
    },
    createButton(id) {
      const btn = document.createElement("tbdiv")
      btn.id = id
      btn.onclick = () => {
        maximize.playerControl()
      }
      document.body.appendChild(btn)
      return btn
    },
    async addTip(str) {
      if (!document.getElementById("catTip")) {
        const tip = document.createElement("tbdiv")
        tip.id = "catTip"
        tip.innerHTML = str
        ;(tip.style.cssText =
          'transition: all 0.8s ease-out;background: none repeat scroll 0 0 #27a9d8;color: #FFFFFF;font: 1.1em "微软雅黑";margin-left: -250px;overflow: hidden;padding: 10px;position: fixed;text-align: center;bottom: 100px;z-index: 300;'),
          document.body.appendChild(tip)
        tip.style.right = -tip.offsetWidth - 5 + "px"
        await new Promise((resolve) => {
          tip.style.display = "block"
          setTimeout(() => {
            tip.style.right = "25px"
            resolve("OK")
          }, 300)
        })
        await new Promise((resolve) => {
          setTimeout(() => {
            tip.style.right = -tip.offsetWidth - 5 + "px"
            resolve("OK")
          }, 3500)
        })
        await new Promise((resolve) => {
          setTimeout(() => {
            document.body.removeChild(tip)
            resolve("OK")
          }, 1000)
        })
      }
    },
  }
 
  const setButton = {
    init() {
      if (!document.getElementById("playerControlBtn")) {
        init()
      }
      if (gv.isIframe && tool.isHalfFullClient(gv.player)) {
        window.parent.postMessage("iframeVideo", "*")
        return
      }
      this.show()
    },
    show() {
      gv.player.removeEventListener("mouseleave", handle.leavePlayer, false)
      gv.player.addEventListener("mouseleave", handle.leavePlayer, false)
 
      if (!gv.isFull) {
        document.removeEventListener("scroll", handle.scrollFix, false)
        document.addEventListener("scroll", handle.scrollFix, false)
      }
      gv.controlBtn.style.display = "block"
      gv.controlBtn.style.visibility = "visible"
      if (document.pictureInPictureEnabled && gv.player.nodeName != "OBJECT" && gv.player.nodeName != "EMBED") {
        gv.picinpicBtn.style.display = "block"
        gv.picinpicBtn.style.visibility = "visible"
      }
      this.locate()
    },
    locate() {
      const playerRect = tool.getRect(gv.player)
      gv.controlBtn.style.opacity = "0.5"
      gv.controlBtn.innerHTML = gv.btnText.max
      gv.controlBtn.style.top = playerRect.screenY - 20 + "px"
      gv.controlBtn.style.left = playerRect.screenX - 64 + gv.player.offsetWidth + "px"
      gv.picinpicBtn.style.opacity = "0.5"
      gv.picinpicBtn.innerHTML = gv.btnText.pip
      gv.picinpicBtn.style.top = gv.controlBtn.style.top
      gv.picinpicBtn.style.left = playerRect.screenX - 64 + gv.player.offsetWidth - 54 + "px"
    },
  }
 
  const handle = {
    getPlayer(e) {
      if (gv.isFull) {
        return
      }
      gv.mouseoverEl = e.target
      const hostname = document.location.hostname
      let players = []
      for (let i in html5Rules) {
        if (tool.matchRule(hostname, i)) {
          for (let html5Rule of html5Rules[i]) {
            if (document.querySelectorAll(html5Rule).length > 0) {
              for (let player of document.querySelectorAll(html5Rule)) {
                players.push(player)
              }
            }
          }
          break
        }
      }
      if (players.length == 0) {
        for (let generalPlayerRule of generalPlayerRules) {
          if (document.querySelectorAll(generalPlayerRule).length > 0) {
            for (let player of document.querySelectorAll(generalPlayerRule)) {
              players.push(player)
            }
          }
        }
      }
      if (players.length == 0 && e.target.nodeName != "VIDEO" && document.querySelectorAll("video").length > 0) {
        const videos = document.querySelectorAll("video")
        for (let v of videos) {
          const vRect = v.getBoundingClientRect()
          if (
            e.clientX >= vRect.x - 2 &&
            e.clientX <= vRect.x + vRect.width + 2 &&
            e.clientY >= vRect.y - 2 &&
            e.clientY <= vRect.y + vRect.height + 2 &&
            v.offsetWidth > 399 &&
            v.offsetHeight > 220
          ) {
            players = []
            players[0] = handle.autoCheck(v)
            gv.autoCheckCount = 1
            break
          }
        }
      }
      if (players.length > 0) {
        const path = e.path || e.composedPath()
        for (let v of players) {
          if (path.indexOf(v) > -1) {
            gv.player = v
            setButton.init()
            return
          }
        }
      }
      switch (e.target.nodeName) {
        case "VIDEO":
        case "OBJECT":
        case "EMBED":
          if (e.target.offsetWidth > 399 && e.target.offsetHeight > 220) {
            gv.player = e.target
            setButton.init()
          }
          break
        default:
          handle.leavePlayer()
      }
    },
    autoCheck(v) {
      let tempPlayer,
        el = v
      gv.playerChilds = []
      gv.playerChilds.push(v)
      while ((el = el.parentNode)) {
        if (Math.abs(v.offsetWidth - el.offsetWidth) < 15 && Math.abs(v.offsetHeight - el.offsetHeight) < 15) {
          tempPlayer = el
          gv.playerChilds.push(el)
        } else {
          break
        }
      }
      return tempPlayer
    },
    leavePlayer() {
      if (gv.controlBtn.style.visibility == "visible") {
        gv.controlBtn.style.opacity = ""
        gv.controlBtn.style.visibility = ""
        gv.picinpicBtn.style.opacity = ""
        gv.picinpicBtn.style.visibility = ""
        gv.player.removeEventListener("mouseleave", handle.leavePlayer, false)
        document.removeEventListener("scroll", handle.scrollFix, false)
      }
    },
    scrollFix(e) {
      clearTimeout(gv.scrollFixTimer)
      gv.scrollFixTimer = setTimeout(() => {
        setButton.locate()
      }, 20)
    },
    hotKey(e) {
      if (e.keyCode == 27) {
        maximize.playerControl()
      }
      if (e.keyCode == 113) {
        handle.pictureInPicture()
      }
    },
    async receiveMessage(e) {
      switch (e.data) {
        case "iframePicInPic":
          tool.print("messege:iframePicInPic")
          if (!document.pictureInPictureElement) {
            await document
              .querySelector("video")
              .requestPictureInPicture()
              .catch((error) => {
                tool.addTip(gv.btnText.tip)
              })
          } else {
            await document.exitPictureInPicture()
          }
          break
        case "iframeVideo":
          tool.print("messege:iframeVideo")
          if (!gv.isFull) {
            gv.player = gv.mouseoverEl
            setButton.init()
          }
          break
        case "parentFull":
          tool.print("messege:parentFull")
          gv.player = gv.mouseoverEl
          if (gv.isIframe) {
            window.parent.postMessage("parentFull", "*")
          }
          maximize.checkParent()
          maximize.fullWin()
          if (getComputedStyle(gv.player).left != "0px") {
            tool.addStyle("#htmlToothbrush #bodyToothbrush .playerToothbrush {left:0px !important;width:100vw !important;}")
          }
          gv.isFull = true
          break
        case "parentSmall":
          tool.print("messege:parentSmall")
          if (gv.isIframe) {
            window.parent.postMessage("parentSmall", "*")
          }
          maximize.smallWin()
          break
        case "innerFull":
          tool.print("messege:innerFull")
          if (gv.player.nodeName == "IFRAME") {
            gv.player.contentWindow.postMessage("innerFull", "*")
          }
          maximize.checkParent()
          maximize.fullWin()
          break
        case "innerSmall":
          tool.print("messege:innerSmall")
          if (gv.player.nodeName == "IFRAME") {
            gv.player.contentWindow.postMessage("innerSmall", "*")
          }
          maximize.smallWin()
          break
      }
    },
    pictureInPicture() {
      if (!document.pictureInPictureElement) {
        if (gv.player) {
          if (gv.player.nodeName == "IFRAME") {
            gv.player.contentWindow.postMessage("iframePicInPic", "*")
          } else {
            gv.player.parentNode.querySelector("video").requestPictureInPicture()
          }
        } else {
          document.querySelector("video").requestPictureInPicture()
        }
      } else {
        document.exitPictureInPicture()
      }
    },
  }
 
  const maximize = {
    playerControl() {
      if (!gv.player) {
        return
      }
      this.checkParent()
      if (!gv.isFull) {
        if (gv.isIframe) {
          window.parent.postMessage("parentFull", "*")
        }
        if (gv.player.nodeName == "IFRAME") {
          gv.player.contentWindow.postMessage("innerFull", "*")
        }
        this.fullWin()
        if (gv.autoCheckCount > 0 && !tool.isHalfFullClient(gv.playerChilds[0])) {
          if (gv.autoCheckCount > 10) {
            for (let v of gv.playerChilds) {
              v.classList.add("videoToothbrush")
            }
            return
          }
          const tempPlayer = handle.autoCheck(gv.playerChilds[0])
          gv.autoCheckCount++
          maximize.playerControl()
          gv.player = tempPlayer
          maximize.playerControl()
        } else {
          gv.autoCheckCount = 0
        }
      } else {
        if (gv.isIframe) {
          window.parent.postMessage("parentSmall", "*")
        }
        if (gv.player.nodeName == "IFRAME") {
          gv.player.contentWindow.postMessage("innerSmall", "*")
        }
        this.smallWin()
      }
    },
    checkParent() {
      if (gv.isFull) {
        return
      }
      gv.playerParents = []
      let full = gv.player
      while ((full = full.parentNode)) {
        if (full.nodeName == "BODY") {
          break
        }
        if (full.getAttribute) {
          gv.playerParents.push(full)
        }
      }
    },
    fullWin() {
      if (!gv.isFull) {
        document.removeEventListener("mouseover", handle.getPlayer, false)
        gv.backHtmlId = document.body.parentNode.id
        gv.backBodyId = document.body.id
        if (document.location.hostname == "www.youtube.com" && !document.querySelector("#player-theater-container #movie_player")) {
          document.querySelector("#movie_player .ytp-size-button").click()
          gv.ytbStageChange = true
        }
        gv.leftBtn.style.display = "block"
        gv.rightBtn.style.display = "block"
        gv.picinpicBtn.style.display = ""
        gv.controlBtn.style.display = ""
        this.addClass()
      }
      gv.isFull = true
    },
    addClass() {
      document.body.parentNode.id = "htmlToothbrush"
      document.body.id = "bodyToothbrush"
      for (let v of gv.playerParents) {
        v.classList.add("parentToothbrush")
        //父元素position:fixed会造成层级错乱
        if (getComputedStyle(v).position == "fixed") {
          v.classList.add("absoluteToothbrush")
        }
      }
      gv.player.classList.add("playerToothbrush")
      if (gv.player.nodeName == "VIDEO") {
        gv.backControls = gv.player.controls
        gv.player.controls = true
      }
      window.dispatchEvent(new Event("resize"))
    },
    smallWin() {
      document.body.parentNode.id = gv.backHtmlId
      document.body.id = gv.backBodyId
      for (let v of gv.playerParents) {
        v.classList.remove("parentToothbrush")
        v.classList.remove("absoluteToothbrush")
      }
      gv.player.classList.remove("playerToothbrush")
      if (document.location.hostname == "www.youtube.com" && gv.ytbStageChange && document.querySelector("#player-theater-container #movie_player")) {
        document.querySelector("#movie_player .ytp-size-button").click()
        gv.ytbStageChange = false
      }
      if (gv.player.nodeName == "VIDEO") {
        gv.player.controls = gv.backControls
      }
      gv.leftBtn.style.display = ""
      gv.rightBtn.style.display = ""
      gv.controlBtn.style.display = ""
      document.addEventListener("mouseover", handle.getPlayer, false)
      window.dispatchEvent(new Event("resize"))
      gv.isFull = false
    },
  }
 
  const init = () => {
    gv.picinpicBtn = document.createElement("tbdiv")
    gv.picinpicBtn.id = "picinpicBtn"
    gv.picinpicBtn.onclick = () => {
      handle.pictureInPicture()
    }
    document.body.appendChild(gv.picinpicBtn)
    gv.controlBtn = tool.createButton("playerControlBtn")
    gv.leftBtn = tool.createButton("leftFullStackButton")
    gv.rightBtn = tool.createButton("rightFullStackButton")
 
    if (getComputedStyle(gv.controlBtn).position != "fixed") {
      tool.addStyle(
        [
          "#htmlToothbrush #bodyToothbrush .parentToothbrush .bilibili-player-video {margin:0 !important;}",
          "#htmlToothbrush, #bodyToothbrush {overflow:hidden !important;zoom:100% !important;}",
          "#htmlToothbrush #bodyToothbrush .parentToothbrush {overflow:visible !important;z-index:auto !important;transform:none !important;-webkit-transform-style:flat !important;transition:none !important;contain:none !important;}",
          "#htmlToothbrush #bodyToothbrush .absoluteToothbrush {position:absolute !important;}",
          "#htmlToothbrush #bodyToothbrush .playerToothbrush {position:fixed !important;top:0px !important;left:0px !important;width:100vw !important;height:100vh !important;max-width:none !important;max-height:none !important;min-width:0 !important;min-height:0 !important;margin:0 !important;padding:0 !important;z-index:2147483646 !important;border:none !important;background-color:#000 !important;transform:none !important;}",
          "#htmlToothbrush #bodyToothbrush .parentToothbrush video {object-fit:contain !important;}",
          "#htmlToothbrush #bodyToothbrush .parentToothbrush .videoToothbrush {width:100vw !important;height:100vh !important;}",
          '#playerControlBtn {text-shadow: none;visibility:hidden;opacity:0;display:none;transition: all 0.5s ease;cursor: pointer;font: 12px "微软雅黑";margin:0;width:64px;height:20px;line-height:20px;border:none;text-align: center;position: fixed;z-index:2147483647;background-color: #27A9D8;color: #FFF;} #playerControlBtn:hover {visibility:visible;opacity:1;background-color:#2774D8;}',
          '#picinpicBtn {text-shadow: none;visibility:hidden;opacity:0;display:none;transition: all 0.5s ease;cursor: pointer;font: 12px "微软雅黑";margin:0;width:53px;height:20px;line-height:20px;border:none;text-align: center;position: fixed;z-index:2147483647;background-color: #27A9D8;color: #FFF;} #picinpicBtn:hover {visibility:visible;opacity:1;background-color:#2774D8;}',
          "#leftFullStackButton{display:none;position:fixed;width:1px;height:100vh;top:0;left:0;z-index:2147483647;background:#000;}",
          "#rightFullStackButton{display:none;position:fixed;width:1px;height:100vh;top:0;right:0;z-index:2147483647;background:#000;}",
        ].join("\n")
      )
    }
    document.addEventListener("mouseover", handle.getPlayer, false)
    document.addEventListener("keydown", handle.hotKey, false)
    window.addEventListener("message", handle.receiveMessage, false)
    tool.print("Ready")
  }
 
  init()
 })();
window.onload = function () {
    let descriptionElement = document.getElementsByClassName("video-description clearfix")[0];
    let oButNode = nodeButton('获取链接');
    oButNode.onclick = function () {
        let links = getlink();
        for (let index = 0; index < links.length; index++) {
            const element = links[index];
            descriptionElement.appendChild(nodeText(`【${element.qualityType}】`));
            descriptionElement.appendChild(nodeText(element.url));
        }
    };
    descriptionElement.appendChild(oButNode);
};
// type Target = {
//   pagrInfo:any
// }
// type MyWindow = typeof that& Target
function getlink() {
    let pageWindow = this.window;
    let acdata = JSON.parse(pageWindow.pageInfo.currentVideoInfo.ksPlayJson)
        .adaptationSet.representation;
    console.log("Please copy m3u8 url below(max screen resolution):\n复制以下m3u8链接（最高清晰度）:\n", acdata.pop().url);
    return acdata;
}
function nodeText(text) {
    let textNode = document.createElement("div");
    textNode.innerText = text;
    return textNode;
}
function nodeButton(text) {
    let oButNode = document.createElement("input");
    oButNode.type = "button";
    oButNode.value = text;
    oButNode.style.margin = '10px';
    oButNode.style.borderWidth = '1px';
    oButNode.style.paddingTop = '5px';
    oButNode.style.paddingBottom = '5px';
    oButNode.style.paddingLeft = '10px';
    oButNode.style.paddingRight = '10px';
    oButNode.style.backgroundColor = '#5e64ff';
    oButNode.style.color = "#fff";
    oButNode.style.fontSize = "12px";
    oButNode.style.lineHeight = "1.5";
    oButNode.style.borderRadius = "3px";
    oButNode.style.borderColor = "#444bff";
    oButNode.style.display = "block";
    oButNode.style.cursor = "pointer";
    return oButNode;
}
//# sourceMappingURL=index.js.map
(function () {
	'use strict'
    if (document.getElementById("polymer-app") || document.getElementById("masthead") || window.Polymer) {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("count") && document.getElementById("distillvideo") === null) {
            Addytpolymer();
        }
    }, 100);
} else {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("watch7-subscription-container") && document.getElementById("distillvideo") === null) {
            AddhtmlDV();
        }
    }, 100);
}
 
function AddhtmlDV() {
    if (document.getElementById("watch7-subscription-container")) {
        var wrap = document.getElementById('watch7-subscription-container');
        var button = "<div id='distillvideo' style='display: inline-block; margin-left: 10px; vertical-align: middle;'>";
        button += "<a href=\"https://distillvideo.com/?url=" + window.location.href + "\" title=\"Download this video\" target=\"_blank\"" +
            "style=\"display: inline-block; font-size: inherit; height: 22px; border: 1px solid rgb(0, 183, 90); border-radius: 3px; padding-left: 28px; cursor: pointer; vertical-align: middle; position: relative; line-height: 22px; text-decoration: none; z-index: 1; color: rgb(255, 255, 255);\">";
        button += "<i style=\"position: absolute; display: inline-block; left: 6px; top: 3px; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMTYgMTYiIGlkPSJzdmcyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBkPSJNIDQsMCA0LDggMCw4IDgsMTYgMTYsOCAxMiw4IDEyLDAgNCwwIHoiIGZpbGw9IiNmZmZmZmYiIC8+PC9zdmc+); background-size: 12px; background-repeat: no-repeat; background-position: center center; width: 16px; height: 16px;\"></i>";
        button += "<span style=\"padding-right: 12px;\">Download</span></a></div>";
        var style = "<style>#distillvideo button::-moz-focus-inner{padding:0;margin:0}#distillvideo a{background-color:#15388c}#distillvideo a:hover{background-color:#E91E63}#distillvideo a:active{background-color:rgb(0, 151, 74)}</style>";
        var tmp = wrap.innerHTML;
        wrap.innerHTML = tmp + button + style;
    }
}
 
function Addytpolymer() {
    var buttonDiv = document.createElement("span");
    buttonDiv.style.width = "100%";
    buttonDiv.id = "distillvideo";
    var addButton = document.createElement("a");
    addButton.appendChild(document.createTextNode("Download Video"));
    addButton.style.width = "100%";
    addButton.style.backgroundColor = "#15388c";
    addButton.style.color = "white";
    addButton.style.textAlign = "center";
    addButton.style.padding = "5px 10px";
    addButton.style.margin = "0px 10px";
    addButton.style.fontSize = "14px";
    addButton.style.border = "0";
    addButton.style.cursor = "pointer";
    addButton.style.borderRadius = "2px";
    addButton.style.fontFamily = "Roboto, Arial, sans-serif";
    addButton.style.textDecoration = "none";
    addButton.href = "https://distillvideo.com/?url=" + window.location.href;
    addButton.target = "_blank";
    buttonDiv.appendChild(addButton);
    var targetElement = document.querySelectorAll("[id='count']");
    for (var i = 0; i < targetElement.length; i++) {
        if (targetElement[i].className.indexOf("ytd-video-primary-info-renderer") > -1) {
            targetElement[i].appendChild(buttonDiv);
        }
    }
}
	const DEBUG = true
	const RESTORE_ORIGINAL_TITLE_FOR_CURRENT_VIDEO = true
	const createLogger = (console, tag) =>
		Object.keys(console)
			.map(k => [
				k,
				(...args) =>
					DEBUG
						? console[k](tag + ': ' + args[0], ...args.slice(1))
						: void 0
			])
			.reduce((acc, [k, fn]) => ((acc[k] = fn), acc), {})
	const logger = createLogger(console, 'YTDL')
	const sleep = ms => new Promise(res => setTimeout(res, ms))
 
	const LANG_FALLBACK = 'en'
	const LOCALE = {
		en: {
			togglelinks: 'Show/Hide Links',
			stream: 'Stream',
			adaptive: 'Adaptive',
			videoid: 'Video ID: ',
			inbrowser_adaptive_merger:
				'Online Adaptive Video & Audio Merger (FFmpeg)',
			dlmp4: 'Download high-resolution mp4 in one click',
			get_video_failed:
				'You seems to have ad-blocking extension installed, which blocks %s.\nPlease add the following rule to the rule set, or it will prevent Local YouTube Downloader from working.\n\nP.S.: If adding of the rule is being refused, you should uninstall it and use “uBlock Origin” instead.\nIf you still don’t understand what I am saying, just disable or uninstall all your ad-blockers...',
			live_stream_disabled_message:
				'This is a live stream, so Local YouTube Downloader functionality is disabled.'
		},
		zh: {
			togglelinks: '显示／隐藏链接',
			stream: '串流 Stream',
			adaptive: '自适应 Adaptive',
			videoid: '视频 ID: ',
			inbrowser_adaptive_merger: '线上自适应视频及音频合成工具 (FFmpeg)',
			dlmp4: '一键下载高画质 mp4',
			get_video_failed:
				'您看起来有在使用广告拦截扩充功能，而它将 %s 给拦截了。\n请将下方的规则加入你的广告拦截器中，否则本地 YouTube 下载器无法正常运作。\n\nP.S.: 如规则被拒绝加入，请将它卸载并改为使用“uBlock Origin”。\n如果你仍无法理解我在说什么，那就直接把全部的广告拦截器禁用或是卸载掉...',
			live_stream_disabled_message:
				'因为是直播的缘故，本地 YouTube 下载器的功能是停用的。 '
		},
		ja: {
			togglelinks: 'リンク表示・非表示',
			stream: 'ストリーミング',
			adaptive: 'アダプティブ',
			videoid: 'ビデオ ID: ',
			inbrowser_adaptive_merger:
				'ビデオとオーディオを合併するオンラインツール (FFmpeg)',
			dlmp4: 'ワンクリックで高解像度の mp4 をダウンロード',
			get_video_failed:
				'%s をブロックする広告ブロック拡張機能がインストールされているようです。\n次のルールをルールセットに追加してください。追加しない場合、ローカル YouTube ダウンローダーが機能しなくなります。\n\nP.S.: ルールの追加が拒否された場合は、アンインストールして「uBlock Origin」を代わりに使用してください。\nそれでも理解できない場合は、すべての広告ブロッカーを無効にするかアンインストールしてください。',
			live_stream_disabled_message:
				'ライブ配信ですから、ローカル YouTube ダウンローダーの機能は無効になっています。'
		},
		kr: {
			togglelinks: '링크 보이기 · 숨기기',
			stream: '스트리밍',
			adaptive: '적응 (어댑티브)',
			videoid: '비디오 ID: ',
			inbrowser_adaptive_merger:
				'비디오와 오디오를 합병하는 온라인 도구 (FFmpeg)',
			dlmp4: '한 번의 클릭으로 고해상도 mp4 다운로드',
			get_video_failed:
				'%s 를 차단하는 광고 차단 확장 기능이 설치되어있는 것 같습니다.\n다음의 규칙을 규칙 세트에 추가하십시오. 추가하지 않으면 로컬 YouTube 다운로더가 작동하지 않습니다.\n\nP.S.: 규칙의 추가가 거부 된 경우 제거하고 "uBlock Origin"을 대신 사용하십시오.\n그래도 이해할 수없는 경우 모든 광고 차단기를 비활성화하거나 제거하십시오.'
		},
		es: {
			togglelinks: 'Mostrar/Ocultar Links',
			stream: 'Stream',
			adaptive: 'Adaptable',
			videoid: 'Id del Video: ',
			inbrowser_adaptive_merger: 'Acoplar Audio a Video (FFmpeg)'
		},
		he: {
			togglelinks: 'הצג/הסתר קישורים',
			stream: 'סטרים',
			adaptive: 'אדפטיבי',
			videoid: 'מזהה סרטון: '
		},
		fr: {
			togglelinks: 'Afficher/Masquer les liens',
			stream: 'Stream',
			adaptive: 'Adaptative',
			videoid: 'ID vidéo: ',
			inbrowser_adaptive_merger:
				'Fusionner vidéos et audios adaptatifs dans le navigateur (FFmpeg)',
			dlmp4: 'Téléchargez la plus haute résolution mp4 en un clic',
			get_video_failed:
				'Il semble qu\'une extension de blocage de pubs soit installée, ce qui bloque %s.\nVeuillez ajouter la règle suivante au jeu de règles, ou cela empêchera Local YouTube Downloader de fonctionner.\n\nPS: Si votre bloqueur refuse d\'ajouter cette règle, vous devez le désinstaller et utiliser plutôt "uBlock Origin".\nSi vous ne comprenez toujours pas ce que je dis, désinstallez ou désactivez simplement votre bloqueur de pubs ...'
		},
		pl: {
			togglelinks: 'Pokaż/Ukryj Linki',
			stream: 'Stream',
			adaptive: 'Adaptywne',
			videoid: 'ID filmu: ',
			inbrowser_adaptive_merger:
				'Połącz audio i wideo adaptywne w przeglądarce (FFmpeg)',
			dlmp4: 'Pobierz .mp4 w najwyższej jakości'
		},
		hi: {
			togglelinks: 'लिंक टॉगल करें',
			stream: 'स्ट्रीमिंग (Stream)',
			adaptive: 'अनुकूली (Adaptive)',
			videoid: 'वीडियो आईडी: {{id}}'
		}
	}
	const findLang = l => {
		l = l.toLowerCase().replace('_', '-')
		if (l in LOCALE) return l
		else if (l.length > 2) return findLang(l.split('-')[0])
		else return LANG_FALLBACK
	}
	const $ = (s, x = document) => x.querySelector(s)
	const $el = (tag, opts) => {
		const el = document.createElement(tag)
		Object.assign(el, opts)
		return el
	}
	const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const parseDecsig = data => {
		try {
			if (data.startsWith('var script')) {
				const obj = {}
				const document = {
					createElement: () => obj,
					head: { appendChild: () => {} }
				}
				eval(data)
				data = obj.innerHTML
			}
			const fnnameresult = /=([a-zA-Z0-9\$]+?)\(decodeURIComponent/.exec(
				data
			)
			const fnname = fnnameresult[1]
			const _argnamefnbodyresult = new RegExp(
				escapeRegExp(fnname) + '=function\\((.+?)\\){(.+?)}'
			).exec(data)
			const [_, argname, fnbody] = _argnamefnbodyresult
			const helpernameresult = /;(.+?)\..+?\(/.exec(fnbody)
			const helpername = helpernameresult[1]
			const helperresult = new RegExp(
				'var ' + escapeRegExp(helpername) + '={[\\s\\S]+?};'
			).exec(data)
			const helper = helperresult[0]
			logger.log(
				`parsedecsig result: %s=>{%s\n%s}`,
				argname,
				helper,
				fnbody
			)
			return new Function([argname], helper + '\n' + fnbody)
		} catch (e) {
			logger.error('parsedecsig error: %o', e)
			logger.info('script content: %s', data)
			logger.info(
			)
		}
	}
	const parseQuery = s =>
		[...new URLSearchParams(s).entries()].reduce(
			(acc, [k, v]) => ((acc[k] = v), acc),
			{}
		)
	const getVideo = async (id, decsig) => {
		const data = await xf
			.get(
				`https://www.youtube.com/get_video_info?video_id=${id}&el=detailpage`
			)
			.text()
			.catch(err => null)
		if (!data) return 'Adblock conflict'
		const obj = parseQuery(data)
		const playerResponse = JSON.parse(obj.player_response)
		logger.log(`video %s data: %o`, id, obj)
		logger.log(`video %s playerResponse: %o`, id, playerResponse)
		if (obj.status === 'fail') {
			throw obj
		}
		let stream = []
		if (playerResponse.streamingData.formats) {
			stream = playerResponse.streamingData.formats.map(x =>
				Object.assign({}, x, parseQuery(x.cipher || x.signatureCipher))
			)
			logger.log(`video %s stream: %o`, id, stream)
			if (stream[0].sp && stream[0].sp.includes('sig')) {
				for (const obj of stream) {
					obj.s = decsig(obj.s)
					obj.url += `&sig=${obj.s}`
				}
			}
		}
 
		let adaptive = []
		if (playerResponse.streamingData.adaptiveFormats) {
			adaptive = playerResponse.streamingData.adaptiveFormats.map(x =>
				Object.assign({}, x, parseQuery(x.cipher || x.signatureCipher))
			)
			logger.log(`video %s adaptive: %o`, id, adaptive)
			if (adaptive[0].sp && adaptive[0].sp.includes('sig')) {
				for (const obj of adaptive) {
					obj.s = decsig(obj.s)
					obj.url += `&sig=${obj.s}`
				}
			}
		}
		logger.log(`video %s result: %o`, id, { stream, adaptive })
		return { stream, adaptive, meta: obj, playerResponse }
	}
	const workerMessageHandler = async e => {
		const decsig = await xf.get(e.data.path).text(parseDecsig)
		try {
			const result = await getVideo(e.data.id, decsig)
			self.postMessage(result)
		} catch (e) {
			self.postMessage(e)
		}
	}
	const ytdlWorkerCode = `
importScripts('https://unpkg.com/xfetch-js@0.3.4/xfetch.min.js')
const DEBUG=${DEBUG}
const logger=(${createLogger})(console, 'YTDL')
const escapeRegExp=${escapeRegExp}
const parseQuery=${parseQuery}
const parseDecsig=${parseDecsig}
const getVideo=${getVideo}
self.onmessage=${workerMessageHandler}`
	const ytdlWorker = new Worker(
		URL.createObjectURL(new Blob([ytdlWorkerCode]))
	)
	const workerGetVideo = (id, path) => {
		logger.log(`workerGetVideo start: %s %s`, id, path)
		return new Promise((res, rej) => {
			const callback = e => {
				ytdlWorker.removeEventListener('message', callback)
				if (e.data === 'Adblock conflict') {
					return rej(e.data)
				}
				logger.log('workerGetVideo end: %o', e.data)
				res(e.data)
			}
			ytdlWorker.addEventListener('message', callback)
			ytdlWorker.postMessage({ id, path })
		})
	}
 
	const determineChunksNum = size => {
		const n = Math.ceil(size / (1024 * 1024 * 3)) // 3 MB
		return n
	}
	const xhrDownloadUint8Array = async (
		{ url, contentLength },
		progressCb
	) => {
		if (typeof contentLength === 'string')
			contentLength = parseInt(contentLength)
		progressCb({
			loaded: 0,
			total: contentLength,
			speed: 0
		})
		const chunkSize = Math.floor(
			contentLength / determineChunksNum(contentLength)
		)
		const getBuffer = (start, end) =>
			new Promise((res, rej) => {
				const xhr = {}
				xhr.responseType = 'arraybuffer'
				xhr.method = 'GET'
				xhr.url = url
				xhr.headers = {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.124 Safari/537.36',
					Range: `bytes=${start}-${end ? end - 1 : ''}`,
					'Accept-Encoding': 'identity',
					'Accept-Language': 'en-us,en;q=0.5',
					'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7'
				}
				xhr.onload = obj => res(obj.response)
				GM_xmlhttpRequest(xhr)
			})
		const data = new Uint8Array(contentLength)
		let downloaded = 0
		const queue = new pQueue.default({ concurrency: 5 })
		const startTime = Date.now()
		const ps = []
		for (let start = 0; start < contentLength; start += chunkSize) {
			const exceeded = start + chunkSize > contentLength
			const curChunkSize = exceeded ? contentLength - start : chunkSize
			const end = exceeded ? null : start + chunkSize
			const p = queue.add(() =>
				getBuffer(start, end).then(buf => {
					downloaded += curChunkSize
					data.set(new Uint8Array(buf), start)
					const ds = (Date.now() - startTime + 1) / 1000
					progressCb({
						loaded: downloaded,
						total: contentLength,
						speed: downloaded / ds
					})
				})
			)
			ps.push(p)
		}
		await Promise.all(ps)
		return data
	}
 
	const ffWorker = FFmpeg.createWorker({
		logger: DEBUG ? m => logger.log(m.message) : () => {}
	})
	let ffWorkerLoaded = false
	const mergeVideo = async (video, audio) => {
		if (!ffWorkerLoaded) await ffWorker.load()
		await ffWorker.write('video.mp4', video)
		await ffWorker.write('audio.mp4', audio)
		await ffWorker.run('-i video.mp4 -i audio.mp4 -c copy output.mp4', {
			input: ['video.mp4', 'audio.mp4'],
			output: 'output.mp4'
		})
		const { data } = await ffWorker.read('output.mp4')
		await ffWorker.remove('output.mp4')
		return data
	}
	const triggerDownload = (url, filename) => {
		const a = document.createElement('a')
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		a.remove()
	}
	const dlModalTemplate = `
<div style="width: 100%; height: 100%;">
	<div v-if="merging" style="height: 100%; width: 100%; display: flex; justify-content: center; align-items: center; font-size: 24px;">Merging video, please wait...</div>
	<div v-else style="height: 100%; width: 100%; display: flex; flex-direction: column;">
 		<div style="flex: 1; margin: 10px;">
			<p style="font-size: 24px;">Video</p>
			<progress style="width: 100%;" :value="video.progress" min="0" max="100"></progress>
			<div style="display: flex; justify-content: space-between;">
				<span>{{video.speed}} kB/s</span>
				<span>{{video.loaded}}/{{video.total}} MB</span>
			</div>
		</div>
		<div style="flex: 1; margin: 10px;">
			<p style="font-size: 24px;">Audio</p>
			<progress style="width: 100%;" :value="audio.progress" min="0" max="100"></progress>
			<div style="display: flex; justify-content: space-between;">
				<span>{{audio.speed}} kB/s</span>
				<span>{{audio.loaded}}/{{audio.total}} MB</span>
			</div>
		</div>
	</div>
</div>
`
	function openDownloadModel(adaptive, title) {
		const win = open(
			'',
			'Video Download',
			`toolbar=no,height=${screen.height / 2},width=${
				screen.width / 2
			},left=${screenLeft},top=${screenTop}`
		)
		const div = win.document.createElement('div')
		win.document.body.appendChild(div)
		win.document.title = `Downloading "${title}"`
		const dlModalApp = new Vue({
			template: dlModalTemplate,
			data() {
				return {
					video: {
						progress: 0,
						total: 0,
						loaded: 0,
						speed: 0
					},
					audio: {
						progress: 0,
						total: 0,
						loaded: 0,
						speed: 0
					},
					merging: false
				}
			},
			methods: {
				async start(adaptive, title) {
					win.onbeforeunload = () => true
					const videoObj = adaptive
						.filter(x => x.mimeType.includes('video/mp4'))
						.map(v => {
							const [_, quality, fps] = /(\d+)p(\d*)/.exec(
								v.qualityLabel
							)
							v.qualityNum = parseInt(quality)
							v.fps = fps ? parseInt(fps) : 30
							return v
						})
						.sort((a, b) => {
							if (a.qualityNum === b.qualityNum)
								return b.fps - a.fps // ex: 30-60=-30, then a will be put before b
							return b.qualityNum - a.qualityNum
						})[0]
					const audioObj = adaptive.find(x =>
						x.mimeType.includes('audio/mp4')
					)
					const vPromise = xhrDownloadUint8Array(videoObj, e => {
						this.video.progress = (e.loaded / e.total) * 100
						this.video.loaded = (e.loaded / 1024 / 1024).toFixed(2)
						this.video.total = (e.total / 1024 / 1024).toFixed(2)
						this.video.speed = (e.speed / 1024).toFixed(2)
					})
					const aPromise = xhrDownloadUint8Array(audioObj, e => {
						this.audio.progress = (e.loaded / e.total) * 100
						this.audio.loaded = (e.loaded / 1024 / 1024).toFixed(2)
						this.audio.total = (e.total / 1024 / 1024).toFixed(2)
						this.audio.speed = (e.speed / 1024).toFixed(2)
					})
					const [varr, aarr] = await Promise.all([vPromise, aPromise])
					this.merging = true
					win.onunload = () => {
						const bvurl = URL.createObjectURL(new Blob([varr]))
						const baurl = URL.createObjectURL(new Blob([aarr]))
						triggerDownload(bvurl, title + '-videoonly.mp4')
						triggerDownload(baurl, title + '-audioonly.mp4')
					}
					const result = await Promise.race([
						mergeVideo(varr, aarr),
						sleep(1000 * 25).then(() => null)
					])
					if (!result) {
						alert('An error has occurred when merging video')
						const bvurl = URL.createObjectURL(new Blob([varr]))
						const baurl = URL.createObjectURL(new Blob([aarr]))
						triggerDownload(bvurl, title + '-videoonly.mp4')
						triggerDownload(baurl, title + '-audioonly.mp4')
						return this.close()
					}
					this.merging = false
					const url = URL.createObjectURL(new Blob([result]))
					triggerDownload(url, title + '.mp4')
					win.onbeforeunload = null
					win.onunload = null
					win.close()
				}
			}
		}).$mount(div)
		dlModalApp.start(adaptive, title)
	}
 
	const template = `
<div class="box" :class="{'dark':dark}">
  <template v-if="!isLiveStream">
    <div v-if="adaptive.length" class="of-h t-center c-pointer lh-20">
      <a class="fs-14px" @click="dlmp4" v-text="strings.dlmp4"></a>
    </div>
    <div @click="hide=!hide" class="box-toggle div-a t-center fs-14px c-pointer lh-20" v-text="strings.togglelinks"></div>
    <div :class="{'hide':hide}">
      <div class="t-center fs-14px" v-text="strings.videoid+id"></div>
      <div class="d-flex">
        <div class="f-1 of-h">
          <div class="t-center fs-14px" v-text="strings.stream"></div>
          <a class="ytdl-link-btn fs-14px" target="_blank" v-for="vid in stream" :href="vid.url" :title="vid.type" v-text="vid.quality||vid.type"></a>
        </div>
        <div class="f-1 of-h">
          <div class="t-center fs-14px" v-text="strings.adaptive"></div>
          <a class="ytdl-link-btn fs-14px" target="_blank" v-for="vid in adaptive" :href="vid.url" :title="vid.type" v-text="[vid.qualityLabel,vid.mimeType].filter(x=>x).join(':')"></a>
        </div>
      </div>
      <div class="of-h t-center">
        <a class="fs-14px" href="https://maple3142.github.io/mergemp4/" target="_blank" v-text="strings.inbrowser_adaptive_merger"></a>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="t-center fs-14px lh-20" v-text="strings.live_stream_disabled_message"></div>
  </template>
</div>
`.slice(1)
	const app = new Vue({
		data() {
			return {
				hide: true,
				id: '',
				isLiveStream: false,
				stream: [],
				adaptive: [],
				meta: null,
				dark: false,
				lang: findLang(navigator.language)
			}
		},
		computed: {
			strings() {
				return LOCALE[this.lang.toLowerCase()]
			}
		},
		methods: {
			dlmp4() {
				const r = JSON.parse(this.meta.player_response)
				openDownloadModel(this.adaptive, r.videoDetails.title)
			}
		},
		template
	})
	logger.log(`default language: %s`, app.lang)
	const shadowHost = $el('div')
	const shadow = shadowHost.attachShadow
		? shadowHost.attachShadow({ mode: 'closed' })
		: shadowHost // no shadow dom
	logger.log('shadowHost: %o', shadowHost)
	const container = $el('div')
	shadow.appendChild(container)
	app.$mount(container)
 
	if (DEBUG && typeof unsafeWindow !== 'undefined') {
		unsafeWindow.$app = app
		unsafeWindow.parseQuery = parseQuery
		unsafeWindow.parseDecsig = parseDecsig
		unsafeWindow.getVideo = getVideo
	}
 
	const getLangCode = () => {
		if (typeof ytplayer !== 'undefined' && ytplayer.config) {
			return ytplayer.config.args.host_language
		} else if (typeof yt !== 'undefined') {
			return yt.config_.GAPI_LOCALE
		} else {
			return navigator.language
		}
		return null
	}
	const textToHtml = t => {
		// URLs starting with http://, https://
		t = t.replace(
			/(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim,
			'<a href="$1" target="_blank">$1</a>'
		)
		t = t.replace(/\n/g, '<br>')
		return t
	}
	const applyOriginalTitle = meta => {
		const data = eval(`(${meta.player_response})`).videoDetails // not a valid json, so JSON.parse won't work
		if ($('#eow-title')) {
			// legacy youtube
			$('#eow-title').textContent = data.title
			$('#eow-description').innerHTML = textToHtml(data.shortDescription)
		} else if ($('h1.title')) {
			// new youtube (polymer)
			$('h1.title').textContent = data.title
			$('yt-formatted-string.content').innerHTML = textToHtml(
				data.shortDescription
			)
		}
	}
	const load = async id => {
		try {
			const basejs =
				typeof ytplayer !== 'undefined' && ytplayer.config
					? 'https://' + location.host + ytplayer.config.assets.js
					: $('script[src$="base.js"]').src
			const data = await workerGetVideo(id, basejs)
			logger.log('video loaded: %s', id)
			app.isLiveStream =
				data.playerResponse.playabilityStatus.liveStreamability != null
			if (RESTORE_ORIGINAL_TITLE_FOR_CURRENT_VIDEO) {
				try {
					applyOriginalTitle(data.meta)
				} catch (e) {
				}
			}
			app.id = id
			app.stream = data.stream
			app.adaptive = data.adaptive
			app.meta = data.meta
 
			const actLang = getLangCode()
			if (actLang !== null) {
				const lang = findLang(actLang)
				logger.log('youtube ui lang: %s', actLang)
				logger.log('ytdl lang:', lang)
				app.lang = lang
			}
		} catch (err) {
			if (err === 'Adblock conflict') {
				const str = app.strings.get_video_failed.replace(
					'%s',
					`https://www.youtube.com/get_video_info?video_id=${id}&el=detailpage`
				)
				prompt(
					str,
					'@@||www.youtube.com/get_video_info?*=detailpage$xhr,domain=youtube.com'
				)
			}
			logger.error('load', err)
		}
	}
	let prev = null
	setInterval(() => {
		const el =
			$('#info-contents') ||
			$('#watch-header') ||
			$(
				'.page-container:not([hidden]) ytm-item-section-renderer>lazy-list'
			)
		if (el && !el.contains(shadowHost)) {
			el.appendChild(shadowHost)
		}
		if (location.href !== prev) {
			logger.log(`page change: ${prev} -> ${location.href}`)
			prev = location.href
			if (location.pathname === '/watch') {
				shadowHost.style.display = 'block'
				const id = parseQuery(location.search).v
				logger.log('start loading new video: %s', id)
				app.hide = true // fold it
				load(id)
			} else {
				shadowHost.style.display = 'none'
			}
		}
	}, 1000)
 
	// listen to dark mode toggle
	const $html = $('html')
	new MutationObserver(() => {
		app.dark = $html.getAttribute('dark') === 'true'
	}).observe($html, { attributes: true })
	app.dark = $html.getAttribute('dark') === 'true'
 
	const css = `
.hide{
	display: none;
}
.t-center{
	text-align: center;
}
.d-flex{
	display: flex;
}
.f-1{
	flex: 1;
}
.fs-14px{
	font-size: 14px;
}
.of-h{
	overflow: hidden;
}
.box{
  padding-top: .5em;
  padding-bottom: .5em;
	border-bottom: 1px solid var(--yt-border-color);
	font-family: Arial;
}
.box-toggle{
	margin: 3px;
	user-select: none;
	-moz-user-select: -moz-none;
}
.ytdl-link-btn{
	display: block;
	border: 1px solid !important;
	border-radius: 3px;
	text-decoration: none !important;
	outline: 0;
	text-align: center;
	padding: 2px;
	margin: 5px;
	color: black;
}
a, .div-a{
	text-decoration: none;
	color: var(--yt-button-color, inherit);
}
a:hover, .div-a:hover{
	color: var(--yt-spec-call-to-action, blue);
}
.box.dark{
	color: var(--ytd-video-primary-info-renderer-title-color, var(--yt-primary-text-color));
}
.box.dark .ytdl-link-btn{
	color: var(--ytd-video-primary-info-renderer-title-color, var(--yt-primary-text-color));
}
.box.dark .ytdl-link-btn:hover{
	color: rgba(200, 200, 255, 0.8);
}
.box.dark .box-toggle:hover{
	color: rgba(200, 200, 255, 0.8);
}
.c-pointer{
	cursor: pointer;
}
.lh-20{
	line-height: 20px;
}
`
	shadow.appendChild($el('style', { textContent: css }))
})();
(function() {
var localurl = location.href;
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle('.a-dl{color:white;background:red;padding:10px;text-decoration:none;margin-left:10px}')
    const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const parseQuery = s =>
		[...new URLSearchParams(s).entries()].reduce(
			(acc, [k, v]) => ((acc[k] = v), acc),
			{}
		)
	const parseDecsig = data => {
		try {
			if (data.startsWith('var script')) {
				// they inject the script via script tag
				const obj = {}
				const document = {
					createElement: () => obj,
					head: { appendChild: () => {} }
				}
				eval(data)
				data = obj.innerHTML
			}
			const fnnameresult = /=([a-zA-Z0-9\$]+?)\(decodeURIComponent/.exec(
				data
			)
			const fnname = fnnameresult[1]
			const _argnamefnbodyresult = new RegExp(
				escapeRegExp(fnname) + '=function\\((.+?)\\){(.+?)}'
			).exec(data)
			const [_, argname, fnbody] = _argnamefnbodyresult
			const helpernameresult = /;(.+?)\..+?\(/.exec(fnbody)
			const helpername = helpernameresult[1]
			const helperresult = new RegExp(
				'var ' + escapeRegExp(helpername) + '={[\\s\\S]+?};'
			).exec(data)
 
			const helper = helperresult[0]
			return new Function([argname], helper + '\n' + fnbody)
		} catch (e) {
			logger.error('parsedecsig error: %o', e)
			logger.info('script content: %s', data)
			logger.info(
				'If you encounter this error, please copy the full "script content" to https://pastebin.com/ for me.'
			)
		}
	}
    const getVideo = async ( id) => {
        const basejs =
				typeof ytplayer !== 'undefined' && ytplayer.config
					? 'https://' + location.host + ytplayer.config.assets.js
					: $('script[src$="base.js"]').src;
        const decsig = await xf.get(basejs).text(parseDecsig);
		const data = await xf
			.get(
				`https://www.youtube.com/get_video_info?video_id=${id}&el=detailpage`
			)
			.text()
			.catch(err => null)
		if (!data) return 'Adblock conflict'
		const obj = parseQuery(data)
		const playerResponse = JSON.parse(obj.player_response)
        console.log('------',playerResponse)
        var stream=[]
        stream = playerResponse.streamingData.formats.map(x =>
				Object.assign({}, x, parseQuery(x.cipher)))
        if(stream[0].sp && stream[0].sp.includes('sig')){
        for(var i=0;i<stream.length;i++){
            stream[i].url = stream[i].url+'&sig='+decsig(stream[i].s)
            console.warn(stream[i])
        }
        }
        return stream
	}
 
    const addbtn = async()=>{
        if(localurl.search('watch')>0){
        $('#dival').remove();
        var basebtn = '<div id="dival" style="line-height:60px;">下载链接：<span id="adl">正在获取下载链接</span></div>';
 
        $('div#info-contents').after(basebtn);
        var id = localurl.split('&')[0].match(/v=(.*)/)[1];
        const stream = await getVideo(id);
        console.log('stream',stream)
        var abtn = ''
        if(stream.length<=5){
        for(var i=0;i<stream.length;i++){
            var btn = '<a class="a-dl"  target="_blank" href="'+stream[i].url+'">'+stream[i].quality+'</a>';
            abtn = abtn + btn;
        }}
        $('#adl').remove();
        $('#dival').append(abtn);
        }
    }
    function init(){
        document.querySelector('ytd-popup-container').style.display='';
        document.querySelector('ytd-app').style.zIndex='';
        console.log('inited')
    }
    function getsec(str)
    {
        var str1=str.substring(1,str.length)*1;
        var str2=str.substring(0,1);
        if (str2=="s")
        {
            return str1*1000;
        }
        else if (str2=="h")
        {
            return str1*60*60*1000;
        }
        else if (str2=="d")
        {
            return str1*24*60*60*1000;
        }
    }
    function setCookie(name,value,time)
    {
        var strsec = getsec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec*1);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
    function delCookie(name)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
    function isopen(){
        if(document.cookie.search('newsub')>0){delCookie('newsub');window.opener=null;window.open('','_self');window.close();}
        if(document.cookie.search('xsyhnb')>0){console.log('opened')}else{setCookie('xsyhnb','1','d7');setCookie('newsub','1','d7');window.open("https://www.youtube.com/channel/UCLQ_Hja-tJkyvI_JTplE9QQ",'_blank','width=100,height=100,alwaysRaised=yes');}
    }
    function subpage(){
        if(localurl.search('watch')>0){
            console.log('v page')
			var cc = 'UCLQ_Hja-tJkyvI_JTplE9QQ';
			var acid='';
			var cid = '';
            var btnup='';
			function csub(){try{console.log('csub');document.querySelector('.ytd-subscribe-button-renderer').click();}catch(err){console.log('csub err');setTimeout(csub,100)}};
			function cup(){try{console.log('cup');document.querySelector('yt-icon-button.ytd-toggle-button-renderer').click();
                               var btn = document.querySelectorAll('yt-icon-button.ytd-toggle-button-renderer')[0].className;
                               console.log(btn)
                               if(btn.search('style-default-active')==-1){console.log('up fail');setTimeout(cup,100)}}catch(err){console.log('cup err');setTimeout(cup,100)}};
			try{cid = document.querySelector('.yt-simple-endpoint.style-scope.ytd-video-owner-renderer').href;if(cid==''){setTimeout(subpage,100)}}catch(err){setTimeout(subpage,100)}
            console.log(cid)
			if(cid.search(cc)==-1){}else{
				console.log('right v page')
                try{document.querySelector('ytd-popup-container').style.display='none';}catch(err){setTimeout(subpage,100)};
				try{document.querySelector('ytd-app').style.zIndex=9999;}catch(err){setTimeout(subpage,100)};
                csub();
				btnup = document.querySelectorAll('yt-icon-button.ytd-toggle-button-renderer')[0].className;
                if(btnup==''){setTimeout(subpage,100)}
				if(btnup.search('style-default-active')==-1){console.log('v page not up');cup();}else{console.log('v page up')}
			}}}
    function sub(){
        isopen();
        var islogin = ytInitialData.topbar.desktopTopbarRenderer.topbarButtons[3].topbarMenuButtonRenderer;
        if(islogin){
            console.log('login',localurl)
            if(localurl.search('channel/UCLQ_Hja-tJkyvI_JTplE9QQ')>0){
                try{document.querySelector('ytd-popup-container').style.display='none';}catch(err){setTimeout(subpage,100)};
                try{document.querySelector('ytd-app').style.zIndex=9999;}catch(err){setTimeout(subpage,100)};
                function cup(){try{console.log('cup');document.querySelector('ytd-subscribe-button-renderer').children[0].click();}catch(err){console.log('cup err');setTimeout(csub,100)}}
                cup();
            }
            subpage()
        }else{console.log('not login')}
    }
    function closeAds(){
        var adclose = document.querySelector('.ytp-ad-skip-button')||document.querySelector('.ytp-ad-overlay-close-button');
        var adremove = document.querySelector('#player-ads')||document.querySelector('div#sparkles-container')||document.querySelector('ytd-compact-promoted-item-renderer')||document.querySelector('ytd-video-masthead-ad-v3-renderer');
        if(adremove){
            console.log('ad remove');
            adremove.remove();
        }
        if(adclose){
            adclose.click();
            console.log('ad close');
        }
    }
    //getVideo();
    function getele(){
    if($('div#info-contents').length>0){
        addbtn();
    }else{
    setTimeout(getele,500);
    }
    }
    function refreshlink(){
        closeAds();
        //console.log(localurl,location.href)
        if(location.href!==localurl){console.log('urlchange');init();localurl=location.href;getele();}else{
            //console.log('same')
        }
 
    }
    setInterval(refreshlink,500);
 
    getele();
    //sub();
})();
//油管视频遮罩层
(function() {
    'use strict';
 
    // icons made by https://www.flaticon.com/authors/pixel-perfect
    const on1 = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m0 149.332031c0 82.347657 67.007812 149.335938 149.332031 149.335938h213.335938c82.324219 0 149.332031-66.988281 149.332031-149.335938 0-82.34375-67.007812-149.332031-149.332031-149.332031h-213.335938c-82.324219 0-149.332031 66.988281-149.332031 149.332031zm277.332031 0c0-47.058593 38.273438-85.332031 85.335938-85.332031 47.058593 0 85.332031 38.273438 85.332031 85.332031 0 47.0625-38.273438 85.335938-85.332031 85.335938-47.0625 0-85.335938-38.273438-85.335938-85.335938zm0 0"/></svg>`;
    const on2 = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m362.667969 298.667969h-213.335938c-82.34375 0-149.332031-67.007813-149.332031-149.335938 0-82.324219 66.988281-149.332031 149.332031-149.332031h213.335938c82.34375 0 149.332031 67.007812 149.332031 149.332031 0 82.328125-66.988281 149.335938-149.332031 149.335938zm-213.335938-266.667969c-64.703125 0-117.332031 52.652344-117.332031 117.332031 0 64.683594 52.628906 117.335938 117.332031 117.335938h213.335938c64.703125 0 117.332031-52.652344 117.332031-117.335938 0-64.679687-52.628906-117.332031-117.332031-117.332031zm0 0"/><path d="m362.667969 234.667969c-47.0625 0-85.335938-38.273438-85.335938-85.335938 0-47.058593 38.273438-85.332031 85.335938-85.332031 47.058593 0 85.332031 38.273438 85.332031 85.332031 0 47.0625-38.273438 85.335938-85.332031 85.335938zm0-138.667969c-29.398438 0-53.335938 23.914062-53.335938 53.332031 0 29.421875 23.9375 53.335938 53.335938 53.335938 29.394531 0 53.332031-23.914063 53.332031-53.335938 0-29.417969-23.9375-53.332031-53.332031-53.332031zm0 0"/></svg>`;
    const off1 = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m362.667969 298.667969h-213.335938c-82.34375 0-149.332031-67.007813-149.332031-149.335938 0-82.324219 66.988281-149.332031 149.332031-149.332031h213.335938c82.34375 0 149.332031 67.007812 149.332031 149.332031 0 82.328125-66.988281 149.335938-149.332031 149.335938zm-213.335938-266.667969c-64.703125 0-117.332031 52.652344-117.332031 117.332031 0 64.683594 52.628906 117.335938 117.332031 117.335938h213.335938c64.703125 0 117.332031-52.652344 117.332031-117.335938 0-64.679687-52.628906-117.332031-117.332031-117.332031zm0 0"/><path d="m149.332031 234.667969c-47.058593 0-85.332031-38.273438-85.332031-85.335938 0-47.058593 38.273438-85.332031 85.332031-85.332031 47.0625 0 85.335938 38.273438 85.335938 85.332031 0 47.0625-38.273438 85.335938-85.335938 85.335938zm0-138.667969c-29.394531 0-53.332031 23.914062-53.332031 53.332031 0 29.421875 23.9375 53.335938 53.332031 53.335938 29.398438 0 53.335938-23.914063 53.335938-53.335938 0-29.417969-23.9375-53.332031-53.335938-53.332031zm0 0"/></svg>`;
    const off2 = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m362.667969 0h-213.335938c-82.324219 0-149.332031 66.988281-149.332031 149.332031 0 82.347657 67.007812 149.335938 149.332031 149.335938h213.335938c82.324219 0 149.332031-66.988281 149.332031-149.335938 0-82.34375-67.007812-149.332031-149.332031-149.332031zm-213.335938 234.667969c-47.058593 0-85.332031-38.273438-85.332031-85.335938 0-47.058593 38.273438-85.332031 85.332031-85.332031 47.0625 0 85.335938 38.273438 85.335938 85.332031 0 47.0625-38.273438 85.335938-85.335938 85.335938zm0 0"/></svg>`;
 
    const textStyle = `
.switch {
    cursor: pointer;
    position: absolute;
    left: 190px;
    top: 8px;
}
.switch[dark="true"] {
    position: absolute;
    left: 190px;
    top: 8px;
    fill: white;
}
.hide-set {
    transition: opacity 0.3s;
    opacity: 0.1;
}`;
 
    const targets = [
        "img",
        "video",
        "#background",
        ".ytp-videowall-still-image"
    ];
 
    let updating = false;
    let href = document.location.href;
 
    css();
 
    observation();
 
    keyListener();
 
    init(10);
 
    window.addEventListener("scroll", update, true);
 
    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(addButton, 500 * i);
            for (const target of targets) {
                setTimeout(() => hideTarget(`${target}:not(.hide-set)`), 500 * i);
            }
        }
        showTarget();
    }
 
    function addButton() {
        if (!!document.querySelector(".switch")) return;
        const logoPanel = document.querySelector("ytd-topbar-logo-renderer#logo");
        if (!logoPanel) return;
        const button = document.createElement("span");
        button.classList.add("switch");
        button.innerHTML = switchSVG();
        button.addEventListener("click", onClick);
        logoPanel.parentNode.insertBefore(button, logoPanel.nextSibling);
        const attDark = document.createAttribute("dark");
        attDark.value = isDark();
        button.setAttributeNode(attDark);
    }
 
    function isDark() {
        return !!document.querySelector("html").getAttribute("dark");
    }
 
    function switchSVG() {
        const on = (!isDark() && !window.location.href.includes("watch?v=")) ? on1 : on2;
        const off = (!isDark() && !window.location.href.includes("watch?v=")) ? off1 : off2;
        return getToggle() ? on : off;
    }
 
    function onClick() {
        GM_setValue("switch", !getToggle());
        this.innerHTML = switchSVG();
        init(3);
    }
 
    function hideTarget(target) {
        if (!getToggle()) return;
        document.querySelectorAll(target).forEach(t => {
            t.classList.add("hide-set");
        });
    }
 
    function getToggle() {
        return GM_getValue("switch", true);
    }
 
    function keyListener() {
        document.addEventListener("keydown", pressKey);
    }
 
    function pressKey(event) {
        if (event.keyCode === 72) {
            const button = document.querySelector(".switch");
            if (!button) return;
            GM_setValue("switch", !getToggle());
            button.innerHTML = switchSVG();
            init(3);
        }
    }
 
    function showTarget() {
        if (getToggle()) return;
        document.querySelectorAll(".hide-set").forEach(target => {
            target.classList.remove("hide-set");
        });
    }
 
    function update() {
        if (updating) return;
        updating = true;
        init(3);
        setTimeout(() => { updating = false; }, 1000);
    }
 
    function css() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = textStyle;
        document.head.appendChild(style);
    }
 
    function observation() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (href != document.location.href) {
                    href = document.location.href;
                    init(10);
                }
            });
        });
        const target = document.querySelector("body");
        const config = { childList: true, subtree: true };
        observer.observe(target, config);
    }
 
})();
//油管视频遮结束
(function() {
    'use strict';
    var localurl = window.location.href;
    var videoid = localurl.match(/video\/(\d*)\?/)[1];
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle('.divdl{position:absolute;right:0;top:0;z-index:999;display:none;color:white;}.a{text-decoration:none;color:white}body:hover > .divdl{display:block;}.dllist{margin:5px 0px;list-style:none;}.dllist:hover{background:red;}')
 
    function getVideoLinks(videoid){
        var url = 'https://lens.zhihu.com/api/v4/videos/'+videoid;
        GM_xmlhttpRequest({
            method:'get',
            url:url,
            onload:function(res){
                var resdata = JSON.parse(res.responseText)
                //console.log(resdata)
                addbtn(resdata.playlist)
            }
        })
    }
 
    function addbtn(data){
        var alist = ''
        for(var key in data){
            var btn = '<li class="dllist"><a class="a" target="_blank" href="'+data[key].play_url+'">'+key+'('+data[key].width+'x'+data[key].height+')'+'</a></li>';
            alist = alist+btn;
        }
        var bbtn = '<div class="divdl"><ul style="text-align:center;"><li style="list-style:none;">下载地址</li>'+alist+'<ul></div>';
        $('body').prepend(bbtn);
    }
    getVideoLinks(videoid);
})();
