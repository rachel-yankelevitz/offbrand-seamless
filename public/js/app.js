$(document).ready(function() {
    // var baseURL = "https://api.yelp.com/v3/businesses/search";
    // var user_KEY = "vX1o9YxPq4_PSZi-tNCGan5lQcG7qTClOYSkifxnbRUGVIb3luYsWDCZuoPgBBDi7IEYPQRP2S-hWpuvuNjr-AMOAeTXgg23_lxJKJLqrkhv5V4cl8hrfRirTNscWXYx";
    // var clientId = "5M-C08bDvKu382tlHqxq3Q"
    // var PROXY_URL = "https://accesscontrolalloworiginall.herokuapp.com/";
    //bind events and stuff
    var rest_tmpl = '\
        <article>\
            <h3><%= name %></h3>\
            <div>\
                <%=location.address1 %>, <%=location.city %>, <%=location.state %>, <%=location.zip_code %>\
            </div>\
            <div>\
                Phone: <%= display_phone %>\
            </div>\
            <div>\
                Price: <%= price %>\
            </div>\
            <div>\
                URL: <a href="<%-url%>" target="_blank">\
                <%=name %>\
            </div>\
            <hr/>\
        </article>';

    var App = {
        init: function() {
            App.bindEvents();
        },
        requestFromYelp: function(zip) {
          var request = $.ajax('/yelp', {
              dataType: 'json',
              data: {
                  location: zip
              }
          });

          request.done(function(response) {
              App.renderRestaurants(response);
          });
        },
        bindEvents: function() {
            $(".zipbutton").on("click", function() {
                var zipInput = $("#zipHolder").val();

                App.requestFromYelp(zipInput);
                //also show processing modal
            });
        },
        //add the results to the footer div!!!
        renderRestaurants: function(response) {
            var restaurantList = response.businesses;

            var makeHtml = _.template(rest_tmpl);

            restaurantList.forEach(function(restaurant){
                var html = makeHtml(restaurant);
                $('section#padding').append(html);
            });
            console.log(restaurantList);
            // $(".footer").html(minTempMarkup + maxTempMarkup);
        }
    };
//this is in case I've screwed up//
    App.init();
});
