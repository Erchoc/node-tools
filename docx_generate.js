const fs = require("fs");

const uuidv1 = require('uuid');
var officegen = require("officegen");
var cheerio = require("cheerio");

const Config = require('./config/docx_generate_mock.js');


// 假数据读取
const data = Config.getExampleData;

// 配置文件读取
const config = Config.getConfig;
const directory = config.staticResourceLocation;

/* 加入事务处理，服务器存储和数据库存储保持UUID一致 */

// 确定新资源UUID
const resourceId = uuidv1();

// 调用生成接口
let out = fs.createWriteStream(`${directory}${resourceId}.docx`);
// let docx = generateDocx.generateDemoLearn(data);
let docx = generateDemoLearn(data);
docx.generate ( out );
console.log(`生成成功,资源名为${resourceId}`);

// TODO更新数据库资源路径

function generateDemoLearn(data) {
  // 初始化docx文档
  let docx = officegen( {type:'docx'} );

  // 创建一个文字段落
  let pobj =docx.createP();
  // 在这个段落中添加文字内容和设置改内容的字体样式
  pobj.addText(data.ptxt);

  // 创建一个段落，只有图片
  let obj1 = docx.createP();
  obj1.addImage('./public/1.png');

  // 创建一个段落//含有图片文字
  let obj = docx.createP();
  // 因为含有图片，而且图片大小
  // 分离image标签和src的距离，因为出现过<imgsrc='*****'>的问题；
  // 分离image标签和src的距离，因为出现过<imgsrc='*****'>的问题；
  data.pImage = data.pImage.replace(/img/ig, 'img  ');
  // cheerio 处理数据中的img标签，使字符串的html标签,像dom节点一样可操作
  const $ = cheerio.load(data.pImage);
  const images = data.pImage.match(/<img[^>]+>/ig);
  const texts = data.pImage.split(/<img[^>]+>/ig);
  // 获取img标签的dom节点
  const slideList = $('img');
  const imgdata = [];
  if (images !== null) {
    // 处理image信息，获得imge中的width,height的信息
    images.forEach((data, index) => {
      imgdata[index] = slideList[index + ''].attribs;
      imgdata[index].strLen = data.length;
      imgdata[index].src = imgdata[index].src;
      // TODO默认图片设置 
    });
    // 判断拼凑的规则
    texts.forEach((item , index) => {
      // 拼凑图片
      obj.addText(item);
      if (index + 1 < texts.length) { // 图片的数量一定比分割数据少1
        obj.addImage(imgdata[index].src, {
          cx: imgdata[index].width,
          cy: imgdata[index].height,
          border: imgdata[index].border,
        });
      }
    });
  }
  return docx;
};
