// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron obj

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue
		const self = this;
		setTimeout(function() {

			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()


/* Select all DOM form elements */
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

patronEntries.addEventListener('click', returnBookToLibrary)

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();
	// Add book book to global array
	//query for inputs:
	const newBookName = document.querySelector('#newBookName').value;
	const newBookAuthor = document.querySelector('#newBookAuthor').value;
	const newBookGenre = document.querySelector('#newBookGenre').value;
	//add to array
	const newBook = new Book(newBookName, newBookAuthor, newBookGenre);
	libraryBooks.push(newBook);

	addBookToLibraryTable(newBook);
}

// Changes book patron information, and calls
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	const loanBookId = document.querySelector('#loanBookId').value
	const patronId = document.querySelector('#loanCardNum').value

	// Add patron to the book's patron property
	// 1. find book
	let borrowedBook;
	for (let j = 0; j < numberOfBooks; j ++) {
		if (libraryBooks[j].bookId == loanBookId) {
			borrowedBook = libraryBooks[j]
		}
	}
	// 2. find patron
	for (let i = 0; i < numberOfPatrons; i ++) {
		if (patronId == patrons[i].cardNumber) {
			if (!borrowedBook.patron) {
				borrowedBook.patron = patrons[patronId]
				addBookToPatronLoans(borrowedBook)
				// Start the book loan timer.
				borrowedBook.setLoanTime()
			}
		}
	}


}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	let retBook;
	if (e.target.classList.contains('return')) {
		const retBookId = e.target.parentNode.parentNode.children[0].innerText
		retBook = libraryBooks[retBookId]
		removeBookFromPatronTable(retBook)
	}
	retBook.patron = null
}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();
	// Add a new patron to global array
	const newPatronName = document.querySelector('#newPatronName').value
	const newPatron = new Patron(newPatronName)
	patrons.push(newPatron)

	addNewPatronEntry(newPatron)
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();
	// Get correct book
	const bookInfoId = document.querySelector('#bookInfoId').value
	for (let i = 0; i < numberOfBooks; i++) {
		if (libraryBooks[i].bookId == bookInfoId) {
			displayBookInfo(libraryBooks[bookInfoId])
			break //stop looking
		} //not found
	}
}


