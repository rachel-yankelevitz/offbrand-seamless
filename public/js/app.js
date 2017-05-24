$(document).ready(function() {
    // var baseURL = "https://api.yelp.com/v3/businesses/search";
    // var user_KEY = "vX1o9YxPq4_PSZi-tNCGan5lQcG7qTClOYSkifxnbRUGVIb3luYsWDCZuoPgBBDi7IEYPQRP2S-hWpuvuNjr-AMOAeTXgg23_lxJKJLqrkhv5V4cl8hrfRirTNscWXYx";
    // var clientId = "5M-C08bDvKu382tlHqxq3Q"
    // var PROXY_URL = "https://accesscontrolalloworiginall.herokuapp.com/";
    //bind events and stuff


    var App = {
        init: function() {
            App.bindEvents();
        },
        setView: function(viewType) {
          if (viewType === 'loader') {
            $('.loader').removeClass('hidden');
            $('.loader').addClass('loading');
            $('.loader').siblings().addClass('hidden');
          } else if (viewType === 'page') {
            $('.loader').addClass('hidden');
            $('.loader').removeClass('loading');
            $('.loader').siblings().removeClass('hidden');
          }
        },
        requestFromYelp: function(zip) {
            App.setView('loader');
          var request = $.ajax('/yelp', {
              dataType: 'json',
              data: {
                  location: zip
              }
          });

          request.done(function(response) {
            App.setView('page');
              App.renderRestaurants(response);
          });
        },
        bindEvents: function() {
            $(".zipbutton").on("click", function() {
                var zipInput = $("#zipHolder").val();

                App.requestFromYelp(zipInput);
                //also show processing modal
            });

            //open modal onclick of "more button"//
            $('#padding').on("click", ".readMore", function() {
                var index = $('.readMore').index($(this));
                var restaurant = App.restaurantList[index];
                var yelpUrl = restaurant.url
                var newLink = $('<a/>', {
                    id : "id5",
                    name : "link",
                    href : yelpUrl,
                    text : "Yelp Page",
                    target: '_blank'
                });


            $('#linkHold').append(newLink);

            $('#popup_name').html(restaurant.name);
            $('#popup_phone').html(restaurant.display_phone);
            $('#popup_address').html(restaurant.location.address1);
            $('#popup_city').html(restaurant.location.city);
            $('#popup_state').html(restaurant.location.state);
            $('#popup_zip').html(restaurant.location.zip_code);
            $('#popup_review').html(restaurant.rating);               // $('#popup_review').html(restaurant.rating);
            // $('#distance').html(restaurant.distance);



            $('#popUp').modal();
                console.log("this is a test!", index)
            });
// hide html modal
        $("#popUp").hide();

        },
        restaurantList: [],
        //add the results to the footer div!!!
        renderRestaurants: function(response) {
            App.restaurantList = response.businesses;

            var makeHtml = _.template(App.rest_tmpl);

            App.restaurantList.forEach(function(restaurant){
                var html = makeHtml(restaurant);
                $('div#padding').append(html);
            });
            console.log(App.restaurantList);

        },
        rest_tmpl: '\
        <article class="article">\
            <h3><%= name %></h3>\
            <div>\
                Address: <%=location.address1 %>, <%=location.city %>, <%=location.state %>, <%=location.zip_code %>\
            </div>\
            <div>\
                Phone: <%= display_phone %>\
            </div>\
            <div>\
                Price: <%= price %>\
            </div>\
            <div>\
                <button class="readMore">More Info</button>\
            </div>\
            <section class="featuredImage">\
            <img src="<%= image_url %>" alt="">\
            </section>\
            <hr/>\
        </article>'
    };
//this is in case I've screwed up//
    App.init();
    // window.App = App;
});
