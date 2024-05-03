import { openDB } from 'idb';

const initdb = async () =>
	// Open or create a database named 'contactDB'
	openDB('contactDB', 1, {
		// Add a 'contact' store if it does not already exist
		upgrade(db) {
			// Verify if the 'contact' object store already exists. Exit if so.
			if (db.objectStoreNames.contains('contact')) {
				console.log('contact store already exists');
				return;
			}
			// Create a 'contact' object store for the data and give it a key name of 'id' which needs to increment automatically.
			db.createObjectStore('contact', { keyPath: 'id', autoIncrement: true });
			console.log('contact store created');
		},
	});

// Export a function we will use to POST to the database.
export const postDb = async (name, home, cell, email) => {
	console.log('Post to the database');

	// Create a connection to the database and version we want to use.
	const contactDb = await openDB('contactDB', 1);

	// Open up the desired object store and specify the transaction privileges.
	const contactStore = contactDb
		.transaction('contact', 'readwrite')
		.objectStore('contact');

	// Use the .add() method on the store and pass in the content.
	const result = await contactStore.add({
		name: name,
		home_phone: home,
		cell_phone: cell,
		email: email,
	});
	console.log('Data saved to the database', result);
};
// Export a function we will use to GET to the database.
export const getDb = async () => {
	console.log('GET from the database');

	// Create a connection to the database and version we want to use.
	const contactDb = await openDB('contactDB', 1);

	// Open up the desired object store and specify the transaction privileges.
	const contactStore = contactDb
		.transaction('contact', 'readonly')
		.objectStore('contact');

	// Use the .getAll() method to get all data in the database.
	const result = await contactStore.getAll();
	console.log('result', result);
	return result;
};

// Export a function we will use to DELETE to the database.
export const deleteDb = async (id) => {
	console.log('DELETE from the database', id);

	// Create a connection to the database and version we want to use.
	const contactDb = await openDB('contactDB', 1);

	// Open up the desired object store and specify the transaction privileges.
	const contactStore = contactDb
		.transaction('contact', 'readwrite')
		.objectStore('contact');

	// Use the .delete() method to get all data in the database.
	const result = await contactStore.delete(id);
	console.log('result', result);
	return result?.value;
};

// Start the database.
initdb();
