/** @format */

'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		'2022-11-18T21:31:17.178Z',
		'2022-12-23T07:42:02.383Z',
		'2023-01-28T09:15:04.904Z',
		'2023-04-01T10:17:24.185Z',
		'2023-05-08T14:11:59.604Z',
		'2023-05-27T17:01:17.194Z',
		'2023-07-11T23:36:17.929Z',
		'2023-07-12T10:51:36.790Z',
	],
	currency: 'EUR',
	locale: 'pt-PT', // de-DE
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		'2022-11-01T13:15:33.035Z',
		'2022-11-30T09:48:16.867Z',
		'2022-12-25T06:04:23.907Z',
		'2023-01-25T14:18:46.235Z',
		'2023-02-05T16:33:06.386Z',
		'2023-04-10T14:43:26.374Z',
		'2023-06-25T18:49:59.371Z',
		'2023-07-26T12:01:20.894Z',
	],
	currency: 'USD',
	locale: 'en-US',
};

const account3 = {
	owner: 'Steven Thomas Williams',
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	movementsDates: [
		'2022-11-18T21:31:17.178Z',
		'2022-12-23T07:42:02.383Z',
		'2023-01-28T09:15:04.904Z',
		'2023-04-01T10:17:24.185Z',
		'2023-05-08T14:11:59.604Z',
		'2023-05-27T17:01:17.194Z',
		'2023-07-11T23:36:17.929Z',
		'2023-07-12T10:51:36.790Z',
	],
	interestRate: 0.7,
	currency: 'USD',
	locale: 'en-US',
	pin: 3333,
};

