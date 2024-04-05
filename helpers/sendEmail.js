import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (data) => {
	const email = { ...data, from: "vladislavsidenko@meta.ua" };
	await sgMail.send(email);
	return true;
};

export default sendMail;
