function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
  }
  return "";
}

//设置cookie
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 1000 / 2));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

//清除cookie
function clearCookie(name) {
  setCookie(name, "", -1);
}

function getRequest() {
  var url = window.location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

function trim(s){
  return s.replace(/(^s*)|(s*$)/g, "");
}

function isNumber(value){
  return typeof value === 'number' && !isNaN(value);
}

function setLoaclStorage(key, value){
  localStorage.setItem(key, value);
}

function getLoaclStorage(key){
  localStorage.getItem(key);
}

function removeLoaclStorage(key){
  localStorage.removeItem(key);
}

function getALLLoaclStorage(){

  var len = localStorage.length;  // 获取长度
  var arr = []; // 定义数据集

  for(var i = 0; i < len; i++) {

    var getKey = localStorage.key(i);

    if(getKey.substring(0, 4) == 'key-' ){
      var getVal = localStorage.getItem(getKey);

      // 放进数组
      let obj = {
          'key': getKey,
          'val': getVal,
      }

      arr.push(obj);
    }
  }

  return arr;
}

export {
  
  getCookie,
  setCookie,
  setLoaclStorage,
  getLoaclStorage,
  getALLLoaclStorage,
  removeLoaclStorage,
  clearCookie,
  getRequest,
  trim,
  isNumber
}
