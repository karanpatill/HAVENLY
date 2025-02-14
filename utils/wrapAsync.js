module.export = (fn) => {
    return (err , req, res) => {
        fn( req, res , next).catch(next);

    }
};