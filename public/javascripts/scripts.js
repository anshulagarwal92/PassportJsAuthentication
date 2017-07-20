

//On Document ready init the ImportFacebookImages application and resolved the doc ready.
$(document).ready(function() {

    //Create Object of Facebook Class of import images
    var importFacebookImages = new ImportFacebookImages();

//Initialize the facebook Instance
    window.fbAsyncInit = function() {
        FB.init({
          appId      : '1849287568722647',
          cookie     : true,
          xfbml      : true,
          version    : 'v2.8'
        });
        FB.AppEvents.logPageView();
    };

    importFacebookImages.docReady.resolve();


    // applicaiton = new ImportFacebook(importFacebookImages);

    // facebookInit();
    importFacebookImages.init();
});

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));




// call facebook script
/*
(function(d){

}(document));*/
