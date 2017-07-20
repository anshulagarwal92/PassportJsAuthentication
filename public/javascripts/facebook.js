/**
 * Facebook Class To Get Images on Button Click
 * @params appID String
 * @author Anshul Agarwal
 * @version 1.0.1
 */
var ImportFacebookImages = function() {
    this.appId = "921756577886381";
    this.docReady = $.Deferred();
    this.facebookReady = $.Deferred();
};

ImportFacebookImages.prototype = {
    SelectedImages: [],
    accessToken: "",
    FbButton: "#getFbImages",
    FbLogoutButton: "#logoutFB",
    FacebookPopup: '#myModal',
    FbImagesContainer: '.photos',
    FbImageSelectClass: "selected",
    SelectedIcon: '/images/selected-icon.png',
    uploadButton: '#uploadAll',
    uploadURL: '/upload',
    init: function() {
        // wait for DOM and facebook auth
        var self = this;
        var Photos = [];
        $(self.FbButton).unbind("click").bind("click", function() {
            // $(self.FbImagesContainer).html("");
            self.SelectedImages = [];
            self.getPhotos( function( photos ) {
                for(var i in photos) {
                    Photos.push(photos[i].url);
                    var newImage = "<li><img  src="+photos[i].url+" class='fb-images'/><img src='"+self.SelectedIcon+"' class='selected-icon hide' alt='' /></li>";
                    $(self.FbImagesContainer).append(newImage);
                }
                self.bindEvents();
            });
        });
    },

    makeFacebookPhotoURL: function( id, accessToken ) {
        return 'https://graph.facebook.com/' + id + '/picture?access_token=' + accessToken;
    },
    login: function(callback) {
        var self = this;
        FB.login(function(response) {
            if (response.authResponse) {
                $(self.FacebookPopup).modal({
                    show: true
                });
                if (callback) {
                    callback(response);
                }
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        },{scope: 'user_photos, email, public_profile'} );
    },

    getAlbums: function(callback) {
        FB.api(
            '/me/albums',
            {fields: 'id,cover_photo'},
            function(albumResponse) {
                if (callback) {
                    callback(albumResponse);
                }
            }
        );
    },

    getPhotosForAlbumId: function(albumId, callback) {
        FB.api(
            '/'+albumId+'/photos',
            {fields: 'id'},
            function(albumPhotosResponse) {
                if (callback) {
                    callback( albumId, albumPhotosResponse );
                }
            }
        );
    },

    getLikesForPhotoId: function(photoId, callback) {
        FB.api(
            '/'+albumId+'/photos/'+photoId+'/likes',
            {},
            function(photoLikesResponse) {
                if (callback) {
                    callback( photoId, photoLikesResponse );
                }
            }
        );
    },

    getPhotos: function(callback) {
        var allPhotos = [],
            self = this;
        self.login(function(loginResponse) {
            self.accessToken = loginResponse.authResponse.accessToken || '';
            self.getAlbums(function(albumResponse) {
                var i, album, deferreds = {}, listOfDeferreds = [];

                for (i = 0; i < albumResponse.data.length; i++) {
                    album = albumResponse.data[i];
                    deferreds[album.id] = $.Deferred();
                    listOfDeferreds.push( deferreds[album.id] );
                    self.getPhotosForAlbumId( album.id, function( albumId, albumPhotosResponse ) {
                        var i, facebookPhoto;
                        for (i = 0; i < albumPhotosResponse.data.length; i++) {
                            facebookPhoto = albumPhotosResponse.data[i];
                            allPhotos.push({
                                'id'    :   facebookPhoto.id,
                                'added' :   facebookPhoto.created_time,
                                'url'   :   self.makeFacebookPhotoURL( facebookPhoto.id, self.accessToken )
                            });
                        }
                        deferreds[albumId].resolve();
                    });
                }

                $.when.apply($, listOfDeferreds ).then( function() {
                    if (callback) {
                        callback( allPhotos );
                    }
                }, function( error ) {
                    if (callback) {
                        callback( allPhotos, error );
                    }
                });
            });
        });
    },

    bindEvents: function(){
        var self = this;
        //Facebook Logout Click button
        $(self.FbLogoutButton).unbind("click").bind("click", function(){
            FB.logout(function(response) {
              // user is now logged out
                $(self.FbButton).show();
                $(self.FbImagesContainer).html("");
                $(self.FbLogoutButton).hide();
            });
        });

        //Upload Button To upload Images to Own Server
        $(self.uploadButton).unbind("click").bind("click", function(){
            if(self.SelectedImages.length) {
                $.ajax({
                    method: "POST",
                    url: self.uploadURL,
                    data: {
                        "photos": self.SelectedImages,
                        "accessToken": self.accessToken
                    }
                }).done(function( msg ) {
                    console.log("msg", msg);
                });
            } else {
                alert("please select atleast one image.");
            }
        });

        $('.fb-images').unbind("click").bind("click", function(){
            if($(this).hasClass('selected')) {
                $(this).removeClass("selected");
                $(this).siblings('.selected-icon').addClass('hide');
            } else {
                $(this).addClass("selected");
                $(this).siblings('.selected-icon').removeClass('hide');
            }
        });

        $('.selected-icon').click(function() {
            if($(this).hasClass('hide')) {
                $(this).removeClass("hide");
                $(this).siblings('.fb-images').addClass('selected');
            } else {
                $(this).addClass("hide");
                $(this).siblings('.fb-images').removeClass('selected');
            }
        })
    }
};
