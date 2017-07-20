var HomeController = {
    getHomePage: function(req, res, next){
        res.render('index', { title: 'Home page', user : req.user });
    }
};

module.exports = HomeController;
