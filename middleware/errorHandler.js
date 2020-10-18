const errorHandler = (err, req, res, next) => {
    console.log(err.stack.red.bold);

    //mongoose bad objectid
    if (err.name === 'CastError') {
        err.message = `id: ${err.value} is bad format`;
        err.statusCode = 400;
    }

    if (err.name === 'ValidationError') {
        err.message = Object.values(err.errors).map(val => val.message)
        err.statusCode = 400
    }

    res.status(err.statusCode || 500).json({
        success: false,
        err: err.message || 'server error'
    });
};

module.exports = errorHandler