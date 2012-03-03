/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. 
 * 
 * The initial developer of trinjal.js is Rob Gerns.
 * Copyright 2012 Rob Gerns.  All rights reserved.*/

/*
   Title: Trinjal - Trinity Church JavaScript Library
   
   Group: TrinityChurchJSL
   
   Constructor: TrinityChurchJSL

   Constructor function that is used to create the various methods. 

   Parameters:

      None.

   Returns:

      this - the object it's constructing (if properly called using "new")
    
   How to Call:
   The constructor is created by using new TrinityChuchJSL();
   
   (start code)
   var trinjal = new TrinityChurchJSL();
   (end code)
    
   Keep in mind that the global *trinjal* variable is an instance of 
   the TrinityChurchJSL constructor that's ready for use.  It's recommended
   that you use *trinjal.desiredMethod()* (where desiredMethod is one of the
   actual available methods) rather than creating a new instance.
   
*/

function TrinityChurchJSL() {
    "use strict";

    var httpRequest = new XMLHttpRequest(), //(AJAX method common to most browsers)
        result = ""; //Whatever data the AJAX GET request returns

    /*
    Group: Built-in Methods
    
    Method: getXML

    Uses AJAX to get the XML data from the given URL

    Parameters:

       feed - the URL for the desired XML data.
       responseFunc - any custom function(s) that will do something with 
                      the returned XML data.
       args - any parameters that the custom function(s) need.  Can be 
              undefined.

    Returns:

       result - returns either the XML found at the given URL OR an appropriate 
                message if there's an error.
                
    How to Call:
    
      Should only be called from within another method that's more descriptive
      about what kind of data is expected to be returned.  
      
      (start code)
      TrinityChurchJSL.prototype.someMethod(feed) {
      
          return this.getXML(feed);
      }
      (end)
      
      While calling getXML() outside of another method should 
      work at a basic level if given  correct parameters, doing 
      so is not recommended.
      
   */
    this.getXML = function (feed, responseFunc, args) {
        // start an AJAX HTTP GET request
        httpRequest.open("GET", feed, false);

        try {
            //Pretty standard way of making sure the data is found and ready
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState === 4
                        && httpRequest.status === 200) {


                    //Use result to store the returned XML data
                    //(can't really see a use for conditionally offering
                    //responseText here too, but maybe some reason will present
                    //itself in the future)
                    result = httpRequest.responseXML;

                    if (responseFunc !== "" && responseFunc !== undefined) {
                        //Call the custom function(s) and pass any parameters 
                        //given, plus the XML that was grabbed.
                        responseFunc(args, result);
                    }
                    /*
                      TO DO: Add some extra error checking here, in case getXML()
                             was somehow called with an undefined responseFunc 
                             parameter.
                     */

                } else if (httpRequest.readyState === 4
                        && httpRequest.status !== 200) {

                    //If the HTTP status is anything other than 200, the file 
                    //won't be found, so give an appropriate error message.
                    result = "Couldn't download the feed.";

                }

            };
        } catch (e) {
            //Something odd happened that interrupted grabbing the XML,
            //so handle the error.
            this.caughtError(e);

        } finally {
            // Nothing to send back to the server, nice to let the server know
            //the HTTP transaction is done.
            httpRequest.send();
        }
        //Return the XML data.
        return result;
    };

    /*
    
    Method: caughtError

    Right now, it simply returns whatever error/value has been passed to it.  
    Still needs to be expanded into error handling that's actually useful.

    Parameters:

       e - usually an error given from a Catch, but e is whatever is passed
           into caughtError.

    Returns:

       e - Right now, it just returns the error/value it was given.  
           Not that useful, but better than nothing.  Barely. 

    How to Call:
    
      Should only be called from within another method that's more descriptive
      about what kind of data is expected to be returned.  
      
      (start code)
      TrinityChurchJSL.prototype.someMethod(feed) {
      
          try {
              return this.getXML(feed);
          } catch (e) {
              return this.caughtError(e);
          } finally {
              //do something
          }
      }
      (end)
      
      While calling caughtError() outside of another method should 
      work if properly called, doing so is not recommended. */

    this.caughtError = function (e) {

        return e;

    };
}