/*-----------------------------------------------------------*/
/*** DOM functions below  ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// create new row and row items
	const newRow = document.createElement('tr')
	const newBookId = document.createElement('td')
	const newBookTitle = document.createElement('td')
	const newPatronNum = document.createElement('td')

	newBookId.appendChild(document.createTextNode(book.bookId))
	const newBookTitleText = document.createElement('strong')
	newBookTitleText.appendChild(document.createTextNode(book.title))
	newBookTitle.appendChild(newBookTitleText)

	newRow.appendChild(newBookId)
	newRow.appendChild(newBookTitle)
	newRow.appendChild(newPatronNum)

	bookTable.firstElementChild.appendChild(newRow)

}

// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	const children = bookInfo.children;
	for (let i = 0; i < children.length; i++) {
		const row = children[i];
		const newSpanNode = document.createElement('span')
		let newBookInfo;
		switch (i) {
			case 0:
				newBookInfo = document.createTextNode(book.bookId)
				break;
			case 1:
				newBookInfo = document.createTextNode(book.title)
				break;
			case 2:
				newBookInfo = document.createTextNode(book.author)
				break;
			case 3:
				newBookInfo = document.createTextNode(book.genre)
				break;
			case 4:
				if (book.patron) {
					newBookInfo = document.createTextNode(book.patron.cardNumber)
				} else {
					newBookInfo = document.createTextNode('N/A')
				}
		}
		newSpanNode.appendChild(newBookInfo)
		row.childNodes[1].replaceWith(newSpanNode)
	}
}

// Adds a book to a patron's book list with a status of 'Within due date'.
function addBookToPatronLoans(book) {
	const newBookRow = document.createElement('tr')
	const newBookId = document.createElement('td')
	const newBookTitle = document.createElement('td')
	const newBookStatus = document.createElement('td')
	const newReturnButton = document.createElement('td')

	newBookId.appendChild(document.createTextNode(book.bookId))
	const strongTitle = document.createElement('strong')
	strongTitle.appendChild(document.createTextNode(book.title))
	newBookTitle.appendChild(strongTitle)
	const statusSpan = document.createElement('span')
	statusSpan.className = 'green'
	statusSpan.appendChild(document.createTextNode('Within due date'))
	newBookStatus.appendChild(statusSpan)

	const returnButton = document.createElement('button')
	returnButton.className = 'return'
	returnButton.appendChild(document.createTextNode("return"))
	newReturnButton.appendChild(returnButton)

	newBookRow.appendChild(newBookId)
	newBookRow.appendChild(newBookTitle)
	newBookRow.appendChild(newBookStatus)
	newBookRow.appendChild(newReturnButton)

	patronEntries.children[book.patron.cardNumber].getElementsByClassName('patronLoansTable')
		.item(0).firstElementChild.appendChild(newBookRow)
	const newCirculationStatus = document.createElement('td')
	newCirculationStatus.appendChild(document.createTextNode(book.patron.cardNumber))
	bookTable.children[0].children[book.bookId + 1].children[2].replaceWith(newCirculationStatus)
}

function addNewPatronEntry(patron) {
	const newPatronTable = document.createElement('div')
	newPatronTable.className = 'patron'
	// create name
	const patronName = document.createElement('p')
	const patronNameSpan = document.createElement('span')
	patronNameSpan.appendChild(document.createTextNode(patron.name))
	patronName.appendChild(document.createTextNode('Name: '))
	patronName.appendChild(patronNameSpan)

	// create card number
	const cardNum = document.createElement('p')
	const cardNumSpan = document.createElement('span')
	cardNumSpan.appendChild(document.createTextNode(patron.cardNumber))
	cardNum.appendChild(document.createTextNode('Card Number: '))
	cardNum.appendChild(cardNumSpan)

	// create books on loan
	const bookOnLoan = document.createElement('h4')
	bookOnLoan.appendChild(document.createTextNode('Books on loan:'))


	newPatronTable.appendChild(patronName)
	newPatronTable.appendChild(cardNum)
	newPatronTable.appendChild(bookOnLoan)
	// -----create inner table-----
	const loansTable = document.createElement('table')
	loansTable.className = 'patronLoansTable'
	const tableBody = document.createElement('tbody')
	const headingRow = document.createElement('tr')

	const bookIdCell = document.createElement('th')
	bookIdCell.appendChild(document.createTextNode('BookID'))
	const bookTitleCell = document.createElement('th')
	bookTitleCell.appendChild(document.createTextNode('Title'))
	const statusCell = document.createElement('th')
	statusCell.appendChild(document.createTextNode('Status'))
	const returnCell = document.createElement('th')
	returnCell.appendChild(document.createTextNode('Return'))

	headingRow.appendChild(bookIdCell)
	headingRow.appendChild(bookTitleCell)
	headingRow.appendChild(statusCell)
	headingRow.appendChild(returnCell)
	tableBody.appendChild(headingRow)
	loansTable.appendChild(tableBody)

	// add headings elements to the new table
	newPatronTable.appendChild(loansTable)

	// add new elements to the master patron table
	patronEntries.appendChild(newPatronTable)
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// get patron's loan table
	const targetBookTable = document.getElementsByClassName("patronLoansTable")[book.patron.cardNumber].firstElementChild
	let targetRow = targetBookTable.firstElementChild;
	// find returning book
	for (let i = 0; i < targetBookTable.children.length; i++) {
		if (book.bookId != parseInt(targetRow.firstElementChild.innerText)) {
			targetRow = targetRow.nextElementSibling
		}
	}
	targetRow.parentElement.removeChild(targetRow)

	// remove loan status from circulation table
	const newCirculationStatus = document.createElement('td')
	bookTable.children[0].children[book.bookId + 1].children[2].replaceWith(newCirculationStatus)
}

function changeToOverdue(book) {
	const newStatusColour = document.createElement('span')
	newStatusColour.className = 'red'
	newStatusColour.appendChild(document.createTextNode('Overdue'))
	patronEntries.getElementsByClassName('green').item(0).replaceWith(newStatusColour)
}

