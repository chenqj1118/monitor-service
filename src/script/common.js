const router = require('../router');
const api = require('./api');
const queryTpl = require('./es-query-tpl');

/**
 * 将字符串中的代量
 * @param {string} str 字符串
 * @param {object} obj 新的值
 * @return {string} str
 */
let _replaceWord = (str, obj) => {
  str = str.replace(/\$\{interval\}/g, obj.interval);
  str = str.replace(/\$\{format\}/g, obj.format);
  str = str.replace(/\$\{startTime\}/g, obj.startTime);
  str = str.replace(/\$\{endTime\}/g, obj.endTime);
  str = str.replace(/\$\{serverName\}/g, obj.serverName);
  return str;
}

/**
 * 获取时间间隔
 * @return {string} interval Eg：10s、10m、10h
 */
let _getInterval = () => {
  let interval = '1m';
  let localDateTime = JSON.parse(localStorage.getItem('dateTime'));
  let startTime = new Date(localDateTime[0]).getTime();
  let endTime = new Date(localDateTime[1]).getTime();
  let difTime = (endTime - startTime) / (3600 * 1000); // 相差小时数
  if (difTime <= 0.5) { // 小于半小时
    interval = '1s'
  } else if (difTime <= 2 && difTime > 0.5) {
    interval = '1m'
  } else if (difTime <= 8 && difTime > 2) {
    interval = '10m'
  } else if (difTime <= 24 && difTime > 8) {
    interval = '1h'
  } else if (difTime <= 168 && difTime > 24) {
    interval = '5h'
  } else if (difTime <= 360 && difTime > 168) {
    interval = '10h'
  } else if (difTime > 360) {
    interval = '1d'
  }
  console.log('interval时间间隔：' + interval);
  return interval;
}

let _doQueryFun = (key, searchParams, callback) => {
  let obj = queryTpl[key];
  let url = obj.url;
  let params = obj.queryTpl;
  params = _replaceWord(params, searchParams);
  params = params.replace(/'/g, '"');
  params = obj['content-type'] === 'application/json' ? JSON.parse(params) : params;
  let headers = {'content-type': obj['content-type']};
  if (obj.method === 'POST') {
    api.FetchPost(url, params, headers, (data) => {
      callback(data, searchParams);
    });
  } else {
    api.FetchGet(url, params, headers, (data) => {
      callback(data, searchParams);
    });
  }
}
/**
 * 查询
 * @param {Obejct} obj 例：es-query-tpl.json的value对象
 * @callback data
 */
export let doQuery = (key, callback) => {
  let localDateTime = JSON.parse(localStorage.getItem('dateTime'));
  let searchParams = {
    interval: _getInterval(), // 时间间隔，Eg：10s、10m、10h
    format: 'strict_date_optional_time',
    startTime: localDateTime[0],
    endTime: localDateTime[1],
    serverName: router.default.currentRoute.params.serverName || 'spring-application-1'
  };
  _doQueryFun(key, searchParams, callback);
}

/**
 * 实时查询
 * @param {Obejct} obj 例：es-query-tpl.json的value对象
 * @callback data
 */
export let doIntervalQuery = (key, callback) => {
  let timeNum = 60 * 1000 * 2; // 最近2分钟
  let searchParams = {
    interval: '1s',
    format: 'strict_date_optional_time',
    startTime: new Date(new Date().getTime() - timeNum).toISOString(),
    endTime: new Date().toISOString(),
    serverName: router.default.currentRoute.params.serverName || 'spring-application-1'
  };
  let timer = setInterval(() => {
    searchParams.startTime = new Date(new Date().getTime() - timeNum).toISOString();
    searchParams.endTime = new Date().toISOString();
    _doQueryFun(key, searchParams, callback);
  }, 5000);
  _doQueryFun(key, searchParams, callback);
}
/**
 * 获取chartRow的数据
 * @param {array} array 例：aggregations[2].buckets对象
 * @return newRowsArray
 */
export let getChartRows = (array, searchParams) => {
  let newRowsArray = [];
  if (array.length) {
    array.forEach((item, index) => {
      let newObj = {};
      newObj.key = item.key;
      if (item['3']) {
        item['3'].buckets.forEach((i, iIndex) => {
          newObj[i.key] = i.doc_count;
        })
      } else {
        newObj.doc_count = item.doc_count;
      }
      newRowsArray.push(newObj);
    })
    let reg = /^\d+(\.\d+)?$/; // 日期开头的字符串
    let firstKey = newRowsArray[0].key;
    let newRowObj = JSON.parse(JSON.stringify(newRowsArray[0]));
    for (let key in newRowObj) {
      newRowObj[key] = 0;
    }
    let isTime = reg.test(firstKey); // 是时间才需要补点
    if (isTime) {
      let originRowsArray = [];
      let firstTime = firstKey;
      let stepTime = 1000; // 时间步长 微秒单位
      switch (searchParams.interval) {
        case '1s':
          stepTime = 1000;
          break;
        case '1m':
          stepTime = 60 * 1000;
          break;
        case '10m':
          stepTime = 10 * 60 * 1000;
          break;
        case '1h':
          stepTime = 3600 * 1000;
          break;
        case '5h':
          stepTime = 5 * 3600 * 1000;
          break;
        case '10h':
          stepTime = 10 * 3600 * 1000;
          break;
        default:
          stepTime = 1000;
          break;
      }
      for (let i = firstTime; i >= Date.parse(searchParams.startTime); i -= stepTime) {
        let obj = JSON.parse(JSON.stringify(newRowObj))
        obj.key = i;
        originRowsArray.push(obj);
      }
      originRowsArray.reverse(); // 倒序
      originRowsArray.length && originRowsArray.splice(originRowsArray.length - 1, 1);
      for (let i = firstTime; i <= Date.parse(searchParams.endTime); i += stepTime) {
        let obj = JSON.parse(JSON.stringify(newRowObj))
        obj.key = i;
        originRowsArray.push(obj);
      }
      if (originRowsArray.length !== newRowsArray.length) {
        for (let i = 0; i < originRowsArray.length; i++) { // 合并两个array
          for (let j = 0; j < newRowsArray.length; j++) {
            if (originRowsArray[i].key === newRowsArray[j].key) {
              originRowsArray[i].doc_count = newRowsArray[j].doc_count;
            }
          }
        }
        return originRowsArray;
      } else {
        return newRowsArray;
      }
    } else {
      return newRowsArray;
    }
  } else {
    return [];
  }
}

/**
 * 获取chartColumns的数据
 * @param {array} array 例：aggregations[2].buckets对象
 * @return newColumnsArray
 */
export let getChartColumns = (array) => {
  let newColumnsArray = [];
  if (array.length) {
    if (array[0]['3']) {
      newColumnsArray = ['key'];
      array[0]['3'].buckets.forEach((item) => {
        newColumnsArray.push(item.key);
      })
    } else {
      newColumnsArray = ['key', 'doc_count'];
    }
  }
  return newColumnsArray;
}
