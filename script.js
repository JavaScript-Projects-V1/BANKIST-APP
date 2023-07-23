// Functions

let xx; // for time function
const sessionLoginTime = function (x) {
  let y = 59;
  if (xx) clearInterval(xx);
  labelTimer.textContent = formatTime(new Date(0, 0, 0, 0, x--, 0));
  xx = setInterval(function () {
    labelTimer.textContent = formatTime(new Date(0, 0, 0, 0, x, y--));
    if (y === 0) {
      if (x === 0) {
        clearInterval(xx);
        labelTimer.textContent = formatTime(new Date(0, 0, 0, 0, 0, 0));
        labelWelcome.textContent = "Log in to get started";
        containerApp.style.opacity = 0;
      }
      y = 59;
      --x;
    }
  }, 1000);
};

const formatCur = (value, locale, currency) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);

const formatTime = function (value) {
  return new Intl.DateTimeFormat(navigator.locale, {
    minute: "2-digit",
    second: "2-digit",
  }).format(value);
};

const accountMovementFormat = function (date, locale) {
  let formattedDate;
  let sub = Math.round((new Date() - date) / (1000 * 60 * 60 * 24));

  if (sub === 0) formattedDate = "TODAY";
  else if (sub === 1) formattedDate = "YESTERDAY";
  else if (sub <= 7) formattedDate = `${sub} days ago`;
  else if (sub <= 30) formattedDate = `${Math.round(sub / 7)} weeks ago`;
  else if (sub < 335) formattedDate = `${Math.round(sub / 30)} Months ago`;
  else formattedDate = new Intl.DateTimeFormat(locale).format(date);

  return formattedDate;
};

let curDate;
const diplayCurDate = function (locale) {
  const initial = function () {
    labelDate.textContent = new Intl.DateTimeFormat(locale, {
      // year: "numeric",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      weekday: "long",
    }).format(new Date());
    labelDate.style.fontWeight = 1000;
  };
  if (curDate) clearInterval(curDate);
  initial();
  curDate = setInterval(initial, 1000);
};

const displayMovements = function (acc, sorted = false) {
  // clear content of div -> movements
  containerMovements.innerHTML = "";

  containerApp.style.opacity = 1;

  movs = sorted ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const cur = new Date(acc.movementsDates[i]);

    diplayCurDate(acc.locale);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${accountMovementFormat(
            cur,
            acc.locale
          )}</div>
          <div class="movements__value">${formatCur(
            mov,
            acc.locale,
            acc.currency
          )}</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const creteUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = formatCur(-out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

let acc;
const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
  sessionLoginTime(5);
};

// Data

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2023-07-01T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-07-26T17:01:17.194Z",
    "2022-07-28T23:36:17.929Z",
    "2022-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2023-07-01T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-07-26T17:01:17.194Z",
    "2022-07-28T23:36:17.929Z",
    "2022-08-01T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US", // de-DE
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2023-07-01T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-07-26T17:01:17.194Z",
    "2022-07-28T23:36:17.929Z",
    "2022-08-01T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US", // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const now = new Date();
const year = now.getFullYear();
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const date = `${now.getDate()}`.padStart(2, 0);
const hours = `${now.getHours()}`.padStart(2, 0);
const minutes = `${now.getMinutes()}`.padStart(2, 0);

creteUserNames(accounts);

btnLogin.addEventListener("click", function (e) {
  inputTransferAmount.value = "";
  inputTransferTo.value = "";
  inputCloseUsername.value = inputClosePin.value = "";
  inputLoanAmount.value = "";
  inputLoanAmount.blur();

  e.preventDefault();
  sorted = false;
  acc = accounts.find((acc) => acc.userName === inputLoginUsername.value);
  if (acc?.pin === +inputLoginPin.value) {
    updateUI(acc);
    labelWelcome.textContent = `Welcome back, ${acc.owner.split(" ")[0]}`;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener("click", function (e) {
  sorted = false;
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const recieverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  if (
    amount > 0 &&
    recieverAcc &&
    recieverAcc?.userName !== acc.userName &&
    acc.balance >= amount
  ) {
    acc.movements.push(-amount);
    recieverAcc.movements.push(amount);
    acc.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());

    setTimeout(() => {
      updateUI(acc);
    }, 2500);

    inputTransferAmount.value = "";
    inputTransferTo.value = "";
    inputLoanAmount.blur();
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === acc.userName &&
    acc.pin === +inputClosePin.value
  ) {
    const idx = accounts.findIndex(
      (cur) => cur.userName === acc.userName && cur.pin === acc.pin
    );
    accounts.splice(idx, 1);
    inputCloseUsername.value = inputClosePin.value = "";
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
});

btnLoan.addEventListener("click", function (e) {
  sorted = false;
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0 && acc.movements.some((mov) => mov >= amount * 0.1)) {
    setTimeout(function () {
      acc.movements.push(amount);
      acc.movementsDates.push(new Date().toISOString());
      updateUI(acc);
      inputLoanAmount.blur();
    }, 2500);
    inputLoanAmount.value = "";
  }
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(acc, !sorted);
  sorted = !sorted;
});
