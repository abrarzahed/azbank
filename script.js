'use strict';

const account1 = {
  owner: 'Zahed Abrar',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-06-29T14:43:26.374Z',
    '2022-07-02T18:49:59.371Z',
    '2022-07-04T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Abdul Hussen',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-06-01T18:49:59.371Z',
    '2022-07-04T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// @@@@@@@@@@ Elements  @@@@@@@@@@ //
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort1 = document.querySelector('.btn--sort1');
const btnSort2 = document.querySelector('.btn--sort2');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/****************************************** 
COMMENT: display movement rows   
******************************************/

/* 
  COMMENT: utility functions
*/

const formatMovements = function (date, locale) {
  const calcDatePassed = function (date1, date2) {
    return Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  };

  const daysPassed = calcDatePassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    /*
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth()}`.padStart(2, 0);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
    */
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCurrency = function (value, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  };
  const formattedValue = new Intl.NumberFormat(locale, options).format(value);

  return formattedValue;
};

const displayMovement = function (account, sort = false) {
  containerMovements.innerHTML = '';

  //=== sorting  ===//
  const moves = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  moves.forEach((movement, i) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovements(date, account.locale);

    const formattedMov = formatCurrency(
      movement,
      account.locale,
      account.currency
    );

    const movementHtml = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate.toLocaleString()}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', movementHtml);
  });
};

/****************************************** 
COMMENT: calculate and print total balances   
******************************************/
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

/****************************************** 
COMMENT: display summery   
******************************************/
//=== incomes: Deposits, loan, got transfer  ===//
const calcDisplaySummery = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(
    incomes,
    account.locale,
    account.currency
  );

  //=== out: withdrawal  ===//
  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    account.locale,
    account.currency
  );

  //=== transfer  ===//
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};

/****************************************** 
COMMENT: Create username   
******************************************/
const createUserName = function (accounts) {
  accounts.forEach(account => {
    account.userName = account.owner
      .toLowerCase()
      .split(' ')
      .map(w => w[0])
      .join('');
  });
};
createUserName(accounts);

/****************************************** 
COMMENT: Update ui   
******************************************/
const updateUI = function (account) {
  //=== display movements  ===//
  displayMovement(account);

  //=== display balance  ===//
  calcDisplayBalance(account);

  //=== display summery  ===//
  calcDisplaySummery(account);
};

/****************************************** 
COMMENT: Event handlers   
******************************************/
/* 
  COMMENT: Log in
*/

const handleLogout = function () {
  const tick = function () {
    const min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const sec = `${Math.trunc(time % 60)}`.padStart(2, 0);
    //=== in each call print the remaining time to UI  ===//
    labelTimer.textContent = `${min}:${sec}`;

    //=== when 0 seconds, stop timer and logout user  ===//
    if (time === 0) {
      clearInterval(logoutTimer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;

      //=== show instructions  ===//
      document.querySelector('.info').classList.remove('d-none');
    }

    //=== decrease by one second  ===//
    time--;
  };
  //=== set time to 5 seconds  ===//
  let time = 300;

  //=== call timer in every seconds  ===//
  tick();
  const logoutTimer = setInterval(tick, 1000);
  return logoutTimer;
};

let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //=== Display ui with welcome message  ===//
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short',
    };

    const locale = currentAccount.locale;
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    /*
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth()}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}: ${minutes}`;
    */

    //=== clear input fields  ===//
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //=== updating ui  ===//
    updateUI(currentAccount);

    //=== hide instructions  ===//
    document.querySelector('.info').classList.add('d-none');

    //=== logout timer  ===//
    if (timer) clearInterval(timer);
    timer = handleLogout();
  }
});

/* 
  COMMENT: Transfer money
*/
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const ReceiverAccount = accounts.find(
    ac => ac.userName === inputTransferTo.value
  );

  if (
    amount > 0 &&
    ReceiverAccount &&
    currentAccount.balance >= amount &&
    ReceiverAccount?.userName !== currentAccount.userName
  ) {
    //=== doing the transfer  ===//
    currentAccount.movements.push(-amount);
    ReceiverAccount.movements.push(amount);

    //=== Add transfer date  ===//
    currentAccount.movementsDates.push(new Date().toISOString());
    ReceiverAccount.movementsDates.push(new Date().toISOString());

    //=== updating ui  ===//
    updateUI(currentAccount);

    //=== reset timer  ===//
    clearInterval(timer);
    timer = handleLogout();
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
});

/* 
  COMMENT: request loan
*/
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      //=== add movement  ===//
      currentAccount.movements.push(amount);

      //=== Add loan date  ===//
      currentAccount.movementsDates.push(new Date().toISOString());

      //=== update ui  ===//
      updateUI(currentAccount);

      //=== reset timer  ===//
      clearInterval(timer);
      timer = handleLogout();
    }, 2500);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

/* 
  COMMENT: Close account
*/
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const accountToClose = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );

    //=== remove account from accounts array  ===//
    accounts.splice(accountToClose, 1);

    //=== hide ui  ===//
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

/* 
  COMMENT: sorting movements
*/
let isSorted = false;
btnSort1.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovement(currentAccount, !isSorted);
  isSorted = !isSorted;
});
