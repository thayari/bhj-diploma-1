/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    if (localStorage.user) {
      return JSON.parse(localStorage.user);
    }
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch( data, callback = f => f ) {
    let options = {
      data,
      method: 'GET',
      url: User.URL + '/current',
      responseType: 'json',
      callback: (err, response) => {
        response = JSON.parse(response);
        if (response.success) {
          this.setCurrent(data);
        } else {
          this.unsetCurrent();
          console.error(response.error);
        }
        callback(err, response);
      }
    }
    return createRequest(options);
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login( data, callback = f => f ) {
    let options = {
      data,
      method: 'POST',
      url: User.URL + '/login',
      responseType: 'json',
      callback: (err, response) => {
        response = JSON.parse(response);
        if (response.success) {
          this.setCurrent(response.user);
        } else {
          console.error('Пользователь не авторизован');
        }
        callback(err, response);
      }
    }
    return createRequest(options);
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register( data, callback = f => f ) {
    let options = {
      data,
      method: 'POST',
      url: User.URL + '/register',
      responseType: 'json',
      callback: (err, response) => {
        response = JSON.parse(response);
        if (response.success) {
          this.setCurrent(data);
        } else {
          console.error(response.error);
        }
        callback(err, response);
      }
    }
    return createRequest(options);
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout( data, callback = f => f ) {
    let options = {
      data,
      method: 'POST',
      url: User.URL + '/logout',
      responseType: 'json',
      callback: (err, response) => {
        response = JSON.parse(response);
        if (response.success) {
          this.unsetCurrent();
        }
        callback(err, response);
      }
    }
    return createRequest(options);
  }
}

User.URL = '/user';