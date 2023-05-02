export default (err, req, res, next) => {
    const { code, message } = err;
    res.status(code || 500).send({
        error: message
    });
};