/*
    Group: Prototype Methods
    
    Method: getNews

    Gets the Trinity website's XML feed in the given format.

    Parameters:

        format - the desired format of the feed. Accepts rss, rss2, or atom,
            defaults to rss2.
        responseFunc - any custom function(s) that will handle the returned XML data 
            (or the returned error message). 
        args - any custom parameters that should be passed to the custom function(s).
            Can also be undefined or null.

    Returns:

        response - either the returned XML data OR an error message
 
     How to Call:
     
        (start code)
        trinjal.getNews("rss | rss2 | atom", function | [function1, function2], 
            "parameters" | [["function1 parameters"],["function2 parameters"]]);
        (end)
       
       
        OR
       
       
        (start code)
        var theNewsXML = trinjal.getNews(); <-This will default to rss2.
        
        
        var theNewsXML = trinjal.getNews("atom"); <-The atom version.
        (end)
*/

TrinityChurchJSL.prototype.getNews = function (format, responseFunc, args) {
    "use strict";

    var response = "", //The XML data OR an error.
        feed = ""; //The URL for the XML data

    //format defaults to rss2, this conditional is so that if someone tries
    //to pass an invalid format it will just use rss2 instead
    if (format !== "rss" && format !== "rss2" && format !== "atom") {
        format = "rss2";
    }
    //Assign the appropriate URL to feed, based on "format"
    //Also a somewhat redundant check for whether "format" is undefined
    feed = "http://www.trinityeaston.org/?feed=" + format
        || "http://www.trinityeaston.org/?feed=rss2";

    try {
        //Call the getXML method to grab the XML data, pass the 
        //custom function(s) and parameter(s)
        response = this.getXML(feed, responseFunc, args);
    } catch (e) {
        //Something went goofy, so do some error handling
        response = this.caughtError(e);
    } finally {
        //Whether getXML was successfully called or not, 
        //check to make sure that the returned data is good and
        //handle the error if not.
        if (typeof response === undefined) {
            this.caughtError("Can't load data");
        }
    }
    //Return the XML data or the error message
    return response;
};

/*
    Method: getBlog

    Gets the Trinity blog's XML feed in the given format.

    Parameters:

        format - the desired format of the feed. Accepts rss or atom.  Optional.
            Defaults to rss (rss is actually rss2, there's no rss 0.92/1).
        responseFunc - any custom function(s) that will handle the returned XML data 
            (or the returned error message). 
        args - any custom parameters that should be passed to the custom function(s).
            Can also be undefined or null.

    Returns:

        response - either the returned XML data OR an error message.
   
    How to Call:
        
        (start code)
        trinjal.getBlog("rss | atom", function | [function1, function2], 
            "parameters" | [["function1 parameters"],["function2 parameters"]]);
        (end)
       
       
        OR
       
       
        (start code)
        var theBlogXML = trinjal.getBlog(); <-This will default to rss.
        
        var theBlogXML = trinjal.getBlog("atom"); <-This will return the atom version.
        (end)
*/

TrinityChurchJSL.prototype.getBlog = function (format, responseFunc, args) {
    "use strict";

    var response = "", //either the returned XML data or an error message.
        feed = ""; //The URL of the XML data,

    //format defaults to atom, this conditional is so that if someone tries 
    //to pass an invalid format it will just use atom instead
    if (format !== "rss" && format !== "atom") {
        //if they enter rss2, make it rss, since rss returns rss2 format
        //while rss2 is invalid (I know...not up to me),
        //otherwise default to atom
        format = (format === "rss2") ? "rss" : "atom";
    }
    //Assign the appropriate URL to feed, based on "format"
    //Also a somewhat redundant check for whether "format" is undefined
    feed = "http://trinityeaston.blogspot.com/feeds/posts/default?alt=" +
        format || "http://trinityeaston.blogspot.com/feeds/posts/default";

    try {
        //Call the getXML method to grab the XML data, pass the 
        //custom function(s) and parameter(s)
        response = this.getXML(feed, responseFunc, args);
    } catch (e) {
        //Something went goofy, so do some error handling
        response = this.caughtError(e);
    } finally {
        //Whether getXML was successfully called or not, 
        //check to make sure that the returned data is good and
        //handle the error if not.
        if (typeof response === undefined) {
            this.caughtError("Can't load data");
        }
    }
    //Return the XML data or the error message
    return response;
};

