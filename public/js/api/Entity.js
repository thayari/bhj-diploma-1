/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {

  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list( data, callback = f => f ) {
    let options = {
      data,
      method: 'GET',
      url: this.URL,
      responseType: 'json',
      callback
    }
    return createRequest(options);
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create( data, callback = f => f ) {
    let options = {
      data,
      method: 'POST',
      url: this.URL,
      responseType: 'json',
      callback
    }
    return createRequest(options);
  }

  /**
   * Получает информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static get( id = '', data, callback = f => f ) {
    let dataNew = { [id]: data };
    let options = {
      data: dataNew,
      method: 'GET',
      url: this.URL,
      responseType: 'json',
      callback
    }
    return createRequest(options);
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove( id = '', data, callback = f => f ) {
    Object.assign(data, { id: id, _method: 'DELETE' });
    let options = {
      data,
      method: 'POST',
      url: this.URL,
      responseType: 'json',
      callback
    }
    console.log(options);
    return createRequest(options);
  }
}

Entity.URL = '';