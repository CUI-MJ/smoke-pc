//图片上传相关工具函数
import {Message} from 'element-ui';

export function checkWidth2(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload =  (event) => {
      let data = event.target.result
      let img = new Image()
      img.src = data
      img.onload = () => {
        if(img.width < 320 || img.height < 320){
          Message.warning('照片不能小于320*320')
          resolve(null);
        }else{
          canvasPhoto(data,{img,quality: file.size > 1 ? 1 / (file.size/1024/1024) : 1},base64Photo =>{
            resolve(base64Photo);
          })
        }
      }
    }
  })
}


function canvasPhoto(result,obj,callback){
  var w = obj.img.width;
  var h = obj.img.height;
  // 默认图片质量为0.7
  var quality = 0.7;
  //生成canvas
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  // 创建属性节点
  var anw = document.createAttribute("width");
  anw.nodeValue = w;
  var anh = document.createAttribute("height");
  anh.nodeValue = h;
  canvas.setAttributeNode(anw);
  canvas.setAttributeNode(anh);
  ctx.drawImage(obj.img, 0, 0, w, h);
  // 图像质量
  if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
    quality = obj.quality;
  }
  // quality值越小，所绘制出的图像越模糊
  var base64 = canvas.toDataURL('image/jpeg', quality);
  // 回调函数返回base64的值
  callback(base64);
}


function getBase64(url, callback){
  //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
  var Img = new Image(),
    dataURL='';
  Img.src=url;
  Img.onload=function(){ //要先确保图片完整获取到，这是个异步事件
    var canvas = document.createElement("canvas"), //创建canvas元素
      width=Img.width, //确保canvas的尺寸和图片一样
      height=Img.height;
    canvas.width=width;
    canvas.height=height;
    canvas.getContext("2d").drawImage(Img,0,0,width,height); //将图片绘制到canvas中
    dataURL=canvas.toDataURL('image/jpeg'); //转换图片为dataURL
    callback?callback(dataURL):null; //调用回调函数
  };
}