/*
    Method: getTwitter

    Gets the feed for Trinity's tweets in the given format.

    Parameters:

       format - the desired format of the feed. Accepts rss or xml.
            defaults to rss.
       tweetsNumber - how many tweets to grab. 
            Must be greater than 0 and less than 200.  Defaults to 20.
       responseFunc - any custom function(s) that will handle the returned XML data 
                  (or the returned error message). 
       args - any custom parameters that should be passed to the custom function(s).
          Can also be undefined or null.

    Returns:

        response - either the returned XML data OR an error message.
   
    How to Call:
    
        (start code)
        trinjal.getTwitter("rss | xml", 20, function | [function1, function2], 
          "parameters" | [["function1 parameters"],["function2 parameters"]]);
        (end)
           
       
       
        OR
        
       
        
        (start code)
        var tweets = trinjal.getTwitter(); <-This will default to rss with 8 tweets.
        
        var tweets = trinjal.getTwitter("xml", 60); <-This returns non-rss XML version with 60 tweets.
        (end code)
*/

TrinityChurchJSL.prototype.getTwitter = function (format, tweetsNumber,
        responseFunc, args) {
    "use strict";

    var tweets = tweetsNumber || 8, //The number of tweets to get.
        feed = "", //The URL for the XML feed.
        response = ""; //Either the returned XML or an error

    //format defaults to rss, this conditional is so that if someone tries 
    //to pass an invalid format it will just use rss instead
    if (format !== "rss" && format !== "xml") {
        format = "rss";
    }
    //Assign the appropriate URL to feed, based on "format"
    //Also a somewhat redundant check for whether "format" is undefined
    feed =
        "http://api.twitter.com/1/statuses/user_timeline." + format +
        "?include_rts=true&screen_name=trinityeastonpa&count=" + tweets;

    try {
        //Call the getXML method to grab the XML data, pass the 
        //custom function(s) and parameter(s)
        response = this.getXML(feed, responseFunc, args);
    } catch (e) {
        //Something went goofy, so do some error handling
        response = this.caughtError(e);
    } finally {
        //Whether getXML was successfully called or not, 
        //check to make sure that the returned data is good and
        //handle the error if not.
        if (typeof response === undefined) {
            this.caughtError("Can't load data");
        }
    }
    //Return the XML data or the error message
    return response;
};

/*
    Method: getFacebook

    Gets the XML feed for Trinity's Facebook page.  Only atom format is available.

    Parameters:

        responseFunc - any custom function(s) that will handle the returned XML data 
                  (or the returned error message). 
        args - any custom parameters that should be passed to the custom function(s).
               Can also be undefined or null.

    Returns:

       response - either the returned XML data OR an error message

    How to Call:
    
       (start code)
       trinjal.getFacebook(function | [function1, function2], 
          "parameters" | [["function1 parameters"],["function2 parameters"]]);
       (end)
       
       
       
       OR
       
       
       
       (start code)
       var theFacebookXML = trinjal.getFacebook();
       (end)

*/

TrinityChurchJSL.prototype.getFacebook = function (responseFunc, args) {
    "use strict";

    var feed = //The URL for the XML data
        "http://www.facebook.com/feeds/page.php?id=99634166137&format=atom10",
        response = ""; //Stores the returned XML data or an error.

    try {
        //Call the getXML method to grab the XML data, pass the 
        //custom function(s) and parameter(s)
        response = this.getXML(feed, responseFunc, args);
    } catch (e) {
        //Something went goofy, so do some error handling
        response = this.caughtError(e);
    } finally {
        //Whether getXML was successfully called or not, 
        //check to make sure that the returned data is good and
        //handle the error if not.
        if (typeof response === undefined) {
            this.caughtError("Can't load data");
        }
    }
    //Return the XML data
    return response;
};

