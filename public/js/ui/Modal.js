/**
 * Класс Modal отвечает за
 * управление всплывающими окнами.
 * В первую очередь это открытие или
 * закрытие имеющихся окон
 * */
class Modal {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      throw Error('Ошибка: передан несуществующий элемент.')
    }
  }

  /**
   * При нажатии на элемент с data-dismiss="modal"
   * должен закрыть текущее окно
   * (с помощью метода Modal.onClose)
   * */
  registerEvents() {
    let closeButtons = this.element.querySelectorAll('[data-dismiss="modal"]');
    for (let i = 0; i < closeButtons.length; i++) {
      closeButtons[i].addEventListener('click', (e) => {
        this.onClose(e);
      })
    }
  }

  /**
   * Срабатывает после нажатия на элементы, закрывающие окно.
   * Закрывает текущее окно (Modal.close())
   * */
  onClose( e ) {
    e.preventDefault();
    this.close();
  }
  /**
   * Удаляет обработчики событий
   * */
  unregisterEvents() {
    let closeButtons = this.element.querySelectorAll('[data-dismiss="modal"]');
    for (let i = 0; i < closeButtons.length; i++) {
      closeButtons[i].removeEventListener('click', (e) => {
        this.onClose(e);
      })
    }
  }
  /**
   * Открывает окно: устанавливает CSS-свойство display
   * со значением «block»
   * */
  open() {
    this.element.style.display = "block";
  }
  /**
   * Закрывает окно: удаляет CSS-свойство display
   * */
  close(){
    this.element.style.display = "none";
  }
}
