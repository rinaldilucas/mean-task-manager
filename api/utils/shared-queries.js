export default countQuery = function (callback) {
    Task.find({ userId: request.params.userId })
        .sort({ date: -1 })
        .count({}, (error, count) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, count);
            }
        });
};
