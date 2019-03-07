/*
 *公用方法函数
 */
import  CryptoJS from 'crypto-js'
// MD5 加密
export function md5(data) {
  console.log(CryptoJS,22222)
  try {
    if (typeof (data) === "string") {
      return CryptoJS.MD5(data).toString().toLowerCase()
    } else {
      return CryptoJS.MD5(JSON.stringify(data)).toString().toLowerCase();
    }
  } catch (e) {}
}
// aes 加密
export function aesEncrypt(data, iv, _key) {
  // 需要加密的数据data  偏移量iv  密码key
  try {
    var key = "";
    if (_key) {
      key = CryptoJS.enc.Utf8.parse(_key);
    } else {
      key = CryptoJS.enc.Utf8.parse(window.CONFIG.AESKEY);
    }
    var iv = CryptoJS.enc.Utf8.parse(window.CONFIG.AESIV);

    var encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  } catch (e) {
    console.log(e);
  }
}
// aes 解密
export function aesDecrypt(data, iv, key) {
  // 需要解密的数据data  偏移量iv  密码key
  try {
    var key = "";
    if (_key) {
      key = CryptoJS.enc.Utf8.parse(_key);
    } else {
      key = CryptoJS.enc.Utf8.parse(window.CONFIG.AESKEY);
    }
    var iv = CryptoJS.enc.Utf8.parse(window.CONFIG.AESIV);
    var decrypted = CryptoJS.AES.decrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    var decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedStr;
  } catch (e) {
    console.log(e);
  }
}
// js触发事件
export function trigger(elem, event) {
  if (document.all) {
    elem.event();
  } else {
    var evt = document.createEvent("Events"); //还有onchange则是HtmlEvents
    evt.initEvent(event, true, true);
    elem.dispatchEvent(evt);
  };
}

//写cookies
export function setCookie(name, value, day, domain) {
  if (!value) {
    return;
  }
  try {
    var Days = day || 30;
    var exp = new Date();
    // Days * 24 * 60 * 60
    exp.setTime(exp.getTime() +Days* 60 * 1000);
    if (typeof (value) != "string") {
      value = JSON.stringify(value)
    } 
    if(process.env.NODE_ENV == 'development'){
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }else{
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ';path=/;domain= membert.chinajinmao.cn';
    }
    
  } catch (e) {
    return null
  }
}
// 读cookies
export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}
// 删除cookie
export function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
// 设置本地缓存
export function setItem(name, value) {
  if (typeof (value) == "string") {
    localStorage.setItem(name, value)
  } else {
    localStorage.setItem(name, JSON.stringify(value))
  }
}

export function getItem(name) {
  return localStorage.getItem(name)
}

export function removeItem(name) {
  localStorage.removeItem(name)
}
// 设置session缓存
export function setSessionItem(name, value) {
  if (typeof (value) == "string") {
    sessionStorage.setItem(name, value)
  } else {
    sessionStorage.setItem(name, JSON.stringify(value))
  }
}

export function getSessionItem(name) {
  return sessionStorage.getItem(name)
}

export function removeSessionItem(name) {
  sessionStorage.removeItem(name)
}

export function loginFn(id) {
  setCookie(window.CONFIG.TOKENKEY, id)
  setItem(window.CONFIG.TOKENKEY, id)
}

export function logOutFn(id) {
  delCookie(window.CONFIG.TOKENKEY)
  removeItem(window.CONFIG.TOKENKEY)
  delCookie(window.CONFIG.OPENIDKEY)
  removeItem(window.CONFIG.OPENIDKEY)
}

export function formatePhone(phone) {
  let tel = phone.replace(/\s+/g, '');
  if (tel.length > 3 && tel.length <= 7) {
    tel = tel.substring(0, 3) + " " + tel.substring(3)
  } else if (tel.length > 7) {
    tel = tel.substring(0, 3) + " " + tel.substring(3, 7) + " " + tel.substring(7)
  }
  return tel.trim();
}

// 判断是否为手机号
export function isPoneAvailable(pone) {
  var myreg = /^[1][1,2,3,4,5,6,7,8,9,0][0-9]{9}$/;
  if (!myreg.test(pone)) {
    return false;
  } else {
    return true;
  }
}

// 判断是否为电话号码
export function isTelAvailable(tel) {
  var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
  if (!myreg.test(tel)) {
    return false;
  } else {
    return true;
  }
}

export function isWeChat() {
  let userAgent = window.navigator.userAgent;
  return userAgent.match(/MicroMessenger/i) == "MicroMessenger";
}

// 校验姓名
export function checkName(name) {
  var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
  if (reg.test(name)) {
    return true;
  } else {
    return false;
  }
}
// 校验借款金额是否是1000的整数倍
export function checkMoney(val) {
  if (isNaN(val)) {
    return false
  } else {
    let str = (val / 1000) + ''
    if (str.indexOf(".") != -1) {
      return false
    } else {
      return true
    }
  }
}
// 校验身份证
export function checkCardNo(card) {
  // 身份证号码为18位，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
  var reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(card) === false) {
    return false;
  } else {
    return true
  }
}
// 校验密码6-20位字母数字
export function checkPassword(pwd) {
  // 校验密码6-20位字母数
  var reg = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,20}$/;
  if (reg.test(pwd) === false) {
    return false;
  } else {
    return true
  }
}
//校验汉字
export function checkTxtword(pwd) {
  var reg = /[\u4E00-\u9FA5]/g;
  if (reg.test(pwd) === false) {
    return false;
  } else {
    return true
  }
}


// 获取URL 参数
export function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r === null) {
    var reg2 = /^.*?[?]/;
    var r2 = window.location.hash.replace(reg2, "")
    r = r2.match(reg);
  }

  if (r != null) return r[2];
  return null;
}
// URL参数转对象格式
export function parseQuery(query) {
  var reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
  var obj = {};
  while (reg.exec(query)) {
    obj[RegExp.$1] = RegExp.$2;
  }
  return obj;
}

// 倒计时
export function startClock(vueInstance, options) {
  let _config = {
    statusKey: 'smsDisabled',
    lbCodeKey: 'lbSmsCode'
  }
  _config = Object.assign({}, _config, options);
  let time = 60;
  let timer = setInterval(function () {
    time--;
    if (time <= 0) {
      clearInterval(timer);
      vueInstance[_config.lbCodeKey] = '重新发送验证码';
      vueInstance[_config.statusKey] = false;
      return;
    }

    vueInstance[_config.lbCodeKey] = time + 's后重新获取';
    vueInstance[_config.statusKey] = true;
  }, 1000);
}

export function checkNumber(theObj) {
  var reg = /^[0-9]+.?[0-9]*$/;
  if (reg.test(theObj)) {
    return true;
  }
  return false;
}


