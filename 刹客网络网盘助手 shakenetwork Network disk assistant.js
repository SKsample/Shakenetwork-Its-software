// ==UserScript==
// @icon         https://img.tujidu.com/image/5e7ba0d6b0062.jpg
// @name         （内测已在试用的代码丢失不在维护）刹客网络网盘助手 shakenetwork Network disk assistant
// @namespace    https://mp.weixin.qq.com/s/jif5WcnbS2lsQ3ufeikxmg
// @version      0.1.1 20200813
// @description  自动识别并标记百度云、蓝奏云、腾讯微云和天翼云盘的链接状态，网盘密码自动输入万能钥匙,百度网盘生成并展示下载链接，百度网盘分享时自定义提取码
// @author       由刹客网络科技提供
// @match        *://**/*
// @connect      www.lanzous.com
// @connect      pan.baidu.com
// @connect      share.weiyun.com
// @connect      cloud.189.cn
// @connect      newday.me
// @connect      likestyle.cn
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/snap.svg/0.5.1/snap.svg-min.js
// @require      https://cdn.staticfile.org/findAndReplaceDOMText/0.4.6/findAndReplaceDOMText.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @match        *://*.weiyun.com/*
// @match        *://*.lanzous.com/*
// @match        *://*.lanzoux.com/*
// @match        *://cloud.189.cn/*
// @match        *://*.newday.me/*
// @match        *://*.likestyle.cn/*
// @connect      newday.me
// @connect      likestyle.cn
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @require      https://cdn.staticfile.org/dompurify/2.0.10/purify.min.js
// @require      https://cdn.staticfile.org/snap.svg/0.5.1/snap.svg-min.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    var manifest = {
        "name": "ljjc",
        "urls": {},
        "apis": {
            "version": "https://api.newday.me/share/link/version",
            "valid": "https://api.newday.me/share/link/valid",
            "report": "https://api.newday.me/share/link/report"
        },
        "logger_level": 3,
        "options_page": "http://go.newday.me/s/link-option"
    };
 
    var container = (function () {
        var obj = {
            defines: {},
            modules: {}
        };
 
        obj.define = function (name, requires, callback) {
            name = obj.processName(name);
            obj.defines[name] = {
                requires: requires,
                callback: callback
            };
        };
 
        obj.require = function (name, cache) {
            if (typeof cache == "undefined") {
                cache = true;
            }
 
            name = obj.processName(name);
            if (cache && obj.modules.hasOwnProperty(name)) {
                return obj.modules[name];
            } else if (obj.defines.hasOwnProperty(name)) {
                var requires = obj.defines[name].requires;
                var callback = obj.defines[name].callback;
 
                var module = obj.use(requires, callback);
                cache && obj.register(name, module);
                return module;
            }
        };
 
        obj.use = function (requires, callback) {
            var module = {
                exports: undefined
            };
            var params = obj.buildParams(requires, module);
            var result = callback.apply(this, params);
            if (typeof result != "undefined") {
                return result;
            } else {
                return module.exports;
            }
        };
 
        obj.register = function (name, module) {
            name = obj.processName(name);
            obj.modules[name] = module;
        };
 
        obj.buildParams = function (requires, module) {
            var params = [];
            requires.forEach(function (name) {
                params.push(obj.require(name));
            });
            params.push(obj.require);
            params.push(module.exports);
            params.push(module);
            return params;
        };
 
        obj.processName = function (name) {
            return name.toLowerCase();
        };
 
        return {
            define: obj.define,
            use: obj.use,
            register: obj.register,
            modules: obj.modules
        };
    })();
 
    container.define("gm", [], function () {
        var obj = {};
 
        obj.ready = function (callback) {
            if (typeof GM_getValue != "undefined") {
                callback && callback();
            }
            else {
                setTimeout(function () {
                    obj.ready(callback);
                }, 100);
            }
        };
 
        return obj;
    });
 
    /** common **/
    container.define("gmDao", [], function () {
        var obj = {
            items: {}
        };
 
        obj.get = function (name) {
            return GM_getValue(name);
        };
 
        obj.getBatch = function (names) {
            var items = {};
            names.forEach(function (name) {
                items[name] = obj.get(name);
            });
            return items;
        };
 
        obj.getAll = function () {
            return obj.getBatch(GM_listValues());
        };
 
        obj.set = function (name, item) {
            GM_setValue(name, item);
        };
 
        obj.setBatch = function (items) {
            for (var name in items) {
                obj.set(name, items[name]);
            }
        };
 
        obj.setAll = function (items) {
            var names = GM_listValues();
            names.forEach(function (name) {
                if (!items.hasOwnProperty(name)) {
                    obj.remove(name);
                }
            });
            obj.setBatch(items);
        };
 
        obj.remove = function (name) {
            GM_deleteValue(name);
        };
 
        obj.removeBatch = function (names) {
            names.forEach(function (name) {
                obj.remove(name);
            });
        };
 
        obj.removeAll = function () {
            obj.removeBatch(GM_listValues());
        };
 
        return obj;
    });
 
    container.define("ScopeDao", [], function () {
        return function (dao, scope) {
            var obj = {
                items: {}
            };
 
            obj.get = function (name) {
                return obj.items[name];
            };
 
            obj.getBatch = function (names) {
                var items = {};
                names.forEach(function (name) {
                    if (obj.items.hasOwnProperty(name)) {
                        items[name] = obj.items[name];
                    }
                });
                return items;
            };
 
            obj.getAll = function () {
                return obj.items;
            };
 
            obj.set = function (name, item) {
                obj.items[name] = item;
 
                obj.sync();
            };
 
            obj.setBatch = function (items) {
                obj.items = Object.assign(obj.items, items);
 
                obj.sync();
            };
 
            obj.setAll = function (items) {
                obj.items = Object.assign({}, items);
 
                obj.sync();
            };
 
            obj.remove = function (name) {
                delete obj.items[name];
 
                obj.sync();
            };
 
            obj.removeBatch = function (names) {
                names.forEach(function (name) {
                    delete obj.items[name];
                });
 
                obj.sync();
            };
 
            obj.removeAll = function () {
                obj.items = {};
 
                obj.getDao().remove(obj.getScope());
            };
 
            obj.init = function () {
                var items = obj.getDao().get(obj.getScope());
                if (items instanceof Object) {
                    obj.items = items;
                }
            };
 
            obj.sync = function () {
                obj.getDao().set(obj.getScope(), obj.items);
            };
 
            obj.getDao = function () {
                return dao;
            };
 
            obj.getScope = function () {
                return scope;
            };
 
            return obj.init(), obj;
        };
    });
 
    container.define("config", ["factory"], function (factory) {
        var obj = {};
 
        obj.getConfig = function (name) {
            return obj.getDao().get(name);
        };
 
        obj.setConfig = function (name, value) {
            obj.getDao().set(name, value);
        };
 
        obj.getAll = function () {
            return obj.getDao().getAll();
        };
 
        obj.getDao = function () {
            return factory.getConfigDao();
        };
 
        return obj;
    });
 
    container.define("storage", ["factory"], function (factory) {
        var obj = {};
 
        obj.getValue = function (name) {
            return obj.getDao().get(name);
        };
 
        obj.setValue = function (name, value) {
            obj.getDao().set(name, value);
        };
 
        obj.getAll = function () {
            return obj.getDao().getAll();
        };
 
        obj.getDao = function () {
            return factory.getStorageDao();
        };
 
        return obj;
    });
 
    container.define("option", ["config", "constant"], function (config, constant) {
        var obj = {
            name: "option",
            constants: constant.options
        };
 
        obj.isOptionActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            return option.indexOf(name) >= 0 ? true : false;
        };
 
        obj.setOptionActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            if (option.indexOf(name) < 0) {
                option.push(name);
                obj.setOption(option);
            }
        };
 
        obj.setOptionUnActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            var index = option.indexOf(name);
            if (index >= 0) {
                delete option[index];
                obj.setOption(option);
            }
        };
 
        obj.getOption = function () {
            var option = [];
            var optionList = obj.getOptionList();
            Object.values(obj.constants).forEach(function (item) {
                var name = item.name;
                if (optionList.hasOwnProperty(name)) {
                    if (optionList[name] != "no") {
                        option.push(name);
                    }
                }
                else if (item.value != "no") {
                    option.push(name);
                }
            });
            return option;
        };
 
        obj.setOption = function (option) {
            var optionList = {};
            Object.values(obj.constants).forEach(function (item) {
                var name = item.name;
                if (option.indexOf(name) >= 0) {
                    optionList[name] = "yes";
                } else {
                    optionList[name] = "no";
                }
            });
            obj.setOptionList(optionList);
        };
 
        obj.getOptionList = function () {
            var optionList = config.getConfig(obj.name);
            return optionList ? optionList : {};
        };
 
        obj.setOptionList = function (optionList) {
            config.setConfig(obj.name, optionList);
        };
 
        return obj;
    });
 
    container.define("manifest", [], function () {
        var obj = {
            manifest: manifest
        };
 
        obj.getItem = function (name) {
            return obj.manifest[name];
        };
 
        obj.getManifest = function () {
            return obj.manifest;
        };
 
        obj.getName = function () {
            return obj.getItem("name");
        };
 
        obj.getAppName = function () {
            return obj.getItem("app_name");
        };
 
        obj.getUrl = function (name) {
            var urls = obj.getItem("urls");
            (urls instanceof Object) || (urls = {});
            return urls[name];
        };
 
        obj.getApi = function (name) {
            var apis = obj.getItem("apis");
            (apis instanceof Object) || (apis = {});
            return apis[name];
        };
 
        obj.getOptionsPage = function () {
            if (GM_info.script.optionUrl) {
                return GM_info.script.optionUrl;
            }
            else {
                return obj.getItem("options_page");
            }
        };
 
        return obj;
    });
 
    container.define("env", ["config", "manifest"], function (config, manifest) {
        var obj = {
            modes: {
                ADDON: "addon",
                SCRIPT: "script"
            },
            browsers: {
                FIREFOX: "firefox",
                EDG: "edg",
                EDGE: "edge",
                BAIDU: "baidu",
                LIEBAO: "liebao",
                UC: "uc",
                QQ: "qq",
                SOGOU: "sogou",
                OPERA: "opera",
                MAXTHON: "maxthon",
                IE2345: "2345",
                SE360: "360",
                CHROME: "chrome",
                SAFIRI: "safari",
                OTHER: "other"
            }
        };
 
        obj.getName = function () {
            return manifest.getName();
        };
 
        obj.getMode = function () {
            if (GM_info.mode) {
                return GM_info.mode;
            }
            else {
                return obj.modes.SCRIPT;
            }
        };
 
        obj.getAid = function () {
            if (GM_info.scriptHandler) {
                return GM_info.scriptHandler.toLowerCase();
            }
            else {
                return "unknown";
            }
        };
 
        obj.getUid = function () {
            var uid = config.getConfig("uid");
            if (!uid) {
                uid = obj.randString(32);
                config.setConfig("uid", uid);
            }
            return uid;
        };
 
        obj.getBrowser = function () {
            if (!obj._browser) {
                obj._browser = obj.matchBrowserType(navigator.userAgent);
            }
            return obj._browser;
        };
 
        obj.getVersion = function () {
            return GM_info.script.version;
        };
 
        obj.getEdition = function () {
            return GM_info.version;
        };
 
        obj.getInfo = function () {
            return {
                mode: obj.getMode(),
                aid: obj.getAid(),
                uid: obj.getUid(),
                browser: obj.getBrowser(),
                version: obj.getVersion(),
                edition: obj.getEdition()
            };
        };
 
        obj.matchBrowserType = function (userAgent) {
            var browser = obj.browsers.OTHER;
            userAgent = userAgent.toLowerCase();
            if (userAgent.match(/firefox/) != null) {
                browser = obj.browsers.FIREFOX;
            } else if (userAgent.match(/edge/) != null) {
                browser = obj.browsers.EDGE;
            } else if (userAgent.match(/edg/) != null) {
                browser = obj.browsers.EDG;
            } else if (userAgent.match(/bidubrowser/) != null) {
                browser = obj.browsers.BAIDU;
            } else if (userAgent.match(/lbbrowser/) != null) {
                browser = obj.browsers.LIEBAO;
            } else if (userAgent.match(/ubrowser/) != null) {
                browser = obj.browsers.UC;
            } else if (userAgent.match(/qqbrowse/) != null) {
                browser = obj.browsers.QQ;
            } else if (userAgent.match(/metasr/) != null) {
                browser = obj.browsers.SOGOU;
            } else if (userAgent.match(/opr/) != null) {
                browser = obj.browsers.OPERA;
            } else if (userAgent.match(/maxthon/) != null) {
                browser = obj.browsers.MAXTHON;
            } else if (userAgent.match(/2345explorer/) != null) {
                browser = obj.browsers.IE2345;
            } else if (userAgent.match(/chrome/) != null) {
                if (navigator.mimeTypes.length > 10) {
                    browser = obj.browsers.SE360;
                } else {
                    browser = obj.browsers.CHROME;
                }
            } else if (userAgent.match(/safari/) != null) {
                browser = obj.browsers.SAFIRI;
            }
            return browser;
        };
 
        obj.randString = function (length) {
            var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
            var text = "";
            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };
 
        return obj;
    });
 
    container.define("http", [], function () {
        var obj = {};
 
        obj.ajax = function (option) {
            var details = {
                method: option.type,
                url: option.url,
                responseType: option.dataType,
                onload: function (result) {
                    option.success && option.success(result.response);
                },
                onerror: function (result) {
                    option.error && option.error(result.error);
                }
            };
            if (option.data instanceof Object) {
                if (option.data instanceof FormData) {
                    details.data = option.data;
                }
                else {
                    var formData = new FormData();
                    for (var i in option.data) {
                        formData.append(i, option.data[i]);
                    }
                    details.data = formData;
                }
            }
            if (option.headers) {
                details.headers = option.headers;
            }
 
            if (option.timeout) {
                details.timeout = option.timeout;
            }
 
            GM_xmlhttpRequest(details);
        };
 
        return obj;
    });
 
    container.define("router", [], function () {
        var obj = {};
 
        obj.getUrl = function () {
            return location.href;
        };
 
        obj.goUrl = function (url) {
            location.href = url;
        };
 
        obj.openUrl = function (url) {
            window.open(url);
        };
 
        obj.openTab = function (url, active) {
            GM_openInTab(url, !active);
        };
 
        obj.jumpLink = function (jumpUrl, jumpMode) {
            switch (jumpMode) {
                case 9:
                    // self
                    obj.goUrl(jumpUrl);
                    break;
                case 6:
                    // new
                    obj.openUrl(jumpUrl);
                    break;
                case 3:
                    // new & not active
                    obj.openTab(jumpUrl, false);
                    break;
                case 1:
                    // new & active
                    obj.openTab(jumpUrl, true);
                    break;
            }
        };
 
        obj.getUrlParam = function (name) {
            var param = obj.parseUrlParam(obj.getUrl());
            if (name) {
                return param.hasOwnProperty(name) ? param[name] : null;
            }
            else {
                return param;
            }
        };
 
        obj.parseUrlParam = function (url) {
            if (url.indexOf("?")) {
                url = url.split("?")[1];
            }
            var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
            var obj = {};
            while (reg.exec(url)) {
                obj[RegExp.$1] = RegExp.$2;
            }
            return obj;
        };
 
        return obj;
    });
 
    container.define("logger", ["env", "manifest"], function (env, manifest) {
        var obj = {
            constant: {
                DEBUG: 0,
                INFO: 1,
                WARN: 2,
                ERROR: 3,
                NONE: 4
            }
        };
 
        obj.debug = function (message) {
            obj.log(message, obj.constant.DEBUG);
        };
 
        obj.info = function (message) {
            obj.log(message, obj.constant.INFO);
        };
 
        obj.warn = function (message) {
            obj.log(message, obj.constant.WARN);
        };
 
        obj.error = function (message) {
            obj.log(message, obj.constant.ERROR);
        };
 
        obj.log = function (message, level) {
            if (level < manifest.getItem("logger_level")) {
                return false;
            }
 
            console.group("[" + env.getName() + "]" + env.getMode());
            console.log(message);
            console.groupEnd();
        };
 
        return obj;
    });
 
    container.define("meta", ["env", "$"], function (env, $) {
        var obj = {};
 
        obj.existMeta = function (name) {
            name = obj.processName(name);
            if ($("meta[name='" + name + "']").length) {
                return true;
            }
            else {
                return false;
            }
        };
 
        obj.appendMeta = function (name, content) {
            name = obj.processName(name);
            content || (content = "on");
            $('<meta name="' + name + '" content="on">').appendTo($("head"));
        };
 
        obj.processName = function (name) {
            return env.getName() + "::" + name;
        };
 
        return obj;
    });
 
    container.define("unsafeWindow", [], function () {
        if (typeof unsafeWindow == "undefined") {
            return window;
        }
        else {
            return unsafeWindow;
        }
    });
 
    container.define("svgCrypt", ["Snap"], function (Snap) {
        var obj = {};
 
        obj.getReqData = function () {
            var reqTime = Math.round(new Date().getTime() / 1000);
            var reqPoint = obj.getStrPoint("timestamp:" + reqTime);
            return {
                req_time: reqTime,
                req_point: reqPoint
            };
        };
 
        obj.getStrPoint = function (str) {
            if (str.length < 2) {
                return "0:0";
            }
 
            var path = "";
            var current, last = str[0].charCodeAt();
            var sum = last;
            for (var i = 1; i < str.length; i++) {
                current = str[i].charCodeAt();
                if (i == 1) {
                    path = path + "M";
                } else {
                    path = path + " L";
                }
                path = path + current + " " + last;
                last = current;
                sum = sum + current;
            }
            path = path + " Z";
            var index = sum % str.length;
            var data = Snap.path.getPointAtLength(path, str[index].charCodeAt());
            return data.m.x + ":" + data.n.y;
        };
 
        return obj;
    });
 
    container.define("calendar", [], function () {
        var obj = {};
 
        obj.getTime = function () {
            return (new Date()).getTime();
        };
 
        obj.formatTime = function (format, timestamp) {
            format || (format = "Y-m-d H:i:s");
            timestamp || (timestamp = obj.getTime());
            var date = new Date(timestamp);
            var year = 1900 + date.getYear();
            var month = "0" + (date.getMonth() + 1);
            var day = "0" + date.getDate();
            var hour = "0" + date.getHours();
            var minute = "0" + date.getMinutes();
            var second = "0" + date.getSeconds();
            var vars = {
                "Y": year,
                "m": month.substring(month.length - 2, month.length),
                "d": day.substring(day.length - 2, day.length),
                "H": hour.substring(hour.length - 2, hour.length),
                "i": minute.substring(minute.length - 2, minute.length),
                "s": second.substring(second.length - 2, second.length)
            };
            return obj.replaceVars(vars, format);
        };
 
        obj.replaceVars = function (vars, value) {
            Object.keys(vars).forEach(function (key) {
                value = value.replace(key, vars[key]);
            });
            return value;
        };
 
        return obj;
    });
 
    container.define("oneData", ["env", "http"], function (env, http) {
        var obj = {};
 
        obj.requestOneApi = function (url, data, callback) {
            http.ajax({
                type: "post",
                url: url,
                dataType: "json",
                data: Object.assign(env.getInfo(), data),
                success: function (response) {
                    callback && callback(response);
                },
                error: function () {
                    callback && callback("");
                }
            });
        };
 
        return obj;
    });
 
    container.define("appRunner", ["router", "logger", "meta", "$"], function (router, logger, meta, $, require) {
        var obj = {};
 
        obj.run = function (appList) {
            var metaName = "status";
            if (meta.existMeta(metaName)) {
                logger.info("setup already");
            }
            else {
                // 添加meta
                meta.appendMeta(metaName);
 
                // 运行应用
                $(function () {
                    obj.runAppList(appList);
                });
            }
        };
 
        obj.runAppList = function (appList) {
            var url = router.getUrl();
            for (var i in appList) {
                var app = appList[i];
 
                var match = obj.matchApp(url, app);
                if (match == false) {
                    continue;
                }
 
                if (require(app.name).run() == true) {
                    break;
                }
            }
        };
 
        obj.matchApp = function (url, app) {
            var match = false;
            app.matchs.forEach(function (item) {
                if (url.indexOf(item) > 0 || item == "*") {
                    match = true;
                }
            });
            return match;
        };
 
        return obj;
    });
 
    /** custom **/
    container.define("factory", ["gmDao", "ScopeDao"], function (gmDao, ScopeDao) {
        var obj = {
            daos: {}
        };
 
        obj.getConfigDao = function () {
            return obj.getDao("config", function () {
                return ScopeDao(gmDao, "$config");
            });
        };
 
        obj.getStorageDao = function () {
            return obj.getDao("storage", function () {
                return ScopeDao(gmDao, "$storage");
            });
        };
 
        obj.getCheckDao = function () {
            return obj.getDao("check", function () {
                return ScopeDao(gmDao, "$check");
            });
        };
 
        obj.getDao = function (key, createFunc) {
            if (!obj.daos.hasOwnProperty(key)) {
                obj.daos[key] = createFunc();
            }
            return obj.daos[key];
        };
 
        return obj;
    });
 
    container.define("constant", [], function () {
        return {
            sources: {
                BAIDU: "baidu",
                WEIYUN: "weiyun",
                LANZOUS: "lanzous",
                TY189: "ty189"
            },
            options: {
                BAIDU_COMPLETE: {
                    name: "baidu_complete",
                    value: "yes"
                },
                BAIDU_TRANS: {
                    name: "baidu_trans",
                    value: "yes"
                },
                BAIDU_CHECK: {
                    name: "baidu_check",
                    value: "yes"
                },
                WEIYUN_TRANS: {
                    name: "weiyun_trans",
                    value: "yes"
                },
                WEIYUN_CHECK: {
                    name: "weiyun_check",
                    value: "yes"
                },
                LANZOUS_TRANS: {
                    name: "lanzous_trans",
                    value: "yes"
                },
                LANZOUS_CHECK: {
                    name: "lanzous_check",
                    value: "yes"
                },
                TY189_COMPLETE: {
                    name: "ty189_complete",
                    value: "yes"
                },
                TY189_TRANS: {
                    name: "ty189_trans",
                    value: "yes"
                },
                TY189_CHECK: {
                    name: "ty189_check",
                    value: "yes"
                }
            }
        };
    });
 
    container.define("resource", [], function () {
        var obj = {};
 
        obj.getErrorIcon = function () {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAP80lEQVR4Xu2dfZAk5V3Hv7+nd29vZ/plYhko9SyikpDc5e52ZkgVgbwQ6ni7AAVHgpCAeCksEy01poiplAqKQoGRSplKJVZSJEAIxhwhctng8WJETQ4T7NnN7aEXRSBGDQrE7emefZ3un9Wz7HFcbqaffu+enfl3nuf39v3M0z3dzwth9NnQFaANnf0oeYwA2OAQjAAYAbDBK7DB0x+NACMANk4FuAljwatUu+xWFYxVPYiqn72A13HR7YyR0qmIhQ6ZsDZKVYZuBOAmxjtedatL2M4Q2wnYzsTbCbQljKgM/gGB5hjeHAGHFGCuis4RMrEaxk7R25YeAHuHehIUvNUjOguEMwFuADSeSuGZVwAyGfiWAA4S8ze1Gef5VHxlZLSUAHSalUaXxV4GXUyEUzKq1YndMP4NhK8Jj+/QZpx/zjWWCM5LA4C1DT+BzdVrmGkvEe2MkGv6XRhPMPHnDTj3luU+ovAAtHdop/EY/z6I3pu+gsl5YHh3TKy6N08eWnomOavJWyosAD3hx/kGMK4EkUg+9SwscpfBdxUZhMIBYE1NvBZi/CYQXZmFRJn5YNw5vtK9oXJ48QeZ+ZRwVBgA+DRolqrdSODfTO0uXqIgaTZh8CIxbtN/5NxGz2IpTV+ytnMHgAGy69peFnwLQCfLBl7mdsz4vsJ8vTbj3Jd3HrkC4DSr27tM9xDRjrwLkYd/Bj824Xb3Ts4uPZuHf99nbgDM19X3k8DHAdqcV/JF8MsMR3i4Wp+1H8gjnswB4B2oWuPqPQS6NI+Ei+uTP61bzm/TU1jOMsZMAfCf4K2y8hUivCbLJMvii8GHgdVLa+byv2cVc2YA2FPq2a6CBwk0mVVyJfXzouJ6u9TZzmwW8WcCQLuhXcbEfzmsf++SFooZHeF1z9NnFw8mbft4e6kD0G5q1zHzZ0CUuq+0i5WpfeZlkHe5YS58PU2/qYrSblavZ4iPpZnA0Nv2+CpjxvlSWnmmBkC7Wb2WIe5MK/CNY5dddvnC2mznkTRyTgUAu6Hu8YB95X2Jk0ap49jkJfLcc/SZxcfjWDlR38QBmJ+qnksKPQjQWNLBbmR7DNiKx2ckPekkUQB6M3WgmBtZqFRzZ35+fMVtJvlGMTEAeBtUa0KbGz3kSRUB3/i3ddN+MwGchKfEAJhvqPcT0WVJBDWyEVABj28yZpwbk6hTIgC069r7WOCOJAIa2ZCoALNHoLP1lv0PEq0HNokNgNWYOBU0PrfR3+rFFSJ8f35Od5030Czmw/d9uUcCAGhPgHB6nCBGfSNX4G7DtK+N3DvufIDeY17gs3ECGPWNVwFyu2fFeWcQeQTw19lZrD1LhFq8FEa941WAj+ims40AL4qdyADMN9TPENGvRHE66pN0BbwPGmbnz6JYjQTAfL1yOgnliSgOR32Sr4D/lFAAP6+b9gthrUcCwGqoB0B0flhno/bpVYCB22umfX1YD6EBmG9UmkTKP4V1lFR7Bi8QqJKUvbTsMGM+y/sjvy5YcbbU5vB/YXIKD0BT/Wp+EzrdiwiK5YEfKjQEjP16x77aUtX9/gObMILEahvhCWEoAOy6utUjHM5+dg+vsse7azOdR/0Ctae0s1jhRwv58MkXv2XvIcDlbdhkbVZ9WDOBwL8XMJbsn6Yn4ciCFAoAq6neC9BVssaTacdLYL7UaHUeOtae3VDPcQnTxZpkyg8YpvOK6e68BZPWSeo0EZ2TTD0GWyHGR/SW/SeyvqQB8P/3t6E+n+nETuZlwThfm3H+7kQJ2U31HR7gzz3If3HJMb/842PNciRg4Omaaf9C4gBYdfU3IOgTsoZjtwsQf91+ISAYIP56nD4E7c3qNEDnxq5NgAFy8RZ91v6WjB/pEcBqZP3Mn5cEsFsznb8NSiRXCBgH9JZ9kX/NHxSnv3lVm7X9IFwQlE/c7/1Z2LWW86sydqQAWNusAUdkDCbbpuAQ+OKTfUnQzmFZiu/X319vaLTsVxHQDdJDCoD5ZvVWgvhIkLF0vi8oBAUV/+glB3xFzXT2BWkiBYDV1L4H4HVBxtL7vmAQFFz8ng7MXzRaztVBmgQCYNfVV3uC/jfIUPrfFwSCMoi/RsBzhun8VJAugQBY9eo1EOLuIEPZfJ8zBKURf00NWsXr9UO2P3r3/QQD0NA+D8IvZyOwjJecICiZ+L0xwOMP1GacP48JgPo/IDpJRprs2vASubRL5r9uIn8RSyh+DwDwvprpXBEZgMWpza9ZUcYLudGhv+OW4uHCfk8Jj016bbWSeDgioA8apv1Omb5WU5sGINVWxl78NsH3AQMvAe1G5SIm5WvxA0nHgv8KVLh0XmojQUl/+cdWW1+1VTqETj8FAgCofphJSL9YSEfmwVZDQ8DwJ7NsCox1CMTv3QgGPBYeCMB8Q/scEfYGFivnBmEgsBrV8wHaPxCCIRG/B4CH6/QZu++inYEAWA3tIAhvzllfKfeJQTBE4vduBBl/WmvZH450CZhvaA4ReseqlOETGwJZ8QGl3dCms3ixE7vujGmjZV8cGgA+FRNtQyvEfrZhihAZgnDi3w/CJWHiyqstM3+31nKmwgPQmwCixVp3llvSIf4dWI3qBYD4gL5sv5uexMqgmHntl18a8XuXAPB/1Eyn76kqfe8BnDdWT3YnxHN5iRjXb5iRQMZXGcV/6R7AqbVsLfQIsFjffMqKGM9tE2MZUYLaJAVBWcVfr49u2qLfhhJ9R4D8JoEEyRru+7gQlF18v1rC45P6nW7W/xJQr+50hchku9JwkoZvHRWCYRC/9yxgwFvBvgDYDfUNHlHpjkHrh0dYCIZF/N4IwLxVazn/cqLa9AVgYcfkltXxsUKdbxP+t/9jPaQ3VOgdZgH6drHWHUSrwHi3u6Xy3cX/CgUAT6HWVrRQ68yihZdRL4mp28dH4q9A8hR+uNDL0CTKp1u2QU+hHQ4AgNpNLdKmAxIxZdskgvjrAQ4DBJH+BfgFsJrqYiFW3cTBJYb4wwCBv/V8rWWroZ8DvATAc2U+yYuZ76+1nMvj8HMUgob2Vo/4QOkuB8z/bbScn4kGQEP7DghvSqKA2dv48YWa/WKwGpNnGK3FfwyK0a6rb3MFfAjKc+oJ43GjZZ8ZDYCm+kWA3hNUmMJ9Lznsv7xih8+WXYZWunsCxp1Gy+47p2PwfICmegNAf1g4gQcFFFr89bV68rONywQBAx+tmfat0UaAunolBP1FaQCILP56hsMHATH26C37q5EAKNX277HFjwZBYXcqeSkd4fG2QWcMDLwEcBOVNrS+M0qLMzKEueHT/lpmJg973rnrW9IMytPfqcQj+pvi1OKVkRimPVBjmZVBxf4nkNgv/3gJ5S8HiSw+SYEgZv77Wst5+yDTgQDMN7TbiPA7KcQX32Rq4oe/HBQSAuY/MFrOwJv4QAB606hJHIivVsIWUhe//BAQ421BZwoEArA2OVR1CnUIVGbilxgC5mW95VSDtq4JBMAvgdXUvgngrIR/w9HMZS5+WSHghw3TCdzOVwqAdqMgS8Ry35CpPDeGMkvDfbSlAOjtEkLwl4lLtY/20w7oJTtvP/XduMoAAa/qcF5NJqwgLaQFtZrqQwCdF2Qwle8LI345LgcMvq9mOu+W0UIegEb1apD4gozRRNsUTvyXIch0k4oQRSV2L9FbC1LL+qUB8P8NWLr2AhH6Ti4IEaNc08KKvxZ+mImmmT0nYH5ebzknyx4sKQ3A2r8B9dMAvV9OvXit/P32ja69ZdDmBuse8tyZw4dA8bBbZqcSq67+HgT9UbzKDO5N8G7Vzc5HZX2EAqC3WojGns7uVHB+RDed3f12vMx6B85+RZUZCebr1V1ENA2iCVlxwrbzt80RHfpZ/Yj9omzfUAD0RoGGdjcI18g6iN+OH9GXnIuOX7hZFPGP3hEMWJDaE1/0TlQfj1+PQRb4E4bp/FYYH+EBmJp4LcT497L8S8jgx4wl5/x1CIom/iAIMhOfeUVZ5lPUJzuhFvSGBsBPdr6h3kdEiUy2lKV1HQJsBme167ZsbMe2O/ZyYE1VdkMRf5X+L9/fCUR+h/Bj440EgL1T3eaN0eEoBYrTh5m/QaAOCH13vIhjP6m+awdb4VaAbkrK5sCBH7y4adV9XeXQ4n+G9RcJgLV7AfXjIPpgWIej9slXgBm/W2vZt0SxHBkA3ga1vVl9BqCfjOJ41CeZCvhHxBimfZrM2QAn8hgZgLVRoPpekLgnmVRGVqJUQLj8Dm3WeSxKX79PLAB6EBTpVXHUKpS1H/OXjZbzi3HCjw2Av5/wshg/XKbt5OIUrDh9+QXq0OvDPPRJ/BKwbtCqV6+CEPcWpzhDHgkzC2CX1nK+ETfT2CPAUQia2l0AfiluQKP+wRUI+7x/kMXEAPDXEFjQDhPwc8EpjFrEqMB3dNM+M2iun6z9xADwHTpT1amuQgdLtXpWtlLFaPejTd5qY3Jm6ftJhZMoAH5Qdl19uyfgH+w8llSQIzv+3APYY+y9RW11DiVZj8QB6EHQUPd4wL7sXhsnWZIi2uIl8txz9JnFx5OOLhUA/CDbzeq1DHFn0gFvPHvssssX1mY7j6SRe2oAvATB9QzxsTQC3zA2Pb7KmHG+lFa+qQKwBoF2nf+qMsv5A2kVK1O7zMsg73LDXPh6mn5TB6AHQUO7jIm/PLoxlJPSv+ETbvcCfXbxoFyP6K0yAcAPzz+6DQo9MPqLGCjWi2KVz9YOOZnMt8gMAD9ta6ryJlbE/QTaEliGDdiAwbNY6V5em1t6Oqv0MwXAT4pPhd42NP+9QYEOWMyq3AP8MH9SJ+dDZGI1y2gyB2A9Oauh/jqA29OcJp1lIaP6YsAi132PMbvwYFQbcfrlBoAfdGdnpd5VxD0g2honibL2ZeZHN62476scXsxtV/ZcAehdEgBhNbTriPjmjTK9zJ/GJVx8SJ+1H8gb3twBWC8A904pU/1lU78GkJJ3YdLw72/cDOAWo23fTk9hOQ0fYW0WBoD1wO26utUl3JT1uoOwhQvdnvlTY+T9cdVc+GHovil2KBwA67n2TuxgupGAPaV9isi8AsId41335n4ndqSorZTpwgLwChBANxDoXVIZFaCRP9QT8d3jq+4tURZrZJlC4QE4eo/gPz/QqpdCiCvAfK7UEfAZVpKBNjH2E2OftmIfCDqFNMPQBroqDQDHZuE/TLI17V2e4AvBtIsItXwKyj9kxrRgmtZn7P35xBDPaykBeAUMgGjvnDwdY4q/JZq/h9EZab10Whva8RjQO0jqYd20j8Qrf/69Sw/A8SVc28qm8kYB2s4ktgO8HcCOUEffMDMTPUPgOQBzzJhTgDm15fxrUpMx85d+LYKhA2BQYf2j8BZ5stqFV1WgVF1SKn57Aa/jotsZUxSnYi10+h2xVhTRkoxjQwGQZOGGxdYIgGFRMmIeIwAiFm5Yuo0AGBYlI+YxAiBi4Yal2wiAYVEyYh7/DxzAVeoLWvApAAAAAElFTkSuQmCC";
        };
 
        obj.getSuccessIcon = function () {
            return "data:image/png;base64,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";
        };
 
        obj.getLockIcon = function () {
            return "data:image/png;base64,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";
        };
 
        obj.getOtherIcon = function () {
            return "data:image/png;base64,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";
        }
 
        obj.getStyleText = function () {
            return ".one-pan-tip { cursor: pointer;}" +
                ".one-pan-tip::before {background-position: center;background-size: 100% 100%;background-repeat: no-repeat;box-sizing: border-box;width: 1em;height: 1em;margin: 0 1px .15em 1px;vertical-align: middle;display: inline-block;}" +
                ".one-pan-tip-success::before {content: '';background-image: url(" + obj.getSuccessIcon() + ")}" +
                ".one-pan-tip-error {text-decoration: line-through;}" +
                ".one-pan-tip-error::before {content: '';background-image: url(" + obj.getErrorIcon() + ")}" +
                ".one-pan-tip-other::before {content: '';background-image: url(" + obj.getOtherIcon() + ")}" +
                ".one-pan-tip-lock::before{content: '';background-image: url(" + obj.getLockIcon() + ")}";
        };
 
        return obj;
    });
 
    container.define("api", ["http", "manifest", "oneData", "constant", "svgCrypt"], function (http, manifest, oneData, constant, svgCrypt) {
        var obj = {};
 
        obj.versionQuery = function (callback) {
            oneData.requestOneApi(manifest.getApi("version"), {}, callback);
        };
 
        obj.checkLinkBatch = function (linkList, callback) {
            var data = Object.assign(svgCrypt.getReqData(), {
                link_json: JSON.stringify(linkList)
            });
            oneData.requestOneApi(manifest.getApi("valid"), data, callback);
        };
 
        obj.reportLink = function (shareSource, shareId, checkState, callback) {
            var data = {
                share_source: shareSource,
                share_id: shareId,
                share_point: svgCrypt.getStrPoint(shareId),
                check_state: checkState
            };
            oneData.requestOneApi(manifest.getApi("report"), data, callback);
        };
 
        obj.checkLinkLocal = function (shareSource, shareId, callback) {
            if (shareSource == constant.sources.BAIDU) {
                obj.checkLinkBaidu(shareId, callback);
            }
            else if (shareSource == constant.sources.LANZOUS) {
                obj.checkLinkLanzous(shareId, callback);
            }
            else if (shareSource == constant.sources.WEIYUN) {
                obj.checkLinkWeiyun(shareId, callback);
            } else if (shareSource == constant.sources.TY189) {
                obj.checkLinkTy189(shareId, callback);
            }
            else {
                callback({
                    state: 0
                });
            }
        };
 
        obj.checkLinkBaidu = function (shareId, callback) {
            var url;
            if (shareId.indexOf("http") < 0) {
                url = "https://pan.baidu.com/s/1" + shareId;
            }
            else {
                url = shareId;
            }
            http.ajax({
                type: "get",
                url: url,
                success: function (response) {
                    var state = 1;
                    if (response.indexOf("输入提取码") > 0) {
                        state = 2;
                    }
                    else if (response.indexOf("页面不存在了") > 0) {
                        state = -1;
                    }
                    else if (response.indexOf("可能的原因") > 0 || response.indexOf("分享的文件已经被取消了") > 0 || response.indexOf("分享内容可能因为涉及侵权") > 0) {
                        state = -1;
                    }
                    callback && callback({
                        state: state
                    });
                },
                error: function () {
                    callback && callback({
                        state: 0
                    });
                }
            });
        };
 
        obj.checkLinkLanzous = function (shareId, callback) {
            var url;
            if (shareId.indexOf("http") < 0) {
                url = "https://www.lanzous.com/" + shareId;
            }
            else {
                url = shareId;
            }
            http.ajax({
                type: "get",
                url: url,
                success: function (response) {
                    var state = 1;
                    if (response.indexOf("输入密码") > 0) {
                        state = 2;
                    }
                    else if (response.indexOf("来晚啦") > 0) {
                        state = -1;
                    }
                    callback && callback({
                        state: state
                    });
                },
                error: function () {
                    callback && callback({
                        state: 0
                    });
                }
            });
        };
 
        obj.checkLinkWeiyun = function (shareId, callback) {
            var url;
            if (shareId.indexOf("http") < 0) {
                url = "https://share.weiyun.com/" + shareId;
            }
            else {
                url = shareId;
            }
            http.ajax({
                type: "get",
                url: url,
                success: function (response) {
                    var state = 1;
                    if (response.indexOf("链接已删除") > 0) {
                        state = -1;
                    }
                    else if (response.indexOf('"share_key":null') > 0) {
                        state = 2;
                    }
                    callback && callback({
                        state: state
                    });
                },
                error: function () {
                    callback && callback({
                        state: 0
                    });
                }
            });
        };
 
        obj.checkLinkTy189 = function (shareId, callback) {
            var url;
            if (shareId.indexOf("http") < 0) {
                url = "https://cloud.189.cn/t/" + shareId;
            }
            else {
                url = shareId;
            }
            http.ajax({
                type: "get",
                url: url,
                success: function (response) {
                    var state = 1;
                    if (response.indexOf("页面地址有误") > 0 || response.indexOf("页面不存在") > 0) {
                        state = -1;
                    }
                    else if (response.indexOf("私密分享") > 0) {
                        state = 2;
                    }
                    callback && callback({
                        state: state
                    });
                },
                error: function () {
                    callback && callback({
                        state: 0
                    });
                }
            });
        };
 
        return obj;
    });
 
    container.define("checkManage", ["logger", "calendar", "factory", "api"], function (logger, calendar, factory, api) {
        var obj = {
            active: false,
            timer: null,
            queues: []
        };
 
        obj.activeQueue = function () {
            if (!obj.active) {
                obj.active = true;
                obj.consumeQueue();
            }
        };
 
        obj.consumeQueue = function () {
            if (obj.queues.length) {
                obj.timer && clearTimeout(obj.timer);
 
                var items = [];
                while (obj.queues.length && items.length < 5) {
                    items.push(obj.queues.shift());
                }
                obj.checkLinkBatch(items, obj.consumeQueue);
            }
            else {
                obj.active = false;
                obj.timer = setTimeout(obj.consumeQueue, 1000);
            }
        };
 
        obj.checkLinkAsync = function (shareSource, shareId, bearTime, callback) {
            obj.queues.push({
                share_source: shareSource,
                share_id: shareId,
                bear_time: bearTime,
                callback: callback
            });
 
            obj.activeQueue();
        };
 
        obj.checkLinkBatch = function (items, callback) {
            obj.syncLinkBatch(items, function () {
                callback();
 
                items.forEach(function (item) {
                    try {
                        obj.checkLink(item.share_source, item.share_id, item.bear_time, item.callback);
                    }
                    catch (err) {
                        logger.error(err);
                    }
                });
            });
        };
 
        obj.checkLink = function (shareSource, shareId, bearTime, callback) {
            var item = obj.getItem(shareSource, shareId);
            bearTime || (bearTime = 86400 * 3);
            if (item instanceof Object && item.check_time > calendar.getTime() - bearTime) {
                callback && callback({
                    state: item.check_state
                });
            }
            else {
                api.checkLinkLocal(shareSource, shareId, function (item) {
                    if (item instanceof Object && item.state != 0) {
                        obj.setItem(shareSource, shareId, item.state);
                        api.reportLink(shareSource, shareId, item.state);
                    }
                    callback && callback(item);
                });
            }
        };
 
        obj.syncLinkBatch = function (items, callback) {
            var linkList = [];
            items.forEach(function (item) {
                linkList.push(obj.buildShareKey(item.share_source, item.share_id));
            });
            api.checkLinkBatch(linkList, function (response) {
                if (response instanceof Object && response.code == 1) {
                    for (var i in response.data) {
                        try {
                            var item = response.data[i];
                            var localItem = obj.getItem(item.share_source, item.share_id);
                            if (item.check_state != 0 && (!localItem || item.check_time > localItem.check_time)) {
                                obj.setItem(item.share_source, item.share_id, item.check_state);
                            }
                        }
                        catch (err) {
                            logger.error(err);
                        }
                    }
                }
                callback && callback();
            });
        };
 
        obj.getItem = function (shareSource, shareId) {
            return obj.getDao().get(obj.buildShareKey(shareSource, shareId));
        };
 
        obj.setItem = function (shareSource, shareId, checkState) {
            obj.getDao().set(obj.buildShareKey(shareSource, shareId), obj.buildItem(shareId, shareSource, checkState));
        };
 
        obj.buildItem = function (shareId, shareSource, checkState) {
            return {
                share_id: shareId,
                share_source: shareSource,
                check_state: checkState,
                check_time: calendar.getTime()
            };
        };
 
        obj.buildShareKey = function (shareSource, shareId) {
            return shareSource + "#" + shareId;
        };
 
        obj.getDao = function () {
            return factory.getCheckDao();
        };
 
        return obj;
    });
 
    container.define("runtime", ["calendar", "storage", "api"], function (calendar, storage, api) {
        var obj = {};
 
        obj.initVersion = function () {
            var versionDate = parseInt(storage.getValue("version_date"));
            var currentDate = calendar.formatTime("Ymd");
            if (!versionDate || versionDate < currentDate) {
                api.versionQuery(function (response) {
                    storage.setValue("version_date", currentDate);
 
                    if (response && response.code == 1 && response.data instanceof Object) {
                        var versionPayload = response.data;
                        storage.setValue("version_payload", versionPayload);
                        storage.setValue("version_latest", versionPayload.version);
                    }
                });
            }
        };
 
        obj.initRuntime = function () {
            obj.initVersion();
        };
 
        return obj;
    });
 
    container.define("core", ["resource", "runtime", "$"], function (resource, runtime, $) {
        var obj = {};
 
        obj.appendStyle = function () {
            var styleText = resource.getStyleText();
            $("<style></style>").text(styleText).appendTo($("head"));
        };
 
        obj.ready = function (callback) {
            runtime.initRuntime();
 
            obj.appendStyle();
 
            callback && callback();
        };
 
        return obj;
    });
    container.define("app_check_url", ["router", "constant", "config", "option", "checkManage", "findAndReplaceDOMText", "$"], function (router, constant, config, option, checkManage, findAndReplaceDOMText, $) {
        var obj = {
            index: 0,
            prefixs: {
                BAIDU: "https://pan.baidu.com/s/1",
                LANZOUS: "https://www.lanzous.com/",
                WEIYUN: "https://share.weiyun.com/",
                TY189: "https://cloud.189.cn/t/"
            }
        };
 
        obj.run = function () {
            obj.isEnable() && obj.runMatch();
            return false;
        };
 
        obj.isEnable = function () {
            if (typeof findAndReplaceDOMText == "undefined") {
                return false;
            }
 
            if (config.getConfig("check_switch") == "off") {
                return false;
            }
 
            var nowUrl = router.getUrl();
 
            var passUrl = config.getConfig("pass_url");
            var passList = passUrl ? passUrl.split("\n") : [];
            for (var i in passList) {
                if (nowUrl.indexOf(passList[i]) >= 0) {
                    return true;
                }
            }
 
            var ignoreUrl = config.getConfig("ignore_url");
            var ignoreList = ignoreUrl ? ignoreUrl.split("\n") : ["bilibili.com"];
            for (var j in ignoreList) {
                if (nowUrl.indexOf(ignoreList[j]) >= 0) {
                    return false;
                }
            }
 
            return true;
        };
 
        obj.runMatch = function () {
            if (option.isOptionActive(option.constants.BAIDU_COMPLETE)) {
                findAndReplaceDOMText(document.body, {
                    find: /([ ])(\/?s\/1[a-zA-Z0-9_\-]{5,22})/gi,
                    replace: function (portion, match) {
                        return " https://pan.baidu.com" + (match[2].indexOf("/") == 0 ? "" : "/") + match[2];
                    }
                });
            }
            if (option.isOptionActive(option.constants.TY189_COMPLETE)) {
                findAndReplaceDOMText(document.body, {
                    find: /([ ])(\/?t\/[a-zA-Z0-9_\-]{8,14})/gi,
                    replace: function (portion, match) {
                        return " https://cloud.189.cn" + (match[2].indexOf("/") == 0 ? "" : "/") + match[2];
                    }
                });
            }
            obj.replaceTextAsLink(/(?:https?:\/\/)?(yun|pan)\.baidu\.com\/s\/([\w\-]{4,25})\b/gi, constant.sources.BAIDU, function (match) {
                return match[2].slice(1);
            });
            obj.replaceTextAsLink(/(?:https?:\/\/)?www\.lanzous\.com\/([a-zA-Z0-9_\-]{5,22})\b/gi, constant.sources.LANZOUS, function (match) {
                return match[1];
            });
            obj.replaceTextAsLink(/(?:https?:\/\/)?share\.weiyun\.com\/([a-zA-Z0-9_\-]{5,22})\b/gi, constant.sources.WEIYUN, function (match) {
                return match[1];
            });
            obj.replaceTextAsLink(/(?:https?:\/\/)?cloud\.189\.cn\/t\/([a-zA-Z0-9_\-]{8,14})\b/gi, constant.sources.TY189, function (match) {
                return match[1];
            });
            $("a:not(.one-pan-link-mark)").each(function () {
                var $this = $(this);
 
                $this.addClass("one-pan-link-mark");
 
                var match, oneId, oneSource;
                var href = $this.attr("href");
                if (href) {
                    if ((match = /(?:https?:\/\/)?(yun|pan)\.baidu\.com\/s\/([\w\-]{4,25})/gi.exec(href))) {
                        oneId = match[2].slice(1);
                        oneSource = constant.sources.BAIDU;
                    } else if ((match = /(?:https?:\/\/)?www\.lanzous\.com\/([a-zA-Z0-9_\-]{5,22})/gi.exec(href))) {
                        oneId = match[1];
                        oneSource = constant.sources.LANZOUS;
                    }
                    else if ((match = /(?:https?:\/\/)?share\.weiyun\.com\/([a-zA-Z0-9_\-]{5,22})/gi.exec(href))) {
                        oneId = match[1];
                        oneSource = constant.sources.WEIYUN;
                    } else if ((match = /(?:https?:\/\/)?cloud\.189\.cn\/t\/([a-zA-Z0-9_\-]{8,14})/gi.exec(href))) {
                        oneId = match[1];
                        oneSource = constant.sources.TY189;
                    }
                }
 
                if (match && $this.find(".one-pan-tip").length == 0) {
                    var node = obj.createOnePanNode(oneId, oneSource);
                    $this.wrapInner(node);
                }
            });
            $(".one-pan-tip:not(.one-pan-tip-mark)").each(function () {
                var $this = $(this);
 
                $this.addClass("one-pan-tip-mark");
 
                var shareSource = $this.attr("one-source");
                var shareId = $this.attr("one-id");
 
                var parentNode = this.parentNode;
                if (parentNode.nodeName != "A") {
                    if (obj.isTransEnable(shareSource)) {
                        $this.wrap('<a href="' + this.textContent + '" target="_blank"></a>');
                    }
                }
 
                if (obj.isCheckEnable(shareSource)) {
                    checkManage.checkLinkAsync(shareSource, shareId, 0, function (response) {
                        if (response.state == 2) {
                            $this.addClass("one-pan-tip-lock");
                        }
                        else if (response.state == 1) {
                            $this.addClass("one-pan-tip-success");
                        }
                        else if (response.state == -1) {
                            $this.addClass("one-pan-tip-error");
                        }
                        else {
                            $this.addClass("one-pan-tip-other");
                        }
                    });
                }
            });
 
            var checkTimes = obj.getCheckTimes();
            if (checkTimes == 0 || obj.index < checkTimes) {
                obj.index++;
                setTimeout(obj.runMatch, 1000 * obj.getCheckInterval());
            }
        };
 
        obj.replaceTextAsLink = function (shareMatch, shareSource, getShareId) {
            findAndReplaceDOMText(document.body, {
                find: shareMatch,
                replace: function (portion, match) {
                    var parentNode = portion.node.parentNode;
                    if (parentNode.nodeName == "SPAN" && $(parentNode).hasClass("one-pan-tip")) {
                        return portion.text;
                    }
                    else {
                        var shareId = getShareId(match);
                        var node = obj.createOnePanNode(shareId, shareSource);
                        node.textContent = obj.buildShareUrl(shareId, shareSource);
                        return node;
                    }
                }
            });
        };
 
        obj.isTransEnable = function (shareSource) {
            if (shareSource == constant.sources.BAIDU && option.isOptionActive(option.constants.BAIDU_TRANS)) {
                return true;
            }
            else if (shareSource == constant.sources.LANZOUS && option.isOptionActive(option.constants.LANZOUS_TRANS)) {
                return true;
            }
            else if (shareSource == constant.sources.WEIYUN && option.isOptionActive(option.constants.WEIYUN_TRANS)) {
                return true;
            }
            else if (shareSource == constant.sources.TY189 && option.isOptionActive(option.constants.TY189_TRANS)) {
                return true;
            }
            else {
                return false;
            }
        };
 
        obj.isCheckEnable = function (shareSource) {
            if (shareSource == constant.sources.BAIDU && option.isOptionActive(option.constants.BAIDU_CHECK)) {
                return true;
            }
            else if (shareSource == constant.sources.LANZOUS && option.isOptionActive(option.constants.LANZOUS_CHECK)) {
                return true;
            }
            else if (shareSource == constant.sources.WEIYUN && option.isOptionActive(option.constants.WEIYUN_CHECK)) {
                return true;
            }
            else if (shareSource == constant.sources.TY189 && option.isOptionActive(option.constants.TY189_CHECK)) {
                return true;
            }
            else {
                return false;
            }
        };
 
        obj.getCheckTimes = function () {
            var checkTimes = parseInt(config.getConfig("check_times"));
            if (isNaN(checkTimes)) {
                checkTimes = 3;
            }
            return checkTimes;
        };
 
        obj.getCheckInterval = function () {
            var checkInterval = parseInt(config.getConfig("check_interval"));
            if (isNaN(checkInterval)) {
                checkInterval = 2;
            }
            else if (checkInterval < 1) {
                checkInterval = 1;
            }
            return checkInterval;
        };
 
        obj.createOnePanNode = function (shareId, shareSource) {
            var node = document.createElementNS(document.lookupNamespaceURI(null) || "http://www.w3.org/1999/xhtml", "span");
            node.setAttribute("class", "one-pan-tip");
            node.setAttribute("one-id", shareId);
            node.setAttribute("one-source", shareSource);
            return node;
        };
 
        obj.buildShareUrl = function (shareId, shareSource) {
            var shareUrl = shareId;
            if (shareSource == constant.sources.BAIDU) {
                shareUrl = obj.prefixs.BAIDU + shareId;
            }
            else if (shareSource == constant.sources.LANZOUS) {
                shareUrl = obj.prefixs.LANZOUS + shareId;
            }
            else if (shareSource == constant.sources.WEIYUN) {
                shareUrl = obj.prefixs.WEIYUN + shareId;
            } else if (shareSource == constant.sources.TY189) {
                shareUrl = obj.prefixs.TY189 + shareId;
            }
            return shareUrl;
        };
 
        return obj;
    });
 
    container.define("app_manage", ["meta", "unsafeWindow"], function (meta, unsafeWindow) {
        var obj = {};
 
        obj.run = function () {
            if (meta.existMeta("manage")) {
                unsafeWindow.OneLink = container;
                return true;
            }
        };
 
        return obj;
    });
 
    container.define("app", ["appRunner"], function (appRunner) {
        var obj = {};
 
        obj.run = function () {
            appRunner.run([
                {
                    name: "app_check_url",
                    matchs: [
                        "*"
                    ]
                },
                {
                    name: "app_manage",
                    matchs: [
                        "*"
                    ]
                }
            ]);
        };
 
        return obj;
    });
 
    // lib
    container.define("$", [], function () {
        return window.$;
    });
    container.define("Snap", [], function () {
        if (typeof Snap != "undefined") {
            return Snap;
        }
        else {
            return window.Snap;
        }
    });
    container.define("findAndReplaceDOMText", [], function () {
        if (typeof findAndReplaceDOMText != "undefined") {
            return findAndReplaceDOMText;
        }
        else {
            return window.findAndReplaceDOMText;
        }
    });
 
    container.use(["gm", "core", "app"], function (gm, core, app) {
        gm.ready(function () {
            core.ready(app.run);
        });
    });
})();
(function () {
    'use strict';
 
    var manifest = {
        "name": "wpzs",
        "urls": {},
        "apis": {
            "version": "https://api.newday.me/share/disk/version",
            "origin": "https://api.newday.me/share/disk/origin",
            "query": "https://api.newday.me/share/disk/query",
            "store": "https://api.newday.me/share/disk/store",
            "lists": "https://api.newday.me/share/disk/lists",
            "delete": "https://api.newday.me/share/disk/delete"
        },
        "logger_level": 3,
        "options_page": "http://go.newday.me/s/pan-option"
    };
 
    var container = (function () {
        var obj = {
            defines: {},
            modules: {}
        };
 
        obj.define = function (name, requires, callback) {
            name = obj.processName(name);
            obj.defines[name] = {
                requires: requires,
                callback: callback
            };
        };
 
        obj.require = function (name, cache) {
            if (typeof cache == "undefined") {
                cache = true;
            }
 
            name = obj.processName(name);
            if (cache && obj.modules.hasOwnProperty(name)) {
                return obj.modules[name];
            } else if (obj.defines.hasOwnProperty(name)) {
                var requires = obj.defines[name].requires;
                var callback = obj.defines[name].callback;
 
                var module = obj.use(requires, callback);
                cache && obj.register(name, module);
                return module;
            }
        };
 
        obj.use = function (requires, callback) {
            var module = {
                exports: undefined
            };
            var params = obj.buildParams(requires, module);
            var result = callback.apply(this, params);
            if (typeof result != "undefined") {
                return result;
            } else {
                return module.exports;
            }
        };
 
        obj.register = function (name, module) {
            name = obj.processName(name);
            obj.modules[name] = module;
        };
 
        obj.buildParams = function (requires, module) {
            var params = [];
            requires.forEach(function (name) {
                params.push(obj.require(name));
            });
            params.push(obj.require);
            params.push(module.exports);
            params.push(module);
            return params;
        };
 
        obj.processName = function (name) {
            return name.toLowerCase();
        };
 
        return {
            define: obj.define,
            use: obj.use,
            register: obj.register,
            modules: obj.modules
        };
    })();
 
    container.define("gm", [], function () {
        var obj = {};
 
        obj.ready = function (callback) {
            if (typeof GM_getValue != "undefined") {
                callback && callback();
            }
            else {
                setTimeout(function () {
                    obj.ready(callback);
                }, 100);
            }
        };
 
        return obj;
    });
 
    /** common **/
    container.define("gmDao", [], function () {
        var obj = {
            items: {}
        };
 
        obj.get = function (name) {
            return GM_getValue(name);
        };
 
        obj.getBatch = function (names) {
            var items = {};
            names.forEach(function (name) {
                items[name] = obj.get(name);
            });
            return items;
        };
 
        obj.getAll = function () {
            return obj.getBatch(GM_listValues());
        };
 
        obj.set = function (name, item) {
            GM_setValue(name, item);
        };
 
        obj.setBatch = function (items) {
            for (var name in items) {
                obj.set(name, items[name]);
            }
        };
 
        obj.setAll = function (items) {
            var names = GM_listValues();
            names.forEach(function (name) {
                if (!items.hasOwnProperty(name)) {
                    obj.remove(name);
                }
            });
            obj.setBatch(items);
        };
 
        obj.remove = function (name) {
            GM_deleteValue(name);
        };
 
        obj.removeBatch = function (names) {
            names.forEach(function (name) {
                obj.remove(name);
            });
        };
 
        obj.removeAll = function () {
            obj.removeBatch(GM_listValues());
        };
 
        return obj;
    });
 
    container.define("ScopeDao", [], function () {
        return function (dao, scope) {
            var obj = {
                items: {}
            };
 
            obj.get = function (name) {
                return obj.items[name];
            };
 
            obj.getBatch = function (names) {
                var items = {};
                names.forEach(function (name) {
                    if (obj.items.hasOwnProperty(name)) {
                        items[name] = obj.items[name];
                    }
                });
                return items;
            };
 
            obj.getAll = function () {
                return obj.items;
            };
 
            obj.set = function (name, item) {
                obj.items[name] = item;
 
                obj.sync();
            };
 
            obj.setBatch = function (items) {
                obj.items = Object.assign(obj.items, items);
 
                obj.sync();
            };
 
            obj.setAll = function (items) {
                obj.items = Object.assign({}, items);
 
                obj.sync();
            };
 
            obj.remove = function (name) {
                delete obj.items[name];
 
                obj.sync();
            };
 
            obj.removeBatch = function (names) {
                names.forEach(function (name) {
                    delete obj.items[name];
                });
 
                obj.sync();
            };
 
            obj.removeAll = function () {
                obj.items = {};
 
                obj.getDao().remove(obj.getScope());
            };
 
            obj.init = function () {
                var items = obj.getDao().get(obj.getScope());
                if (items instanceof Object) {
                    obj.items = items;
                }
            };
 
            obj.sync = function () {
                obj.getDao().set(obj.getScope(), obj.items);
            };
 
            obj.getDao = function () {
                return dao;
            };
 
            obj.getScope = function () {
                return scope;
            };
 
            return obj.init(), obj;
        };
    });
 
    container.define("config", ["factory"], function (factory) {
        var obj = {};
 
        obj.getConfig = function (name) {
            return obj.getDao().get(name);
        };
 
        obj.setConfig = function (name, value) {
            obj.getDao().set(name, value);
        };
 
        obj.getAll = function () {
            return obj.getDao().getAll();
        };
 
        obj.getDao = function () {
            return factory.getConfigDao();
        };
 
        return obj;
    });
 
    container.define("storage", ["factory"], function (factory) {
        var obj = {};
 
        obj.getValue = function (name) {
            return obj.getDao().get(name);
        };
 
        obj.setValue = function (name, value) {
            obj.getDao().set(name, value);
        };
 
        obj.getAll = function () {
            return obj.getDao().getAll();
        };
 
        obj.getDao = function () {
            return factory.getStorageDao();
        };
 
        return obj;
    });
 
    container.define("option", ["config", "constant"], function (config, constant) {
        var obj = {
            name: "option",
            constant: constant.option
        };
 
        obj.isOptionActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            return option.indexOf(name) >= 0 ? true : false;
        };
 
        obj.setOptionActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            if (option.indexOf(name) < 0) {
                option.push(name);
                obj.setOption(option);
            }
        };
 
        obj.setOptionUnActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            var index = option.indexOf(name);
            if (index >= 0) {
                delete option[index];
                obj.setOption(option);
            }
        };
 
        obj.getOption = function () {
            var option = [];
            var optionList = obj.getOptionList();
            Object.values(obj.constant).forEach(function (item) {
                var name = item.name;
                if (optionList.hasOwnProperty(name)) {
                    if (optionList[name] != "no") {
                        option.push(name);
                    }
                }
                else if (item.value != "no") {
                    option.push(name);
                }
            });
            return option;
        };
 
        obj.setOption = function (option) {
            var optionList = {};
            Object.values(obj.constant).forEach(function (item) {
                var name = item.name;
                if (option.indexOf(name) >= 0) {
                    optionList[name] = "yes";
                } else {
                    optionList[name] = "no";
                }
            });
            obj.setOptionList(optionList);
        };
 
        obj.getOptionList = function () {
            var optionList = config.getConfig(obj.name);
            return optionList ? optionList : {};
        };
 
        obj.setOptionList = function (optionList) {
            config.setConfig(obj.name, optionList);
        };
 
        return obj;
    });
 
    container.define("manifest", [], function () {
        var obj = {
            manifest: manifest
        };
 
        obj.getItem = function (name) {
            return obj.manifest[name];
        };
 
        obj.getManifest = function () {
            return obj.manifest;
        };
 
        obj.getName = function () {
            return obj.getItem("name");
        };
 
        obj.getAppName = function () {
            return obj.getItem("app_name");
        };
 
        obj.getUrl = function (name) {
            var urls = obj.getItem("urls");
            (urls instanceof Object) || (urls = {});
            return urls[name];
        };
 
        obj.getApi = function (name) {
            var apis = obj.getItem("apis");
            (apis instanceof Object) || (apis = {});
            return apis[name];
        };
 
        obj.getOptionsPage = function () {
            if (GM_info.script.optionUrl) {
                return GM_info.script.optionUrl;
            }
            else {
                return obj.getItem("options_page");
            }
        };
 
        return obj;
    });
 
    container.define("env", ["config", "manifest"], function (config, manifest) {
        var obj = {
            modes: {
                ADDON: "addon",
                SCRIPT: "script"
            },
            browsers: {
                FIREFOX: "firefox",
                EDG: "edg",
                EDGE: "edge",
                BAIDU: "baidu",
                LIEBAO: "liebao",
                UC: "uc",
                QQ: "qq",
                SOGOU: "sogou",
                OPERA: "opera",
                MAXTHON: "maxthon",
                IE2345: "2345",
                SE360: "360",
                CHROME: "chrome",
                SAFIRI: "safari",
                OTHER: "other"
            }
        };
 
        obj.getName = function () {
            return manifest.getName();
        };
 
        obj.getMode = function () {
            if (GM_info.mode) {
                return GM_info.mode;
            }
            else {
                return obj.modes.SCRIPT;
            }
        };
 
        obj.getAid = function () {
            if (GM_info.scriptHandler) {
                return GM_info.scriptHandler.toLowerCase();
            }
            else {
                return "unknown";
            }
        };
 
        obj.getUid = function () {
            var uid = config.getConfig("uid");
            if (!uid) {
                uid = obj.randString(32);
                config.setConfig("uid", uid);
            }
            return uid;
        };
 
        obj.getBrowser = function () {
            if (!obj._browser) {
                obj._browser = obj.matchBrowserType(navigator.userAgent);
            }
            return obj._browser;
        };
 
        obj.getVersion = function () {
            return GM_info.script.version;
        };
 
        obj.getEdition = function () {
            return GM_info.version;
        };
 
        obj.getInfo = function () {
            return {
                mode: obj.getMode(),
                aid: obj.getAid(),
                uid: obj.getUid(),
                browser: obj.getBrowser(),
                version: obj.getVersion(),
                edition: obj.getEdition()
            };
        };
 
        obj.matchBrowserType = function (userAgent) {
            var browser = obj.browsers.OTHER;
            userAgent = userAgent.toLowerCase();
            if (userAgent.match(/firefox/) != null) {
                browser = obj.browsers.FIREFOX;
            } else if (userAgent.match(/edge/) != null) {
                browser = obj.browsers.EDGE;
            } else if (userAgent.match(/edg/) != null) {
                browser = obj.browsers.EDG;
            } else if (userAgent.match(/bidubrowser/) != null) {
                browser = obj.browsers.BAIDU;
            } else if (userAgent.match(/lbbrowser/) != null) {
                browser = obj.browsers.LIEBAO;
            } else if (userAgent.match(/ubrowser/) != null) {
                browser = obj.browsers.UC;
            } else if (userAgent.match(/qqbrowse/) != null) {
                browser = obj.browsers.QQ;
            } else if (userAgent.match(/metasr/) != null) {
                browser = obj.browsers.SOGOU;
            } else if (userAgent.match(/opr/) != null) {
                browser = obj.browsers.OPERA;
            } else if (userAgent.match(/maxthon/) != null) {
                browser = obj.browsers.MAXTHON;
            } else if (userAgent.match(/2345explorer/) != null) {
                browser = obj.browsers.IE2345;
            } else if (userAgent.match(/chrome/) != null) {
                if (navigator.mimeTypes.length > 10) {
                    browser = obj.browsers.SE360;
                } else {
                    browser = obj.browsers.CHROME;
                }
            } else if (userAgent.match(/safari/) != null) {
                browser = obj.browsers.SAFIRI;
            }
            return browser;
        };
 
        obj.randString = function (length) {
            var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
            var text = "";
            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };
 
        return obj;
    });
 
    container.define("http", [], function () {
        var obj = {};
 
        obj.ajax = function (option) {
            var details = {
                method: option.type,
                url: option.url,
                responseType: option.dataType,
                onload: function (result) {
                    if (!result.status || parseInt(result.status / 100) == 2) {
                        option.success && option.success(result.response);
                    }
                    else {
                        option.error && option.error("");
                    }
                },
                onerror: function (result) {
                    option.error && option.error(result.error);
                }
            };
 
            // 提交数据
            if (option.data instanceof Object) {
                if (option.data instanceof FormData) {
                    details.data = option.data;
                }
                else {
                    var formData = new FormData();
                    for (var i in option.data) {
                        formData.append(i, option.data[i]);
                    }
                    details.data = formData;
                }
            }
 
            // 自定义头
            if (option.headers) {
                details.headers = option.headers;
            }
 
            // 超时
            if (option.timeout) {
                details.timeout = option.timeout;
            }
 
            GM_xmlhttpRequest(details);
        };
 
        return obj;
    });
 
    container.define("router", [], function () {
        var obj = {};
 
        obj.getUrl = function () {
            return location.href;
        };
 
        obj.goUrl = function (url) {
            location.href = url;
        };
 
        obj.openUrl = function (url) {
            window.open(url);
        };
 
        obj.openTab = function (url, active) {
            GM_openInTab(url, !active);
        };
 
        obj.jumpLink = function (jumpUrl, jumpMode) {
            switch (jumpMode) {
                case 9:
                    // self
                    obj.goUrl(jumpUrl);
                    break;
                case 6:
                    // new
                    obj.openUrl(jumpUrl);
                    break;
                case 3:
                    // new & not active
                    obj.openTab(jumpUrl, false);
                    break;
                case 1:
                    // new & active
                    obj.openTab(jumpUrl, true);
                    break;
            }
        };
 
        obj.getUrlParam = function (name) {
            var param = obj.parseUrlParam(obj.getUrl());
            if (name) {
                return param.hasOwnProperty(name) ? param[name] : null;
            }
            else {
                return param;
            }
        };
 
        obj.parseUrlParam = function (url) {
            if (url.indexOf("?")) {
                url = url.split("?")[1];
            }
            var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
            var obj = {};
            while (reg.exec(url)) {
                obj[RegExp.$1] = RegExp.$2;
            }
            return obj;
        };
 
        return obj;
    });
 
    container.define("logger", ["env", "manifest"], function (env, manifest) {
        var obj = {
            constant: {
                DEBUG: 0,
                INFO: 1,
                WARN: 2,
                ERROR: 3,
                NONE: 4
            }
        };
 
        obj.debug = function (message) {
            obj.log(message, obj.constant.DEBUG);
        };
 
        obj.info = function (message) {
            obj.log(message, obj.constant.INFO);
        };
 
        obj.warn = function (message) {
            obj.log(message, obj.constant.WARN);
        };
 
        obj.error = function (message) {
            obj.log(message, obj.constant.ERROR);
        };
 
        obj.log = function (message, level) {
            if (level < manifest.getItem("logger_level")) {
                return false;
            }
 
            console.group("[" + env.getName() + "]" + env.getMode());
            console.log(message);
            console.groupEnd();
        };
 
        return obj;
    });
 
    container.define("meta", ["env", "$"], function (env, $) {
        var obj = {};
 
        obj.existMeta = function (name) {
            name = obj.processName(name);
            if ($("meta[name='" + name + "']").length) {
                return true;
            }
            else {
                return false;
            }
        };
 
        obj.appendMeta = function (name, content) {
            name = obj.processName(name);
            content || (content = "on");
            $('<meta name="' + name + '" content="on">').appendTo($("head"));
        };
 
        obj.processName = function (name) {
            return env.getName() + "::" + name;
        };
 
        return obj;
    });
 
    container.define("unsafeWindow", [], function () {
        if (typeof unsafeWindow == "undefined") {
            return window;
        }
        else {
            return unsafeWindow;
        }
    });
 
    container.define("svgCrypt", ["Snap"], function (Snap) {
        var obj = {};
 
        obj.getReqData = function () {
            var reqTime = Math.round(new Date().getTime() / 1000);
            var reqPoint = obj.getStrPoint("timestamp:" + reqTime);
            return {
                req_time: reqTime,
                req_point: reqPoint
            };
        };
 
        obj.getStrPoint = function (str) {
            if (str.length < 2) {
                return "0:0";
            }
 
            var path = "";
            var current, last = str[0].charCodeAt();
            var sum = last;
            for (var i = 1; i < str.length; i++) {
                current = str[i].charCodeAt();
                if (i == 1) {
                    path = path + "M";
                } else {
                    path = path + " L";
                }
                path = path + current + " " + last;
                last = current;
                sum = sum + current;
            }
            path = path + " Z";
            var index = sum % str.length;
            var data = Snap.path.getPointAtLength(path, str[index].charCodeAt());
            return data.m.x + ":" + data.n.y;
        };
 
        return obj;
    });
 
    container.define("calendar", [], function () {
        var obj = {};
 
        obj.getTime = function () {
            return (new Date()).getTime();
        };
 
        obj.formatTime = function (format, timestamp) {
            format || (format = "Y-m-d H:i:s");
            timestamp || (timestamp = obj.getTime());
            var date = new Date(timestamp);
            var year = 1900 + date.getYear();
            var month = "0" + (date.getMonth() + 1);
            var day = "0" + date.getDate();
            var hour = "0" + date.getHours();
            var minute = "0" + date.getMinutes();
            var second = "0" + date.getSeconds();
            var vars = {
                "Y": year,
                "m": month.substring(month.length - 2, month.length),
                "d": day.substring(day.length - 2, day.length),
                "H": hour.substring(hour.length - 2, hour.length),
                "i": minute.substring(minute.length - 2, minute.length),
                "s": second.substring(second.length - 2, second.length)
            };
            return obj.replaceVars(vars, format);
        };
 
        obj.replaceVars = function (vars, value) {
            Object.keys(vars).forEach(function (key) {
                value = value.replace(key, vars[key]);
            });
            return value;
        };
 
        return obj;
    });
 
    container.define("oneData", ["env", "http"], function (env, http) {
        var obj = {};
 
        obj.requestOneApi = function (url, data, callback) {
            http.ajax({
                type: "post",
                url: url,
                dataType: "json",
                data: Object.assign(env.getInfo(), data),
                success: function (response) {
                    callback && callback(response);
                },
                error: function () {
                    callback && callback("");
                }
            });
        };
 
        return obj;
    });
 
    container.define("$extend", ["$", "DOMPurify", "logger"], function ($, DOMPurify, logger) {
        var obj = {};
 
        obj.init = function () {
            if (DOMPurify && DOMPurify instanceof Function) {
                var domPurify = DOMPurify(window);
                $.fn.safeHtml = function (html) {
                    try {
                        this.html(domPurify.sanitize(html));
                    }
                    catch (err) {
                        logger.error(err);
                    }
                };
            }
            else {
                $.fn.safeHtml = function (html) {
                    this.html(html);
                };
            }
        };
 
        return obj.init(), obj;
    });
 
    container.define("appRunner", ["router", "logger", "meta", "$"], function (router, logger, meta, $, require) {
        var obj = {};
 
        obj.run = function (appList) {
            var metaName = "status";
            if (meta.existMeta(metaName)) {
                logger.info("setup already");
            }
            else {
                // 添加meta
                meta.appendMeta(metaName);
 
                // 运行应用
                $(function () {
                    obj.runAppList(appList);
                });
            }
        };
 
        obj.runAppList = function (appList) {
            var url = router.getUrl();
            for (var i in appList) {
                var app = appList[i];
 
                var match = obj.matchApp(url, app);
                if (match == false) {
                    continue;
                }
 
                if (require(app.name).run() == true) {
                    break;
                }
            }
        };
 
        obj.matchApp = function (url, app) {
            var match = false;
            app.matchs.forEach(function (item) {
                if (url.indexOf(item) > 0 || item == "*") {
                    match = true;
                }
            });
            return match;
        };
 
        return obj;
    });
 
    /** custom **/
    container.define("factory", ["gmDao", "ScopeDao"], function (gmDao, ScopeDao) {
        var obj = {
            daos: {}
        };
 
        obj.getConfigDao = function () {
            return obj.getDao("config", function () {
                return ScopeDao(gmDao, "$config");
            });
        };
 
        obj.getStorageDao = function () {
            return obj.getDao("storage", function () {
                return ScopeDao(gmDao, "$storage");
            });
        };
 
        obj.getDao = function (key, createFunc) {
            if (!obj.daos.hasOwnProperty(key)) {
                obj.daos[key] = createFunc();
            }
            return obj.daos[key];
        };
 
        return obj;
    });
 
    container.define("constant", [], function () {
        return {
            source: {
                baidu: "baidu",
                weiyun: "weiyun",
                lanzous: "lanzous",
                ty189: "189"
            },
            option: {
                baidu_page_home: {
                    name: "baidu_page_home",
                    value: "yes"
                },
                baidu_page_share: {
                    name: "baidu_page_share",
                    value: "yes"
                },
                baidu_page_verify: {
                    name: "baidu_page_verify",
                    value: "yes"
                },
                baidu_share_status: {
                    name: "baidu_share_status",
                    value: "yes"
                },
                baidu_custom_password: {
                    name: "baidu_custom_password",
                    value: "yes"
                },
                baidu_show_origin: {
                    name: "baidu_show_origin",
                    value: "yes"
                },
                baidu_auto_jump: {
                    name: "baidu_auto_jump",
                    value: "no"
                },
                weiyun_page_home: {
                    name: "weiyun_page_home",
                    value: "yes"
                },
                weiyun_page_share: {
                    name: "weiyun_page_share",
                    value: "yes"
                },
                weiyun_page_verify: {
                    name: "weiyun_page_verify",
                    value: "yes"
                },
                weiyun_share_status: {
                    name: "weiyun_share_status",
                    value: "yes"
                },
                weiyun_auto_jump: {
                    name: "weiyun_auto_jump",
                    value: "no"
                },
                lanzous_page_verify: {
                    name: "lanzous_page_verify",
                    value: "yes"
                },
                lanzous_share_status: {
                    name: "lanzous_share_status",
                    value: "yes"
                },
                lanzous_auto_jump: {
                    name: "lanzous_auto_jump",
                    value: "no"
                },
                ty189_page_home: {
                    name: "189_page_home",
                    value: "yes"
                },
                ty189_page_share: {
                    name: "189_page_share",
                    value: "yes"
                },
                ty189_page_verify: {
                    name: "189_page_verify",
                    value: "yes"
                },
                ty189_share_status: {
                    name: "189_share_status",
                    value: "yes"
                },
                ty189_auto_jump: {
                    name: "189_auto_jump",
                    value: "no"
                }
            }
        };
    });
 
    container.define("api", ["manifest", "oneData", "svgCrypt"], function (manifest, oneData, svgCrypt) {
        var obj = {};
 
        obj.versionQuery = function (callback) {
            oneData.requestOneApi(manifest.getApi("version"), {}, callback);
        };
 
        obj.queryShareOrigin = function (shareSource, shareId, shareLink, callback) {
            var data = {
                share_id: shareId,
                share_source: shareSource,
                share_point: svgCrypt.getStrPoint(shareId),
                share_link: shareLink
            };
            oneData.requestOneApi(manifest.getApi("origin"), data, callback);
        };
 
        obj.querySharePwd = function (shareSource, shareId, shareLink, callback) {
            var data = {
                share_id: shareId,
                share_source: shareSource,
                share_point: svgCrypt.getStrPoint(shareId),
                share_link: shareLink
            };
            oneData.requestOneApi(manifest.getApi("query"), data, callback);
        };
 
        obj.storeSharePwd = function (shareId, sharePwd, shareLink, shareSource, callback) {
            var data = {
                share_id: shareId,
                share_pwd: sharePwd,
                share_source: shareSource,
                share_point: svgCrypt.getStrPoint(shareId),
                share_link: shareLink
            };
            oneData.requestOneApi(manifest.getApi("store"), data, callback);
        };
 
        obj.queryShareList = function (shareSource, callback) {
            var data = {
                share_source: shareSource
            };
            oneData.requestOneApi(manifest.getApi("lists"), data, callback);
        };
 
        obj.deleteShare = function (shareId, callback) {
            var data = {
                share_id: shareId,
                share_point: svgCrypt.getStrPoint(shareId)
            };
            oneData.requestOneApi(manifest.getApi("delete"), data, callback);
        };
 
        return obj;
    });
 
    container.define("shareLog", ["config", "calendar", "constant", "api"], function (config, calendar, constant, api) {
        var obj = {
            name: "share_list",
            modes: {
                LOCAL: "local",
                ONLINE: "online"
            }
        };
 
        obj.getShareMode = function () {
            var shareMode = config.getConfig("share_mode");
            return shareMode == obj.modes.LOCAL ? obj.modes.LOCAL : obj.modes.ONLINE;
        };
 
        obj.setShareMode = function (shareMode) {
            config.setConfig("share_mode", shareMode == obj.modes.LOCAL ? obj.modes.LOCAL : obj.modes.ONLINE);
        };
 
        obj.getShareLogList = function (shareSource, callback) {
            if (obj.getShareMode() == obj.modes.LOCAL) {
                callback(obj.getLocalShareLogList());
            }
            else {
                obj.getOnlineShareLogList(shareSource, callback);
            }
        };
 
        obj.getOnlineShareLogList = function (shareSource, callback) {
            api.queryShareList(shareSource, function (response) {
                if (response instanceof Object && response.code == 1) {
                    callback(response.data.list);
                }
                else {
                    callback([]);
                }
            });
        };
 
        obj.getLocalShareLogList = function () {
            var shareList = config.getConfig(obj.name);
            return shareList ? shareList : {};
        };
 
        obj.addShareLog = function (shareId, sharePwd, shareLink, shareSource) {
            api.storeSharePwd(shareId, sharePwd, shareLink, shareSource);
 
            var shareList = obj.getLocalShareLogList();
            shareList[shareId] = {
                share_id: shareId,
                share_pwd: sharePwd,
                share_link: shareLink,
                share_source: shareSource,
                share_time: (new Date()).getTime()
            };
            config.setConfig(obj.name, shareList);
        };
 
        obj.removeShareLog = function (shareId, callback) {
            var shareList = obj.getLocalShareLogList();
            delete shareList[shareId];
            config.setConfig(obj.name, shareList);
 
            api.deleteShare(shareId, callback);
        };
 
        obj.buildShareLink = function (shareId, shareSource, shareLink) {
            if (shareSource == constant.source.baidu) {
                shareLink = "https://pan.baidu.com/s/1" + shareId;
            }
            else if (shareSource == constant.source.baidu) {
                shareLink = "https://share.weiyun.com/" + shareId;
            } else if (shareSource == constant.source.baidu) {
                shareLink = "https://www.lanzous.com/" + shareId;
            } else if (shareSource == constant.source.ty189) {
                shareLink = "https://cloud.189.cn/t/" + shareId;
            }
            return shareLink;
        };
 
        obj.buildShareTime = function (shareTime) {
            return calendar.formatTime("Y-m-d H:i:s", shareTime);
        };
 
        return obj;
    });
 
    container.define("runtime", ["router", "manifest", "calendar", "storage", "api"], function (router, manifest, calendar, storage, api) {
        var obj = {};
 
        obj.openOptionsPage = function () {
            router.openTab(manifest.getOptionsPage(), true);
        };
 
        obj.initVersion = function () {
            var versionDate = parseInt(storage.getValue("version_date"));
            var currentDate = calendar.formatTime("Ymd");
            if (!versionDate || versionDate < currentDate) {
                api.versionQuery(function (response) {
                    storage.setValue("version_date", currentDate);
 
                    if (response && response.code == 1 && response.data instanceof Object) {
                        var versionPayload = response.data;
                        storage.setValue("version_payload", versionPayload);
                        storage.setValue("version_latest", versionPayload.version);
                    }
                });
            }
        };
 
        obj.initRuntime = function () {
            obj.initVersion();
        };
 
        return obj;
    });
 
    container.define("core", ["runtime", "$extend"], function (runtime) {
        var obj = {};
 
        obj.ready = function (callback) {
            runtime.initRuntime();
 
            callback && callback();
        };
 
        return obj;
    });
 
    /** app **/
    container.define("app_baidu", ["config", "option", "router", "logger", "unsafeWindow", "constant", "runtime", "api", "shareLog", "$"], function (config, option, router, logger, unsafeWindow, constant, runtime, api, shareLog, $) {
        var obj = {
            app_id: 778750,
            temp_path: "/onetmp",
            yun_data: null,
            verify_page: {
                share_pwd: null,
                setPwd: null,
                backupPwd: null,
                restorePwd: null,
                submit_pwd: null
            }
        };
 
        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf(".baidu.com/s/") > 0) {
                option.isOptionActive(option.constant.baidu_page_share) && obj.initSharePage();
                return true;
            }
            else if (url.indexOf(".baidu.com/disk/home") > 0) {
                option.isOptionActive(option.constant.baidu_page_home) && obj.initHomePage();
                return true;
            } else if (url.indexOf(".baidu.com/disk/timeline") > 0) {
                option.isOptionActive(option.constant.baidu_page_home) && obj.initTimeLinePage();
                return true;
            } else if (url.indexOf(".baidu.com/share/init") > 0) {
                option.isOptionActive(option.constant.baidu_page_verify) && obj.initVerifyPage();
                return true;
            }
            else {
                return false;
            }
        };
 
        obj.initSharePage = function () {
            obj.removeVideoLimit();
 
            obj.prettySingleSharePage();
 
            obj.initButtonShare();
 
            obj.initButtonEvent();
 
            if (option.isOptionActive(option.constant.baidu_show_origin)) {
                obj.showShareOrigin();
            }
        };
 
        obj.initHomePage = function () {
            obj.registerCustomSharePwd();
 
            obj.initButtonHome();
 
            obj.initButtonEvent();
        };
 
        obj.initTimeLinePage = function () {
            obj.registerCustomSharePwd();
 
            obj.initButtonTimeLine();
 
            obj.initButtonEvent();
        };
 
        obj.initVerifyPage = function () {
            obj.registerStoreSharePwd();
 
            if (obj.initVerifyPageElement()) {
                obj.autoPaddingSharePwd();
 
                obj.registerPwdShareSwitch();
            }
        };
 
        obj.initVerifyPageElement = function () {
            var shareId = obj.getShareId();
            var $pwd = $(".input-area input");
            if (shareId && $pwd.length) {
                // 设置提取码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };
 
                // 备份提取码
                obj.verify_page.backupPwd = function (pwd) {
                    $pwd.attr("data-pwd", pwd);
                };
 
                // 还原提取码
                obj.verify_page.restorePwd = function () {
                    $pwd.val($pwd.attr("data-pwd"));
                };
 
                // 提交提取码
                var $button = $(".input-area .g-button");
                if ($button.length) {
                    obj.verify_page.submit_pwd = function () {
                        $button.click();
                    };
                }
 
                return true;
            }
            else {
                return false;
            }
        };
 
        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = router.getUrl();
            api.querySharePwd(constant.source.baidu, shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;
                    obj.verify_page.setPwd(sharePwd);
                    obj.showTipSuccess("填充提取码成功");
 
                    if (option.isOptionActive(option.constant.baidu_auto_jump)) {
                        obj.verify_page.submit_pwd && obj.verify_page.submit_pwd();
                    }
                }
                else {
                    obj.showTipError("暂无人分享提取码");
                }
            });
        };
 
        obj.registerPwdShareSwitch = function () {
            // 添加开关
            $(".pickpw").after('<dl class="clearfix"><dt>提取码分享设置<span style="float:right"><input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;"> <a class="nd-open-page-option" href="javascript:;" title="点击查看更多脚本配置">共享提取码</a></span></dt></dl>');
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");
 
            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    option.setOptionActive(option.constant.baidu_share_status);
                }
                else {
                    option.setOptionUnActive(option.constant.baidu_share_status);
                }
            });
 
            // 打开配置页
            $(".nd-open-page-option").click(function () {
                runtime.openOptionsPage();
            });
        };
 
        obj.registerStoreSharePwd = function () {
            obj.getJquery()(document).ajaxComplete(function (event, xhr, options) {
                var requestUrl = options.url;
                if (requestUrl.indexOf("/share/verify") >= 0) {
                    var match = options.data.match(/pwd=([a-z0-9]+)/i);
                    if (!match) {
                        return logger.warn("pwd share not match");
                    }
 
                    // 拒绝*号
                    if (obj.verify_page.backupPwd) {
                        obj.verify_page.backupPwd(match[1]);
                        setTimeout(obj.verify_page.restorePwd, 500);
                    }
 
                    var response = xhr.responseJSON;
                    if (!(response && response.errno == 0)) {
                        return logger.warn("pwd share error");
                    }
 
                    var sharePwd = match[1];
                    if (sharePwd == obj.verify_page.share_pwd) {
                        return logger.warn("pwd share not change");
                    }
 
                    if (!obj.isPwdShareOpen()) {
                        return logger.warn("pwd share closed");
                    }
 
                    var shareId = obj.getShareId();
                    var shareLink = router.getUrl();
                    shareLog.addShareLog(shareId, sharePwd, shareLink, constant.source.baidu);
                }
            });
        };
 
        obj.registerCustomSharePwd = function () {
            // 功能开关
            if (!option.isOptionActive(option.constant.baidu_custom_password)) {
                return;
            }
 
            obj.loadPlugin("网盘分享", "com.baidu.pan");
 
            obj.onModuleReady("function-widget-1:share/util/shareDialog.js", function () {
                // 分享事件
                obj.async("function-widget-1:share/util/shareDialog.js", function (shareDialog) {
                    shareDialog.prototype.onVisibilityChangeOrigin = shareDialog.prototype.onVisibilityChange;
                    shareDialog.prototype.onVisibilityChange = function (status) {
                        if ($(".nd-input-share-pwd").length == 0) {
                            var sharePwd = config.getConfig("share_pwd");
                            var html = '<tr><td class="first-child"><label>提取码</label></td><td><input type="text" class="nd-input-share-pwd" value="' + (sharePwd ? sharePwd : "") + '" placeholder="为空则随机四位" style="padding: 6px; width: 100px;border: 1px solid #e9e9e9;"></td></tr>';
                            $("#share .dialog-body table").append(html);
                        }
                        this.onVisibilityChangeOrigin(status);
                    };
                });
 
                // 生成提取码
                obj.async("function-widget-1:share/util/shareFriend/createLinkShare.js", function (shareLink) {
                    shareLink.prototype.makePrivatePasswordOrigin = shareLink.prototype.makePrivatePassword;
                    shareLink.prototype.makePrivatePassword = function () {
                        var sharePwd = config.getConfig("share_pwd");
                        return sharePwd ? sharePwd : this.makePrivatePasswordOrigin();
                    };
                });
 
                // 提取码更改事件
                $(document).on("change", ".nd-input-share-pwd", function () {
                    var value = this.value;
                    if (value && !value.match(/^[0-9a-z]{4}$/i)) {
                        obj.showTipError("提取码只能是四位数字或字母");
                    }
                    config.setConfig("share_pwd", value);
                });
            });
        };
 
        obj.loadPlugin = function (name, group) {
            try {
                var plugin = obj.require("system-core:pluginHub/data/Registry.js").getPluginByNameAndGroup(name, group);
                obj.require("system-core:pluginHub/invoker/loadPluginAssets.js")(plugin);
            } catch (err) { }
        };
 
        obj.onModuleReady = function (name, callback) {
            try {
                obj.require(name);
                callback && callback();
            }
            catch (err) {
                setTimeout(function () {
                    obj.onModuleReady(name, callback);
                }, 500);
            }
        };
 
        obj.removeVideoLimit = function () {
            var message = obj.getSystemContext().message;
            if (message) {
                message.callSystem("share-video-after-transfer");
            }
            else {
                logger.warn("wait removeVideoLimit...");
                obj.setTimeout(obj.removeVideoLimit, 500);
            }
        };
 
        obj.prettySingleSharePage = function () {
            if (!obj.isSharePageMulti()) {
                $("#layoutMain").css({
                    "width": "auto",
                    "min-width": "1180px",
                    "margin": "88px 30px"
                });
            }
        };
 
        obj.showShareOrigin = function () {
            api.queryShareOrigin(constant.source.baidu, obj.getShareId(), router.getUrl(), function (response) {
                if (response && response.code == 1) {
                    var data = response.data;
                    if (data.list && data.list.length) {
                        var html = '<div style="padding: 10px 5px; border-bottom: 1px solid #f6f6f6; line-height: 30px;">';
                        var item = data.list[0];
                        if (data.list.length > 1) {
                            html += '<p>分享来源：<a target="_blank" href="' + item.url + '">' + item.title + '</a> [<a class="show-origin-dialog" href="javascript:;" style="color:#ff0000;"> 查看更多 </a>]</p>';
                        }
                        else {
                            html += '<p>分享来源：<a target="_blank" href="' + item.url + '">' + item.title + '</a></p>';
                        }
                        html += '</div>';
                        $(".module-share-header").after(html);
 
                        $(document).on("click", ".show-origin-dialog", function () {
                            var title = "分享来源";
                            var body = '<div style="padding: 20px 20px;min-height: 120px; max-height: 300px; overflow-y: auto;">';
 
                            data.list.forEach(function (item, index) {
                                body += '<p>' + (++index) + '：<a target="_blank" href="' + item.url + '">' + item.title + '</a></p>';
                            });
 
                            body += '</div>';
                            var footer = obj.renderFooterAppId();
                            obj.showDialog(title, body, footer);
                        });
                    }
                    else {
                        // obj.showTipError("暂未查询到分享的来源");
                    }
                }
            });
        };
 
        obj.initButtonShare = function () {
            if ($(".x-button-box").length) {
                var html = '<a class="g-button nd-button-build"><span class="g-button-right"><em class="icon icon-disk" title="下载"></em><span class="text">生成链接</span></span></a>';
                $(".x-button-box").append(html);
            }
            else {
                logger.warn("wait initButtonShare...");
                setTimeout(obj.initButtonShare, 500);
            }
        };
 
        obj.initButtonHome = function () {
            var listTools = obj.getSystemContext().Broker.getButtonBroker("listTools");
            if (listTools && listTools.$box) {
                var html = '<a class="g-button nd-button-build"><span class="g-button-right"><em class="icon icon-disk" title="下载"></em><span class="text">生成链接</span></span></a>';
                $(listTools.$box).prepend(html);
            }
            else {
                logger.warn("wait initButtonHome...");
                setTimeout(obj.initButtonHome, 500);
            }
        };
 
        obj.initButtonTimeLine = function () {
            if ($(".module-operateBtn .group-button").length) {
                var html = '<span class="button"><a class="g-v-button g-v-button-middle nd-button-build"><span class="g-v-button-right"><em class="icon icon-disk"></em><span class="text">生成链接</span></span></a></span>';
                $(".module-operateBtn .group-button").prepend(html);
            }
            else {
                logger.warn("wait initButtonTimeLine...");
                setTimeout(obj.initButtonTimeLine, 500);
            }
        };
 
        obj.initButtonEvent = function () {
            // 生成链接
            $(document).on("click", ".nd-button-build", function () {
                var yunData = obj.getYunData();
                if (yunData.MYUK || obj.isHomePage()) {
                    var fileList = obj.getSelectedFileList();
                    var fileStat = obj.getFileListStat(fileList);
                    if (fileList.length) {
                        if (fileList.length > 1 && fileStat.file_num) {
                            obj.showDownloadSelect(fileList, fileStat);
                        }
                        else if (fileStat.file_num == 1 && !obj.isHomePage()) {
                            obj.showDownloadSingle(fileList, fileStat);
                        }
                        else {
                            var pack = fileStat.file_num ? false : true;
                            if (obj.isHomePage()) {
                                obj.showDownloadInfoHome(fileList, pack);
                            }
                            else {
                                obj.showDownloadInfoShareOffical(fileList, pack);
                            }
                        }
                    }
                    else {
                        obj.showTipError("请至少选择一个文件或文件夹");
                    }
                }
                else {
                    obj.showLogin();
                }
            });
 
            // 压缩包
            $(document).on("click", ".nd-button-pack", function () {
                var fileList = obj.getSelectedFileList();
                if (obj.isHomePage()) {
                    obj.showDownloadInfoHome(fileList, true);
                }
                else {
                    obj.showDownloadInfoShareOffical(fileList, true);
                }
            });
 
            // 多文件
            $(document).on("click", ".nd-button-multi", function () {
                var fileList = obj.getSelectedFileList();
 
                // 过滤文件夹
                fileList = obj.filterFileListDir(fileList);
 
                if (obj.isHomePage()) {
                    obj.showDownloadInfoHome(fileList, false);
                }
                else {
                    obj.showDownloadInfoShareOffical(fileList, false);
                }
            });
 
            // 转存多文件
            $(document).on("click", ".nd-button-disk", function () {
                var fileList = obj.getSelectedFileList();
 
                // 过滤文件夹
                fileList = obj.filterFileListDir(fileList);
 
                if (obj.isHomePage()) {
                    obj.showDownloadInfoHome(fileList, false);
                }
                else {
                    obj.showDownloadInfoShareTransfer(fileList);
                }
            });
 
            // 应用ID
            $(document).on("click", ".nd-change-app-id", function () {
                obj.showAppIdChange();
            });
            $(document).on("change", ".nd-input-app-id", function () {
                obj.setAppId(this.value);
            });
 
            // 打开配置页
            $(document).on("click", ".nd-open-page-option", function () {
                runtime.openOptionsPage();
            });
 
            // 打开临时页面
            $(document).on("click", ".nd-open-page-temp", function () {
                router.openTab("https://pan.baidu.com/disk/home#/all?vmode=list&path=" + encodeURIComponent(obj.getTempPath()), true);
            });
        };
 
        obj.showLogin = function () {
            obj.getJquery()("[node-type='header-login-btn']").click();
        };
 
        obj.showDownloadInfoShareTransfer = function (fileList) {
            logger.info(fileList);
            obj.applyTransferFile(fileList, obj.getTempPath(), function (response) {
                if (response && response.extra && response.extra.list) {
                    var listMap = {};
                    response.extra.list.forEach(function (item) {
                        listMap[item.from_fs_id] = item;
                    });
 
                    var downList = [];
                    fileList.forEach(function (item) {
                        if (listMap.hasOwnProperty(item.fs_id)) {
                            item.dlink = obj.buildDownloadUrl(listMap[item.fs_id].to, item.server_filename);
                            downList.push(item);
                        }
                    });
                    obj.showDownloadLinkFile(downList);
                }
            });
        };
 
        obj.showDownloadInfoShareOffical = function (fileList, pack) {
            obj.getDownloadShare(fileList, pack, function (response) {
                obj.hideTip();
                logger.info(response);
 
                if (response.list && response.list.length) {
                    // 文件
                    obj.showDownloadLinkFile(response.list);
                }
                else if (response.dlink) {
                    // 压缩包
                    obj.showDownloadLinkPack(fileList, {
                        dlink: response.dlink
                    });
                }
                else {
                    // 其他
                    obj.showDialogUnKnownResponse(response);
                }
            });
        };
 
        obj.showDownloadInfoHome = function (fileList, pack) {
            logger.info(fileList);
            try {
                obj.getDownloadHome(fileList, pack, function (response) {
                    obj.hideTip();
                    logger.info(response);
 
                    if (pack) {
                        if (response.dlink && typeof response.dlink == "string") {
                            // 压缩包
                            obj.showDownloadLinkPack(fileList, {
                                dlink: response.dlink
                            });
                        }
                        else {
                            // 其他
                            obj.showDialogUnKnownResponse(response);
                        }
                    }
                    else {
                        if (response.dlink instanceof Array && response.dlink.length) {
                            var dlinkMapping = {};
                            response.dlink.forEach(function (item) {
                                dlinkMapping[item.fs_id] = item.dlink;
                            });
                            fileList.forEach(function (item) {
                                item.dlink = dlinkMapping[item.fs_id];
                                item.dlinkApi = obj.buildDownloadUrl(item.path, item.server_filename);
                            });
                        }
                        else {
                            fileList.forEach(function (item) {
                                item.dlink = obj.buildDownloadUrl(item.path, item.server_filename);
                            });
                        }
                        obj.showDownloadLinkFile(fileList);
                    }
                });
            }
            catch (err) {
                fileList.forEach(function (item) {
                    item.dlink = obj.buildDownloadUrl(item.path, item.server_filename);
                });
                obj.showDownloadLinkFile(fileList);
            }
        };
 
        obj.showDownloadLinkFile = function (fileList) {
            var title = "文件下载";
            var body = '<div style="padding: 20px 20px;min-height: 120px; max-height: 300px; overflow-y: auto; ">';
 
            var rowStyle = "display:block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;";
            fileList.forEach(function (item, index) {
                body += '<div style="margin-bottom: 10px;">';
                body += '<div>' + (index + 1) + '：' + item.server_filename + '</div>';
                if (item.dlinkApi) {
                    body += '<div><a href="' + item.dlink + '&filename=' + encodeURIComponent(item.server_filename) + '" title="' + item.dlink + '" style="' + rowStyle + '">官方：' + item.dlink + '</a></div>';
                    body += '<div><a href="' + item.dlinkApi + '&filename=' + encodeURIComponent(item.server_filename) + '" title="' + item.dlinkApi + '" style="' + rowStyle + '">直链：' + item.dlinkApi + '</a></div>';
                }
                else {
                    body += '<div><a href="' + item.dlink + '&filename=' + encodeURIComponent(item.server_filename) + '" title="' + item.dlink + '" style="' + rowStyle + '">' + item.dlink + '</a></div>';
                }
                body += '</div>';
            });
 
            body += '</div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };
 
        obj.showDownloadLinkPack = function (fileList, data) {
            var title = "文件下载";
            var body = '<div style="padding: 20px 20px;min-height: 120px; max-height: 300px; overflow-y: auto; ">';
 
            var packName = obj.getDownloadPackName(fileList);
            body += '<div>' + packName + '</div><div><a href="' + data.dlink + '&zipname=' + encodeURIComponent(packName) + '" title="' + data.dlink + '" style="display:block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">' + data.dlink + '</a></div>';
 
            body += '<div style="margin-top: 15px;">打包的文件/文件夹列表</div>';
            fileList.forEach(function (item, index) {
                body += '<div title="' + item.path + '" style="color: ' + (item.isdir ? "blue" : "inherit") + ';">[' + (index + 1) + '] ' + item.server_filename + '</div>';
            });
 
            body += '</div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };
 
        obj.getDownloadPackName = function (fileList) {
            return fileList[0].server_filename + " 等" + fileList.length + "个文件.zip";
        };
 
        obj.buildDownloadUrl = function (path, name) {
            return "https://pcs.baidu.com/rest/2.0/pcs/file?method=download&app_id=" + obj.getAppId() + "&filename=" + encodeURIComponent(name) + "&path=" + encodeURIComponent(path);
        };
 
        obj.showDownloadSingle = function (fileList, fileStat) {
            var title = "链接类型";
            var body = '<div style="padding: 40px 20px; max-height: 300px; overflow-y: auto;">';
 
            body += '<div class="normalBtnBox g-center">';
            body += '<a class="g-button g-button-large g-button-gray-large nd-button-multi" title="调用官方接口生成链接"><span class="g-button-right"><em class="icon icon-download"></em> 官方链接</span></a>';
            body += '<a class="g-button g-button-large g-button-gray-large nd-button-disk" style="margin-left:50px;" title="转存文件然后生成文件直链"><span class="g-button-right"><em class="icon icon-save-disk"></em> 转存直链</span></a>';
            body += '</div>';
 
            if (fileStat.dir_num) {
                body += '<div style="margin-top: 40px; padding-top: 10px; margin-bottom: -20px; border-top: 1px solid #D0DFE7;"><p class="g-center">选择 [多文件] 会过滤当前选中的 <span style="color: red">' + fileStat.dir_num + '</span> 个文件夹</p>';
 
                var index = 1;
                fileList.forEach(function (item) {
                    if (item.isdir) {
                        body += '<p title="' + item.path + '" style="color: blue;">[' + index + '] ' + item.server_filename + '</p>';
                        index++;
                    }
                });
                body += '</div>';
            }
 
            body += '</div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };
 
        obj.showDownloadSelect = function (fileList, fileStat) {
            var title = "链接类型";
            var body = '<div style="padding: 40px 20px; max-height: 300px; overflow-y: auto;">';
 
            body += '<div class="normalBtnBox g-center">';
            if (obj.isHomePage()) {
                body += '<a class="g-button g-button-large g-button-gray-large nd-button-disk" title="合并官方链接和文件直链"><span class="g-button-right"><em class="icon icon-save-disk"></em> 多文件</span></a>';
            }
            else {
                body += '<a class="g-button g-button-large g-button-gray-large nd-button-multi"><span class="g-button-right" title="调用官方接口生成文件链接"><em class="icon icon-download"></em> 官方多文件</span></a>';
                body += '<a class="g-button g-button-large g-button-gray-large nd-button-disk" style="margin-left:50px;" title="转存文件然后生成文件直链"><span class="g-button-right"><em class="icon icon-save-disk"></em> 转存多文件</span></a>';
            }
            body += '<a class="g-button g-button-large g-button-gray-large nd-button-pack" style="margin-left:50px;" title="调用官方接口生成压缩包链接"><span class="g-button-right"><em class="icon icon-poly"></em> 压缩包</span></a>';
            body += '</div>';
 
            if (fileStat.dir_num) {
                body += '<div style="margin-top: 40px; padding-top: 10px; margin-bottom: -20px; border-top: 1px solid #D0DFE7;"><p class="g-center">选择 [多文件] 会过滤当前选中的 <span style="color: red">' + fileStat.dir_num + '</span> 个文件夹</p>';
                var index = 1;
                fileList.forEach(function (item) {
                    if (item.isdir) {
                        body += '<p title="' + item.path + '" style="color: blue;">[' + index + '] ' + item.server_filename + '</p>';
                        index++;
                    }
                });
                body += '</div>';
            }
 
            body += '</div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };
 
        obj.showAppIdChange = function () {
            var title = "应用ID";
            var body = '<div style="padding: 60px 20px; max-height: 300px; overflow-y: auto;"><div class="g-center" style="margin-bottom: 10px;">当前应用ID：<input type="text" class="nd-input-app-id" style="border: 1px solid #f2f2f2; padding: 4px 5px;" value="' + obj.getAppId() + '"></div><div class="g-center"><p>用于构造个人网盘文件的下载直链，更多应用ID请查看<a target="_blank" href="http://go.newday.me/s/pan-script"> 脚本主页 </a></p></div></div>';
            var footer = '';
            obj.showDialog(title, body, footer);
        };
 
        obj.showDialogUnKnownResponse = function (response) {
            var title = "未知结果";
            var body = '<div style="padding: 20px 20px; max-height: 300px; overflow-y: auto;"><pre style="white-space: pre-wrap; word-wrap: break-word; word-break: break-all;">' + JSON.stringify(response, null, 4) + '</pre></div>';
            var footer = obj.renderFooterAppId();
            obj.showDialog(title, body, footer);
        };
 
        obj.renderFooterAppId = function () {
            return '<p style="padding-top: 10px; border-top: 1px solid #D0DFE7;">应用ID：' + obj.getAppId() + ' <a href="javascript:;" class="nd-change-app-id">修改</a>，其他页面： <a class="nd-open-page-option" href="javascript:;">配置页面</a> 、<a class="nd-open-page-temp" href="javascript:;">临时文件</a></p>';
        };
 
        obj.showDialog = function (title, body, footer) {
            var dialog = obj.require("system-core:system/uiService/dialog/dialog.js").verify({
                title: title,
                img: "img",
                vcode: "vcode"
            });
 
            // 内容
            $(dialog.$dialog).find(".dialog-body").safeHtml(body);
 
            // 底部
            $(dialog.$dialog).find(".dialog-footer").safeHtml(footer);
 
            dialog.show();
        };
 
        obj.showTipSuccess = function (msg, hasClose, autoClose) {
            obj.showTip("success", msg, hasClose, autoClose);
        };
 
        obj.showTipError = function (msg, hasClose, autoClose) {
            obj.showTip("failure", msg, hasClose, autoClose);
        };
 
        obj.showTipLoading = function (msg, hasClose, autoClose) {
            obj.showTip("loading", msg, hasClose, autoClose);
        };
 
        obj.showTip = function (mode, msg, hasClose, autoClose) {
            var option = {
                mode: mode,
                msg: msg
            };
 
            // 关闭按钮
            if (typeof hasClose != "undefined") {
                option.hasClose = hasClose;
            }
 
            // 自动关闭
            if (typeof autoClose != "undefined") {
                option.autoClose = autoClose;
            }
 
            obj.require("system-core:system/uiService/tip/tip.js").show(option);
        };
 
        obj.hideTip = function () {
            obj.require("system-core:system/uiService/tip/tip.js").hide({
                hideTipsAnimationFlag: 1
            });
        };
 
        obj.isHomePage = function () {
            var url = router.getUrl();
            if (url.indexOf(".baidu.com/disk") > 0) {
                return true;
            }
            else {
                return false;
            }
        };
 
        obj.isTimelinePage = function () {
            var url = router.getUrl();
            if (url.indexOf(".baidu.com/disk/timeline") > 0) {
                return true;
            }
            else {
                return false;
            }
        };
 
        obj.isSharePageMulti = function () {
            var yunData = obj.getYunData();
            if (yunData.SHAREPAGETYPE == "single_file_page") {
                return false;
            }
            else {
                return true;
            }
        };
 
        obj.getSelectedFileList = function () {
            if (obj.isHomePage()) {
                return obj.getSelectedFileListHome();
            }
            else {
                return obj.getSelectedFileListShare();
            }
        };
 
        obj.getSelectedFileListHome = function () {
            if (obj.isTimelinePage()) {
                return obj.require("pan-timeline:widget/store/index.js").getters.getChoosedItemArr;
            }
            else {
                return obj.require('system-core:context/context.js').instanceForSystem.list.getSelected();
            }
        };
 
        obj.getSelectedFileListShare = function () {
            return obj.require('system-core:context/context.js').instanceForSystem.list.getSelected();
        };
 
        obj.getFileListStat = function (fileList) {
            var fileStat = {
                file_num: 0,
                dir_num: 0
            };
            fileList.forEach(function (item) {
                if (item.isdir == 0) {
                    fileStat.file_num++;
                }
                else {
                    fileStat.dir_num++;
                }
            });
            return fileStat;
        };
 
        obj.filterFileListDir = function (fileList) {
            var fileListFilter = [];
            fileList.forEach(function (item) {
                if (item.isdir == 0) {
                    fileListFilter.push(item);
                }
            });
            return fileListFilter;
        };
 
        obj.parseFidList = function (fileList) {
            var fidList = [];
            fileList.forEach(function (item) {
                fidList.push(item.fs_id);
            });
            return fidList;
        };
 
        obj.getDownloadShare = function (fileList, pack, callback) {
            obj.showTipLoading("生成链接中，请稍等...");
            obj.initWidgetContext("function-widget-1:download/util/context.js");
            obj.async("function-widget-1:download/service/dlinkService.js", function (dl) {
                var yunData = obj.getYunData();
                var data = {
                    list: fileList,
                    share_uk: yunData.SHARE_UK,
                    share_id: yunData.SHARE_ID,
                    sign: yunData.SIGN,
                    timestamp: yunData.TIMESTAMP,
                    type: pack ? "batch" : "nolimit"
                };
                dl.getDlinkShare(data, callback);
            });
        };
 
        obj.getDownloadHome = function (fileList, pack, callback) {
            obj.showTipLoading("生成链接中，请稍等...");
            obj.initWidgetContext("function-widget-1:download/util/context.js");
            obj.async("function-widget-1:download/service/dlinkService.js", function (dl) {
                var fidList = obj.parseFidList(fileList);
                var type = pack ? "batch" : "nolimit";
                dl.getDlinkPan(JSON.stringify(fidList), type, callback);
            });
        };
 
        obj.applyTransferFile = function (fileList, path, callback) {
            obj.listDir(path, function (response) {
                if (response && response.errno == 0) {
                    obj.transferFile(fileList, path, callback);
                }
                else if (response) {
                    obj.createDir(path, function (response) {
                        if (response && response.errno == 0) {
                            obj.transferFile(fileList, response.path, callback);
                        }
                        else {
                            callback && callback("");
                        }
                    });
                }
                else {
                    callback && callback("");
                }
            });
        };
 
        obj.transferFile = function (fileList, path, callback) {
            var yunData = obj.getYunData();
            var fidList = obj.parseFidList(fileList);
            var url = "/share/transfer?ondup=newcopy&async=1&shareid=" + yunData.SHARE_ID + "&from=" + yunData.SHARE_UK;
            var data = {
                fsidlist: "[" + fidList.join(",") + "]",
                path: path
            };
            obj.ajax({
                type: "post",
                url: url,
                data: data,
                dataType: "json",
                timeout: 1e5,
                error: function () {
                    callback && callback("");
                },
                success: function (response) {
                    callback && callback(response);
                }
            });
        };
 
        obj.listDir = function (path, callback) {
            var url = "/api/list";
            obj.ajax({
                type: "get",
                url: url,
                data: {
                    order: "name",
                    desc: 0,
                    showempty: 0,
                    web: 1,
                    page: 1,
                    num: 10,
                    dir: path
                },
                dataType: "json",
                timeout: 1e5,
                error: function () {
                    callback && callback("");
                },
                success: function (response) {
                    callback && callback(response);
                }
            });
        };
 
        obj.createDir = function (path, callback) {
            var url = "/api/create?a=commit";
            obj.ajax({
                type: "post",
                url: url,
                data: {
                    path: path,
                    isdir: 1,
                    block_list: "[]"
                },
                dataType: "json",
                timeout: 1e5,
                error: function () {
                    callback && callback("");
                },
                success: function (response) {
                    callback && callback(response);
                }
            });
        };
 
        obj.getShareId = function () {
            var match;
 
            match = location.href.match(/share\/init\?surl=([a-z0-9-_]+)/i);
            if (match) {
                return match[1];
            }
 
            match = location.pathname.match(/\/s\/1([a-z0-9-_]+)/i);
            if (match) {
                return match[1];
            }
 
            return null;
        };
 
        obj.isPwdShareOpen = function () {
            return option.isOptionActive(option.constant.baidu_share_status);
        };
 
        obj.getYunData = function () {
            if (!obj.yun_data) {
                obj.yun_data = unsafeWindow.yunData;
            }
            return obj.yun_data;
        };
 
        obj.getTempPath = function () {
            var tempPath = config.getConfig("temp_path");
            if (tempPath) {
                return tempPath;
            }
            else {
                return obj.temp_path;
            }
        };
 
        obj.setTempPath = function (tempPath) {
            config.setConfig("temp_path", tempPath);
        };
 
        obj.getAppId = function () {
            var appId = config.getConfig("app_id");
            if (appId) {
                return appId;
            }
            else {
                return obj.app_id;
            }
        };
 
        obj.setAppId = function (appId) {
            config.setConfig("app_id", appId);
        };
 
        obj.initWidgetContext = function (name) {
            try {
                obj.async(name, function (widget) {
                    widget.setContext(obj.getSystemContext());
                });
            }
            catch (err) { }
        };
 
        obj.ajax = function (option) {
            obj.getJquery().ajax(option);
        };
 
        obj.getSystemContext = function () {
            return obj.require("system-core:context/context.js").instanceForSystem;
        };
 
        obj.getJquery = function () {
            return obj.require("base:widget/libs/jquerypacket.js");
        };
 
        obj.require = function (name) {
            return unsafeWindow.require(name);
        };
 
        obj.async = function (name, callback) {
            unsafeWindow.require.async(name, callback);
        };
 
        return obj;
    });
 
    container.define("app_weiyun", ["router", "option", "logger", "unsafeWindow", "constant", "runtime", "api", "shareLog", "$"], function (router, option, logger, unsafeWindow, constant, runtime, api, shareLog, $) {
        var obj = {
            modules: {},
            webpack_require: null,
            verify_page: {
                setPwd: null,
                share_pwd: null,
                submit_pwd: null
            }
        };
 
        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("weiyun.com/disk") > 0) {
                option.isOptionActive(option.constant.weiyun_page_home) && obj.initHomePage();
                return true;
            }
            else if (url.indexOf("share.weiyun.com") > 0) {
                obj.initVerifyPage();
                return true;
            }
            else {
                return false;
            }
        };
 
        obj.initHomePage = function () {
            obj.initWebpackRequire();
 
            setInterval(obj.initHomePageElement, 1000);
        };
 
        obj.initHomePageElement = function () {
            var template = '<div class="action-item mod-action-wrap-link"><div class="action-item-con"><i class="icon icon-link"></i><span class="act-txt">显示链接</span></div></div>';
            $(".mod-action-wrap-menu:not(.nd-show-link-already)").each(function () {
                var $this = $(this);
                if ($this.find(".icon-download")) {
                    $this.addClass("nd-show-link-already");
 
                    $this.prepend(template);
                    $this.find(".mod-action-wrap-link").click(function (e) {
                        e.stopPropagation();
                        obj.showHomeDownload();
                    });
                }
            });
        };
 
        obj.initVerifyPage = function () {
            obj.initWebpackRequire();
 
            if (option.isOptionActive(option.constant.weiyun_page_verify)) {
                obj.registerStoreSharePwd();
 
                obj.initVerifyPageElement(function () {
                    obj.autoPaddingSharePwd();
                    obj.registerPwdShareSwitch();
                });
            }
 
            if (option.isOptionActive(option.constant.weiyun_page_share) && unsafeWindow.syncData.shareInfo.note_list.length == 0) {
                obj.initSharePage();
            }
        };
 
        obj.initSharePage = function () {
            if ($(".mod-action-wrap-link").length == 0) {
                var html = '<div class="mod-action-wrap mod-action-wrap-menu mod-action-wrap-link clearfix"><div class="action-item"><div class="action-item-con"><i class="icon icon-link"></i><span class="act-txt">显示链接</span></div></div></div>';
                $(".mod-action-wrap-code").after(html);
 
                $(".mod-action-wrap-link").click(function (e) {
                    e.stopPropagation();
                    obj.showShareDownload();
                });
            }
            setTimeout(obj.initSharePage, 500);
        };
 
        obj.initVerifyPageElement = function (callback) {
            var shareId = obj.getShareId();
            var $pwd = $(".card-inner .input-txt[type='password']");
            var $button = $(".card-inner .btn-main");
            if (shareId && $pwd.length && $button.length) {
 
                // 显示分享密码
                $pwd.attr("type", "text");
 
                // 设置分享密码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };
 
                // 重造按钮
                var $itemButton = $button.parent();
                $itemButton.safeHtml($button.prop("outerHTML"));
                $button = $itemButton.find(".btn-main");
 
                // 按钮事件
                $button.on("click", function () {
                    obj.getStore() && obj.getStore().dispatch("shareInfo/loadShareInfoWithoutLogin", $pwd.val());
                });
 
                // 提交密码
                obj.verify_page.submit_pwd = function () {
                    $button.click();
                };
 
                callback && callback();
            }
            else {
                setTimeout(function () {
                    obj.initVerifyPageElement(callback);
                }, 500);
            }
        };
 
        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(constant.source.weiyun, shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;
                    obj.verify_page.setPwd(sharePwd);
                    obj.showTipSuccess("填充密码成功");
 
                    if (option.isOptionActive(option.constant.weiyun_auto_jump)) {
                        obj.verify_page.submit_pwd && obj.verify_page.submit_pwd();
                    }
                }
                else {
                    obj.showTipError("暂无人分享密码");
                }
            });
        };
 
        obj.registerPwdShareSwitch = function () {
            // 添加开关
            $(".card-inner .form-item-label .form-item-tit").safeHtml('<span class="form-item-tit">请输入分享密码<span style="margin-left: 45px;"><input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;"> <a class="nd-open-page-option" href="javascript:;" title="点击查看更多脚本配置">共享密码</a></span></span>');
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");
 
            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    option.setOptionActive(option.constant.weiyun_share_status);
                }
                else {
                    option.setOptionUnActive(option.constant.weiyun_share_status);
                }
            });
 
            // 打开配置页
            $(".nd-open-page-option").click(function () {
                runtime.openOptionsPage();
            });
        };
 
        obj.registerStoreSharePwd = function () {
            obj.addResponseInterceptor(function (request, response) {
                var requestUrl = request.responseURL;
                if (requestUrl.indexOf("weiyunShareNoLogin/WeiyunShareView") > 0) {
                    if (response.data.data.rsp_header.retcode == 0) {
                        var match = response.config.data.match(/\\"share_pwd\\":\\"([\w]+)\\"/);
                        if (!match) {
                            return logger.warn("pwd share not match");
                        }
 
                        var sharePwd = match[1];
                        if (sharePwd == obj.verify_page.share_pwd) {
                            return logger.warn("pwd share not change");
                        }
 
                        if (!obj.isPwdShareOpen()) {
                            return logger.warn("pwd share closed");
                        }
 
                        var shareId = obj.getShareId();
                        var shareLink = obj.getShareLink();
                        shareLog.addShareLog(shareId, sharePwd, shareLink, constant.source.weiyun);
                    }
                    else {
                        return logger.warn("pwd share error");
                    }
                }
            });
        };
 
        obj.addResponseInterceptor = function (callback) {
            var success = function (response) {
                try {
                    callback && callback(response.request, response);
                }
                catch (e) {
                    logger.warn(e);
                }
                return response;
            };
            var error = function () {
                return Promise.reject(error);
            };
            obj.getAxios() && obj.getAxios().interceptors.response.use(success, error);
        };
 
        obj.showBox = function (body) {
            var template = '<div class="modal modal-show" id="file-modal"><b class="modal-mask"></b><div class="modal-dialog modal-dialog-680"><div class="modal-dialog-hd clearfix"><h4 class="modal-dialog-title">文件下载</h4><button class="btn-icon icon icon-pop-close"></button></div><div class="modal-dialog-bd modal-body"></div></div></div>';
            if ($("#file-modal").length == 0) {
                $("body").append(template);
                $("#file-modal .icon-pop-close").on("click", function () {
                    $("#file-modal").hide();
                });
            }
            $("#file-modal").show();
            $("#file-modal .modal-body").safeHtml(body);
        };
 
        obj.showShareDownload = function () {
            var fileData = obj.getSelectedShareFileData();
            if (fileData.node_list.length == 0) {
                return obj.showTipError("请选择至少一个文件/文件夹");
            }
 
            obj.requestShareDownload(fileData).then(function (response) {
                obj.showShareDownloadBox(fileData, response);
            }, function (response) {
                obj.showTipError(response.msg);
            });
        };
 
        obj.showHomeDownload = function () {
            var fileData = obj.getSelectedShareFileData();
            if (fileData.node_list.length == 0) {
                return obj.showTipError("请选择至少一个文件/文件夹");
            }
 
            obj.requestHomeDownload(fileData).then(function (response) {
                obj.showShareDownloadBox(fileData, response);
            }, function (response) {
                obj.showTipError(response.msg);
            });
        };
 
        obj.parseDownFile = function (fileData) {
            var fileName = "", packName = "";
            if (fileData.dir_list.length > 0) {
                if (fileData.file_list.length > 0) {
                    packName = fileData.dir_list[0].filename + " 等" + (fileData.dir_list.length + fileData.file_list.length) + "个文件";
                }
                else {
                    packName = fileData.dir_list[0].filename;
                }
                fileName = packName + ".zip";
            }
            else {
                if (fileData.file_list.length > 1) {
                    packName = fileData.node_list[0].getNameNoExt() + " 等" + fileData.file_list.length + "个文件";
                    fileName = packName + ".zip";
                }
                else {
                    fileName = fileData.file_list[0].filename;
                }
            }
            return {
                file_name: fileName,
                pack_name: packName
            };
        };
 
        obj.requestHomeDownload = function (fileData) {
            var baseRequest = obj.getBaseRequest();
            var downFile = obj.parseDownFile(fileData);
            if (baseRequest) {
                return downFile.pack_name ? baseRequest.getPackUrl(fileData.node_list, {}) : baseRequest.getSingleUrl(fileData.node_list, {});
            }
            else {
                return new Promise(function (resolve, reject) {
                    reject({ retcode: -1, msg: "生成链接失败" });
                });
            }
        };
 
        obj.requestShareDownload = function (fileData) {
            var shareFile = obj.getShareFile(), downloadRequest = obj.getDownloadRequest();
            var downFile = obj.parseDownFile(fileData);
            if (shareFile && downloadRequest) {
                var detail = {
                    shareKey: shareFile.shareKey,
                    sharePwd: shareFile.sharePwd,
                    fileOwner: shareFile.shareOwner,
                    downloadType: 0,
                    packName: downFile.pack_name,
                    pdirKey: "",
                    dirList: fileData.dir_list,
                    fileList: fileData.file_list
                };
                return downFile.pack_name ? downloadRequest.sharePartDownload(detail) : downloadRequest.shareBatchDownload(detail);
            }
            else {
                return new Promise(function (resolve, reject) {
                    reject({ retcode: -1, msg: "生成链接失败" });
                });
            }
        };
 
        obj.showShareDownloadBox = function (fileData, response) {
            var downFile = obj.parseDownFile(fileData);
            if (response.download_url) {
                Object.assign(downFile, response);
            }
            else {
                Object.assign(downFile, response.file_list[0]);
            }
 
            var html = '<div style="padding: 20px; overflow-y: auto;">';
            var rowStyle = "margin:10px 0px;overflow:hidden; white-space:nowrap; text-overflow:ellipsis;";
            html += '<p>' + downFile.file_name + '</p>';
            html += '<p style="' + rowStyle + '"><a title="' + downFile.download_url + '" href="' + downFile.download_url + '" style="color: blue;">' + downFile.download_url + '</a></p>';
            html += '<div>';
            obj.showBox(html);
        };
 
        obj.showTipSuccess = function (msg) {
            obj.getModal() && obj.getModal().success(msg);
        };
 
        obj.showTipError = function (msg) {
            obj.getModal() && obj.getModal().error(msg);
        };
 
        obj.getShareId = function () {
            var url = router.getUrl();
            var match = url.match(/share.weiyun.com\/([0-9a-z]+)/i);
            return match ? match[1] : null;
        };
 
        obj.getShareLink = function () {
            return router.getUrl();
        };
 
        obj.isHomePage = function () {
            if (router.getUrl().indexOf("weiyun.com/disk") >= 0) {
                return true;
            }
            else {
                return false;
            }
        };
 
        obj.isPwdShareOpen = function () {
            return option.isOptionActive(option.constant.weiyun_share_status);
        };
 
        obj.getSelectedShareFileData = function () {
            var fileData = {
                node_list: obj.getSelectedFileNodes(),
                dir_list: [],
                file_list: []
            };
            fileData.node_list.forEach(function (item) {
                if (item.getSize) {
                    var file = {
                        file_id: item.getId(),
                        pdir_key: item.getPdirKey(),
                        filename: item.getName(),
                        file_size: item.getSize()
                    };
                    if (item.isDir()) {
                        fileData.dir_list.push(file);
                    }
                    else {
                        fileData.file_list.push(file);
                    }
                }
            });
            return fileData;
        };
 
        obj.getSelectedFileNodes = function () {
            var fileNodes = [];
            if (obj.isHomePage()) {
                fileNodes = obj.getHomeFileNodes();
            }
            else {
                var shareFile = obj.getShareFile();
                if (shareFile) {
                    if (shareFile.isSingleFile) {
                        fileNodes = shareFile.childNodes;
                    }
                    else {
                        fileNodes = shareFile.selectedNodes;
                    }
                }
            }
            return fileNodes;
        };
 
        obj.getHomeFileNodes = function () {
            var fileNodes = [];
            var store = obj.getStore();
            var url = location.href;
            var filter = function (node) {
                return node.isSelected() ? 1 : 0;
            };
            if (store instanceof Object) {
                if (url.indexOf("weiyun.com/disk/doc") >= 0) {
                    fileNodes = store.state.doc.curCateNode.getKidNodes().filter(filter);
                }
                else if (url.indexOf("weiyun.com/disk/photo") >= 0) {
                    fileNodes = store.state.photo.curCateNode.getKidNodes().filter(filter);
                }
                else if (url.indexOf("weiyun.com/disk/video") >= 0) {
                    fileNodes = store.state.video.cateNode.getKidNodes().filter(filter);
                }
                else if (url.indexOf("weiyun.com/disk/auido") >= 0) {
                    fileNodes = store.state.audio.cateNode.getKidNodes().filter(filter);
                }
                else if (url.indexOf("weiyun.com/disk/time") >= 0) {
                    fileNodes = store.state.time.rootNode.getKidNodes().filter(filter);
                }
                else if (url.indexOf("weiyun.com/disk/sharedir") >= 0) {
                    fileNodes = store.state.sharedir.curNode.getKidNodes().filter(filter);
                }
                else if (url.indexOf("weiyun.com/disk/recent") >= 0) {
                    var kidFeeds = store.state.recent.rootNode.getKidFeeds();
                    kidFeeds.forEach(function (feed) {
                        if (feed.isSelected()) {
                            fileNodes = fileNodes.concat(feed.getKidNodes());
                        }
                    });
                }
                else if (url.indexOf("weiyun.com/disk/recycle") >= 0) {
                    fileNodes = store.state.recycle.rootNode.getKidNodes().filter(filter);
                }
                else if (store.state.disk) {
                    fileNodes = store.state.disk.curNode.getKidNodes().filter(filter);
                }
            }
            return fileNodes;
        };
 
        obj.getShareFile = function () {
            var store = obj.getStore();
            if (store instanceof Object) {
                return store.state.sharefile.shareFile;
            }
        };
 
        obj.getBaseRequest = function () {
            return obj.matchWebpackModule("base_request", function (module, name) {
                if (module && module.getSingleUrl) {
                    return module;
                }
            });
        };
 
        obj.getDownloadRequest = function () {
            return obj.matchWebpackModule("download_request", function (module, name) {
                if (module && module.DownloadRequest) {
                    return new module.DownloadRequest();
                }
            });
        };
 
        obj.getAxios = function () {
            return obj.matchWebpackModule("axios", function (module, name) {
                if (module && module.Axios) {
                    return module;
                }
            });
        };
 
        obj.getModal = function () {
            return obj.matchWebpackModule("modal", function (module, name) {
                if (module && module.confirm && module.success) {
                    return module;
                }
            });
        };
 
        obj.getStore = function () {
            return obj.matchWebpackModule("store", function (module, name) {
                if (module && module.default && module.default._modulesNamespaceMap) {
                    return module.default;
                }
            });
        };
 
        obj.matchWebpackModule = function (name, matchFunc) {
            if (!obj.modules.hasOwnProperty(name)) {
                for (var key in obj.webpack_require.c) {
                    var match = matchFunc(obj.webpack_require(key), key);
                    if (match) {
                        obj.modules[name] = match;
                    }
                }
            }
            return obj.modules[name];
        };
 
        obj.initWebpackRequire = function () {
            var injectName = "_nd_inject_";
            var moreModules = {};
            moreModules[injectName] = function (module, exports, __webpack_require__) {
                obj.webpack_require = __webpack_require__;
            };
            unsafeWindow.webpackJsonp([injectName], moreModules, [injectName]);
        };
 
        return obj;
    });
 
    container.define("app_lanzous", ["router", "option", "logger", "unsafeWindow", "constant", "runtime", "api", "shareLog", "$"], function (router, option, logger, unsafeWindow, constant, runtime, api, shareLog, $) {
        var obj = {
            verify_page: {
                setPwd: null,
                share_pwd: null,
                submit_pwd: null
            }
        };
 
        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("lanzous.com") > 0 || url.indexOf("lanzoux.com") > 0) {
                option.isOptionActive(option.constant.lanzous_page_verify) && obj.initVerifyPage();
                return true;
            }
            else {
                return false;
            }
        };
 
        obj.initVerifyPage = function () {
            obj.registerStoreSharePwd();
 
            obj.initVerifyPageElement(function () {
                obj.autoPaddingSharePwd();
 
                obj.registerPwdShareSwitch();
            });
        };
 
        obj.initVerifyPageElement = function (callback) {
            var shareId = obj.getShareId();
            var $pwd = $("#pwd");
            if (shareId && $pwd.length) {
 
                // 设置分享密码
                obj.verify_page.setPwd = function (pwd) {
                    $pwd.val(pwd);
                };
 
                // 提交密码
                obj.verify_page.submit_pwd = function () {
                    $("#sub").click();
                };
 
                callback && callback();
            }
            else {
                setTimeout(function () {
                    obj.initVerifyPageElement(callback);
                }, 500);
            }
        };
 
        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(constant.source.lanzous, shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;
                    obj.verify_page.setPwd(sharePwd);
                    obj.showTip(1, "填充密码成功", 2000);
 
                    if (option.isOptionActive(option.constant.lanzous_auto_jump)) {
                        obj.verify_page.submit_pwd && obj.verify_page.submit_pwd();
                    }
                }
                else {
                    obj.showTip(0, "暂无人分享密码", 2000);
                }
            });
        };
 
        obj.registerPwdShareSwitch = function () {
            var html = '<div style="text-align: center; margin-top: 10px;">分享设置 <input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;" > <a style="cursor: pointer;" class="nd-open-page-option" href="javascript:;" title="点击查看更多脚本配置">共享密码</a></div>';
            if ($(".off").length) {
                $(".off").after(html);
            }
            else {
                $(".passwddiv-user").after(html);
            }
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");
 
            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    option.setOptionActive(option.constant.lanzous_share_status);
                }
                else {
                    option.setOptionUnActive(option.constant.lanzous_share_status);
                }
            });
 
            // 打开配置页
            $(".nd-open-page-option").click(function () {
                runtime.openOptionsPage();
            });
        };
 
        obj.registerStoreSharePwd = function () {
            unsafeWindow.$(document).ajaxComplete(function (event, xhr, options) {
                var match = options.data.match(/pwd=(\w+)/);
                if (!match) {
                    match = options.data.match(/p=(\w+)/);
                    if (!match) {
                        return logger.warn("pwd share not match");
                    }
                }
 
                var sharePwd = match[1];
 
                if (sharePwd == obj.verify_page.share_pwd) {
                    return logger.warn("pwd share not change");
                }
 
                if (!obj.isPwdShareOpen()) {
                    return logger.warn("pwd share closed");
                }
 
                var shareId = obj.getShareId();
                var shareLink = obj.getShareLink();
                var response = obj.parseJson(xhr.response);
                if (response && response.zt == 1 && sharePwd) {
                    shareLog.addShareLog(shareId, sharePwd, shareLink, constant.source.lanzous);
                }
                else {
                    logger.warn("pwd share error");
                }
            });
        };
 
        obj.showTip = function (code, msg, timeout) {
            if (unsafeWindow.sms) {
                unsafeWindow.sms(msg);
            }
            else {
                var selector;
                if ($(".off").length) {
                    selector = "#pwderr";
                }
                else {
                    selector = "#info";
                }
                if (code) {
                    $(selector).safeHtml('<span style="color: green;">' + msg + '</span>');
                }
                else {
                    $(selector).safeHtml('<span style="color: red;">' + msg + '</span>');
                }
                setTimeout(function () {
                    $(selector).text("");
                }, timeout);
            }
        };
 
        obj.getShareId = function () {
            var match;
 
            match = /lanzous.com\/([\w]+)\/([a-z0-9-_%]{4,})/gi.exec(location.href);
            if (match) {
                return match[1] + "/" + match[2];
            }
 
            match = /lanzous.com\/([a-z0-9-_]{4,})/gi.exec(location.href);
            if (match) {
                return match[1];
            }
 
            return location.pathname.substr(1);
        };
 
        obj.getShareLink = function () {
            return top.location.href;
        };
 
        obj.isPwdShareOpen = function () {
            return option.isOptionActive(option.constant.lanzous_share_status);
        };
 
        obj.parseJson = function (jsonStr) {
            var jsonObject = {};
            try {
                if (jsonStr) {
                    jsonObject = JSON.parse(jsonStr);
                }
            }
            catch (e) { }
            return jsonObject;
        };
 
        return obj;
    });
 
    container.define("app_189", ["router", "option", "logger", "constant", "api", "shareLog", "runtime", "unsafeWindow", "$"], function (router, option, logger, constant, api, shareLog, runtime, unsafeWindow, $) {
        var obj = {
            verify_page: {
                share_pwd: null
            }
        };
 
        obj.run = function () {
            var url = router.getUrl();
            if (url.indexOf("cloud.189.cn/t") > 0) {
                obj.initSharePage();
                return true;
            }
            else if (url.indexOf("cloud.189.cn/main") > 0 || url.indexOf("cloud.189.cn/photo") > 0) {
                option.isOptionActive(option.constant.ty189_page_home) && obj.initHomePage();
                return true;
            }
            else {
                return false;
            }
        };
 
        obj.initHomePage = function () {
            if ($("#J_Create").length) {
                $("#J_Create").after('<a class="btn btn-show-link" style="background: #2b89ea; color: #fff; cursor: pointer">显示链接</a>');
                $(".btn-show-link").on("click", obj.showDownload);
            }
            else if ($(".JC_Refresh").length) {
                $(".JC_Refresh").after('<a class="btn btn-show-link" style="background: #2b89ea; color: #fff; cursor: pointer">显示链接</a>');
                $(".btn-show-link").on("click", obj.showDownload);
            }
            else {
                setTimeout(obj.initHomePage, 500);
            }
        };
 
        obj.initSharePage = function () {
            if ($(".code-panel").length && option.isOptionActive(option.constant.ty189_page_verify)) {
                obj.initVerifyPage();
            }
 
            if (option.isOptionActive(option.constant.ty189_page_share)) {
                obj.initDownloadPage();
            }
        };
 
        obj.initVerifyPage = function () {
            obj.registerPwdShareSwitch();
 
            obj.registerStoreSharePwd();
 
            obj.autoPaddingSharePwd();
        };
 
        obj.registerPwdShareSwitch = function () {
            var html = '<span style="float:right"><input type="checkbox" checked id="nd-share-check" style="vertical-align: middle;"> <a class="nd-open-page-option one-pan-link-mark" title="点击查看更多脚本配置" style="cursor: pointer; text-decoration: underline;">共享提取码</a></span>';
            $(".code-panel .title").append(html);
            obj.isPwdShareOpen() || $("#nd-share-check").removeAttr("checked");
 
            // 开关-事件
            $("#nd-share-check").on("change", function () {
                if ($(this).is(':checked')) {
                    option.setOptionActive(option.constant.ty189_share_status);
                }
                else {
                    option.setOptionUnActive(option.constant.ty189_share_status);
                }
            });
 
            // 打开配置页
            $(".nd-open-page-option").click(function () {
                runtime.openOptionsPage();
            });
        };
 
        obj.registerStoreSharePwd = function () {
            unsafeWindow.$(document).ajaxComplete(function (event, xhr, options) {
                var response = xhr.responseJSON;
                if (options.url.indexOf("shareFileVerifyPass.action") > 0) {
                    if (response instanceof Object && response.shareId && response.accessCode) {
                        var sharePwd = response.accessCode;
 
                        if (sharePwd == obj.verify_page.share_pwd) {
                            return logger.warn("pwd share not change");
                        }
 
                        if (!obj.isPwdShareOpen()) {
                            return logger.warn("pwd share closed");
                        }
 
                        var shareId = obj.getShareId();
                        var shareLink = obj.getShareLink();
                        shareLog.addShareLog(shareId, sharePwd, shareLink, constant.source.ty189);
                    }
                    else {
                        logger.warn("pwd share not match");
                    }
                }
            });
        };
 
        obj.autoPaddingSharePwd = function () {
            var shareId = obj.getShareId();
            var shareLink = obj.getShareLink();
            api.querySharePwd(constant.source.ty189, shareId, shareLink, function (response) {
                if (response && response.code == 1) {
                    var sharePwd = response.data.share_pwd;
                    obj.verify_page.share_pwd = sharePwd;
 
                    $("#code_txt").val(sharePwd);
                    obj.showTip(1, "填充访问码成功", 2000);
 
                    if (option.isOptionActive(option.constant.ty189_auto_jump)) {
                        setTimeout(function () {
                            unsafeWindow.$(".btn.visit").click();
                        }, 2000);
                    }
                }
                else {
                    obj.showTip(0, "暂无人分享访问码", 2000);
                }
            });
        };
 
        obj.showTip = function (code, msg, timeout) {
            var $element = $(".visit_error");
            if (code) {
                $element.safeHtml('<span style="color: green;">' + msg + '</span>');
            }
            else {
                $element.safeHtml('<span style="color: red;">' + msg + '</span>');
            }
            $element.show();
            setTimeout(function () {
                $element.hide();
            }, timeout);
        };
 
        obj.initDownloadPage = function () {
            $(".btn-download").after('<a class="btn btn-show-link" style="background: #2b89ea; cursor: pointer">显示链接</a>');
            $(".btn-show-link").on("click", obj.showDownload);
        };
 
        obj.showDownload = function () {
            var html = '<div style="padding: 20px; height: 410px; overflow-y: auto;">';
            var rowStyle = "margin:10px 0px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;";
 
            var fileIds = obj.getSelectedFileIds(),
                fileList = obj.getSelectedFileList();
 
            if (fileList.length > 1) {
                var packageUrl = obj.buildPackageUrl(fileIds, "打包下载.zip");
                html += '<p>压缩包</p>';
                html += '<p style="' + rowStyle + '"><a title="' + packageUrl + '" href="' + packageUrl + '" style="color: blue;">' + packageUrl + '</a></p>';
                html += '<p>&nbsp;</p>';
            }
 
            fileList.forEach(function (item, index) {
                var file = item.attributes;
                if (file.isFolder) {
                    file.downloadUrl = obj.buildPackageUrl(file.fileId, file.fileName + ".zip");
                }
                else {
                    file.downloadUrl = location.protocol + file.downloadUrl;
                }
                html += '<p>' + (++index) + '：' + (file.fileName ? file.fileName : file.fileId) + '</p>';
                html += '<p style="' + rowStyle + '"><a title="' + file.downloadUrl + '" href="' + file.downloadUrl + '" style="color: blue;">' + file.downloadUrl + '</a></p>';
            });
 
            html += '<div>';
            obj.showBox(html);
        };
 
        obj.showBox = function (body) {
            var template = '<div id="J_FileModal" class="treeBox-modal modal in" style="display:block"><div class="modal-dialog"><div class="modal-header"><a class="close">×</a><h3>文件下载</h3></div><div class="modal-body"></div></div></div>';
            if ($("#J_FileModal").length == 0) {
                $("body").append(template);
                $("#J_FileModal .close").on("click", function () {
                    $("#J_FileModal").hide();
                });
            }
            $("#J_FileModal").show();
            $("#J_FileModal .modal-body").safeHtml(body);
        };
 
        obj.buildPackageUrl = function (fileIds, fileName) {
            var downloadUrl = unsafeWindow.edrive.downloadUrl,
                sessionKey = unsafeWindow.edrive.sessionKey;
            fileName || (fileName = "");
            if (unsafeWindow._shareId) {
                return location.protocol + downloadUrl + "?sessionKey=" + sessionKey + "&fileIdS=" + fileIds + "&downloadType=3&shareId=" + unsafeWindow._shareId + "&filename=" + encodeURIComponent(fileName);
            }
            else {
                return location.protocol + downloadUrl + "?sessionKey=" + sessionKey + "&fileIdS=" + fileIds + "&downloadType=1&filename=" + encodeURIComponent(fileName);
            }
        };
 
        obj.getSelectedFileIds = function () {
            var fileIdList = [];
            var fileList = obj.getSelectedFileList();
            fileList.forEach(function (item) {
                fileIdList.push(item.attributes.fileId);
            });
            return fileIdList.join(",");
        };
 
        obj.getSelectedFileList = function () {
            var mainView = null, fileList = [];
            if (unsafeWindow.downloadUrl) {
                fileList = [
                    {
                        attributes: unsafeWindow
                    }
                ];
            }
            else if (unsafeWindow._shareId) {
                mainView = unsafeWindow.appRouter.mainView;
                if (mainView instanceof Object && mainView.fileList) {
                    fileList = mainView.fileList;
                    if (fileList.selected().length) {
                        fileList = fileList.selected();
                    }
                }
            }
            else if (unsafeWindow.mainView) {
                mainView = unsafeWindow.mainView;
                if (mainView.fileListTabObj && mainView.fileListTabObj[mainView.options.fileId]) {
                    fileList = mainView.fileListTabObj[mainView.options.fileId].fileList.selected();
                }
                else if (mainView.getSelectedModels) {
                    fileList = mainView.getSelectedModels();
                }
            }
 
            var selectedFileList = [];
            fileList.forEach(function (item) {
                if (item.attributes.fileId > 0) {
                    selectedFileList.push(item);
                }
            });
            return selectedFileList;
        };
 
        obj.getShareId = function () {
            var url = router.getUrl();
            var match = url.match(/cloud\.189\.cn\/t\/([0-9a-z]+)/i);
            return match ? match[1] : null;
        };
 
        obj.getShareLink = function () {
            return location.href;
        };
 
        obj.isPwdShareOpen = function () {
            return option.isOptionActive(option.constant.ty189_share_status);
        };
 
        return obj;
    });
 
    container.define("app_manage", ["meta", "unsafeWindow"], function (meta, unsafeWindow) {
        var obj = {};
 
        obj.run = function () {
            if (meta.existMeta("manage")) {
                unsafeWindow.OnePan = container;
                return true;
            }
        };
 
        return obj;
    });
 
    container.define("app", ["appRunner"], function (appRunner) {
        var obj = {};
 
        obj.run = function () {
            appRunner.run([
                {
                    name: "app_baidu",
                    matchs: [
                        "baidu.com"
                    ]
                },
                {
                    name: "app_weiyun",
                    matchs: [
                        "weiyun.com"
                    ]
                },
                {
                    name: "app_lanzous",
                    matchs: [
                        "lanzous.com",
                        "lanzoux.com"
                    ]
                },
                {
                    name: "app_189",
                    matchs: [
                        "cloud.189.cn"
                    ]
                },
                {
                    name: "app_manage",
                    matchs: [
                        "*"
                    ]
                }
            ]);
        };
 
        return obj;
    });
 
    /** lib **/
    container.define("$", [], function () {
        return window.$;
    });
    container.define("Snap", [], function () {
        if (typeof Snap != "undefined") {
            return Snap;
        }
        else {
            return window.Snap;
        }
    });
    container.define("DOMPurify", [], function () {
        if (typeof DOMPurify != "undefined") {
            return DOMPurify;
        }
        else {
            return window.DOMPurify;
        }
    });
 
    container.use(["gm", "core", "app"], function (gm, core, app) {
        gm.ready(function () {
            core.ready(app.run);
        });
    });
})();
