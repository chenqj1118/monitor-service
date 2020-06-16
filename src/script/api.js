import axios from 'axios';
import { Loading, MessageBox, Message } from 'element-ui';
let loading; // 定义loading变量

function startLoading () { // 使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中……'
  })
}
function endLoading () { // 使用Element loading-close 方法
  loading.close()
}
let needLoadingRequestCount = 0
export function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}
export function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

/* 请求拦截器 */
axios.interceptors.request.use(
  config => {
    /* let token = localStorage.getItem('user_token');
     if (token) {
     config.headers['X-Auth-Token'] =  `${token}`;
     //console.log(config);
     }else{
     window.location.pathname = '/'
     } */
    // showFullScreenLoading()
    return config;
  },
  err => {
    alert('请求超时');
    return Promise.reject(err);
  }
);

axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

// 响应拦截器
axios.interceptors.response.use((response) => {
  // tryHideFullScreenLoading()
  return response
}, (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        MessageBox.alert(error.response.data.message, '报错' + error.response.status, {
          confirmButtonText: '确定',
          callback: action => {
            // Message.error(err.message);
          }
        });
        break;
      case 404:
        MessageBox.alert(error.response.data.message, '报错' + error.response.status, {
          confirmButtonText: '确定',
          callback: action => {
            // Message.error(err.message);
          }
        });
        break;
      case 500:
        /* MessageBox.alert(error.response.data.message, '报错'+error.response.status, {
          confirmButtonText: '确定',
          callback: action => {
            // Message.error(err.message);
          }
        }); */
        break;
      default:
        MessageBox.alert(error.response.data.message, '报错' + error.response.status, {
          confirmButtonText: '确定',
          callback: action => {
            // Message.error(err.message);
          }
        });
        break;
    }
    // tryHideFullScreenLoading()
  }
  console.log(error.response.data)
  return Promise.reject(error.response.data)
})

/**
 * fetch Get请求
 * @param {String} url 例：'http://xxx/xxx'
 * @param {Obejct} params 例：{'id': id}
 * @param {Obejct} headers 例： {'content-type': 'application/json','token': token }
 * @callback response
 */
export function FetchGet (url, params, headers, callback) {
  axios.get(url, {params: params, headers: headers}).then(response => {
    callback(response.data);
  }).catch(err => {
    console.log(err);
    Message.error('数据错误！' + err);
  });
}

/**
 * fetch Post请求
 * @param {String} url 例：'http://xxx/xxx'
 * @param {Obejct} params 例：{'id': id}
 * @param {Obejct} headers 例：{'content-type': 'application/json','token': token }
 * @callback response
 */
export function FetchPost (url, params, headers, callback) {
  axios.post(url, params, {headers: headers}).then(response => {
    callback(response.data);
  }).catch(err => {
    console.log(err);
    Message.error('数据错误！' + err);
  });
}
