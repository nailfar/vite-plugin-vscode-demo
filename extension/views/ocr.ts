const AipOcrClient = require("baidu-aip-sdk").ocr;

const APP_ID = "80045850";
const API_KEY = "YzG25Qs7GMk1wjZxDBYtvCLV";
const SECRET_KEY = "wW8EiV9SSezzLAgSjHGAWrcVNvqV4po2";

// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

export function ocrBasic(img: string) {
  return client.generalBasic(img).then(function (result) {
    console.log(JSON.stringify(result));
    return result;
  }).catch(function (err) {
    // 如果发生网络错误
    console.log(err);
  });
}