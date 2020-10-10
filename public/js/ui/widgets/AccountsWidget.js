/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (element) {
      this.element = element;
      this.registerEvents();
      this.update();
    } else {
      throw Error('Ошибка: передан несуществующий элемент.')
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    let createAccount = document.querySelector('.create-account');
    createAccount.addEventListener('click', () => {
      App.getModal('createAccount').open();
    })
    this.element.addEventListener('click', (event) => {
      let target = event.target.closest('.account');
      if (target) {
        this.onSelectAccount(target);
      }
    })
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      let user = User.current();
      Account.list(user, (err, response) => {
        response = JSON.parse(response);
        if (response.success) {
          this.clear();
          console.log(response.data);
          this.renderItem(response.data);
        } else {
          console.error('Ошибка при обновлении списка счетов.')
        }
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    let accounts = document.querySelectorAll('.account');
    if (accounts.length > 0) {
      for (let i = 0; i < accounts.length; i++) {
        accounts[i].remove();
      }
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    let previousElem = document.querySelector('.active');
    if (previousElem) {
      previousElem.classList.remove('active'); 
    }
    element.classList.add('active');
    App.showPage( 'transactions', { account_id: element.dataset.id })
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    let string = '';
    for (let i = 0; i < item.length; i++) {
      string += `<li class="account" data-id="${item[i].id}">
      <a href="#">
          <span>${item[i].name}</span> /
          <span>${item[i].sum} ₽</span>
      </a>
      </li>`;
    }
    return string;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(item) {
    this.element.insertAdjacentHTML('beforeend', this.getAccountHTML(item));
  }
}
