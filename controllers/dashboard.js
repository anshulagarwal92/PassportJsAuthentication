var DashboardController = {
    getDashboardPage: function(req, res, next){
        if(typeof req.user !== 'undefined' && req.user !== null) {
            res.render('dashboard/index', { title: 'User dashboard' ,user : req.user});
        } else {
            req.flash('danger', 'You are not authorised user. Please login to continue');
            res.redirect('/login');
        }
    }
};

module.exports = DashboardController;
