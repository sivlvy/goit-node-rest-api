import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contactsPath = path.join(__dirname, "../db/contacts.json");

export async function listContacts() {
	const data = await fs.readFile(contactsPath);

	return JSON.parse(data);
}

export async function getContactById(contactId) {
	const data = await listContacts();

	const result = data.find((item) => item.id === contactId);
	console.log(result);
	return result || null;
}

export async function removeContact(contactId) {
	const data = await listContacts();
	const index = data.findIndex((item) => item.id === contactId);

	if (index === -1) {
		return null;
	}

	const deletedContact = data.splice(index, 1);

	await fs.writeFile(contactsPath, JSON.stringify(data));
	return deletedContact;
}

export async function saveContacts(data) {
	await fs.writeFile(contactsPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function addContact(name, email, phone) {
	const data = await listContacts();

	const newContact = {
		id: nanoid(),
		name,
		email,
		phone,
	};

	data.push(newContact);
	await saveContacts(data);
	await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));

	return newContact;
}

export async function updateContact(id, body) {
	const data = await listContacts();
	const index = data.findIndex((item = item.id === id));
	if (index === -1) {
		return null;
	}
	data[index] = { id, ...data };
	await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
	return data[index];
}
