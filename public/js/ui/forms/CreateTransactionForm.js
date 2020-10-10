/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * Наследуется от AsyncForm
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor( element ) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const expenceAccountsList = document.querySelector('#expense-accounts-list');
    const incomeAccountsList = document.querySelector('#income-accounts-list');
    let accountsListItems = '';
    const user = User.current();

    Account.list(user, (err, response) => {
      response = JSON.parse(response);
      if (response.success) {
        for (let element of response.data) {
          accountsListItems += `<option value="${element.id}">${element.name}</option>`;
        }
        expenceAccountsList.innerHTML = accountsListItems;
        incomeAccountsList.innerHTML = accountsListItems;
      } else {
        console.error('Ошибка при обновлении списка счетов.')
      }
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit( options ) {
    let modifiedData = Object.assign({ _method: 'PUT' }, options.data );
    Transaction.create(modifiedData, (err, response) => {
      response = JSON.parse(response);
      if (response.success) {
        this.element.reset();
        App.update();
        App.getModal('newIncome').close();
        App.getModal('newExpense').close();
      } else {
        console.error(response.error);
      }
    })
  }
}
