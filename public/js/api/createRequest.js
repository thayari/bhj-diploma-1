/**
 * Основная функция для совершения запросов
 * на сервер.
 * @param {Object} options
 * @param {string} options.url
 * @param {Object} options.headers
 * @param {Object} options.data
 * @param {string} options.responseType
 * @param {string} options.method
 * @param {requestCallback} options.callback
 * */
const createRequest = (options = {}) => {
  let xhr = new XMLHttpRequest();

  xhr.withCredentials = true;

  if (options.method == 'GET') {
    let data = [];
    for (key in options.data) {
      data.push(`${key}=${options.data[key]}`);
    }
    let requestString = `${options.url}?${data.join('&')}`;
    xhr.open('GET', requestString);
    xhr.send();
  } else {
    let formData = new FormData;
    for (key in options.data) {
      formData.append(key, options.data[key]);
    }
    try {
      xhr.open(options.method, options.url);
      xhr.send(formData);
    }
    catch (e) {
      callback(e);
    }
  }

  xhr.addEventListener('load', () => {
    if (xhr.readyState = 4 && xhr.status == 200) {
      options.callback(null, xhr.response);
    }
  });

  xhr.addEventListener('error', () => {
    options.callback(err);
  });
};
