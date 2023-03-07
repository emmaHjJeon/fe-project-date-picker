class DatePicker {
  monthData = [
    'January',
    'Fabruary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'Septempber',
    'October',
    'November',
    'December',
  ];

  #calendarDate = {
    data: '',
    date: 0,
    month: 0,
    year: 0,
  };

  #currentDate = {
    data: '',
    date: 0,
    month: 0,
    year: 0,
  };

  selectDate = {
    data: '',
    date: 0,
    month: 0,
    year: 0,
  };

  datePickerEl;
  dateInputEl;
  calendarEl;
  calendarMonthEl;
  monthContentEl;
  prevBtnEl;
  nextBtnEl;
  calendarDatesEl;
  calendarDaysEl;

  constructor() {
    this.initCalendarDate();
    this.initCurrentDate();
    this.initSelectedDate();
    this.assignElement();
    this.addEvent();
    this.setDateInput();
  }

  initCalendarDate() {
    const data = new Date();
    const date = data.getDate();
    const month = data.getMonth();
    const year = data.getFullYear();
    this.#calendarDate = {
      data,
      date,
      month,
      year,
    };
  }

  initCurrentDate() {
    this.#currentDate = {
      ...this.#calendarDate,
    };
  }

  initSelectedDate() {
    this.selectDate = {
      ...this.#calendarDate,
    };
  }

  setDateInput() {
    this.dateInputEl.textContent = this.formateDate(this.selectDate.data);
    this.dateInputEl.dataset.value = this.selectDate.data;
  }
  assignElement() {
    this.datePickerEl = document.getElementById('date-picker');
    this.dateInputEl = this.datePickerEl.querySelector('#date-input');
    this.calendarEl = this.datePickerEl.querySelector('#calendar');
    this.calendarMonthEl = this.calendarEl.querySelector('#month');
    this.monthContentEl = this.calendarMonthEl.querySelector('#content');
    this.nextBtnEl = this.calendarMonthEl.querySelector('#next');
    this.prevBtnEl = this.calendarMonthEl.querySelector('#prev');
    this.calendarDatesEl = this.calendarEl.querySelector('#dates');
  }

  addEvent() {
    this.dateInputEl.addEventListener('click', this.toggleCalendar.bind(this));
    this.nextBtnEl.addEventListener('click', this.moveToNextMonth.bind(this));
    this.prevBtnEl.addEventListener('click', this.moveToPrevMonth.bind(this));
    this.calendarDatesEl.addEventListener(
      'click',
      this.onClickSelectDate.bind(this),
    );
  }

  onClickSelectDate(event) {
    const eventTarget = event.target;
    if (eventTarget.dataset.date) {
      this.calendarDatesEl
        .querySelector('.selected')
        ?.classList.remove('selected');

      event.target.classList.add('selected');

      this.selectDate = {
        data: new Date(
          this.#calendarDate.year,
          this.#calendarDate.month,
          eventTarget.dataset.date,
        ),
        year: this.#calendarDate.year,
        month: this.#calendarDate.month,
        date: eventTarget.dataset.date,
      };

      this.setDateInput();
      this.calendarEl.classList.remove('active');
    }
  }

  formateDate(dateData) {
    let date = dateData.getDate();
    if (date < 10) {
      date = `0${date}`;
    }

    let month = dateData.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }

    let year = dateData.getFullYear();

    return `${year}/${month}/${date}`;
  }

  moveToNextMonth() {
    this.#calendarDate.month++;
    if (this.#calendarDate.month > 11) {
      this.#calendarDate.month = 0;
      this.#calendarDate.year++;
    }

    this.updateMonth();
    this.updateDates();
  }

  moveToPrevMonth() {
    this.#calendarDate.month--;
    if (this.#calendarDate.month < 0) {
      this.#calendarDate.month = 11;
      this.#calendarDate.year--;
    }

    this.updateMonth();
    this.updateDates();
  }

  toggleCalendar() {
    if (this.calendarEl.classList.contains('active')) {
      this.#calendarDate = { ...this.selectDate };
    }
    this.calendarEl.classList.toggle('active');
    this.updateMonth();
    this.updateDates();
  }

  updateMonth() {
    this.monthContentEl.textContent = `${this.#calendarDate.year} ${
      this.monthData[this.#calendarDate.month]
    }`;
  }

  updateDates() {
    this.calendarDatesEl.innerHTML = '';
    const numberOfDates = new Date(
      this.#calendarDate.year,
      this.#calendarDate.month + 1,
      0,
    ).getDate();

    const fragment = new DocumentFragment();
    for (let i = 1; i <= numberOfDates; i++) {
      const dateEl = document.createElement('div');
      dateEl.classList.add('date');
      dateEl.textContent = i;
      dateEl.dataset.date = i;

      fragment.appendChild(dateEl);
    }

    // set day of 1st date
    fragment.firstChild.style.gridColumnStart =
      new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay() +
      1;

    this.calendarDatesEl.appendChild(fragment);

    this.colorSaturday();
    this.colorSunday();
    this.markToday();
    this.markSelectedDate();
  }

  colorSaturday() {
    const saturdayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        7 -
        new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay()
      })`,
    );
    for (let i = 0; i < saturdayEls.length; i++) {
      saturdayEls[i].style.color = 'blue';
    }
  }

  colorSunday() {
    const sundayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        2 +
        new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay()
      })`,
    );

    for (let i = 0; i < sundayEls.length; i++) {
      sundayEls[i].style.color = 'red';
    }
  }

  markToday() {
    if (
      this.#currentDate.year === this.#calendarDate.year &&
      this.#currentDate.month === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${this.#currentDate.date}`)
        .classList.add('today');
    }
  }

  markSelectedDate() {
    if (
      this.selectDate.year === this.#calendarDate.year &&
      this.selectDate.month === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${this.selectDate.date}`)
        .classList.add('selected');
    }
  }
}

new DatePicker();
