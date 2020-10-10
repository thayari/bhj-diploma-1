/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * Наследуется от AsyncForm
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно (в котором находится форма) в случае успеха,
   * а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit( options ) {
    let modifiedData = Object.assign({ _method: 'PUT' }, options.data );
    Account.create(modifiedData, (err, response) => {
      response = JSON.parse(response);
      if (response.success) {
        this.element.reset();
        App.getModal('createAccount').close();
        App.update();
      } else {
        console.error(`Ошибка ${err}`)
      }
    })
  }
}
