/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      throw new Error('Передан несуществующий элемент');
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      if (event.target.classList.contains('remove-account')) {
        this.removeAccount();
      }
    })
    this.element.addEventListener('click', (event) => {
      if (event.target.classList.contains('transaction__remove')) {
        this.removeTransaction(event.target.dataset.id);
      }
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount() {
    let result = confirm('Вы действительно хотите удалить счёт?');
    if (result) {

      Account.remove(this.lastOptions.account_id, this.lastOptions, (err, response) => {
        
        response = JSON.parse(response);
        if (response.success) {
          this.clear();
          App.update();
        }
      }) 
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction( id ) {
    let result = confirm('Вы действительно хотите удалить эту транзакцию?');
    if (result) {
      Transaction.remove(id, {}, (err, response) => {
        response = JSON.parse(response);
        if (response.success) {
          console.log(response);
          App.update();
        } else {
          console.error(err);
        }
      }) 
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      this.lastOptions = options;

      Account.get('id', options.account_id, (err, response) => {
        response = JSON.parse(response);

        if (response.data) {
          this.renderTitle(response.data.name)

          Transaction.list(options, (err, response) => {
            response = JSON.parse(response);
            if (response.success) {
              this.renderTransactions([]);
              this.renderTransactions(response.data);
            } else {
              console.error('Ошибка при обновлении списка счетов: ' + err)
            }
          })

        } else {
          console.error(`Ошибка ${err}`)
        }
      })
    } else {
      this.clear();
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTitle('Название счета')
    this.renderTransactions([]);
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle( name ) {
    let title = this.element.querySelector('.content-title');
    title.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate( date ) {
    let newDate = new Date(date).toLocaleDateString(
      'ru-ru',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      }
    );
    return newDate;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    let transactionCode = `<div class="transaction transaction_${item.type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
        ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
    </div>`;
    return transactionCode;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions( data ) {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    let transactionsList = '';
    for (let item of data) {
      transactionsList += this.getTransactionHTML(item);
    }
    content.insertAdjacentHTML('beforeend', transactionsList);
  }
}
