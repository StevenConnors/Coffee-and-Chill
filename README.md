#BooseSecretary

## Overview

BooseSecretary is a tool for organizations who want to keep track of how much boose they've bought and thus, consumed.

BooseSecretary is a small side project that I'm playing with to learn about AngularJS and NodeJS. It is a spinoff project from the AutoSecretary project.  


#### Description
BooseSecretary is a tool that your organization can use to keep track of boose. It provides functionalities such as
* How much boose was spent on a party
* Keeping track of who spent how much on boose
* Learning about your org's favorite drink
* Distributing profit from the party to those who've invested
* And many more to come! 


#### Future Goals
To minimize time spent on tracking boose so you get to actually consume it, we have a few stretch goals that we would eventually like to encorporate.

* Incorporating OCR and being able to track a purchase with a picture of the receipt.
* Being able to read barcodes of bottles to recognize it.
* Venmo integration to split the bill between people.



Feel free to contact me!

---

The following is a rough sketch of the project structure
<pre>
root
	| - app
		| - models       // where our models are
 		| -routes.js     // all the routes for our application
 	| - config
  		| - auth.js      // will hold all our client secret keys (facebook, twitter, google)
  		| - database.js  // will hold our database connection settings
  		| - passport.js  // configuring the strategies for passport
	| -  views
  		| - index.ejs    // show our home page with login links
  		| - login.ejs    // show our login form
  		| - signup.ejs   // show our signup form
  		| - profile.ejs  // after a user logs in, they will see their profile
	| -  package.json    // handle our npm packages
	| -  server.js       // setup our application

</pre>