/*
Method: getCalendar

Gets the XML feed for Trinity's Calendar.  Only RSS(2) format is available.

Parameters:

    days - number (integer) of days to grab from the calendar, defaults to 14

    responseFunc - any custom function(s) that will handle the returned XML data 
              (or the returned error message). 
    args - any custom parameters that should be passed to the custom function(s).
           Can also be undefined or null.

Returns:

   response - either the returned XML data OR an error message

How to Call:

   (start code)
   trinjal.getCalendar(30, function | [function1, function2], 
      "parameters" | [["function1 parameters"],["function2 parameters"]]);
   (end)
   
   
   
   OR
   
   
   
   (start code)
   var theCalendarXML = trinjal.getCalendar(); <- gets the next 14 days
   
   
   
   var theCalendarXML = trinjal.getCalendar(30); < - gets the next 30 days
   (end)

*/
TrinityChurchJSL.prototype.getCalendar = function (days, responseFunc, args) {
    "use strict";
    
    var dayCount = days || 14,
        feed = //The URL for the XML data
        "http://www.mychurchevents.com/Calendar/RSS.ashx?days=" +
        dayCount + "&ci=L6M7G1G1L6H2G1G1&igd=",
        response = ""; //Stores the returned XML data or an error.

    try {
        //Call the getXML method to grab the XML data, pass the 
        //custom function(s) and parameter(s)
        response = this.getXML(feed, responseFunc, args);
    } catch (e) {
        //Something went goofy, so do some error handling
        response = this.caughtError(e);
    } finally {
        //Whether getXML was successfully called or not, 
        //check to make sure that the returned data is good and
        //handle the error if not.
        if (typeof response === undefined) {
            this.caughtError("Can't load data");
        }
    }
    //Return the XML data
    return response;   
};

/*
    Method: getServiceTimes

    Gets the XML for the service times, which is a custom XML file.

    Parameters:
     
        caching - boolean.  If set to true a new AJAX HTTP request is not used,
        instead the original cached HTTP response is used.
        This means caching is irrelevant for the first time this method is called but may 
        provide a ridiculously small speed increase if called again.  Whether this works
        also depends somewhat on how each device handles HTTP caching.

        responseFunc - any custom function(s) that will handle the returned XML data 
              (or the returned error message).
               
        args - any custom parameters that should be passed to the custom function(s).
            Can also be undefined or null.

    Returns:

        response - either the returned XML data OR an error message

    How to Call:
    
    (start code)

        trinjal.getServiceTimes(false | true, function | [function1, function2], 
            "parameters" | [["function1 parameters"],["function2 parameters"]]);

   
   
     (end)
       OR
      
   
   
       (start code)
       var theServiceTimesXML = trinjal.getServiceTimes(false | true);
       (end)

*/

TrinityChurchJSL.prototype.getServiceTimes = function (caching, responseFunc,
        args) {
    "use strict";

    var cache = caching || false, //if true caching of the data is enabled.
        feed =                    //The URL for the Service Times XML data.
            "http://www.trinityeaston.org/trinjal/data/servicetimes.xml",    
        response = "",            //Stores either the returned data.
        today = new Date(),
        time = today.getHours() + today.getMinutes() + today.getSeconds(),
        cacheBuster = "?" + time; //A "?" plus the current time (hhmmss).

    //if caching is set to false, append the "cacheBuster" value
    if (!cache) {
        feed = feed + cacheBuster;
    }

    try {
        //Call the getXML method to grab the XML data, pass the 
        //custom function(s) and parameter(s)        
        response = this.getXML(feed, responseFunc, args);
    } catch (e) {
        //Something went goofy, so do some error handling
        response = this.caughtError(e);
    } finally {
        //Whether getXML was successfully called or not, 
        //check to make sure that the returned data is good and
        //handle the error if not.
        if (typeof response === undefined) {
            this.caughtError("Can't load data");
        }
    }
    //Return the XML data
    return response;
};

//Create a new instance of the TrinityChurchJSL() object
/*
 Group: Instances
 
 Variable: trinjal
 Global instance of the TrinityChurchJSL() object.  
 
 
 Used to call all associated methods.
 
 (start code)
 
 trinjal.getNews("rss2", someFunction);
 
 var theNewsAtomXML = trinjal.getNews("atom");
 
 (end code)
 
 */
var trinjal = new TrinityChurchJSL();
