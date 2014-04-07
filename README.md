booking-assignment
==================

Booking.com assignment for Front-end developers.


Tasks priorities
----------------

1.  Create a photo carousel using the large photos linked from the thumbnails
	currently in the page. Some ideas you may consider: include an automatic
	slideshow mode, add prev/next buttons to manually controll the carousel,
	add a layer that shows the contents of the images alt text.

	__I decided this to be a high priority task because it involves markup, styles and JavaScript to achieve the final result.__

2.  Split the reviews into blocks of 5 and create pagination. Allow the user
	to sort the reviews by review score.

	__This gets a high priority because it needs to implement a templating library
	to minimize the DOM manipulation impact. Also requires a good approach so the 
	sorting function can be re-usable for other sections, and it also can produce
	problems with the pagination arrangment.__

3.  Improve the room table. Some ideas you may consider: allow the user to sort
	the rooms table by occupancy or price, display a total when the user selects
	a quantity, display additional information about rooms.

	__This gets a high priority because of the reasons that were mentioned above.
	To improve the sorting behaviour the rooms data were stored in an object inside
	the main.js file.__

4.  Improve the hotel page however you see fit.

	__See the GENERAL IMPROVEMENTS section__

5.  Imagine there's a json feed with hotels similar to the current one. Design
	the json format and use it to display similar hotels on the page.

	__This is an easy task which doesn't require much coding and can be done in
	a short amount of time.__

6.  Imagine there's a json feed with nearby landmarks. Design the json format
	and use it to display landmarks on the page.

	__Same as above. This is a nice add-on to the page. But it presents not
	much difficulty.__

7.  Improve the facilities block.

	__I think that trying to make this part more complex is not really necessary.
	The important thing in this part of the site is the content and how clear it is 
	to the user. I just added font-icons to get more the attention of the clients.__


General Improvements
--------------------

One of the main improvements was creating gulp tasks for minimizing the css and js files
in order to shrink the loading time of the site. The non-minified files are present for
debugging. Also keeping the css properties of an object alphabetically makes easier for
others developer to search for it in case of bug fixing and maintaining. Font icons were
use for the facilities section, though a better soption would be SVG, but it takes time to
define a sprite that justifies the performance and loading improvements. Buttons and other 
styles were re-use to minify the css file size. Vanilla JavaScript was used for performance.


### Other notes

This site can be downloaded and run instantly. Some browsers need a localhost server to allow 
ajax calls. A simple way to achieve this is to have python installed and run:
__python -m SimpleHTTPServer ####__ where #### is a four digit port number.

Sadly I didn't have time to test this site in Internet Explorer, though I'm aware of the
compromises of cross-browsing. In fact various polyfills and shims created by myself are used 
in this exercise. Also a rAF polyfill is included for older browsers, but take advantage of
requestAnimationFrame performance on the new ones. requestAnimationFrame is used to achieve 
the automatic slide on the carousel.

#### Thanks for your time!

Jeremias Menichelli

