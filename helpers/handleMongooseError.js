export const handleMongooseError = (err, data, next) => {
	err.status = 404;
	next();
};