const account4 = {
	owner: 'Sarah Smith',
	movements: [430, 1000, 700, 50, 90],
	movementsDates: [
		'2022-11-18T21:31:17.178Z',
		'2022-12-23T07:42:02.383Z',
		'2023-01-28T09:15:04.904Z',
		'2023-04-01T10:17:24.185Z',
		'2023-05-08T14:11:59.604Z',
		'2023-05-27T17:01:17.194Z',
		'2023-07-11T23:36:17.929Z',
		'2023-07-12T10:51:36.790Z',
	],
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

const formatCur = function (value, locale, currency) {
	return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(value);
};
const displayMovements = function (acc, sort = false) {
	// To remove the already existing HTML inside the Movements container
	containerMovements.innerHTML = '';

	// This codition is to sort when the sort button is pressed
	const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

	movs.forEach(function (mov, i) {
		const type = mov > 0 ? 'deposit' : 'withdrawal';

		// Adding the dates of each transaction
		const date = new Date(acc.movementsDates[i]);
		const displayDate = formatMovementDate(date, acc.locale);
		const formattedMov = formatCur(mov, acc.locale, acc.currency);

		const html = `
        <div class="movements__row">
			<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
			<div class="movements__date">${displayDate}</div>

			<div class="movements__value">${formattedMov}</div>
        </div>`;

		// Adding the html needed using JavaScript
		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

// Currency changing

const eurToUsd = 1.1;

const movementsToUSD = function (movements) {
	movements.map((mov) => mov * eurToUsd);
};

const movementsDescriptions = function (movements) {
	movements.map((mov, i) => `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`);
};

// Computing the usernames

const createUsernames = function (accs) {
	accs.forEach(function (acc) {
		acc.username = acc.owner
			.toLowerCase()
			.split(' ')
			.map((name) => name[0])
			.join('');
	});
};

createUsernames(accounts);

// Calculating the Balance
const calcDisplayBalance = function (acc) {
	acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
	labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// This function is used to update the UI
const updateUI = function (acc) {
	// Display movements
	displayMovements(acc);

	// Display Balance
	calcDisplayBalance(acc);

	// Display Summary
	calcDisplaySummary(acc);
};

// Log out when inactvie function
const startLogOuttimer = function () {
	const tick = function () {
		const min = String(Math.trunc(time / 60)).padStart(2, 0);
		const sec = String(time % 60).padStart(2, 0);

		// In each iteration print the remaining time
		labelTimer.textContent = `${min}:${sec}`;

		// When 0 seconds, stop timer and log out user
		if (time === 0) {
			labelWelcome.textContent = 'Log in to get started';
			containerApp.style.opacity = 0;
			clearInterval(timer);
		}

		// Decrease 1s
		time--;
	};

	// Set time to 5 minutes
	let time = 300;

	// Call the timer every second
	tick();
	timer = setInterval(tick, 1000);

	return timer;
};

// PIPELINE also known as Chaning where the methods used are all chained in a line
const totalDepositsUSD = account1.movements
	.filter((mov) => mov > 0)
	.map((mov) => mov * eurToUsd)
	.reduce((acc, mov) => acc + mov, 0);

// Calculating the Summary
const calcDisplaySummary = function (acc) {
	// Income
	const incomes = acc.movements.filter((mov) => mov > 0).reduce((acc, mov) => acc + mov, 0);

	labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
	// Outgoing
	const out = acc.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0);

	labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

	// Interest
	const interest = acc.movements
		.filter((mov) => mov > 0)
		.map((deposit) => (deposit * acc.interestRate) / 100)
		.filter((mov) => mov > 1)
		.reduce((acc, int) => acc + int, 0);

	labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// Date function
const formatMovementDate = function (date, locale) {
	const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

	const daysPassed = calcDaysPassed(new Date(), date);

	if (daysPassed === 0) return 'Today';
	if (daysPassed === 1) return 'Yesterday';
	if (daysPassed <= 7) return `${daysPassed} days`;

	// const day = `${date.getDate()}` .padStart(2, 0);
	// const month = `${date.getMonth() + 1}`.padStart(2, 0);
	// const year = date.getFullYear();
	// return `${day}/${month}/${year}`;

	return new Intl.DateTimeFormat(locale).format(date);
};

// Event handler

let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
	//Prevent form from submitting and refreshing
	e.preventDefault();

	currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value);

	if (currentAccount?.pin === Number(inputLoginPin.value)) {
		//Display UI and a welcome message
		labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

		// Creating the signed in date
		const now = new Date();

		// Day/Month/Year

		// const day = `${now.getDate()}`.padStart(2, 0);
		// const month = `${now.getMonth() + 1}`.padStart(2, 0);
		// const year = now.getFullYear();
		// const hour = `${now.getHours()}`.padStart(2, 0);
		// const min = `${now.getMinutes()}`.padStart(2, 0);

		const options = {
			hour: 'numeric',
			minute: 'numeric',
			day: 'numeric',
			month: 'numeric',
			year: 'numeric',
		};

		// const locale = navigator.language;
		labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
		// Showing the page
		containerApp.style.opacity = 100;

		// Clear the input fields
		inputLoginUsername.value = inputLoginPin.value = '';
		inputLoginPin.blur();

		// Logout timer
		if (timer) {
			clearInterval(timer);
		}
		timer = startLogOuttimer();

		// Update the UI
		updateUI(currentAccount);
	}
});

// Transfer money to other accounts
btnTransfer.addEventListener('click', function (e) {
	//Prevent form from submitting and refreshing
	e.preventDefault();

	const amount = Number(inputTransferAmount.value);
	const receiverAcc = accounts.find((acc) => acc.username === inputTransferTo.value);

	inputTransferAmount.value = inputTransferTo.value = '';

	if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
		// Transfer money from the current user
		currentAccount.movements.push(-amount);
		// Receiving the money
		receiverAcc.movements.push(amount);

		// Add transfer date
		currentAccount.movementsDates.push(new Date().toISOString());
		receiverAcc.movementsDates.push(new Date().toISOString());

		// Update the UI
		updateUI(currentAccount);

		// Reset the timer
		clearInterval(timer);
		timer = startLogOuttimer();
	}
});

// Closing the account

btnClose.addEventListener('click', function (e) {
	e.preventDefault();
	const closeUsername = inputCloseUsername.value;
	const closePin = Number(inputClosePin.value);

	if (closeUsername === currentAccount.username && closePin === currentAccount.pin) {
		const index = accounts.findIndex((acc) => acc.username == currentAccount.username);

		// Delete Account
		accounts.splice(index, 1);

		// Hide UI
		containerApp.style.opacity = 0;
	}

	// Emptying the fields where the username and password were used
	inputCloseUsername.value = inputClosePin.value = '';
});

// Creating the Loan Functionality

btnLoan.addEventListener('click', function (e) {
	e.preventDefault();

	const amount = Math.floor(inputLoanAmount.value);

	if (amount > 0 && currentAccount.movements.some((mov) => mov >= amount * 0.1)) {
		// Add movements
		currentAccount.movements.push(amount);

		// Add Loan Date
		currentAccount.movementsDates.push(new Date().toISOString());

		// Update UI
		updateUI(currentAccount);

		// Reset the timer
		clearInterval(timer);
		timer = startLogOuttimer();

		// Clear input field
		inputLoanAmount.value = '';
	}
});

// The sort button event listener
let sorted = false;
btnSort.addEventListener('click', function (e) {
	e.preventDefault();
	displayMovements(currentAccount, !sorted);
	sorted = !sorted;
});
