'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Abrar Hussen',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Ali Umor',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Saklain Shojib Roni',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Imad Abdullah',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
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
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

///DISPLAY MOVEMENTS ON HTML
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}£</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

///DISPLAY BALANCE
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}£`;
};

////DISPLAY SUMMERY
const calcdisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}£`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}£`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}£`;
};

////CREATING USERNAME
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);

const updateUi = function (acc) {
  //Display Movements
  displayMovements(acc.movements);

  //Display ballance
  calcDisplayBalance(acc);

  //Display summery
  calcdisplaySummary(acc);
};

///Event Handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;

    containerApp.style.opacity = 100;

    //Clear Input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    ///Update Ui
    updateUi(currentAccount);
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'NO info! Log in to get started';
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);

    ///Update Ui
    updateUi(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add Movement to current Account
    currentAccount.movements.push(amount);

    //Update The Ui
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    // console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount.movements, !sorted);
});

/////////////////////////////////////////////////
// LECTURES

///sort: it usualy mutes the original one
// const owner = ['abrar', 'jaman','hussen']
// console.log(owner.sort());
// console.log(owner);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// ///Flat Method
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[1, [[2], 3]], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(3));

// const over = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(over);

// ///FlatMap Method: flat and map method together.It can go only one label deep
// const over2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(over2);

///Includes Method: Equality. returns boolean value
// console.log(movements.includes(-130));

///Some method : Condition. returns boolean value
// console.log(movements.some(mov => mov > 0));

///Every Method. returns boolean value
// console.log(movements.every(mov => typeof mov === 'number'));
// console.log(movements.every(mov => mov > 0));

// const account = accounts.find(acc => acc.owner == 'Steven Thomas Williams');
// console.log(account);

// let ac = {};

// for (const nw of accounts) {
//   if (nw.owner == 'Sarah Smith') {
//     ac = nw;
//   }
// }

// console.log(ac);

////filter and map funtion alwas return new array while the reduce method returns a value instead of an array.

// const euroToUsd = 1.1;

// const totalInUsd = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * euroToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalInUsd);
//Finding the maximum value from movements array

// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);

// console.log(max);

// console.log(movements);

// ///With reduce method
// const balance = movements.reduce(function (acc, mov, i, arr) {
//   console.log(`Loop ${i}: ${acc}`);
//   return acc + mov;
// }, 0);
// console.log(balance);

// ////with for of loop

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// const widrow = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(movements);
// console.log(deposits);
// console.log(widrow);

// const depo = [];
// for (const m of movements) {
//   if (m > 0) {
//     depo.push(m);
//   }
// }
// console.log(depo);

// const euroToUsd = 1.1;

// const movementsUSD = movements.forEach(function (mov, i) {
//   console.log(`${i + 1} : ${mov * euroToUsd}`);
// });

// console.log('.....................');

// for(const[i, mov] of movements.entries()){
//   console.log(`${i + 1} : ${mov * euroToUsd}`);
// }

/////////////////////////////////////////////////
