(function(){
/*
 * jQuery 1.2.3 - New Wave Javascript
 *
 * Copyright (c) 2008 John Resig (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-02-06 00:21:25 -0500 (Wed, 06 Feb 2008) $
 * $Rev: 4663 $
 */

// Map over jQuery in case of overwrite
if ( window.jQuery )
	var _jQuery = window.jQuery;

var jQuery = window.jQuery = function( selector, context ) {
	// The jQuery object is actually just the init constructor 'enhanced'
	return new jQuery.prototype.init( selector, context );
};

// Map over the $ in case of overwrite
if ( window.$ )
	var _$ = window.$;
	
// Map the jQuery namespace to the '$' one
window.$ = jQuery;

// A simple way to check for HTML strings or ID strings
// (both of which we optimize for)
var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/;

// Is it a simple selector
var isSimple = /^.[^:#\[\.]*$/;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		// Make sure that a selection was provided
		selector = selector || document;

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this[0] = selector;
			this.length = 1;
			return this;

		// Handle HTML strings
		} else if ( typeof selector == "string" ) {
			// Are we dealing with HTML string or an ID?
			var match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] )
					selector = jQuery.clean( [ match[1] ], context );

				// HANDLE: $("#id")
				else {
					var elem = document.getElementById( match[3] );

					// Make sure an element was located
					if ( elem )
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id != match[3] )
							return jQuery().find( selector );

						// Otherwise, we inject the element directly into the jQuery object
						else {
							this[0] = elem;
							this.length = 1;
							return this;
						}

					else
						selector = [];
				}

			// HANDLE: $(expr, [context])
			// (which is just equivalent to: $(content).find(expr)
			} else
				return new jQuery( context ).find( selector );

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) )
			return new jQuery( document )[ jQuery.fn.ready ? "ready" : "load" ]( selector );

		return this.setArray(
			// HANDLE: $(array)
			selector.constructor == Array && selector ||

			// HANDLE: $(arraylike)
			// Watch for when an array-like object, contains DOM nodes, is passed in as the selector
			(selector.jquery || selector.length && selector != window && !selector.nodeType && selector[0] != undefined && selector[0].nodeType) && jQuery.makeArray( selector ) ||

			// HANDLE: $(*)
			[ selector ] );
	},
	
	// The current version of jQuery being used
	jquery: "1.2.3",

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},
	
	// The number of elements contained in the matched element set
	length: 0,

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == undefined ?

			// Return a 'clean' array
			jQuery.makeArray( this ) :

			// Return just the object
			this[ num ];
	},
	
	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {
		// Build a new jQuery matched element set
		var ret = jQuery( elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},
	
	// Force the current matched set of elements to become
	// the specified array of elements (destroying the stack in the process)
	// You should use pushStack() in order to do this, but maintain the stack
	setArray: function( elems ) {
		// Resetting the length to 0, then using the native Array push
		// is a super-fast way to populate an object with array-like properties
		this.length = 0;
		Array.prototype.push.apply( this, elems );
		
		return this;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	// Determine the position of an element within 
	// the matched set of elements
	index: function( elem ) {
		var ret = -1;

		// Locate the position of the desired element
		this.each(function(i){
			if ( this == elem )
				ret = i;
		});

		return ret;
	},

	attr: function( name, value, type ) {
		var options = name;
		
		// Look for the case where we're accessing a style value
		if ( name.constructor == String )
			if ( value == undefined )
				return this.length && jQuery[ type || "attr" ]( this[0], name ) || undefined;

			else {
				options = {};
				options[ name ] = value;
			}
		
		// Check to see if we're setting style values
		return this.each(function(i){
			// Set all the styles
			for ( name in options )
				jQuery.attr(
					type ?
						this.style :
						this,
					name, jQuery.prop( this, options[ name ], type, i, name )
				);
		});
	},

	css: function( key, value ) {
		// ignore negative width and height values
		if ( (key == 'width' || key == 'height') && parseFloat(value) < 0 )
			value = undefined;
		return this.attr( key, value, "curCSS" );
	},

	text: function( text ) {
		if ( typeof text != "object" && text != null )
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );

		var ret = "";

		jQuery.each( text || this, function(){
			jQuery.each( this.childNodes, function(){
				if ( this.nodeType != 8 )
					ret += this.nodeType != 1 ?
						this.nodeValue :
						jQuery.fn.text( [ this ] );
			});
		});

		return ret;
	},

	wrapAll: function( html ) {
		if ( this[0] )
			// The elements to wrap the target around
			jQuery( html, this[0].ownerDocument )
				.clone()
				.insertBefore( this[0] )
				.map(function(){
					var elem = this;

					while ( elem.firstChild )
						elem = elem.firstChild;

					return elem;
				})
				.append(this);

		return this;
	},

	wrapInner: function( html ) {
		return this.each(function(){
			jQuery( this ).contents().wrapAll( html );
		});
	},

	wrap: function( html ) {
		return this.each(function(){
			jQuery( this ).wrapAll( html );
		});
	},

	append: function() {
		return this.domManip(arguments, true, false, function(elem){
			if (this.nodeType == 1)
				this.appendChild( elem );
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, true, function(elem){
			if (this.nodeType == 1)
				this.insertBefore( elem, this.firstChild );
		});
	},
	
	before: function() {
		return this.domManip(arguments, false, false, function(elem){
			this.parentNode.insertBefore( elem, this );
		});
	},

	after: function() {
		return this.domManip(arguments, false, true, function(elem){
			this.parentNode.insertBefore( elem, this.nextSibling );
		});
	},

	end: function() {
		return this.prevObject || jQuery( [] );
	},

	find: function( selector ) {
		var elems = jQuery.map(this, function(elem){
			return jQuery.find( selector, elem );
		});

		return this.pushStack( /[^+>] [^+>]/.test( selector ) || selector.indexOf("..") > -1 ?
			jQuery.unique( elems ) :
			elems );
	},

	clone: function( events ) {
		// Do the clone
		var ret = this.map(function(){
			if ( jQuery.browser.msie && !jQuery.isXMLDoc(this) ) {
				// IE copies events bound via attachEvent when
				// using cloneNode. Calling detachEvent on the
				// clone will also remove the events from the orignal
				// In order to get around this, we use innerHTML.
				// Unfortunately, this means some modifications to 
				// attributes in IE that are actually only stored 
				// as properties will not be copied (such as the
				// the name attribute on an input).
				var clone = this.cloneNode(true),
					container = document.createElement("div");
				container.appendChild(clone);
				return jQuery.clean([container.innerHTML])[0];
			} else
				return this.cloneNode(true);
		});

		// Need to set the expando to null on the cloned set if it exists
		// removeData doesn't work here, IE removes it from the original as well
		// this is primarily for IE but the data expando shouldn't be copied over in any browser
		var clone = ret.find("*").andSelf().each(function(){
			if ( this[ expando ] != undefined )
				this[ expando ] = null;
		});
		
		// Copy the events from the original to the clone
		if ( events === true )
			this.find("*").andSelf().each(function(i){
				if (this.nodeType == 3)
					return;
				var events = jQuery.data( this, "events" );

				for ( var type in events )
					for ( var handler in events[ type ] )
						jQuery.event.add( clone[ i ], type, events[ type ][ handler ], events[ type ][ handler ].data );
			});

		// Return the cloned set
		return ret;
	},

	filter: function( selector ) {
		return this.pushStack(
			jQuery.isFunction( selector ) &&
			jQuery.grep(this, function(elem, i){
				return selector.call( elem, i );
			}) ||

			jQuery.multiFilter( selector, this ) );
	},

	not: function( selector ) {
		if ( selector.constructor == String )
			// test special case where just one selector is passed in
			if ( isSimple.test( selector ) )
				return this.pushStack( jQuery.multiFilter( selector, this, true ) );
			else
				selector = jQuery.multiFilter( selector, this );

		var isArrayLike = selector.length && selector[selector.length - 1] !== undefined && !selector.nodeType;
		return this.filter(function() {
			return isArrayLike ? jQuery.inArray( this, selector ) < 0 : this != selector;
		});
	},

	add: function( selector ) {
		return !selector ? this : this.pushStack( jQuery.merge( 
			this.get(),
			selector.constructor == String ? 
				jQuery( selector ).get() :
				selector.length != undefined && (!selector.nodeName || jQuery.nodeName(selector, "form")) ?
					selector : [selector] ) );
	},

	is: function( selector ) {
		return selector ?
			jQuery.multiFilter( selector, this ).length > 0 :
			false;
	},

	hasClass: function( selector ) {
		return this.is( "." + selector );
	},
	
	val: function( value ) {
		if ( value == undefined ) {

			if ( this.length ) {
				var elem = this[0];

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type == "select-one";
					
					// Nothing was selected
					if ( index < 0 )
						return null;

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							// Get the specifc value for the option
							value = jQuery.browser.msie && !option.attributes.value.specified ? option.text : option.value;
							
							// We don't need an array for one selects
							if ( one )
								return value;
							
							// Multi-Selects return an array
							values.push( value );
						}
					}
					
					return values;
					
				// Everything else, we just grab the value
				} else
					return (this[0].value || "").replace(/\r/g, "");

			}

			return undefined;
		}

		return this.each(function(){
			if ( this.nodeType != 1 )
				return;

			if ( value.constructor == Array && /radio|checkbox/.test( this.type ) )
				this.checked = (jQuery.inArray(this.value, value) >= 0 ||
					jQuery.inArray(this.name, value) >= 0);

			else if ( jQuery.nodeName( this, "select" ) ) {
				var values = value.constructor == Array ?
					value :
					[ value ];

				jQuery( "option", this ).each(function(){
					this.selected = (jQuery.inArray( this.value, values ) >= 0 ||
						jQuery.inArray( this.text, values ) >= 0);
				});

				if ( !values.length )
					this.selectedIndex = -1;

			} else
				this.value = value;
		});
	},
	
	html: function( value ) {
		return value == undefined ?
			(this.length ?
				this[0].innerHTML :
				null) :
			this.empty().append( value );
	},

	replaceWith: function( value ) {
		return this.after( value ).remove();
	},

	eq: function( i ) {
		return this.slice( i, i + 1 );
	},

	slice: function() {
		return this.pushStack( Array.prototype.slice.apply( this, arguments ) );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function(elem, i){
			return callback.call( elem, i, elem );
		}));
	},

	andSelf: function() {
		return this.add( this.prevObject );
	},

	data: function( key, value ){
		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value == null ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);
			
			if ( data == undefined && this.length )
				data = jQuery.data( this[0], key );

			return data == null && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function(){
				jQuery.data( this, key, value );
			});
	},

	removeData: function( key ){
		return this.each(function(){
			jQuery.removeData( this, key );
		});
	},
	
	domManip: function( args, table, reverse, callback ) {
		var clone = this.length > 1, elems; 

		return this.each(function(){
			if ( !elems ) {
				elems = jQuery.clean( args, this.ownerDocument );

				if ( reverse )
					elems.reverse();
			}

			var obj = this;

			if ( table && jQuery.nodeName( this, "table" ) && jQuery.nodeName( elems[0], "tr" ) )
				obj = this.getElementsByTagName("tbody")[0] || this.appendChild( this.ownerDocument.createElement("tbody") );

			var scripts = jQuery( [] );

			jQuery.each(elems, function(){
				var elem = clone ?
					jQuery( this ).clone( true )[0] :
					this;

				// execute all scripts after the elements have been injected
				if ( jQuery.nodeName( elem, "script" ) ) {
					scripts = scripts.add( elem );
				} else {
					// Remove any inner scripts for later evaluation
					if ( elem.nodeType == 1 )
						scripts = scripts.add( jQuery( "script", elem ).remove() );

					// Inject the elements into the document
					callback.call( obj, elem );
				}
			});

			scripts.each( evalScript );
		});
	}
};

// Give the init function the jQuery prototype for later instantiation
jQuery.prototype.init.prototype = jQuery.prototype;

function evalScript( i, elem ) {
	if ( elem.src )
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});

	else
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );

	if ( elem.parentNode )
		elem.parentNode.removeChild( elem );
}

jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

	// Handle a deep copy situation
	if ( target.constructor == Boolean ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target != "object" && typeof target != "function" )
		target = {};

	// extend jQuery itself if only one argument is passed
	if ( length == 1 ) {
		target = this;
		i = 0;
	}

	for ( ; i < length; i++ )
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null )
			// Extend the base object
			for ( var name in options ) {
				// Prevent never-ending loop
				if ( target === options[ name ] )
					continue;

				// Recurse if we're merging object values
				if ( deep && options[ name ] && typeof options[ name ] == "object" && target[ name ] && !options[ name ].nodeType )
					target[ name ] = jQuery.extend( target[ name ], options[ name ] );

				// Don't bring in undefined values
				else if ( options[ name ] != undefined )
					target[ name ] = options[ name ];

			}

	// Return the modified object
	return target;
};

var expando = "jQuery" + (new Date()).getTime(), uuid = 0, windowData = {};

// exclude the following css properties to add px
var exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i;

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep )
			window.jQuery = _jQuery;

		return jQuery;
	},

	// See test/unit/core.js for details concerning this function.
	isFunction: function( fn ) {
		return !!fn && typeof fn != "string" && !fn.nodeName && 
			fn.constructor != Array && /function/i.test( fn + "" );
	},
	
	// check if an element is in a (or is an) XML document
	isXMLDoc: function( elem ) {
		return elem.documentElement && !elem.body ||
			elem.tagName && elem.ownerDocument && !elem.ownerDocument.body;
	},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		data = jQuery.trim( data );

		if ( data ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";
			if ( jQuery.browser.msie )
				script.text = data;
			else
				script.appendChild( document.createTextNode( data ) );

			head.appendChild( script );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
	},
	
	cache: {},
	
	data: function( elem, name, data ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		// Compute a unique ID for the element
		if ( !id ) 
			id = elem[ expando ] = ++uuid;

		// Only generate the data cache if we're
		// trying to access or manipulate it
		if ( name && !jQuery.cache[ id ] )
			jQuery.cache[ id ] = {};
		
		// Prevent overriding the named cache with undefined values
		if ( data != undefined )
			jQuery.cache[ id ][ name ] = data;
		
		// Return the named cache data, or the ID for the element	
		return name ?
			jQuery.cache[ id ][ name ] :
			id;
	},
	
	removeData: function( elem, name ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( jQuery.cache[ id ] ) {
				// Remove the section of cache data
				delete jQuery.cache[ id ][ name ];

				// If we've removed all the data, remove the element's cache
				name = "";

				for ( name in jQuery.cache[ id ] )
					break;

				if ( !name )
					jQuery.removeData( elem );
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			// Clean up the element expando
			try {
				delete elem[ expando ];
			} catch(e){
				// IE has trouble directly removing the expando
				// but it's ok with using removeAttribute
				if ( elem.removeAttribute )
					elem.removeAttribute( expando );
			}

			// Completely remove the data cache
			delete jQuery.cache[ id ];
		}
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		if ( args ) {
			if ( object.length == undefined ) {
				for ( var name in object )
					if ( callback.apply( object[ name ], args ) === false )
						break;
			} else
				for ( var i = 0, length = object.length; i < length; i++ )
					if ( callback.apply( object[ i ], args ) === false )
						break;

		// A special, fast, case for the most common use of each
		} else {
			if ( object.length == undefined ) {
				for ( var name in object )
					if ( callback.call( object[ name ], name, object[ name ] ) === false )
						break;
			} else
				for ( var i = 0, length = object.length, value = object[0]; 
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ){}
		}

		return object;
	},
	
	prop: function( elem, value, type, i, name ) {
			// Handle executable functions
			if ( jQuery.isFunction( value ) )
				value = value.call( elem, i );
				
			// Handle passing in a number to a CSS property
			return value && value.constructor == Number && type == "curCSS" && !exclude.test( name ) ?
				value + "px" :
				value;
	},

	className: {
		// internal only, use addClass("class")
		add: function( elem, classNames ) {
			jQuery.each((classNames || "").split(/\s+/), function(i, className){
				if ( elem.nodeType == 1 && !jQuery.className.has( elem.className, className ) )
					elem.className += (elem.className ? " " : "") + className;
			});
		},

		// internal only, use removeClass("class")
		remove: function( elem, classNames ) {
			if (elem.nodeType == 1)
				elem.className = classNames != undefined ?
					jQuery.grep(elem.className.split(/\s+/), function(className){
						return !jQuery.className.has( classNames, className );	
					}).join(" ") :
					"";
		},

		// internal only, use is(".class")
		has: function( elem, className ) {
			return jQuery.inArray( className, (elem.className || elem).toString().split(/\s+/) ) > -1;
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};
		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( var name in options )
			elem.style[ name ] = old[ name ];
	},

	css: function( elem, name, force ) {
		if ( name == "width" || name == "height" ) {
			var val, props = { position: "absolute", visibility: "hidden", display:"block" }, which = name == "width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ];
		
			function getWH() {
				val = name == "width" ? elem.offsetWidth : elem.offsetHeight;
				var padding = 0, border = 0;
				jQuery.each( which, function() {
					padding += parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
					border += parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
				});
				val -= Math.round(padding + border);
			}
		
			if ( jQuery(elem).is(":visible") )
				getWH();
			else
				jQuery.swap( elem, props, getWH );
			
			return Math.max(0, val);
		}
		
		return jQuery.curCSS( elem, name, force );
	},

	curCSS: function( elem, name, force ) {
		var ret;

		// A helper method for determining if an element's values are broken
		function color( elem ) {
			if ( !jQuery.browser.safari )
				return false;

			var ret = document.defaultView.getComputedStyle( elem, null );
			return !ret || ret.getPropertyValue("color") == "";
		}

		// We need to handle opacity special in IE
		if ( name == "opacity" && jQuery.browser.msie ) {
			ret = jQuery.attr( elem.style, "opacity" );

			return ret == "" ?
				"1" :
				ret;
		}
		// Opera sometimes will give the wrong display answer, this fixes it, see #2037
		if ( jQuery.browser.opera && name == "display" ) {
			var save = elem.style.outline;
			elem.style.outline = "0 solid black";
			elem.style.outline = save;
		}
		
		// Make sure we're using the right name for getting the float value
		if ( name.match( /float/i ) )
			name = styleFloat;

		if ( !force && elem.style && elem.style[ name ] )
			ret = elem.style[ name ];

		else if ( document.defaultView && document.defaultView.getComputedStyle ) {

			// Only "float" is needed here
			if ( name.match( /float/i ) )
				name = "float";

			name = name.replace( /([A-Z])/g, "-$1" ).toLowerCase();

			var getComputedStyle = document.defaultView.getComputedStyle( elem, null );

			if ( getComputedStyle && !color( elem ) )
				ret = getComputedStyle.getPropertyValue( name );

			// If the element isn't reporting its values properly in Safari
			// then some display: none elements are involved
			else {
				var swap = [], stack = [];

				// Locate all of the parent display: none elements
				for ( var a = elem; a && color(a); a = a.parentNode )
					stack.unshift(a);

				// Go through and make them visible, but in reverse
				// (It would be better if we knew the exact display type that they had)
				for ( var i = 0; i < stack.length; i++ )
					if ( color( stack[ i ] ) ) {
						swap[ i ] = stack[ i ].style.display;
						stack[ i ].style.display = "block";
					}

				// Since we flip the display style, we have to handle that
				// one special, otherwise get the value
				ret = name == "display" && swap[ stack.length - 1 ] != null ?
					"none" :
					( getComputedStyle && getComputedStyle.getPropertyValue( name ) ) || "";

				// Finally, revert the display styles back
				for ( var i = 0; i < swap.length; i++ )
					if ( swap[ i ] != null )
						stack[ i ].style.display = swap[ i ];
			}

			// We should always get a number back from opacity
			if ( name == "opacity" && ret == "" )
				ret = "1";

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(/\-(\w)/g, function(all, letter){
				return letter.toUpperCase();
			});

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if ( !/^\d+(px)?$/i.test( ret ) && /^\d/.test( ret ) ) {
				// Remember the original values
				var style = elem.style.left, runtimeStyle = elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				elem.runtimeStyle.left = elem.currentStyle.left;
				elem.style.left = ret || 0;
				ret = elem.style.pixelLeft + "px";

				// Revert the changed values
				elem.style.left = style;
				elem.runtimeStyle.left = runtimeStyle;
			}
		}

		return ret;
	},
	
	clean: function( elems, context ) {
		var ret = [];
		context = context || document;
		// !context.createElement fails in IE with an error but returns typeof 'object'
		if (typeof context.createElement == 'undefined') 
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;

		jQuery.each(elems, function(i, elem){
			if ( !elem )
				return;

			if ( elem.constructor == Number )
				elem = elem.toString();
			
			// Convert html string into DOM nodes
			if ( typeof elem == "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag){
					return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ?
						all :
						front + "></" + tag + ">";
				});

				// Trim whitespace, otherwise indexOf won't work as expected
				var tags = jQuery.trim( elem ).toLowerCase(), div = context.createElement("div");

				var wrap =
					// option or optgroup
					!tags.indexOf("<opt") &&
					[ 1, "<select multiple='multiple'>", "</select>" ] ||
					
					!tags.indexOf("<leg") &&
					[ 1, "<fieldset>", "</fieldset>" ] ||
					
					tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
					[ 1, "<table>", "</table>" ] ||
					
					!tags.indexOf("<tr") &&
					[ 2, "<table><tbody>", "</tbody></table>" ] ||
					
				 	// <thead> matched above
					(!tags.indexOf("<td") || !tags.indexOf("<th")) &&
					[ 3, "<table><tbody><tr>", "</tr></tbody></table>" ] ||
					
					!tags.indexOf("<col") &&
					[ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ] ||

					// IE can't serialize <link> and <script> tags normally
					jQuery.browser.msie &&
					[ 1, "div<div>", "</div>" ] ||
					
					[ 0, "", "" ];

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];
				
				// Move to the right depth
				while ( wrap[0]-- )
					div = div.lastChild;
				
				// Remove IE's autoinserted <tbody> from table fragments
				if ( jQuery.browser.msie ) {
					
					// String was a <table>, *may* have spurious <tbody>
					var tbody = !tags.indexOf("<table") && tags.indexOf("<tbody") < 0 ?
						div.firstChild && div.firstChild.childNodes :
						
						// String was a bare <thead> or <tfoot>
						wrap[1] == "<table>" && tags.indexOf("<tbody") < 0 ?
							div.childNodes :
							[];
				
					for ( var j = tbody.length - 1; j >= 0 ; --j )
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length )
							tbody[ j ].parentNode.removeChild( tbody[ j ] );
					
					// IE completely kills leading whitespace when innerHTML is used	
					if ( /^\s/.test( elem ) )	
						div.insertBefore( context.createTextNode( elem.match(/^\s*/)[0] ), div.firstChild );
				
				}
				
				elem = jQuery.makeArray( div.childNodes );
			}

			if ( elem.length === 0 && (!jQuery.nodeName( elem, "form" ) && !jQuery.nodeName( elem, "select" )) )
				return;

			if ( elem[0] == undefined || jQuery.nodeName( elem, "form" ) || elem.options )
				ret.push( elem );

			else
				ret = jQuery.merge( ret, elem );

		});

		return ret;
	},
	
	attr: function( elem, name, value ) {
		// don't set attributes on text and comment nodes
		if (!elem || elem.nodeType == 3 || elem.nodeType == 8)
			return undefined;

		var fix = jQuery.isXMLDoc( elem ) ?
			{} :
			jQuery.props;

		// Safari mis-reports the default selected property of a hidden option
		// Accessing the parent's selectedIndex property fixes it
		if ( name == "selected" && jQuery.browser.safari )
			elem.parentNode.selectedIndex;
		
		// Certain attributes only work when accessed via the old DOM 0 way
		if ( fix[ name ] ) {
			if ( value != undefined )
				elem[ fix[ name ] ] = value;

			return elem[ fix[ name ] ];

		} else if ( jQuery.browser.msie && name == "style" )
			return jQuery.attr( elem.style, "cssText", value );

		else if ( value == undefined && jQuery.browser.msie && jQuery.nodeName( elem, "form" ) && (name == "action" || name == "method") )
			return elem.getAttributeNode( name ).nodeValue;

		// IE elem.getAttribute passes even for style
		else if ( elem.tagName ) {

			if ( value != undefined ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( name == "type" && jQuery.nodeName( elem, "input" ) && elem.parentNode )
					throw "type property can't be changed";

				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}

			if ( jQuery.browser.msie && /href|src/.test( name ) && !jQuery.isXMLDoc( elem ) ) 
				return elem.getAttribute( name, 2 );

			return elem.getAttribute( name );

		// elem is actually elem.style ... set the style
		} else {
			// IE actually uses filters for opacity
			if ( name == "opacity" && jQuery.browser.msie ) {
				if ( value != undefined ) {
					// IE has trouble with opacity if it does not have layout
					// Force it by setting the zoom level
					elem.zoom = 1; 
	
					// Set the alpha filter to set the opacity
					elem.filter = (elem.filter || "").replace( /alpha\([^)]*\)/, "" ) +
						(parseFloat( value ).toString() == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
				}
	
				return elem.filter && elem.filter.indexOf("opacity=") >= 0 ?
					(parseFloat( elem.filter.match(/opacity=([^)]*)/)[1] ) / 100).toString() :
					"";
			}

			name = name.replace(/-([a-z])/ig, function(all, letter){
				return letter.toUpperCase();
			});

			if ( value != undefined )
				elem[ name ] = value;

			return elem[ name ];
		}
	},
	
	trim: function( text ) {
		return (text || "").replace( /^\s+|\s+$/g, "" );
	},

	makeArray: function( array ) {
		var ret = [];

		// Need to use typeof to fight Safari childNodes crashes
		if ( typeof array != "array" )
			for ( var i = 0, length = array.length; i < length; i++ )
				ret.push( array[ i ] );
		else
			ret = array.slice( 0 );

		return ret;
	},

	inArray: function( elem, array ) {
		for ( var i = 0, length = array.length; i < length; i++ )
			if ( array[ i ] == elem )
				return i;

		return -1;
	},

	merge: function( first, second ) {
		// We have to loop this way because IE & Opera overwrite the length
		// expando of getElementsByTagName

		// Also, we need to make sure that the correct elements are being returned
		// (IE returns comment nodes in a '*' query)
		if ( jQuery.browser.msie ) {
			for ( var i = 0; second[ i ]; i++ )
				if ( second[ i ].nodeType != 8 )
					first.push( second[ i ] );

		} else
			for ( var i = 0; second[ i ]; i++ )
				first.push( second[ i ] );

		return first;
	},

	unique: function( array ) {
		var ret = [], done = {};

		try {

			for ( var i = 0, length = array.length; i < length; i++ ) {
				var id = jQuery.data( array[ i ] );

				if ( !done[ id ] ) {
					done[ id ] = true;
					ret.push( array[ i ] );
				}
			}

		} catch( e ) {
			ret = array;
		}

		return ret;
	},

	grep: function( elems, callback, inv ) {
		var ret = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ )
			if ( !inv && callback( elems[ i ], i ) || inv && !callback( elems[ i ], i ) )
				ret.push( elems[ i ] );

		return ret;
	},

	map: function( elems, callback ) {
		var ret = [];

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			var value = callback( elems[ i ], i );

			if ( value !== null && value != undefined ) {
				if ( value.constructor != Array )
					value = [ value ];

				ret = ret.concat( value );
			}
		}

		return ret;
	}
});

var userAgent = navigator.userAgent.toLowerCase();

// Figure out what browser is being used
jQuery.browser = {
	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};

var styleFloat = jQuery.browser.msie ?
	"styleFloat" :
	"cssFloat";
	
jQuery.extend({
	// Check to see if the W3C box model is being used
	boxModel: !jQuery.browser.msie || document.compatMode == "CSS1Compat",
	
	props: {
		"for": "htmlFor",
		"class": "className",
		"float": styleFloat,
		cssFloat: styleFloat,
		styleFloat: styleFloat,
		innerHTML: "innerHTML",
		className: "className",
		value: "value",
		disabled: "disabled",
		checked: "checked",
		readonly: "readOnly",
		selected: "selected",
		maxlength: "maxLength",
		selectedIndex: "selectedIndex",
		defaultValue: "defaultValue",
		tagName: "tagName",
		nodeName: "nodeName"
	}
});

jQuery.each({
	parent: function(elem){return elem.parentNode;},
	parents: function(elem){return jQuery.dir(elem,"parentNode");},
	next: function(elem){return jQuery.nth(elem,2,"nextSibling");},
	prev: function(elem){return jQuery.nth(elem,2,"previousSibling");},
	nextAll: function(elem){return jQuery.dir(elem,"nextSibling");},
	prevAll: function(elem){return jQuery.dir(elem,"previousSibling");},
	siblings: function(elem){return jQuery.sibling(elem.parentNode.firstChild,elem);},
	children: function(elem){return jQuery.sibling(elem.firstChild);},
	contents: function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes);}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ) );
	};
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function(name, original){
	jQuery.fn[ name ] = function() {
		var args = arguments;

		return this.each(function(){
			for ( var i = 0, length = args.length; i < length; i++ )
				jQuery( args[ i ] )[ original ]( this );
		});
	};
});

jQuery.each({
	removeAttr: function( name ) {
		jQuery.attr( this, name, "" );
		if (this.nodeType == 1) 
			this.removeAttribute( name );
	},

	addClass: function( classNames ) {
		jQuery.className.add( this, classNames );
	},

	removeClass: function( classNames ) {
		jQuery.className.remove( this, classNames );
	},

	toggleClass: function( classNames ) {
		jQuery.className[ jQuery.className.has( this, classNames ) ? "remove" : "add" ]( this, classNames );
	},

	remove: function( selector ) {
		if ( !selector || jQuery.filter( selector, [ this ] ).r.length ) {
			// Prevent memory leaks
			jQuery( "*", this ).add(this).each(function(){
				jQuery.event.remove(this);
				jQuery.removeData(this);
			});
			if (this.parentNode)
				this.parentNode.removeChild( this );
		}
	},

	empty: function() {
		// Remove element nodes and prevent memory leaks
		jQuery( ">*", this ).remove();
		
		// Remove any remaining nodes
		while ( this.firstChild )
			this.removeChild( this.firstChild );
	}
}, function(name, fn){
	jQuery.fn[ name ] = function(){
		return this.each( fn, arguments );
	};
});

jQuery.each([ "Height", "Width" ], function(i, name){
	var type = name.toLowerCase();
	
	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		return this[0] == window ?
			// Opera reports document.body.client[Width/Height] properly in both quirks and standards
			jQuery.browser.opera && document.body[ "client" + name ] || 
			
			// Safari reports inner[Width/Height] just fine (Mozilla and Opera include scroll bar widths)
			jQuery.browser.safari && window[ "inner" + name ] ||
			
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			document.compatMode == "CSS1Compat" && document.documentElement[ "client" + name ] || document.body[ "client" + name ] :
		
			// Get document width or height
			this[0] == document ?
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				Math.max( 
					Math.max(document.body["scroll" + name], document.documentElement["scroll" + name]), 
					Math.max(document.body["offset" + name], document.documentElement["offset" + name]) 
				) :

				// Get or set width or height on the element
				size == undefined ?
					// Get width or height on the element
					(this.length ? jQuery.css( this[0], type ) : null) :

					// Set the width or height on the element (default to pixels if value is unitless)
					this.css( type, size.constructor == String ? size : size + "px" );
	};
});

var chars = jQuery.browser.safari && parseInt(jQuery.browser.version) < 417 ?
		"(?:[\\w*_-]|\\\\.)" :
		"(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",
	quickChild = new RegExp("^>\\s*(" + chars + "+)"),
	quickID = new RegExp("^(" + chars + "+)(#)(" + chars + "+)"),
	quickClass = new RegExp("^([#.]?)(" + chars + "*)");

jQuery.extend({
	expr: {
		"": function(a,i,m){return m[2]=="*"||jQuery.nodeName(a,m[2]);},
		"#": function(a,i,m){return a.getAttribute("id")==m[2];},
		":": {
			// Position Checks
			lt: function(a,i,m){return i<m[3]-0;},
			gt: function(a,i,m){return i>m[3]-0;},
			nth: function(a,i,m){return m[3]-0==i;},
			eq: function(a,i,m){return m[3]-0==i;},
			first: function(a,i){return i==0;},
			last: function(a,i,m,r){return i==r.length-1;},
			even: function(a,i){return i%2==0;},
			odd: function(a,i){return i%2;},

			// Child Checks
			"first-child": function(a){return a.parentNode.getElementsByTagName("*")[0]==a;},
			"last-child": function(a){return jQuery.nth(a.parentNode.lastChild,1,"previousSibling")==a;},
			"only-child": function(a){return !jQuery.nth(a.parentNode.lastChild,2,"previousSibling");},

			// Parent Checks
			parent: function(a){return a.firstChild;},
			empty: function(a){return !a.firstChild;},

			// Text Check
			contains: function(a,i,m){return (a.textContent||a.innerText||jQuery(a).text()||"").indexOf(m[3])>=0;},

			// Visibility
			visible: function(a){return "hidden"!=a.type&&jQuery.css(a,"display")!="none"&&jQuery.css(a,"visibility")!="hidden";},
			hidden: function(a){return "hidden"==a.type||jQuery.css(a,"display")=="none"||jQuery.css(a,"visibility")=="hidden";},

			// Form attributes
			enabled: function(a){return !a.disabled;},
			disabled: function(a){return a.disabled;},
			checked: function(a){return a.checked;},
			selected: function(a){return a.selected||jQuery.attr(a,"selected");},

			// Form elements
			text: function(a){return "text"==a.type;},
			radio: function(a){return "radio"==a.type;},
			checkbox: function(a){return "checkbox"==a.type;},
			file: function(a){return "file"==a.type;},
			password: function(a){return "password"==a.type;},
			submit: function(a){return "submit"==a.type;},
			image: function(a){return "image"==a.type;},
			reset: function(a){return "reset"==a.type;},
			button: function(a){return "button"==a.type||jQuery.nodeName(a,"button");},
			input: function(a){return /input|select|textarea|button/i.test(a.nodeName);},

			// :has()
			has: function(a,i,m){return jQuery.find(m[3],a).length;},

			// :header
			header: function(a){return /h\d/i.test(a.nodeName);},

			// :animated
			animated: function(a){return jQuery.grep(jQuery.timers,function(fn){return a==fn.elem;}).length;}
		}
	},
	
	// The regular expressions that power the parsing engine
	parse: [
		// Match: [@value='test'], [@foo]
		/^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,

		// Match: :contains('foo')
		/^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,

		// Match: :even, :last-chlid, #id, .class
		new RegExp("^([:.#]*)(" + chars + "+)")
	],

	multiFilter: function( expr, elems, not ) {
		var old, cur = [];

		while ( expr && expr != old ) {
			old = expr;
			var f = jQuery.filter( expr, elems, not );
			expr = f.t.replace(/^\s*,\s*/, "" );
			cur = not ? elems = f.r : jQuery.merge( cur, f.r );
		}

		return cur;
	},

	find: function( t, context ) {
		// Quickly handle non-string expressions
		if ( typeof t != "string" )
			return [ t ];

		// check to make sure context is a DOM element or a document
		if ( context && context.nodeType != 1 && context.nodeType != 9)
			return [ ];

		// Set the correct context (if none is provided)
		context = context || document;

		// Initialize the search
		var ret = [context], done = [], last, nodeName;

		// Continue while a selector expression exists, and while
		// we're no longer looping upon ourselves
		while ( t && last != t ) {
			var r = [];
			last = t;

			t = jQuery.trim(t);

			var foundToken = false;

			// An attempt at speeding up child selectors that
			// point to a specific element tag
			var re = quickChild;
			var m = re.exec(t);

			if ( m ) {
				nodeName = m[1].toUpperCase();

				// Perform our own iteration and filter
				for ( var i = 0; ret[i]; i++ )
					for ( var c = ret[i].firstChild; c; c = c.nextSibling )
						if ( c.nodeType == 1 && (nodeName == "*" || c.nodeName.toUpperCase() == nodeName) )
							r.push( c );

				ret = r;
				t = t.replace( re, "" );
				if ( t.indexOf(" ") == 0 ) continue;
				foundToken = true;
			} else {
				re = /^([>+~])\s*(\w*)/i;

				if ( (m = re.exec(t)) != null ) {
					r = [];

					var merge = {};
					nodeName = m[2].toUpperCase();
					m = m[1];

					for ( var j = 0, rl = ret.length; j < rl; j++ ) {
						var n = m == "~" || m == "+" ? ret[j].nextSibling : ret[j].firstChild;
						for ( ; n; n = n.nextSibling )
							if ( n.nodeType == 1 ) {
								var id = jQuery.data(n);

								if ( m == "~" && merge[id] ) break;
								
								if (!nodeName || n.nodeName.toUpperCase() == nodeName ) {
									if ( m == "~" ) merge[id] = true;
									r.push( n );
								}
								
								if ( m == "+" ) break;
							}
					}

					ret = r;

					// And remove the token
					t = jQuery.trim( t.replace( re, "" ) );
					foundToken = true;
				}
			}

			// See if there's still an expression, and that we haven't already
			// matched a token
			if ( t && !foundToken ) {
				// Handle multiple expressions
				if ( !t.indexOf(",") ) {
					// Clean the result set
					if ( context == ret[0] ) ret.shift();

					// Merge the result sets
					done = jQuery.merge( done, ret );

					// Reset the context
					r = ret = [context];

					// Touch up the selector string
					t = " " + t.substr(1,t.length);

				} else {
					// Optimize for the case nodeName#idName
					var re2 = quickID;
					var m = re2.exec(t);
					
					// Re-organize the results, so that they're consistent
					if ( m ) {
						m = [ 0, m[2], m[3], m[1] ];

					} else {
						// Otherwise, do a traditional filter check for
						// ID, class, and element selectors
						re2 = quickClass;
						m = re2.exec(t);
					}

					m[2] = m[2].replace(/\\/g, "");

					var elem = ret[ret.length-1];

					// Try to do a global search by ID, where we can
					if ( m[1] == "#" && elem && elem.getElementById && !jQuery.isXMLDoc(elem) ) {
						// Optimization for HTML document case
						var oid = elem.getElementById(m[2]);
						
						// Do a quick check for the existence of the actual ID attribute
						// to avoid selecting by the name attribute in IE
						// also check to insure id is a string to avoid selecting an element with the name of 'id' inside a form
						if ( (jQuery.browser.msie||jQuery.browser.opera) && oid && typeof oid.id == "string" && oid.id != m[2] )
							oid = jQuery('[@id="'+m[2]+'"]', elem)[0];

						// Do a quick check for node name (where applicable) so
						// that div#foo searches will be really fast
						ret = r = oid && (!m[3] || jQuery.nodeName(oid, m[3])) ? [oid] : [];
					} else {
						// We need to find all descendant elements
						for ( var i = 0; ret[i]; i++ ) {
							// Grab the tag name being searched for
							var tag = m[1] == "#" && m[3] ? m[3] : m[1] != "" || m[0] == "" ? "*" : m[2];

							// Handle IE7 being really dumb about <object>s
							if ( tag == "*" && ret[i].nodeName.toLowerCase() == "object" )
								tag = "param";

							r = jQuery.merge( r, ret[i].getElementsByTagName( tag ));
						}

						// It's faster to filter by class and be done with it
						if ( m[1] == "." )
							r = jQuery.classFilter( r, m[2] );

						// Same with ID filtering
						if ( m[1] == "#" ) {
							var tmp = [];

							// Try to find the element with the ID
							for ( var i = 0; r[i]; i++ )
								if ( r[i].getAttribute("id") == m[2] ) {
									tmp = [ r[i] ];
									break;
								}

							r = tmp;
						}

						ret = r;
					}

					t = t.replace( re2, "" );
				}

			}

			// If a selector string still exists
			if ( t ) {
				// Attempt to filter it
				var val = jQuery.filter(t,r);
				ret = r = val.r;
				t = jQuery.trim(val.t);
			}
		}

		// An error occurred with the selector;
		// just return an empty set instead
		if ( t )
			ret = [];

		// Remove the root context
		if ( ret && context == ret[0] )
			ret.shift();

		// And combine the results
		done = jQuery.merge( done, ret );

		return done;
	},

	classFilter: function(r,m,not){
		m = " " + m + " ";
		var tmp = [];
		for ( var i = 0; r[i]; i++ ) {
			var pass = (" " + r[i].className + " ").indexOf( m ) >= 0;
			if ( !not && pass || not && !pass )
				tmp.push( r[i] );
		}
		return tmp;
	},

	filter: function(t,r,not) {
		var last;

		// Look for common filter expressions
		while ( t && t != last ) {
			last = t;

			var p = jQuery.parse, m;

			for ( var i = 0; p[i]; i++ ) {
				m = p[i].exec( t );

				if ( m ) {
					// Remove what we just matched
					t = t.substring( m[0].length );

					m[2] = m[2].replace(/\\/g, "");
					break;
				}
			}

			if ( !m )
				break;

			// :not() is a special case that can be optimized by
			// keeping it out of the expression list
			if ( m[1] == ":" && m[2] == "not" )
				// optimize if only one selector found (most common case)
				r = isSimple.test( m[3] ) ?
					jQuery.filter(m[3], r, true).r :
					jQuery( r ).not( m[3] );

			// We can get a big speed boost by filtering by class here
			else if ( m[1] == "." )
				r = jQuery.classFilter(r, m[2], not);

			else if ( m[1] == "[" ) {
				var tmp = [], type = m[3];
				
				for ( var i = 0, rl = r.length; i < rl; i++ ) {
					var a = r[i], z = a[ jQuery.props[m[2]] || m[2] ];
					
					if ( z == null || /href|src|selected/.test(m[2]) )
						z = jQuery.attr(a,m[2]) || '';

					if ( (type == "" && !!z ||
						 type == "=" && z == m[5] ||
						 type == "!=" && z != m[5] ||
						 type == "^=" && z && !z.indexOf(m[5]) ||
						 type == "$=" && z.substr(z.length - m[5].length) == m[5] ||
						 (type == "*=" || type == "~=") && z.indexOf(m[5]) >= 0) ^ not )
							tmp.push( a );
				}
				
				r = tmp;

			// We can get a speed boost by handling nth-child here
			} else if ( m[1] == ":" && m[2] == "nth-child" ) {
				var merge = {}, tmp = [],
					// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
					test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
						m[3] == "even" && "2n" || m[3] == "odd" && "2n+1" ||
						!/\D/.test(m[3]) && "0n+" + m[3] || m[3]),
					// calculate the numbers (first)n+(last) including if they are negative
					first = (test[1] + (test[2] || 1)) - 0, last = test[3] - 0;
 
				// loop through all the elements left in the jQuery object
				for ( var i = 0, rl = r.length; i < rl; i++ ) {
					var node = r[i], parentNode = node.parentNode, id = jQuery.data(parentNode);

					if ( !merge[id] ) {
						var c = 1;

						for ( var n = parentNode.firstChild; n; n = n.nextSibling )
							if ( n.nodeType == 1 )
								n.nodeIndex = c++;

						merge[id] = true;
					}

					var add = false;

					if ( first == 0 ) {
						if ( node.nodeIndex == last )
							add = true;
					} else if ( (node.nodeIndex - last) % first == 0 && (node.nodeIndex - last) / first >= 0 )
						add = true;

					if ( add ^ not )
						tmp.push( node );
				}

				r = tmp;

			// Otherwise, find the expression to execute
			} else {
				var fn = jQuery.expr[ m[1] ];
				if ( typeof fn == "object" )
					fn = fn[ m[2] ];

				if ( typeof fn == "string" )
					fn = eval("false||function(a,i){return " + fn + ";}");

				// Execute it against the current filter
				r = jQuery.grep( r, function(elem, i){
					return fn(elem, i, m, r);
				}, not );
			}
		}

		// Return an array of filtered elements (r)
		// and the modified expression string (t)
		return { r: r, t: t };
	},

	dir: function( elem, dir ){
		var matched = [];
		var cur = elem[dir];
		while ( cur && cur != document ) {
			if ( cur.nodeType == 1 )
				matched.push( cur );
			cur = cur[dir];
		}
		return matched;
	},
	
	nth: function(cur,result,dir,elem){
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] )
			if ( cur.nodeType == 1 && ++num == result )
				break;

		return cur;
	},
	
	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType == 1 && (!elem || n != elem) )
				r.push( n );
		}

		return r;
	}
});

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code orignated from 
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function(elem, types, handler, data) {
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( jQuery.browser.msie && elem.setInterval != undefined )
			elem = window;

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid )
			handler.guid = this.guid++;
			
		// if data is passed, bind to handler 
		if( data != undefined ) { 
			// Create temporary function pointer to original handler 
			var fn = handler; 

			// Create unique handler function, wrapped around original handler 
			handler = function() { 
				// Pass arguments and context to original handler 
				return fn.apply(this, arguments); 
			};

			// Store data in unique handler 
			handler.data = data;

			// Set the guid of unique handler to the same of original handler, so it can be removed 
			handler.guid = fn.guid;
		}

		// Init the element's event structure
		var events = jQuery.data(elem, "events") || jQuery.data(elem, "events", {}),
			handle = jQuery.data(elem, "handle") || jQuery.data(elem, "handle", function(){
				// returned undefined or false
				var val;

				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				if ( typeof jQuery == "undefined" || jQuery.event.triggered )
					return val;
		
				val = jQuery.event.handle.apply(arguments.callee.elem, arguments);
		
				return val;
			});
		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native
		// event in IE.
		handle.elem = elem;
			
			// Handle multiple events seperated by a space
			// jQuery(...).bind("mouseover mouseout", fn);
			jQuery.each(types.split(/\s+/), function(index, type) {
				// Namespaced event handlers
				var parts = type.split(".");
				type = parts[0];
				handler.type = parts[1];

				// Get the current list of functions bound to this event
				var handlers = events[type];

				// Init the event handler queue
				if (!handlers) {
					handlers = events[type] = {};
		
					// Check for a special event handler
					// Only use addEventListener/attachEvent if the special
					// events handler returns false
					if ( !jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem) === false ) {
						// Bind the global event handler to the element
						if (elem.addEventListener)
							elem.addEventListener(type, handle, false);
						else if (elem.attachEvent)
							elem.attachEvent("on" + type, handle);
					}
				}

				// Add the function to the element's handler list
				handlers[handler.guid] = handler;

				// Keep track of which events have been used, for global triggering
				jQuery.event.global[type] = true;
			});
		
		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	guid: 1,
	global: {},

	// Detach an event or set of events from an element
	remove: function(elem, types, handler) {
		// don't do events on text and comment nodes
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		var events = jQuery.data(elem, "events"), ret, index;

		if ( events ) {
			// Unbind all events for the element
			if ( types == undefined || (typeof types == "string" && types.charAt(0) == ".") )
				for ( var type in events )
					this.remove( elem, type + (types || "") );
			else {
				// types is actually an event object here
				if ( types.type ) {
					handler = types.handler;
					types = types.type;
				}
				
				// Handle multiple events seperated by a space
				// jQuery(...).unbind("mouseover mouseout", fn);
				jQuery.each(types.split(/\s+/), function(index, type){
					// Namespaced event handlers
					var parts = type.split(".");
					type = parts[0];
					
					if ( events[type] ) {
						// remove the given handler for the given type
						if ( handler )
							delete events[type][handler.guid];
			
						// remove all handlers for the given type
						else
							for ( handler in events[type] )
								// Handle the removal of namespaced events
								if ( !parts[1] || events[type][handler].type == parts[1] )
									delete events[type][handler];

						// remove generic event handler if no more handlers exist
						for ( ret in events[type] ) break;
						if ( !ret ) {
							if ( !jQuery.event.special[type] || jQuery.event.special[type].teardown.call(elem) === false ) {
								if (elem.removeEventListener)
									elem.removeEventListener(type, jQuery.data(elem, "handle"), false);
								else if (elem.detachEvent)
									elem.detachEvent("on" + type, jQuery.data(elem, "handle"));
							}
							ret = null;
							delete events[type];
						}
					}
				});
			}

			// Remove the expando if it's no longer used
			for ( ret in events ) break;
			if ( !ret ) {
				var handle = jQuery.data( elem, "handle" );
				if ( handle ) handle.elem = null;
				jQuery.removeData( elem, "events" );
				jQuery.removeData( elem, "handle" );
			}
		}
	},

	trigger: function(type, data, elem, donative, extra) {
		// Clone the incoming data, if any
		data = jQuery.makeArray(data || []);

		if ( type.indexOf("!") >= 0 ) {
			type = type.slice(0, -1);
			var exclusive = true;
		}

		// Handle a global trigger
		if ( !elem ) {
			// Only trigger if we've ever bound an event for it
			if ( this.global[type] )
				jQuery("*").add([window, document]).trigger(type, data);

		// Handle triggering a single element
		} else {
			// don't do events on text and comment nodes
			if ( elem.nodeType == 3 || elem.nodeType == 8 )
				return undefined;

			var val, ret, fn = jQuery.isFunction( elem[ type ] || null ),
				// Check to see if we need to provide a fake event, or not
				event = !data[0] || !data[0].preventDefault;
			
			// Pass along a fake event
			if ( event )
				data.unshift( this.fix({ type: type, target: elem }) );

			// Enforce the right trigger type
			data[0].type = type;
			if ( exclusive )
				data[0].exclusive = true;

			// Trigger the event
			if ( jQuery.isFunction( jQuery.data(elem, "handle") ) )
				val = jQuery.data(elem, "handle").apply( elem, data );

			// Handle triggering native .onfoo handlers
			if ( !fn && elem["on"+type] && elem["on"+type].apply( elem, data ) === false )
				val = false;

			// Extra functions don't get the custom event object
			if ( event )
				data.shift();

			// Handle triggering of extra function
			if ( extra && jQuery.isFunction( extra ) ) {
				// call the extra function and tack the current return value on the end for possible inspection
				ret = extra.apply( elem, val == null ? data : data.concat( val ) );
				// if anything is returned, give it precedence and have it overwrite the previous value
				if (ret !== undefined)
					val = ret;
			}

			// Trigger the native events (except for clicks on links)
			if ( fn && donative !== false && val !== false && !(jQuery.nodeName(elem, 'a') && type == "click") ) {
				this.triggered = true;
				try {
					elem[ type ]();
				// prevent IE from throwing an error for some hidden elements
				} catch (e) {}
			}

			this.triggered = false;
		}

		return val;
	},

	handle: function(event) {
		// returned undefined or false
		var val;

		// Empty object is for triggered events with no data
		event = jQuery.event.fix( event || window.event || {} ); 

		// Namespaced event handlers
		var parts = event.type.split(".");
		event.type = parts[0];

		var handlers = jQuery.data(this, "events") && jQuery.data(this, "events")[event.type], args = Array.prototype.slice.call( arguments, 1 );
		args.unshift( event );

		for ( var j in handlers ) {
			var handler = handlers[j];
			// Pass in a reference to the handler function itself
			// So that we can later remove it
			args[0].handler = handler;
			args[0].data = handler.data;

			// Filter the functions by class
			if ( !parts[1] && !event.exclusive || handler.type == parts[1] ) {
				var ret = handler.apply( this, args );

				if ( val !== false )
					val = ret;

				if ( ret === false ) {
					event.preventDefault();
					event.stopPropagation();
				}
			}
		}

		// Clean up added properties in IE to prevent memory leak
		if (jQuery.browser.msie)
			event.target = event.preventDefault = event.stopPropagation =
				event.handler = event.data = null;

		return val;
	},

	fix: function(event) {
		// store a copy of the original event object 
		// and clone to set read-only properties
		var originalEvent = event;
		event = jQuery.extend({}, originalEvent);
		
		// add preventDefault and stopPropagation since 
		// they will not work on the clone
		event.preventDefault = function() {
			// if preventDefault exists run it on the original event
			if (originalEvent.preventDefault)
				originalEvent.preventDefault();
			// otherwise set the returnValue property of the original event to false (IE)
			originalEvent.returnValue = false;
		};
		event.stopPropagation = function() {
			// if stopPropagation exists run it on the original event
			if (originalEvent.stopPropagation)
				originalEvent.stopPropagation();
			// otherwise set the cancelBubble property of the original event to true (IE)
			originalEvent.cancelBubble = true;
		};
		
		// Fix target property, if necessary
		if ( !event.target )
			event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either
				
		// check if target is a textnode (safari)
		if ( event.target.nodeType == 3 )
			event.target = originalEvent.target.parentNode;

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement )
			event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
		}
			
		// Add which for key events
		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) )
			event.which = event.charCode || event.keyCode;
		
		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey )
			event.metaKey = event.ctrlKey;

		// Add which for click: 1 == left; 2 == middle; 3 == right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button )
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
			
		return event;
	},
	
	special: {
		ready: {
			setup: function() {
				// Make sure the ready event is setup
				bindReady();
				return;
			},
			
			teardown: function() { return; }
		},
		
		mouseenter: {
			setup: function() {
				if ( jQuery.browser.msie ) return false;
				jQuery(this).bind("mouseover", jQuery.event.special.mouseenter.handler);
				return true;
			},
		
			teardown: function() {
				if ( jQuery.browser.msie ) return false;
				jQuery(this).unbind("mouseover", jQuery.event.special.mouseenter.handler);
				return true;
			},
			
			handler: function(event) {
				// If we actually just moused on to a sub-element, ignore it
				if ( withinElement(event, this) ) return true;
				// Execute the right handlers by setting the event type to mouseenter
				arguments[0].type = "mouseenter";
				return jQuery.event.handle.apply(this, arguments);
			}
		},
	
		mouseleave: {
			setup: function() {
				if ( jQuery.browser.msie ) return false;
				jQuery(this).bind("mouseout", jQuery.event.special.mouseleave.handler);
				return true;
			},
		
			teardown: function() {
				if ( jQuery.browser.msie ) return false;
				jQuery(this).unbind("mouseout", jQuery.event.special.mouseleave.handler);
				return true;
			},
			
			handler: function(event) {
				// If we actually just moused on to a sub-element, ignore it
				if ( withinElement(event, this) ) return true;
				// Execute the right handlers by setting the event type to mouseleave
				arguments[0].type = "mouseleave";
				return jQuery.event.handle.apply(this, arguments);
			}
		}
	}
};

jQuery.fn.extend({
	bind: function( type, data, fn ) {
		return type == "unload" ? this.one(type, data, fn) : this.each(function(){
			jQuery.event.add( this, type, fn || data, fn && data );
		});
	},
	
	one: function( type, data, fn ) {
		return this.each(function(){
			jQuery.event.add( this, type, function(event) {
				jQuery(this).unbind(event);
				return (fn || data).apply( this, arguments);
			}, fn && data);
		});
	},

	unbind: function( type, fn ) {
		return this.each(function(){
			jQuery.event.remove( this, type, fn );
		});
	},

	trigger: function( type, data, fn ) {
		return this.each(function(){
			jQuery.event.trigger( type, data, this, true, fn );
		});
	},

	triggerHandler: function( type, data, fn ) {
		if ( this[0] )
			return jQuery.event.trigger( type, data, this[0], false, fn );
		return undefined;
	},

	toggle: function() {
		// Save reference to arguments for access in closure
		var args = arguments;

		return this.click(function(event) {
			// Figure out which function to execute
			this.lastToggle = 0 == this.lastToggle ? 1 : 0;
			
			// Make sure that clicks stop
			event.preventDefault();
			
			// and execute the function
			return args[this.lastToggle].apply( this, arguments ) || false;
		});
	},

	hover: function(fnOver, fnOut) {
		return this.bind('mouseenter', fnOver).bind('mouseleave', fnOut);
	},
	
	ready: function(fn) {
		// Attach the listeners
		bindReady();

		// If the DOM is already ready
		if ( jQuery.isReady )
			// Execute the function immediately
			fn.call( document, jQuery );
			
		// Otherwise, remember the function for later
		else
			// Add the function to the wait list
			jQuery.readyList.push( function() { return fn.call(this, jQuery); } );
	
		return this;
	}
});

jQuery.extend({
	isReady: false,
	readyList: [],
	// Handle when the DOM is ready
	ready: function() {
		// Make sure that the DOM is not already loaded
		if ( !jQuery.isReady ) {
			// Remember that the DOM is ready
			jQuery.isReady = true;
			
			// If there are functions bound, to execute
			if ( jQuery.readyList ) {
				// Execute all of them
				jQuery.each( jQuery.readyList, function(){
					this.apply( document );
				});
				
				// Reset the list of functions
				jQuery.readyList = null;
			}
		
			// Trigger any bound ready events
			jQuery(document).triggerHandler("ready");
		}
	}
});

var readyBound = false;

function bindReady(){
	if ( readyBound ) return;
	readyBound = true;

	// Mozilla, Opera (see further below for it) and webkit nightlies currently support this event
	if ( document.addEventListener && !jQuery.browser.opera)
		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", jQuery.ready, false );
	
	// If IE is used and is not in a frame
	// Continually check to see if the document is ready
	if ( jQuery.browser.msie && window == top ) (function(){
		if (jQuery.isReady) return;
		try {
			// If IE is used, use the trick by Diego Perini
			// http://javascript.nwbox.com/IEContentLoaded/
			document.documentElement.doScroll("left");
		} catch( error ) {
			setTimeout( arguments.callee, 0 );
			return;
		}
		// and execute any waiting functions
		jQuery.ready();
	})();

	if ( jQuery.browser.opera )
		document.addEventListener( "DOMContentLoaded", function () {
			if (jQuery.isReady) return;
			for (var i = 0; i < document.styleSheets.length; i++)
				if (document.styleSheets[i].disabled) {
					setTimeout( arguments.callee, 0 );
					return;
				}
			// and execute any waiting functions
			jQuery.ready();
		}, false);

	if ( jQuery.browser.safari ) {
		var numStyles;
		(function(){
			if (jQuery.isReady) return;
			if ( document.readyState != "loaded" && document.readyState != "complete" ) {
				setTimeout( arguments.callee, 0 );
				return;
			}
			if ( numStyles === undefined )
				numStyles = jQuery("style, link[rel=stylesheet]").length;
			if ( document.styleSheets.length != numStyles ) {
				setTimeout( arguments.callee, 0 );
				return;
			}
			// and execute any waiting functions
			jQuery.ready();
		})();
	}

	// A fallback to window.onload, that will always work
	jQuery.event.add( window, "load", jQuery.ready );
}

jQuery.each( ("blur,focus,load,resize,scroll,unload,click,dblclick," +
	"mousedown,mouseup,mousemove,mouseover,mouseout,change,select," + 
	"submit,keydown,keypress,keyup,error").split(","), function(i, name){
	
	// Handle event binding
	jQuery.fn[name] = function(fn){
		return fn ? this.bind(name, fn) : this.trigger(name);
	};
});

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function(event, elem) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;
	// Traverse up the tree
	while ( parent && parent != elem ) try { parent = parent.parentNode; } catch(error) { parent = elem; }
	// Return true if we actually just moused on to a sub-element
	return parent == elem;
};

// Prevent memory leaks in IE
// And prevent errors on refresh with events like mouseover in other browsers
// Window isn't included so as not to unbind existing unload events
jQuery(window).bind("unload", function() {
	jQuery("*").add(document).unbind();
});
jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( jQuery.isFunction( url ) )
			return this.bind("load", url);

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		callback = callback || function(){};

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params )
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = null;

			// Otherwise, build a param string
			} else {
				params = jQuery.param( params );
				type = "POST";
			}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function(res, status){
				// If successful, inject the HTML into all the matched elements
				if ( status == "success" || status == "notmodified" )
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div/>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(/<script(.|\s)*?\/script>/g, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						res.responseText );

				self.each( callback, [res.responseText, status, res] );
			}
		});
		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		return this.map(function(){
			return jQuery.nodeName(this, "form") ?
				jQuery.makeArray(this.elements) : this;
		})
		.filter(function(){
			return this.name && !this.disabled && 
				(this.checked || /select|textarea/i.test(this.nodeName) || 
					/text|hidden|password/i.test(this.type));
		})
		.map(function(i, elem){
			var val = jQuery(this).val();
			return val == null ? null :
				val.constructor == Array ?
					jQuery.map( val, function(val, i){
						return {name: elem.name, value: val};
					}) :
					{name: elem.name, value: val};
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function(i,o){
	jQuery.fn[o] = function(f){
		return this.bind(o, f);
	};
});

var jsc = (new Date).getTime();

jQuery.extend({
	get: function( url, data, callback, type ) {
		// shift arguments if data argument was ommited
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = null;
		}
		
		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		global: true,
		type: "GET",
		timeout: 0,
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		data: null,
		username: null,
		password: null,
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},
	
	// Last-Modified header cache for next request
	lastModified: {},

	ajax: function( s ) {
		var jsonp, jsre = /=\?(&|$)/g, status, data;

		// Extend the settings, but re-extend 's' so that it can be
		// checked again later (in the test suite, specifically)
		s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));

		// convert data if not already a string
		if ( s.data && s.processData && typeof s.data != "string" )
			s.data = jQuery.param(s.data);

		// Handle JSONP Parameter Callbacks
		if ( s.dataType == "jsonp" ) {
			if ( s.type.toLowerCase() == "get" ) {
				if ( !s.url.match(jsre) )
					s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?";
			} else if ( !s.data || !s.data.match(jsre) )
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			s.dataType = "json";
		}

		// Build temporary JSONP function
		if ( s.dataType == "json" && (s.data && s.data.match(jsre) || s.url.match(jsre)) ) {
			jsonp = "jsonp" + jsc++;

			// Replace the =? sequence both in the query string and the data
			if ( s.data )
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			// We need to make sure
			// that a JSONP style response is executed properly
			s.dataType = "script";

			// Handle JSONP-style loading
			window[ jsonp ] = function(tmp){
				data = tmp;
				success();
				complete();
				// Garbage collect
				window[ jsonp ] = undefined;
				try{ delete window[ jsonp ]; } catch(e){}
				if ( head )
					head.removeChild( script );
			};
		}

		if ( s.dataType == "script" && s.cache == null )
			s.cache = false;

		if ( s.cache === false && s.type.toLowerCase() == "get" ) {
			var ts = (new Date()).getTime();
			// try replacing _= if it is there
			var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");
			// if nothing was replaced, add timestamp to the end
			s.url = ret + ((ret == s.url) ? (s.url.match(/\?/) ? "&" : "?") + "_=" + ts : "");
		}

		// If data is available, append data to url for get requests
		if ( s.data && s.type.toLowerCase() == "get" ) {
			s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;

			// IE likes to send both get and post data, prevent this
			s.data = null;
		}

		// Watch for a new set of requests
		if ( s.global && ! jQuery.active++ )
			jQuery.event.trigger( "ajaxStart" );

		// If we're requesting a remote document
		// and trying to load JSON or Script with a GET
		if ( (!s.url.indexOf("http") || !s.url.indexOf("//")) && s.dataType == "script" && s.type.toLowerCase() == "get" ) {
			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			script.src = s.url;
			if (s.scriptCharset)
				script.charset = s.scriptCharset;

			// Handle Script loading
			if ( !jsonp ) {
				var done = false;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function(){
					if ( !done && (!this.readyState || 
							this.readyState == "loaded" || this.readyState == "complete") ) {
						done = true;
						success();
						complete();
						head.removeChild( script );
					}
				};
			}

			head.appendChild(script);

			// We handle everything using the script element injection
			return undefined;
		}

		var requestDone = false;

		// Create the request object; Microsoft failed to properly
		// implement the XMLHttpRequest in IE7, so we use the ActiveXObject when it is available
		var xml = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();

		// Open the socket
		xml.open(s.type, s.url, s.async, s.username, s.password);

		// Need an extra try/catch for cross domain requests in Firefox 3
		try {
			// Set the correct header, if data is being sent
			if ( s.data )
				xml.setRequestHeader("Content-Type", s.contentType);

			// Set the If-Modified-Since header, if ifModified mode.
			if ( s.ifModified )
				xml.setRequestHeader("If-Modified-Since",
					jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT" );

			// Set header so the called script knows that it's an XMLHttpRequest
			xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");

			// Set the Accepts header for the server, depending on the dataType
			xml.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*" :
				s.accepts._default );
		} catch(e){}

		// Allow custom headers/mimetypes
		if ( s.beforeSend )
			s.beforeSend(xml);
			
		if ( s.global )
			jQuery.event.trigger("ajaxSend", [xml, s]);

		// Wait for a response to come back
		var onreadystatechange = function(isTimeout){
			// The transfer is complete and the data is available, or the request timed out
			if ( !requestDone && xml && (xml.readyState == 4 || isTimeout == "timeout") ) {
				requestDone = true;
				
				// clear poll interval
				if (ival) {
					clearInterval(ival);
					ival = null;
				}
				
				status = isTimeout == "timeout" && "timeout" ||
					!jQuery.httpSuccess( xml ) && "error" ||
					s.ifModified && jQuery.httpNotModified( xml, s.url ) && "notmodified" ||
					"success";

				if ( status == "success" ) {
					// Watch for, and catch, XML document parse errors
					try {
						// process the data (runs the xml through httpData regardless of callback)
						data = jQuery.httpData( xml, s.dataType );
					} catch(e) {
						status = "parsererror";
					}
				}

				// Make sure that the request was successful or notmodified
				if ( status == "success" ) {
					// Cache Last-Modified header, if ifModified mode.
					var modRes;
					try {
						modRes = xml.getResponseHeader("Last-Modified");
					} catch(e) {} // swallow exception thrown by FF if header is not available
	
					if ( s.ifModified && modRes )
						jQuery.lastModified[s.url] = modRes;

					// JSONP handles its own success callback
					if ( !jsonp )
						success();	
				} else
					jQuery.handleError(s, xml, status);

				// Fire the complete handlers
				complete();

				// Stop memory leaks
				if ( s.async )
					xml = null;
			}
		};
		
		if ( s.async ) {
			// don't attach the handler to the request, just poll it instead
			var ival = setInterval(onreadystatechange, 13); 

			// Timeout checker
			if ( s.timeout > 0 )
				setTimeout(function(){
					// Check to see if the request is still happening
					if ( xml ) {
						// Cancel the request
						xml.abort();
	
						if( !requestDone )
							onreadystatechange( "timeout" );
					}
				}, s.timeout);
		}
			
		// Send the data
		try {
			xml.send(s.data);
		} catch(e) {
			jQuery.handleError(s, xml, null, e);
		}
		
		// firefox 1.5 doesn't fire statechange for sync requests
		if ( !s.async )
			onreadystatechange();

		function success(){
			// If a local callback was specified, fire it and pass it the data
			if ( s.success )
				s.success( data, status );

			// Fire the global callback
			if ( s.global )
				jQuery.event.trigger( "ajaxSuccess", [xml, s] );
		}

		function complete(){
			// Process result
			if ( s.complete )
				s.complete(xml, status);

			// The request was completed
			if ( s.global )
				jQuery.event.trigger( "ajaxComplete", [xml, s] );

			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active )
				jQuery.event.trigger( "ajaxStop" );
		}
		
		// return XMLHttpRequest to allow aborting the request etc.
		return xml;
	},

	handleError: function( s, xml, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) s.error( xml, status, e );

		// Fire the global callback
		if ( s.global )
			jQuery.event.trigger( "ajaxError", [xml, s, e] );
	},

	// Counter for holding the number of active queries
	active: 0,

	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function( r ) {
		try {
			// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
			return !r.status && location.protocol == "file:" ||
				( r.status >= 200 && r.status < 300 ) || r.status == 304 || r.status == 1223 ||
				jQuery.browser.safari && r.status == undefined;
		} catch(e){}
		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function( xml, url ) {
		try {
			var xmlRes = xml.getResponseHeader("Last-Modified");

			// Firefox always returns 200. check Last-Modified date
			return xml.status == 304 || xmlRes == jQuery.lastModified[url] ||
				jQuery.browser.safari && xml.status == undefined;
		} catch(e){}
		return false;
	},

	httpData: function( r, type ) {
		var ct = r.getResponseHeader("content-type");
		var xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0;
		var data = xml ? r.responseXML : r.responseText;

		if ( xml && data.documentElement.tagName == "parsererror" )
			throw "parsererror";

		// If the type is "script", eval it in global context
		if ( type == "script" )
			jQuery.globalEval( data );

		// Get the JavaScript object, if JSON is used.
		if ( type == "json" )
			data = eval("(" + data + ")");

		return data;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a ) {
		var s = [];

		// If an array was passed in, assume that it is an array
		// of form elements
		if ( a.constructor == Array || a.jquery )
			// Serialize the form elements
			jQuery.each( a, function(){
				s.push( encodeURIComponent(this.name) + "=" + encodeURIComponent( this.value ) );
			});

		// Otherwise, assume that it's an object of key/value pairs
		else
			// Serialize the key/values
			for ( var j in a )
				// If the value is an array then the key names need to be repeated
				if ( a[j] && a[j].constructor == Array )
					jQuery.each( a[j], function(){
						s.push( encodeURIComponent(j) + "=" + encodeURIComponent( this ) );
					});
				else
					s.push( encodeURIComponent(j) + "=" + encodeURIComponent( a[j] ) );

		// Return the resulting serialization
		return s.join("&").replace(/%20/g, "+");
	}

});
jQuery.fn.extend({
	show: function(speed,callback){
		return speed ?
			this.animate({
				height: "show", width: "show", opacity: "show"
			}, speed, callback) :
			
			this.filter(":hidden").each(function(){
				this.style.display = this.oldblock || "";
				if ( jQuery.css(this,"display") == "none" ) {
					var elem = jQuery("<" + this.tagName + " />").appendTo("body");
					this.style.display = elem.css("display");
					// handle an edge condition where css is - div { display:none; } or similar
					if (this.style.display == "none")
						this.style.display = "block";
					elem.remove();
				}
			}).end();
	},
	
	hide: function(speed,callback){
		return speed ?
			this.animate({
				height: "hide", width: "hide", opacity: "hide"
			}, speed, callback) :
			
			this.filter(":visible").each(function(){
				this.oldblock = this.oldblock || jQuery.css(this,"display");
				this.style.display = "none";
			}).end();
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,
	
	toggle: function( fn, fn2 ){
		return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
			this._toggle( fn, fn2 ) :
			fn ?
				this.animate({
					height: "toggle", width: "toggle", opacity: "toggle"
				}, fn, fn2) :
				this.each(function(){
					jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ]();
				});
	},
	
	slideDown: function(speed,callback){
		return this.animate({height: "show"}, speed, callback);
	},
	
	slideUp: function(speed,callback){
		return this.animate({height: "hide"}, speed, callback);
	},

	slideToggle: function(speed, callback){
		return this.animate({height: "toggle"}, speed, callback);
	},
	
	fadeIn: function(speed, callback){
		return this.animate({opacity: "show"}, speed, callback);
	},
	
	fadeOut: function(speed, callback){
		return this.animate({opacity: "hide"}, speed, callback);
	},
	
	fadeTo: function(speed,to,callback){
		return this.animate({opacity: to}, speed, callback);
	},
	
	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		return this[ optall.queue === false ? "each" : "queue" ](function(){
			if ( this.nodeType != 1)
				return false;

			var opt = jQuery.extend({}, optall);
			var hidden = jQuery(this).is(":hidden"), self = this;
			
			for ( var p in prop ) {
				if ( prop[p] == "hide" && hidden || prop[p] == "show" && !hidden )
					return jQuery.isFunction(opt.complete) && opt.complete.apply(this);

				if ( p == "height" || p == "width" ) {
					// Store display property
					opt.display = jQuery.css(this, "display");

					// Make sure that nothing sneaks out
					opt.overflow = this.style.overflow;
				}
			}

			if ( opt.overflow != null )
				this.style.overflow = "hidden";

			opt.curAnim = jQuery.extend({}, prop);
			
			jQuery.each( prop, function(name, val){
				var e = new jQuery.fx( self, opt, name );

				if ( /toggle|show|hide/.test(val) )
					e[ val == "toggle" ? hidden ? "show" : "hide" : val ]( prop );
				else {
					var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat(parts[2]),
							unit = parts[3] || "px";

						// We need to compute starting value
						if ( unit != "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] )
							end = ((parts[1] == "-=" ? -1 : 1) * end) + start;

						e.custom( start, end, unit );
					} else
						e.custom( start, val, "" );
				}
			});

			// For JS strict compliance
			return true;
		});
	},
	
	queue: function(type, fn){
		if ( jQuery.isFunction(type) || ( type && type.constructor == Array )) {
			fn = type;
			type = "fx";
		}

		if ( !type || (typeof type == "string" && !fn) )
			return queue( this[0], type );

		return this.each(function(){
			if ( fn.constructor == Array )
				queue(this, type, fn);
			else {
				queue(this, type).push( fn );
			
				if ( queue(this, type).length == 1 )
					fn.apply(this);
			}
		});
	},

	stop: function(clearQueue, gotoEnd){
		var timers = jQuery.timers;

		if (clearQueue)
			this.queue([]);

		this.each(function(){
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- )
				if ( timers[i].elem == this ) {
					if (gotoEnd)
						// force the next step to be the last
						timers[i](true);
					timers.splice(i, 1);
				}
		});

		// start the next in the queue if the last step wasn't forced
		if (!gotoEnd)
			this.dequeue();

		return this;
	}

});

var queue = function( elem, type, array ) {
	if ( !elem )
		return undefined;

	type = type || "fx";

	var q = jQuery.data( elem, type + "queue" );

	if ( !q || array )
		q = jQuery.data( elem, type + "queue", 
			array ? jQuery.makeArray(array) : [] );

	return q;
};

jQuery.fn.dequeue = function(type){
	type = type || "fx";

	return this.each(function(){
		var q = queue(this, type);

		q.shift();

		if ( q.length )
			q[0].apply( this );
	});
};

jQuery.extend({
	
	speed: function(speed, easing, fn) {
		var opt = speed && speed.constructor == Object ? speed : {
			complete: fn || !fn && easing || 
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && easing.constructor != Function && easing
		};

		opt.duration = (opt.duration && opt.duration.constructor == Number ? 
			opt.duration : 
			{ slow: 600, fast: 200 }[opt.duration]) || 400;
	
		// Queueing
		opt.old = opt.complete;
		opt.complete = function(){
			if ( opt.queue !== false )
				jQuery(this).dequeue();
			if ( jQuery.isFunction( opt.old ) )
				opt.old.apply( this );
		};
	
		return opt;
	},
	
	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},
	
	timers: [],
	timerId: null,

	fx: function( elem, options, prop ){
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig )
			options.orig = {};
	}

});

jQuery.fx.prototype = {

	// Simple function for setting a style value
	update: function(){
		if ( this.options.step )
			this.options.step.apply( this.elem, [ this.now, this ] );

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		// Set display property to block for height/width animations
		if ( this.prop == "height" || this.prop == "width" )
			this.elem.style.display = "block";
	},

	// Get the current size
	cur: function(force){
		if ( this.elem[this.prop] != null && this.elem.style[this.prop] == null )
			return this.elem[ this.prop ];

		var r = parseFloat(jQuery.css(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
	},

	// Start an animation from one number to another
	custom: function(from, to, unit){
		this.startTime = (new Date()).getTime();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;
		this.update();

		var self = this;
		function t(gotoEnd){
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		jQuery.timers.push(t);

		if ( jQuery.timerId == null ) {
			jQuery.timerId = setInterval(function(){
				var timers = jQuery.timers;
				
				for ( var i = 0; i < timers.length; i++ )
					if ( !timers[i]() )
						timers.splice(i--, 1);

				if ( !timers.length ) {
					clearInterval( jQuery.timerId );
					jQuery.timerId = null;
				}
			}, 13);
		}
	},

	// Simple 'show' function
	show: function(){
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.show = true;

		// Begin the animation
		this.custom(0, this.cur());

		// Make sure that we start at a small width/height to avoid any
		// flash of content
		if ( this.prop == "width" || this.prop == "height" )
			this.elem.style[this.prop] = "1px";
		
		// Start by showing the element
		jQuery(this.elem).show();
	},

	// Simple 'hide' function
	hide: function(){
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function(gotoEnd){
		var t = (new Date()).getTime();

		if ( gotoEnd || t > this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			var done = true;
			for ( var i in this.options.curAnim )
				if ( this.options.curAnim[i] !== true )
					done = false;

			if ( done ) {
				if ( this.options.display != null ) {
					// Reset the overflow
					this.elem.style.overflow = this.options.overflow;
				
					// Reset the display
					this.elem.style.display = this.options.display;
					if ( jQuery.css(this.elem, "display") == "none" )
						this.elem.style.display = "block";
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide )
					this.elem.style.display = "none";

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show )
					for ( var p in this.options.curAnim )
						jQuery.attr(this.elem.style, p, this.options.orig[p]);
			}

			// If a callback was provided, execute it
			if ( done && jQuery.isFunction( this.options.complete ) )
				// Execute the complete function
				this.options.complete.apply( this.elem );

			return false;
		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}

};

jQuery.fx.step = {
	scrollLeft: function(fx){
		fx.elem.scrollLeft = fx.now;
	},

	scrollTop: function(fx){
		fx.elem.scrollTop = fx.now;
	},

	opacity: function(fx){
		jQuery.attr(fx.elem.style, "opacity", fx.now);
	},

	_default: function(fx){
		fx.elem.style[ fx.prop ] = fx.now + fx.unit;
	}
};
// The Offset Method
// Originally By Brandon Aaron, part of the Dimension Plugin
// http://jquery.com/plugins/project/dimensions
jQuery.fn.offset = function() {
	var left = 0, top = 0, elem = this[0], results;
	
	if ( elem ) with ( jQuery.browser ) {
		var parent       = elem.parentNode, 
		    offsetChild  = elem,
		    offsetParent = elem.offsetParent, 
		    doc          = elem.ownerDocument,
		    safari2      = safari && parseInt(version) < 522 && !/adobeair/i.test(userAgent),
		    fixed        = jQuery.css(elem, "position") == "fixed";
	
		// Use getBoundingClientRect if available
		if ( elem.getBoundingClientRect ) {
			var box = elem.getBoundingClientRect();
		
			// Add the document scroll offsets
			add(box.left + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
				box.top  + Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop));
		
			// IE adds the HTML element's border, by default it is medium which is 2px
			// IE 6 and 7 quirks mode the border width is overwritable by the following css html { border: 0; }
			// IE 7 standards mode, the border is always 2px
			// This border/offset is typically represented by the clientLeft and clientTop properties
			// However, in IE6 and 7 quirks mode the clientLeft and clientTop properties are not updated when overwriting it via CSS
			// Therefore this method will be off by 2px in IE while in quirksmode
			add( -doc.documentElement.clientLeft, -doc.documentElement.clientTop );
	
		// Otherwise loop through the offsetParents and parentNodes
		} else {
		
			// Initial element offsets
			add( elem.offsetLeft, elem.offsetTop );
			
			// Get parent offsets
			while ( offsetParent ) {
				// Add offsetParent offsets
				add( offsetParent.offsetLeft, offsetParent.offsetTop );
			
				// Mozilla and Safari > 2 does not include the border on offset parents
				// However Mozilla adds the border for table or table cells
				if ( mozilla && !/^t(able|d|h)$/i.test(offsetParent.tagName) || safari && !safari2 )
					border( offsetParent );
					
				// Add the document scroll offsets if position is fixed on any offsetParent
				if ( !fixed && jQuery.css(offsetParent, "position") == "fixed" )
					fixed = true;
			
				// Set offsetChild to previous offsetParent unless it is the body element
				offsetChild  = /^body$/i.test(offsetParent.tagName) ? offsetChild : offsetParent;
				// Get next offsetParent
				offsetParent = offsetParent.offsetParent;
			}
		
			// Get parent scroll offsets
			while ( parent && parent.tagName && !/^body|html$/i.test(parent.tagName) ) {
				// Remove parent scroll UNLESS that parent is inline or a table to work around Opera inline/table scrollLeft/Top bug
				if ( !/^inline|table.*$/i.test(jQuery.css(parent, "display")) )
					// Subtract parent scroll offsets
					add( -parent.scrollLeft, -parent.scrollTop );
			
				// Mozilla does not add the border for a parent that has overflow != visible
				if ( mozilla && jQuery.css(parent, "overflow") != "visible" )
					border( parent );
			
				// Get next parent
				parent = parent.parentNode;
			}
		
			// Safari <= 2 doubles body offsets with a fixed position element/offsetParent or absolutely positioned offsetChild
			// Mozilla doubles body offsets with a non-absolutely positioned offsetChild
			if ( (safari2 && (fixed || jQuery.css(offsetChild, "position") == "absolute")) || 
				(mozilla && jQuery.css(offsetChild, "position") != "absolute") )
					add( -doc.body.offsetLeft, -doc.body.offsetTop );
			
			// Add the document scroll offsets if position is fixed
			if ( fixed )
				add(Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
					Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop));
		}

		// Return an object with top and left properties
		results = { top: top, left: left };
	}

	function border(elem) {
		add( jQuery.curCSS(elem, "borderLeftWidth", true), jQuery.curCSS(elem, "borderTopWidth", true) );
	}

	function add(l, t) {
		left += parseInt(l) || 0;
		top += parseInt(t) || 0;
	}

	return results;
};
})();
/* Copyright (c) 2007 Paul Bakaus (paul.bakaus@googlemail.com) and Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate$
 * $Rev$
 *
 * Version: @VERSION
 *
 * Requires: jQuery 1.2+
 */

(function($){
	
$.dimensions = {
	version: '@VERSION'
};

// Create innerHeight, innerWidth, outerHeight and outerWidth methods
$.each( [ 'Height', 'Width' ], function(i, name){
	
	// innerHeight and innerWidth
	$.fn[ 'inner' + name ] = function() {
		if (!this[0]) return;
		
		var torl = name == 'Height' ? 'Top'    : 'Left',  // top or left
		    borr = name == 'Height' ? 'Bottom' : 'Right'; // bottom or right
		
		return num( this, name.toLowerCase() ) + num(this, 'padding' + torl) + num(this, 'padding' + borr);
	};
	
	// outerHeight and outerWidth
	$.fn[ 'outer' + name ] = function(options) {
		if (!this[0]) return;
		
		var torl = name == 'Height' ? 'Top'    : 'Left',  // top or left
		    borr = name == 'Height' ? 'Bottom' : 'Right'; // bottom or right
		
		options = $.extend({ margin: false }, options || {});
		
		return num( this, name.toLowerCase() )
				+ num(this, 'border' + torl + 'Width') + num(this, 'border' + borr + 'Width')
				+ num(this, 'padding' + torl) + num(this, 'padding' + borr)
				+ (options.margin ? (num(this, 'margin' + torl) + num(this, 'margin' + borr)) : 0);
	};
});

// Create scrollLeft and scrollTop methods
$.each( ['Left', 'Top'], function(i, name) {
	$.fn[ 'scroll' + name ] = function(val) {
		if (!this[0]) return;
		
		return val != undefined ?
		
			// Set the scroll offset
			this.each(function() {
				this == window || this == document ?
					window.scrollTo( 
						name == 'Left' ? val : $(window)[ 'scrollLeft' ](),
						name == 'Top'  ? val : $(window)[ 'scrollTop'  ]()
					) :
					this[ 'scroll' + name ] = val;
			}) :
			
			// Return the scroll offset
			this[0] == window || this[0] == document ?
				self[ (name == 'Left' ? 'pageXOffset' : 'pageYOffset') ] ||
					$.boxModel && document.documentElement[ 'scroll' + name ] ||
					document.body[ 'scroll' + name ] :
				this[0][ 'scroll' + name ];
	};
});

$.fn.extend({
	position: function() {
		var left = 0, top = 0, elem = this[0], offset, parentOffset, offsetParent, results;
		
		if (elem) {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();
			
			// Get correct offsets
			offset       = this.offset();
			parentOffset = offsetParent.offset();
			
			// Subtract element margins
			offset.top  -= num(elem, 'marginTop');
			offset.left -= num(elem, 'marginLeft');
			
			// Add offsetParent borders
			parentOffset.top  += num(offsetParent, 'borderTopWidth');
			parentOffset.left += num(offsetParent, 'borderLeftWidth');
			
			// Subtract the two offsets
			results = {
				top:  offset.top  - parentOffset.top,
				left: offset.left - parentOffset.left
			};
		}
		
		return results;
	},
	
	offsetParent: function() {
		var offsetParent = this[0].offsetParent;
		while ( offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && $.css(offsetParent, 'position') == 'static') )
			offsetParent = offsetParent.offsetParent;
		return $(offsetParent);
	}
});

function num(el, prop) {
	return parseInt($.css(el.jquery?el[0]:el,prop))||0;
};

})(jQuery);// JavaScript for ISControls
// Author: Arno Schatz

document.write('<script type="text/javascript" src="./guicontrol/jsconsole.js"></script>');
document.write("<div id='constructionZone' style='display: none;'></div>");

jQuery.noConflict();
var $j = jQuery;
/*
 loads a external js-lib
 @parameter s - path to the external lib
*/

function loadJS(s) {
  var sElem = document.createElement('script');
  sElem.type = 'text/javascript';
  sElem.src = s;
  document.getElementsByTagName('head')[0].appendChild(sElem);
}

var bussy = false;
var queue = new Array(); 
var callStart;

dwr.engine.setAsync(true);
//dwr.engine.setRpcType( dwr.engine.IFrame );
dwr.engine.setErrorHandler( errorhandler );
// if the response is a text, the session is expired
dwr.engine.setTextHtmlHandler( timeouthandler );

// Events ------------------------------
function fireEuHEvent(source, eventName) {

	if( bussy ){
		queue.push(source);
		queue.push(eventName);
	    var chg = calculateContextChanges();
		queue.push(chg);
	}
	else{
	    bussy = true;

		callStart = new Date().getTime();
		//DWREngine.setMethod(DWREngine.IFrame);
	    var chg = calculateContextChanges();
		DWRCaller.event(source, eventName, chg, fireEuHEventBack);
	}
}
function processeQueue() {
	if( queue.length>1 ){
		// check if the last call cleaned up the iframe before doing new call
		if(  document.getElementById('dwr-if-0') ){
			console.debug( "iframe exists" );
			window.setTimeout( "processeQueue()",50 ); 
			return;
		}
		var source = queue.shift();
		var eventName = queue.shift();
	    var chg = queue.shift();
		
		callStart = new Date().getTime();
		DWRCaller.event(source, eventName, chg, fireEuHEventBack);
	}
	else
    	bussy = false;
}

function fireEuHEventBack(retContext) {
// measure time for applying the context
	var msstart = new Date().getTime();
	// disable loadIndicator if we are usng it
	disableLoadImage();
    applyContext(retContext);
    var elContext = (new Date().getTime()) - msstart;
    var callTime = msstart - callStart;
    toServer('Time for applying the context: ', elContext);
    toServer('Time for the call: ', callTime + ' ms.');
    processeQueue();
}

/** OLD CODE ** ( before dwr 2.0 iframe bugfix )
function fireEuHEvent(source, eventName) {
	callStart = new Date().getTime();
	DWREngine.setMethod(DWREngine.IFrame);
    var chg = calculateContextChanges();
	DWRCaller.event(source, eventName, chg, fireEuHEventBack);
}

function fireEuHEventBack(retContext) {
// measure time for applying the context
	var msstart = new Date().getTime();
	// disable loadIndicator if we are usng it
	disableLoadImage();
    applyContext(retContext);
    var elContext = (new Date().getTime()) - msstart;
    var callTime = msstart - callStart;
    toServer('Time for applying the context: ', elContext);
    toServer('Time for the call: ', callTime + ' ms.');
}
*/

function toServer(who,what) {
	var ce = new Object();
	ce.cssId = who;
	ce.value = what;
	ce.type = "timing";
	ce.status = "s";
	changes2server[changes2server.length] = ce;
}
/**
* eventParam put an array of string into the context
* using a special key, so they can be retrieved on serverside 
* as parameters of the event.
* see Event.java
*/
function eventParam(id, params) {
    if ( params ) {
	    for (var i in params) {
	    	var conId = id + ".ev.p" + i;
	    	var p = new Object();
	    	p.cssId = conId;
	    	p.value = params[i];
	    	p.type = "val";
	    	p.status = "s"; //dont send back
	    	changes2server[changes2server.length] = p;
	    }
    } 
}
// the client side context
var context = new Array();
// context additions to be send to the server
var changes2server = new Array();

function selectTab(strip, varray) {
//	console.time("selectTab Time");
	stripid = toLastDot(strip);
	sdot = 	stripid+".";
	// 0 = index of selected tab
	// 1 = status of selected tab
	// 2 = index of old active tab
	// 3 = status of old active tab
	// 4 = type of tabstrip; (n = notops, v = vertical, h = horizontal)
	var values = eval(varray);
	//first handle old selection
	if (values[2]!=-1) {
		if (values[4]=="h") {
			byId(sdot+"lab"+values[2]).className = "euhTabUnselected";
			switch (values[3]) {
				case "first":
					byId(sdot+"tri"+values[2]).className = "euhTabFirstUnselected";
					i = 1;
					while (true) {
						elem = byId(sdot+"tri"+(Number(values[2])+i));
						if (elem==null) {
							visiel.className = "euhTabLastUnselected";
							break;		
						}					
						visiel = elem;
					 	if (visiel.style.display!="none") {
 							visiel.className = "euhTabBetweenUnselected";
					 		break;
					 	}
					 	i++;
					}
					break;
				case "last":
					byId(sdot+"tri"+(values[2])).className = "euhTabBetweenUnselected";
					byId(sdot+"last").className = "euhTabLastUnselected";
 					break;
				case "only":
					byId(sdot+"tri"+(values[0])).className = "euhTabFirstUnselected";
					byId(sdot+"last").className = "euhTabLastUnselected";
					break;	
				default:
					byId(sdot+"tri"+(values[2])).className = "euhTabBetweenUnselected";
					
					i = 1;
					while (true) {
						elem = byId(sdot+"tri"+(Number(values[2])+i));
						if (elem==null) {
							visiel.className = "euhTabLastUnselected";
							break;		
						}					
						visiel = elem;
					 	if (visiel.style.display!="none") {
 							visiel.className = "euhTabBetweenUnselected";
					 		break;
					 	}
					 	i++;
					}
					break;
			}
		}
		//hide inactive tabpane
		if (byId(sdot + "pane"+values[2])) {
			show(byId(sdot + "pane"+values[2]), false);
		}
	}
		if (values[4]=="h") {
			byId(sdot+"lab"+values[0]).className = "euhTabSelected";
			switch (values[1]) {
				case "first":
					byId(sdot+"tri"+values[0]).className = "euhTabFirstSelected";
										i = 1;
					while (true) {
						elem = byId(sdot+"tri"+(Number(values[0])+i));
						if (elem==null) {
							visiel.className = "euhTabLastSelected";
							break;		
						}					
						visiel = elem;
					 	if (visiel.style.display!="none") {
 							visiel.className = "euhTabRightOfSelected";
					 		break;
					 	}
					 	i++;
					}
					break;
				case "last":
					byId(sdot+"tri"+(values[0])).className = "euhTabLeftOfSelected";
					byId(sdot+"last").className = "euhTabLastSelected";
					break;
				case "only":
					byId(sdot+"tri"+(values[0])).className = "euhTabFirstSelected";
					byId(sdot+"last").className = "euhTabLastSelected";
					break;
				default:
					byId(sdot+"tri"+(values[0])).className = "euhTabLeftOfSelected";
					i = 1;
					while (true) {
						elem = byId(sdot+"tri"+(Number(values[0])+i));
						if (elem==null) {
							visiel.className = "euhTabLastSelected";
							break;		
						}					
						visiel = elem;
					 	if (visiel.style.display!="none") {
 							visiel.className = "euhTabRightOfSelected";
					 		break;
					 	}
					 	i++;
					}
					break;
			}	
		}
		//show active tab
		show(byId(sdot + "pane"+values[0]), true);
//		console.timeEnd("selectTab Time");
}

var tri; // holds the pictures of the triangles
function redrawTabStrip(strip, tabno) {
	// lets see if the triangle array is constructed already
	if (tri==null) {
		tri = new Array();
		// bit array:
		// (leftmargin * 1, selected * 2, leftselected * 4)
		tri[1] = "euhTabFirstUnselected";
		tri[2] = "euhTabLeftOfSelected";
		tri[4] = "euhTabRightOfSelected";
		tri[0] = "euhTabBetweenUnselected";
		tri[3] = "euhTabFirstSelected";
	}
	var sdot = strip + ".";
	// go through tab and set the delimiter, strip and the content panes
	var i=0;
	var bSel; // this item selected?
	while (true) { // will break if expected element not found
		// show content
		var contentPane = byId(sdot + "pane"+i);
		if (contentPane==null) break; // end of tabstrib reached
		bSel = (i == tabno);
		show(contentPane, bSel);
		// tabstrip settings
		var theTri = byId(sdot+"tri"+i);
		if (theTri!=null) { // tabstrip present
			// calc boolean
			var first = (i==0);
			var left = (i-1 == tabno);
			triClass = tri[(first ? 1:0) + (bSel? 2: 0) + (left? 4 : 0)];
			theTri.className = triClass;
			// selection of the label
			if( "euhTabDisabled" != byIdReq(sdot + "lab"+i).className )	
				byIdReq(sdot + "lab"+i).className = bSel ? "euhTabSelected" : "euhTabUnselected";
		}
		i++;
	}
	// now what about the last thingi in the strip
	var last = byId(sdot+"last");
	if (last!=null) {
		last.className = (bSel ? "euhTabLastSelected" : "euhTabLastUnselected");
	}
}

/* returns which tabumber is selected
*/
function whichTab(strip) {
	// find the first visible pane
	var i=0;
	do { // break if no further pane found
		var thePane = byId(strip+".pane"+ i);
		if (thePane==null) {
			// error we should have found a visible element before
			alert("Error. no visible element in Tab found "+strip); 
			break;
		}
		if (isShown(thePane)) {
			break;
		}
		i++;
	} while (true);
	return i;
}

// this calculates the change in the context and returns the 
// change as array in the return parameter
// the context variable is changed as well.
function calculateContextChanges() {
	var chgContext = new Array();
	chgContext = chgContext.concat(changes2server);
	changes2server = new Array();
	// now add the changes you find in the dom
	for (var j in context) {
		var ce = context[j];
		if (ce.type == "tse") { // selection of tree
			var treeName = toLastDot(ce.cssId);
			var nodeId = euhTrees[ treeName ].getSelectedItemId();
			if (nodeId != ce.value) { // actually changed?
				ce.value = nodeId;
			    chgContext[chgContext.length]=ce;
			}
		}
		if (ce.type == "cbv") { // transfer the value of the combobox to server
			if (ce.value != getCombo(toLastDot(ce.cssId))) {
				ce.value = getCombo(toLastDot(ce.cssId)); // selection has changed
			    chgContext[chgContext.length]=ce;
			}
		}
		if (ce.type == "trv") { // transfer the checked nodes of a tree to server
			var checkedTreeNodes = getTreeCheckedNodes(toLastDot(ce.cssId));
			if ( ce.value != checkedTreeNodes ) {
				ce.value = checkedTreeNodes; // selection has changed
			    chgContext[chgContext.length]=ce;
			}
		}
		// here begin the type which work on dom elements directly ------------------------
		domElem = byId(ce.cssId);
		if (!domElem) continue;
		if(ce.type=="val") {
			if (ce.value != domElem.value) {
			   // change detected!
			   ce.value = domElem.value;
			   chgContext[chgContext.length]=ce;
			   //chgContext[chgContext.length]=new ContextElement(ce.cssId,ce.value.ce.type,ce.status);
			}
		}
		if (ce.type == "sel") {
			// context eleent may need type conversion
			if (typeof(ce.value)=="string") {
				ce.value = (ce.value=="true");
			}
			if (ce.value != domElem.checked) {
				ce.value = domElem.checked; // selection has changed
			    chgContext[chgContext.length]=ce;
			}
		}
		if (ce.type == "tab") { // get the selected tab number of the tabstrip
			var tabno = whichTab(ce.cssId);
			if (ce.value != tabno) {
				ce.value = tabno; 
			    chgContext[chgContext.length]=ce;
			}
		}
	}
	return chgContext;
}
/*
This applies the context returned from the request on the DOM Tree.
*/
var aktContext ;
function applyContext(con) {
	for (var j in con) {
		aktContext = con[j];
		
//		console.time(aktContext.type);
		switch(aktContext.type) {
			case "val":
				byIdReq(aktContext.cssId).value = aktContext.value;
				break;
			case "txt":
				var theNode = byIdReq(aktContext.cssId);
				var fisrtChild = theNode.firstChild;
				if ((fisrtChild) && (fisrtChild.data)) {
					fisrtChild.data = aktContext.value;
				} else {
					theNode.insertBefore(document.createTextNode(aktContext.value), fisrtChild);
				}
				break;
			case "nop": // no operation
				break;
			case "alr": // show alert box
				alert(aktContext.value);
				break;
			case "lgh": // highlite in table
				highlite(byId(aktContext.value),aktContext.cssId);
				break;
			case "cop":
				clearOption(toLastDot(aktContext.cssId), aktContext.value);
				break;
			case "sel":
				byIdReq(aktContext.cssId).checked = (aktContext.value=="true");
				break;
			case "ro":
			case "rw": // make read-only / writable
				statusChange(aktContext.value, (aktContext.type=="ro")); // multiple elements comma seperated
				break;
			case "vis":// set the visibility of an element
				show(byIdReq(toLastDot(aktContext.cssId)), "true"==aktContext.value);
				break;
			case "tab": // select a tab
				selectTab(aktContext.cssId, aktContext.value);
				break;
			case "trd": // redraw a tabstrip
				redrawTabStrip(aktContext.cssId, aktContext.value);
				break;
			case "ttv":// set the visibility of an tab element
				show(byIdReq(aktContext.cssId), "true"==aktContext.value);
				break;
			case "htm":// insert HTML into a elements
				innerHTML2DOM(byIdReq(aktContext.cssId), aktContext.value);
				break;
			case "out":// reconstruct a node with this (outer) html
			    try {
			         outerHTML2DOM(byIdReq(toLastDot(aktContext.cssId)), aktContext.value);
			    }
			    catch(e) {
			    }
				break;
				
			case "att": // set an attribute of an element
				putAttribute(byIdReq(toLastDot(aktContext.cssId)), fromLastDot(aktContext.cssId), aktContext.value)
				break;
			case "tin":
				eval( "var val= " + aktContext.value);
				initTree( aktContext.cssId, val );
				break;
			case "tre": // construct a tree
				loadTree( aktContext.cssId, aktContext.value );
				break;
			case "tll": // tree lazy loading
				loadBranch( aktContext.cssId, aktContext.value );
				break;
			case "tse":// tree select: select a node inside the tree
				selNodeFromTree(toLastDot(aktContext.cssId), aktContext.value);
				break;
			case "tne":// tree node expand. expand node inside the tree
				expandNodeFromTree(toLastDot(aktContext.cssId), aktContext.value);			
				break;
			case "tnu":// tree node expand. expand node inside the tree
				treeNodeUpdate( aktContext.cssId, aktContext.value);			
				break;
			case "url":// reload window with new url
				gotoUrl(aktContext.value);
				break;
			case "foc":// put focus on selected element
				byIdReq(toLastDot(aktContext.cssId)).focus();
				break;
			case "rpl":// repicate a DOM node n-times
				replicate(byIdReq(aktContext.cssId), aktContext.value);
				break;
			case "rem":// remove a DOM node 
				remove(byIdReq(aktContext.cssId));
				break;
			case "cbx":// load a combobox with optionslist
				loadCombo(toLastDot(aktContext.cssId), aktContext.value);
				break;
			case "cbi":// load a combobox with optionslist
				initCombo(aktContext.cssId, aktContext.value);
				break;
			case "cbv":// set the value of the combobox
				setCombo(toLastDot(aktContext.cssId), aktContext.value);
				break;
			case "cad": // class add
				classAdd(byIdReq(aktContext.cssId), aktContext.value);
				break;
			case "crm":// class remove
				classRemove(byIdReq(aktContext.cssId), aktContext.value);
				break;
			case "cex"://class set if exists
				setClass(byIdReq(toLastDot(aktContext.cssId)), 
					fromLastDot(aktContext.cssId), aktContext.value=="true"); 
				break;
			case "js":// evaluate Java script directly
//				console.time("applyjs Time");
				eval( aktContext.value );
//				console.timeEnd("applyjs Time");
//				console.debug('value ' + aktContext.value);
				break;
			case "ci":// clone and insert a node
				cloneInsert( byIdReq(aktContext.cssId), byIdReq(toLastDot(aktContext.value)), fromLastDot(aktContext.value) );
				break;
			case "ca":// clone and add a node, cssId: node to be cloned, value: <parentNode>.<suffix to be appended to Ids in new node>
				cloneAdd( byIdReq(aktContext.cssId), byIdReq(toLastDot(aktContext.value)), fromLastDot(aktContext.value) );
				break;
			case "tts":// take html snapshot (store dom node in variable)
				taksSnapshot( aktContext.cssId, byIdReq(toLastDot(aktContext.cssId)) );
				break;
			case "trs":// restore snapshot previously taken
				restoreSnapshot( aktContext.cssId, byIdReq(toLastDot(aktContext.cssId)), aktContext.value=="true");
				break;
			case "cs": // create sibling(s) from html string
				loadSibling( byIdReq( aktContext.cssId ), aktContext.value );
				break;
			case "tba": // scrolltable add row
				if( !addRows )
					alert("missing eh_scrollbar.js");
				addRows( toLastDot(aktContext.cssId), aktContext.value );
				break;
			case "tbr": // scrolltable remove row
				if( !addRows )
					alert("missing eh_scrollbar.js");
				removeRows( toLastDot(aktContext.cssId), aktContext.value );
				break;
			case "tbc": // scrolltable clear cache
				if( !addRows )
					alert("missing eh_scrollbar.js");
				clearCache( toLastDot(aktContext.cssId) );
				break;
            case "fui": // file upload info
                var val =  eval(aktContext.value);
                updateUploadProgress( val, toLastDot(aktContext.cssId) );
                break;
            case "ext": // external event
                eval("var val= " + aktContext.value);
                callFrame( val.frame, val.parameter );
                break;
            case "ala": // add to node as last child
            	addAsChild( aktContext.cssId, aktContext.value );
                break;
            case "afi": // add to node as first child
            	insertAsChild( aktContext.cssId, aktContext.value );
                break;
            case "rep": // replace node
            	replaceNode( aktContext.cssId, aktContext.value );
                break;
            case "scr": // reload scrollbar
            	resizeDrag( aktContext.cssId, aktContext.value  );
            	break;
		}
		if (aktContext.status=="e") {
			putContext(aktContext);
		}
//		console.timeEnd(aktContext.type)
	}
	
}


function trim(mystring) {
    mystring = String(mystring);
	if (mystring.substring(0,1)==" "){ // dann f?hrende Leerzeichen entfernen
		  mystring=mystring.substring(1,mystring.length);
	};
	if (mystring.substring(mystring.length-1,mystring.length)==" "){ // u. Leerzeichen am Ende
		  mystring=mystring.substring(0,mystring.length-1);
	};
	return mystring;
}
/*
manage the visibility of an dom-element elem. vis is boolean
*/
function show(elem, vis) {
	elem.style.display = vis ? "" : "none";
	// well would be nice, if it where that simple
	// but M$ is  everywhere
	// workaround for bug in IE6, dropdown show through
	//var visDis = vis ? "" : "none";
	//showSelect(elem, visDis);
}
function isShown(elem) {
	return !elem.style.display || elem.style.display == "";
}
function showSelect(elem, visDis) {
	// search all children
	for (chind in elem.childNodes) {
		var child = elem.childNodes[chind]; // i love js
		if (child.tagName == "SELECT" && visDis == "") {
			child.style.display = visDis;
		}
		if (child.style && !child.style.display) {
			showSelect(child, visDis);
		}
	}
}

function statusChange(sc, ro) {
	if (sc=="") return; // nothing to do
	var ids = sc.split(",");
	for (var i=0;i<ids.length;i++) {
		var elem = byIdReq(ids[i]);
		if (elem.tagName=="SELECT" || elem.type=="radio"
			 ||  elem.type=="checkbox" ) {
			elem.disabled = ro;
		}

		if ((elem.tagName=="INPUT" && (elem.type=="text" || elem.type=="password")) 
					|| elem.tagName=="TEXTAREA"
					) {
			elem.readOnly = ro;
			if (ro) {
				classAdd(elem, "euhReadonly");
			} else {
				classRemove(elem, "euhReadonly");
			}
		}
		if (elem.tagName=="DIV") { //its a select
			var jsname = ids[i] + ".cb";
			eval(jsname+".readonly = " + ro);
			setClass(byIdReq(jsname+"txt"), "euhReadonly", ro);
			setClass(byIdReq(jsname+"button"), "combo-buttonro", ro);
		}
	}
}

function classAdd(elem, className) {
	var strCurrentClass = elem.className;
	if(!new RegExp(className, "i").test(strCurrentClass)){
		elem.className = strCurrentClass + ((strCurrentClass.length > 0)? " " : "") + className;
	}
}

function classRemove(elem, className) {
	var oClassToRemove = new RegExp((className + "\s?"), "i");
	elem.className = elem.className.replace(oClassToRemove, "").replace(/^\s?|\s?$/g, "");
}


function toggleVisi(elemid){
    var elem = byId(elemid);
    var vis = (elem.style.display == 'none') ? 'block' : 'none';
    elem.style.display = vis;
    return vis;        
}

/*
finds the last dot of a string and return the left string from the dot position
*/
function toLastDot(text) {
	if ((typeof text)== "string")
		return text.substring(0, text.lastIndexOf("."));
	else {
		alert("expected string "+text+ " is of type "+(typeof text));
		return "";
	}
}

function fromLastDot(text) {
	if ((typeof text)== "string")
		return text.substring(text.lastIndexOf(".")+1);
	else {
		alert("expected string "+text+ " is of type "+(typeof text));
		return "";
	}
}


/*
remove all children von the node and create children
with empty value, firsttextchild. (will be filled later in context)
*/
function clearOption(nodeid, newnumber) { 
	var node = byIdReq(nodeid);
	while (node.hasChildNodes()) {
		node.removeChild(node.firstChild);
	}
	var opt;
	for (var i=0;i<newnumber;i++) {
		opt = document.createElement("OPTION");
		opt.appendChild(document.createTextNode(""));
		opt.id = nodeid + ".o" + i;
		node.appendChild(opt);
	}
	// determin visibility status... BUG IE6
	/*var upperNode = node;
	var visDis = ""; 
	while (upperNode != null && upperNode.parentNode != upperNode) {
		if (upperNode.style && upperNode.style.display == "none") {
			visDis = "none";
			break;
		}
		upperNode = upperNode.parentNode;
	}
	node.style.display = visDis;
	*/
}

function putContext(ce) {
// let figure out if there is an element already with that id
	for (j=0;j<context.length;j++) {
		if (ce.cssId === context[j].cssId) {
			break;
		}
	}
	context[j] = ce;
}

function byIdReq(id) {
	var elem = byId(id);
	if (elem==null) {
	    var xInfo;
	    if (aktContext) {
	    	try {
	    	   xInfo = " current context ["+aktContext.cssId+", " + aktContext.value +
	    	      ", " + aktContext.type + ", " + aktContext.status +"]";
	    	} catch (e) {
	    	}
	    }
		alert("could not find id="+id+xInfo );
	} else {
		return elem;
	}
}

var idcache = new Object();
function byId(id) {

	var ca = idcache[id];
	if (ca) {
		if (ca==="0") {
			return null; // placeholder fr negative search results
		} else {
			return ca;
		}
	}
	
	ca = window.document.getElementById(id);
	if (ca) {
		idcache[id] = ca;
	} else {
		idcache[id] = "0"; // constant for negative results
	}
	return ca;
}

function fillIdCache() {
	var bd = window.document.body;
	subNodeCache(bd.firstChild);
	if (bd.id) idcache[bd.id] = bd;
	
}

function subNodeCache(node) {
	var nc;
	var child = node;
	do  {
		if (child.nodeType==1) {
			if (child.id) idcache[child.id] = child;
			nc = child.firstChild;
			if (nc) 
				subNodeCache(nc);
		}
	} while (child = child.nextSibling);
}

/*
highlight any domelemnt by adding the css class highlite. It also removes the 
class highlite from the last element it has set highlite.
for multiple highligths you can pass the light as identifying string
*/
var highOldElem = new Array();
var highOldClass = new Array();
var map2Index = new Array();

function highlite(elem, light) {
	var lnr;
	// find index of existing or create
	for (lnr=0;lnr<map2Index.length;lnr++) {
		if (map2Index[lnr] == light) break;
	}
	map2Index[lnr] = light; // if doesnt exist
	
	if (highOldElem[lnr]) {
		highOldElem[lnr].className = highOldClass[lnr];
	}
	if (!elem) return;
	highOldElem[lnr] = elem;
	highOldClass[lnr] = elem.className;
	elem.className = elem.className + " euhHighlight";
}

/* check the input for an regexp.
constists of two steps:
1. keydown: remember the value (to restore)
2. keyup: check for regexp, restore if neccessary. 
must be caleed in short sequence
*/ 
var oldValue;
function enterCheck(elem) {
	oldValue = elem.value;
}
function exitCheck(elem, regex) {
	re = new RegExp(regex);
	if (elem.value.match(re)==null) {
		// restore
		elem.value = oldValue;
	}
}


/*
putAttribute is like setAttribute, but 'style'-aware
*/
function putAttribute(theNode, att, newValue) {
if (theNode==null) alert('putAttribute theNode is null.');
	if (att == 'style') {
		var styles = newValue.split(';');
		for (var i = 0; i < styles.length; ++i) {
			if (trim(styles[i])=="") continue;
			var tstyle = styles[i].split(':');
			theNode.style[trim(tstyle[0])] = trim(tstyle[1]);
		}
	} else if( att == 'class' ){
		theNode.className = newValue;
	} else {
		if (newValue == null) {
			theNode.removeAttribute( att );
		} else {
			theNode.setAttribute(att, newValue);
		}
	}
}


/*
jump to a new url in this window
*/
function gotoUrl(url) {
	window.location = url;
	
}

//################### TREE FUNCTIONS ##############################

var euhTrees = {};

function initTree( id, param ){ 
	var tree = tree = new dhtmlXTreeObject( id, param.width, param.height, id ); 
	tree.setImagePath( param.imagePath ); 
	//tree.setImagePath("./images/gui_control/tree/"); 
	if( param.dragDrop )
		tree.enableDragAndDrop(true);
	if( param.checkboxes )
		tree.enableCheckBoxes(1);
	if( param.checkEvent )
		tree.attachEvent("onCheck", onTreeNodeCheck );
	tree.attachEvent("onClick", onTreeNodeSelect );
	tree.attachEvent("onOpenStart", onTreeNodeOpen );
	tree.attachEvent("onDblClick", onTreeNodeOpen );
	tree.setIconSize("16px","19px");//set global icon size
	euhTrees[id] = tree;
}

/**
Contruct a tree and move it to the right position.
*/			
function loadTree( id, xml ){ 
	var tree = euhTrees[id];
	tree.deleteChildItems(id);
	tree.loadXMLString( xml );
}

function loadBranch( id, xml ){ 
	var nodeIdStart = xml.indexOf( "id=" );
	var nodeIdEnd = xml.indexOf( "\"", nodeIdStart + 4 );
	var nodeId = xml.substring( nodeIdStart+4, nodeIdEnd );
	var tree = euhTrees[id];
	tree.deleteChildItems(nodeId);
	tree.loadXMLString( xml );
}

function onTreeNodeSelect( nodeId ){
	var treeId = toLastDot(nodeId);
	var para = new Array();
	para[0] = nodeId;
	para[1] = "node_onclick";
	para[2] = "";
	para[3] = "";
	eventParam( toLastDot(nodeId), para );
	fireEuHEvent( toLastDot(nodeId), "node_onclick" );
	return true;
}
function onTreeNodeOpen( nodeId ){
	var treeId = toLastDot(nodeId);
	var openState = euhTrees[treeId].getOpenState( nodeId );
	if( openState == "-1" ){
		var isLoaded = euhTrees[treeId].getChildItemIdByIndex( nodeId, 0 ).indexOf("_temp");
		if( isLoaded > 0 ){
			var para = new Array();
			para[0] = nodeId;
			para[1] = "node_onclick";
			para[2] = "";
			para[3] = "";
			eventParam( toLastDot(nodeId), para );
			fireEuHEvent( toLastDot(nodeId), "node_onopen" );
		}
	}
	return true;
}

function onTreeNodeCheck( nodeId ){
	var treeId = toLastDot(nodeId);
	var para = new Array();
	para[0] = nodeId;
	para[1] = "node_checked";
	para[2] = "";
	para[3] = "";
	eventParam( toLastDot(nodeId), para );
	fireEuHEvent( toLastDot(nodeId), "node_checked" );
	return true;
}

function onTreeNodeMouseOver( nodeId ){
	var treeId = toLastDot(nodeId);
	var eventTypes = euhTrees[treeId].getUserData(nodeId,"eventTypes");
	if( eventTypes.indexOf("node_onmouseover") > -1 ){
		var para = new Array();
		para[0] = nodeId;
		para[1] = "node_onmouseover";
		para[2] = "";
		para[3] = "";
		eventParam( toLastDot(nodeId), para );
		fireEuHEvent( toLastDot(nodeId), "node_onmouseover" );
	}
	return true;
}
function onTreeNodeMouseOut( nodeId ){
	var treeId = toLastDot(nodeId);
	var eventTypes = euhTrees[treeId].getUserData(nodeId,"eventTypes");
	if( eventTypes.indexOf("node_onmouseout") > -1 ){
		var para = new Array();
		para[0] = nodeId;
		para[1] = "node_onmouseout";
		para[2] = "";
		para[3] = "";
		eventParam( toLastDot(nodeId), para );
		fireEuHEvent( toLastDot(nodeId), "node_onmouseout" );
	}
	return true;
}

/*
In the tree treeName, select the node with nodeId.
*/
function selNodeFromTree(id, nodeId) {
	euhTrees[id].selectItem( nodeId );
}

/*
* expand treeNode
* expandNode(index, noRedraw, select) 
* Expands node with the given index. 
* If "noRedraw" parameter is true then this call does not redraw the tree. 
* If "select" is true then node's index will be passed to "selectNode()" method.
*/
function expandNodeFromTree( id, nodeId) {
	euhTrees[id].openItem( nodeId );
}

/*
* update the node item text
*/
function treeNodeUpdate( nodeId, val ) {
	var treeId = toLastDot(nodeId);
	euhTrees[treeId].setItemText( nodeId, val );
}



/**
tree node event functions
*/
function sendTNEvent(node, type, treeId) {
	var para = new Array();
	para[0] = node.getId();
	para[1] = type;
	para[2] = node.level;
	para[3] = node.getMinorIndex();
	eventParam(treeId,para);
	fireEuHEvent(treeId, type);
}


function getTreeCheckedNodes( id ){
	return euhTrees[id].getAllChecked();
}

function initTreeDroppable( treeId, nodeId ){
	var objBel = jQuery( '#' + treeId + ' table[@objBelong]' );
	for(var i = 0;i<objBel.length;i++){
		if( objBel.get(i).objBelong.id == nodeId ){
			jQuery( objBel.get(i).childNodes[0].childNodes[0] ).droppable(
				{
					accept: 'tr',
					hoverClass: 'euhDroppableHover',
					drop: function(ev, ui) {
						eventParam( treeId, new Array( nodeId, ui.draggable.element.id ) );
						fireEuHEvent( treeId, "node_dropped" ) 
					}
				}); 
			break;
		} 
	}
}
function initTreeDraggable( treeId, nodeId ){
	var objBel = jQuery( '#' + treeId + ' table[@objBelong]' );
	for(var i = 0; i<objBel.length; i++ ){
		if( objBel.get(i).objBelong.id == nodeId ){
			jQuery( objBel.get(i).childNodes[0].childNodes[0] ).attr( 'id', nodeId );
			jQuery( objBel.get(i).childNodes[0].childNodes[0] ).draggable( {
					helper: function(ev, ui) {
						return jQuery('#dragObject').clone().attr( 'id', 'dragObject_clone' );
				    }, 
					cursor: 'move',
					cursorAt: {top:5, left:5},
					appendTo: 'body',
					zIndex: 20,
					start: function(ev, ui) {
						eventParam( treeId, new Array( this.id ) );
				    	fireEuHEvent( treeId, 'node_dragged' );
				    }
				} );
		} 
	}
}

//######################### END TREE #################################

/**
replicate -- an dom nde should be replicated n times,
and the ids withinthe replication get altered: the numer of the
iteration will be appended to each id.
*/
function replicate(node, times) {
	var father = node.parentNode;
	if (!father) alert('replicate error, node id: ' + node.id);
	var insertAt = node.nextSibling;
	for (var i=0;i<times;i++) {
		var cl = node.cloneNode(true);
	// durchgehen und ids anpassen
		appendId( cl, i );
		father.insertBefore( cl, insertAt );
	}
}

function appendId( node, num) {
	if (node.id) {
		idcache[node.id] = null; // delete cache
		node.id = node.id+num;
		idcache[node.id] = node; // fill cache with new val
	}
	for (var child=node.firstChild; child; child = child.nextSibling) {
		appendId( child, num );
	}
}

function remove(node) {
	if (!node || !node.parentNode) alert('remove failed, node: '+node);
	// go through tree and adjust idcache.
	removeIdFromCache(node);
	node.parentNode.removeChild(node);
}
/**
removing recursively the ids from the cache, node
can be delete afterwards
*/
function removeIdFromCache(node) {
	if (node.id) {
		idcache[node.id] = null;
	}
	for (var child=node.firstChild; child; child = child.nextSibling) {
		removeIdFromCache( child );
	}
	
}

/**
################### Combo Box #############################
*/

var euhCombos = {};
var isComboInit = false;
function initCombo( cbxId, cbxOptions ){
	cbxId = jQueryId(cbxId);
	eval( "var param = "+cbxOptions );
	$j("#"+ cbxId ).autocomplete( param.opt, 
		{ 
			minChars: 0, 
			max: param.opt.length, 
			autoFill: true, 
			mustMatch: true, 
			matchContains: false,
			formatItem: function(row, i, max) { return row.option; },
			formatResult: function(row) { return row.option; },
			
			highlight: function(value, term) {
				if( term != '' )
					return value.replace(new RegExp("(?!<[^<>]*)(" + term + ")(?![^<>]*>)", "gi"), "<strong>$1</strong>");
				else
					return value;
			}
		}
	);
	if( param.changeAction ){
		$j("#"+ cbxId ).result(
			function(event, data, formatted, skipEvent ) {
				$j("#"+ jQueryId(this.id) + "_hidden").val( data.value );
				if(!skipEvent){ fireEuHEvent( this.id, '0' ); }
			}
		);
	}
	else{
		$j("#"+ cbxId ).result(
			function(event, data, formatted, skipEvent ) {
				$j("#"+ jQueryId(this.id) + "_hidden").val( data.value );
			}
		);
	}
	$j("#" + cbxId + "\\.button" ).click(
		function() {
			closeAllCombo();
			if( $j(this)[0].src.indexOf('_ro')>0 ) return false;
			
			$j("#"+jQueryId( toLastDot(this.id) ) ).openSelect();
		}
	);
	euhCombos[ cbxId ] = $j("#"+ cbxId );	
	if( !isComboInit )
		initComboEventHandler(); // just once
}
function initComboEventHandler(){
	if (document.addEventListener) {
		document.addEventListener("mousedown", ComboBox_mouseDown, false );
	}
	else if (document.attachEvent) {
		document.attachEvent("onmousedown", function () { ComboBox_mouseDown(window.event); } );
	}
/*
	$j("document").bind("click", function(e){
	    var el;
	    el = e.target ? e.target : e.srcElement;
	    while ( el.nodeType && el.nodeType != 1) el = el.parentNode;
	    var elcl = el.className;
	    alert( el.nodeType );
	    if( elcl && elcl.indexOf("euhCombo")!=0  ){
			closeAllCombo();
	    }
	});
*/
	isComboInit = true;
}
function ComboBox_mouseDown(e){
	var el;
	el = e.target ? e.target : e.srcElement;
	while ( el.nodeType && el.nodeType != 1) el = el.parentNode;
	var elcl = el.className;
	console.debug( "Test" + elcl);
	if( !elcl || elcl.indexOf("euhCombo")!=0  ){
		console.debug( "close " + elcl);
		closeAllCombo();
	}
}
function closeAllCombo(){
	console.debug( "closeAllCombo()");
  	for (var comboId in euhCombos )
  		euhCombos[ comboId ].closeSelect();
}
function loadCombo(cbxName, cbxNewOptions) {
	var opt = eval( cbxNewOptions );
	$j("#"+jQueryId(cbxName) )
		// clear existing data
		.val("")
		.setOptions({data: opt, max: opt.length })
}
/**
setting the value of the comboboc means choosing one of the elements.
*/
function setCombo(cbxName, newval) {
	var combo = $j( "#"+jQueryId(cbxName) );
	combo.selectValue( newval );
}
function getCombo(cbxName) {
	var hidden = $j( "#"+jQueryId(cbxName)+"_hidden" );
	return hidden.val();
}
/**
################### End Combo Box #############################
*/

function cloneInsert(fromNode, insertNode, postfix) {
	var theClone = fromNode.cloneNode(true);
	appendId(theClone, postfix);
	insertNode.parentNode.insertBefore(theClone, insertNode);
}
function cloneAdd( fromNode, parentNode, postfix) {
	var theClone = fromNode.cloneNode(true);
	appendId(theClone, postfix);
	parentNode.appendChild(theClone);
}
/*
function to take a html snapshot. It makes a deep copy of the dom
node, so it can be restored later on.
*/
function taksSnapshot(snapkey, node) {
	snaps[snapkey] = node.cloneNode(true);
}
// associative array for snapshots
var snaps = new Array();
/*
restore a snapshot which was taken earlier
*/
function restoreSnapshot(snapkey, node, del) {
	var newNode = snaps[snapkey];
	if (!newNode) {
		alert('no client-snapshot found for '+snapkey);
		return;
	}
	var youngerBrother = node.nextSibling;
	var dady = node.parentNode;
	dady.removeChild( node );
	if (del==true) {
		// remove from the array
		snaps[snapkey] = null;
	} else {
		// work on copy to reuse the snapshot
		newNode = newNode.cloneNode(true);
	}
	// insert the new clone into the real DOM-tree
	if (youngerBrother==null) {
		dady.appendChild( newNode);
	} else {
		dady.insertBefore(newNode, youngerBrother);
	}
}

/**
* drag and drop canvas
**/

//Das Objekt, das gerade bewegt wird.
var dragobjekt = null;
// Position, an der das Objekt angeklickt wurde.
var dragx = 0;
var dragy = 0;
// Mausposition
var posx = 0;
var posy = 0;

function draginit() {
 // Initialisierung der �berwachung der Events
  document.onmousemove = drag;
  document.onmouseup = dragstop;
}

function dragstart(element) {
   //Wird aufgerufen, wenn ein Objekt bewegt werden soll.
  dragobjekt = element;
  document.onselectstart = new Function("return false");
  document.body.style.MozUserSelect = "none";
  dragx = posx - dragobjekt.offsetLeft;
  dragy = posy - dragobjekt.offsetTop;
  dragobjekt.style['cursor'] = 'move';
}

function dragstop() {
  //Wird aufgerufen, wenn ein Objekt nicht mehr bewegt werden soll.
  if (dragobjekt) {
	  dragobjekt.style['cursor'] = 'auto';
}
  dragobjekt=null;
  document.onselectstart = null;
  document.body.style.MozUserSelect = "";
}

function drag(ereignis) {
  //Wird aufgerufen, wenn die Maus bewegt wird und bewegt bei Bedarf das Objekt.
  posx = document.all ? window.event.clientX : ereignis.pageX;
  posy = document.all ? window.event.clientY : ereignis.pageY;
  if(dragobjekt != null) {
    dragobjekt.style.marginTop = 0;
	dragobjekt.style.marginLeft = 0;  
	if (posx - dragx > 0) {
   		dragobjekt.style.left = (posx - dragx) + "px";
   	 }
  	 if (posy - dragy > 0) {
    	dragobjekt.style.top = (posy - dragy) + "px";
    }
  }
}

// Returns array with x,y page scroll values.
// Core code from - quirksmode.org
function getPageScroll(){

	var yScroll;
	
	if (self.pageYOffset) {
		yScroll = self.pageYOffset;
	} else if (document.documentElement && document.documentElement.scrollTop){	 // Explorer 6 Strict
		yScroll = document.documentElement.scrollTop;
	} else if (document.body) {// all other Explorers
		yScroll = document.body.scrollTop;
	}
	arrayPageScroll = new Array('',yScroll) 
	return arrayPageScroll;
}



// Returns array with page width, height and window width, height
// Core code from - quirksmode.org
function getPageSize(){
	var xScroll, yScroll;
	if (window.innerHeight && window.scrollMaxY) {	
		xScroll = document.body.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
   	var windowWidth, windowHeight;
	if (self.innerHeight) {	// all except Explorer
		windowWidth = self.innerWidth;
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}	
	// for small pages with total height less then height of the viewport
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else { 
		pageHeight = yScroll;
	}

	// for small pages with total width less then width of the viewport
	if(xScroll < windowWidth){	
		pageWidth = windowWidth;
	} else {
		pageWidth = xScroll;
	}
	arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);
	return arrayPageSize;
}

function centerDiv(canvasid) {
	console.time("centerDiv Time");
    var mycanvas = byIdReq(canvasid)
    if (mycanvas) {
	   	var arrayPageSize = getPageSize();
		var arrayPageScroll = getPageScroll();
		// center canvas and make sure that the top and left values are not negative
		var canvasTop = arrayPageScroll[1] + ((arrayPageSize[3] - 35 - parseInt(mycanvas.style.height)) / 2);
		var canvasLeft = ((arrayPageSize[0] - 20 - parseInt(mycanvas.style.width)) / 2);
		//fucking IE
		if (!isNaN(canvasTop))
			mycanvas.style.top = (canvasTop < 0) ? "0px" : canvasTop + "px";
		if (!isNaN(canvasLeft))			
			mycanvas.style.left = (canvasLeft < 0) ? "0px" : canvasLeft + "px";
	}
	console.timeEnd("centerDiv Time");
}

function disableZone(show, objectId ) {
    if (show) {
//    console.debug("adding disabled zone");
      var arrayPageSize = getPageSize();
      if(!byId('disabledZone')) {
          var disabledImageZone = document.createElement('div');
          disabledImageZone.setAttribute('id', 'disabledZone');
          disabledImageZone.style['position'] = "absolute";
          disabledImageZone.style['zIndex'] = "999";
          disabledImageZone.style['left'] = "0px";
          disabledImageZone.style['top'] = "0px";
          disabledImageZone.style['width'] = "100%";
          disabledImageZone.style['height'] = (arrayPageSize[1] + 'px');
          disabledImageZone.style['backgroundImage'] = "url(./images/gui_control/1.gif)";
          disabledImageZone.style['backgroundRepeat'] = "no-repeat";
          disabledImageZone.style['visibility'] = 'visible';
          disabledImageZone.handler = new Array( objectId );
          disabledImageZone.innerHTML = "&nbsp;";
          document.body.appendChild(disabledImageZone);
          window.setTimeout("checkDisableZone()", 2000 );
          subNodeCache(disabledImageZone);
        }
        else {
            var disabledImageZone = byId('disabledZone');
            if( findInArray(disabledImageZone.handler,objectId) == -1 )
                disabledImageZone.handler[ disabledImageZone.handler.length ] = objectId;
            if( disabledImageZone.style.visibility == 'hidden' ){
                window.setTimeout("checkDisableZone()", 2000 );
            }
            disabledImageZone.style.visibility = 'visible';
        }
     } else {
        if(byId('disabledZone')) {
//          console.debug("hide disabled zone");
            var disabledImageZone = byId('disabledZone');
            var index = findInArray(disabledImageZone.handler,objectId);
            if( index != -1 )
                disabledImageZone.handler.splice( index, 1 );
            if( disabledImageZone.handler.length == 0 )
                disabledImageZone.style.visibility = 'hidden';
        }
     }
}
function findInArray( array, toBeFound ){
    for( var i = 0; i<array.length; i++ ){
        if( array[i] == toBeFound )
            return i;
    }
    return -1;
}
function checkDisableZone(){
    var disabledImageZone = byId('disabledZone');
    if( disabledImageZone && disabledImageZone.style.visibility == "visible" ){
        for( var i = 0; i<disabledImageZone.handler.length; i++ ){
           var handler = byId( disabledImageZone.handler[i] );
           if( !handler || jQuery(handler).css("visibility")=="hidden" || jQuery(handler).css("display")=="none" ){
               var disabledImageZone = byId('disabledZone');
               disabledImageZone.handler.splice( i, 1 );
               if( disabledImageZone.handler.length == 0 ){
                   disabledImageZone.style.visibility = 'hidden';
                    return;
               }
            }
        }
        window.setTimeout("checkDisableZone()", 2000 );
    }
}

/*
innerHTML with workaround for M$ great Table Object Model
don't we all love IE?
see http://www.tutorials.de/forum/javascript/137407-unbekannter-laufzeitfehler-bei-innerhtml.html
    http://msdn.microsoft.com/workshop/author/dhtml/reference/properties/innerhtml.asp
    * don't call this while loading the document *
*/

function innerHTML2DOM( node,  newHtml) {
	removeIdFromCache(node); // remove old ids...

	if (document.all && node.tagName == "TR") {
		var oldId = node.id;
		var cZone = byIdReq("constructionZone");
		cZone.innerHTML =
		"<table><tr>" + newHtml +
		"</tr></table>";
		var tr = cZone.getElementsByTagName("TR")[0];
		var parent = node.parentNode;
		
		parent.replaceChild( tr, node );
		tr.id = oldId;
		// fix idcache
		subNodeCache(tr);
		if (tr.id) idcache[tr.id] = tr;
	
	} else {
		node.innerHTML = newHtml;
		// fix idcache
		subNodeCache(node);
		// accidently removed..
		if (node.id) idcache[node.id] = node;
	}
}

/* reconstruct a node with as outerhtml
*/
function outerHTML2DOM( node, newHtml) {
	removeIdFromCache(node); // remove old ids...
	// does not work as well http://webfx.eae.net/dhtml/ieemu/htmlmodel.html
	// was will ich denn mit einem DocumentFragement?
	var cz = document.createElement("DIV");
	cz.innerHTML = newHtml;
	var newNode = cz.firstChild; // can only be one child
	node.parentNode.replaceChild( newNode, node);
	node = newNode;
	// fix idcache
	subNodeCache(node);
	// readd the node itself
	if (node.id) idcache[node.id] = node;
}

//no more background image flicker in ie 6
//http://evil.che.lu/2006/9/25/no-more-ie6-background-flicker
try {
  document.execCommand('BackgroundImageCache', false, true);
} catch(e) {}
/*
load this html as sibling to an existing node
*/
function loadSibling(node, newHtml) {

	console.time("loadSibling Time");
	var cZone = byIdReq("constructionZone");
	var cRoot;
	if (node.tagName == "TR") { //M$ fix see inner2DOM()
		cZone.innerHTML =
		"<table>" + newHtml +
		"</table>";
		if (!cZone.getElementsByTagName("TR") || cZone.getElementsByTagName("TR").length==0) {
			return;
		}
		cRoot = cZone.getElementsByTagName("TR")[0].parentNode;
	
	} else {
		// root is the zone itself
		cRoot = cZone;
		
	}
	subNodeCache(cRoot);
	// move node to new position
	var dady = node.parentNode;
	var youngerBrother = node.nextSibling;
	while (cRoot.firstChild) {
		var childNode = cRoot.firstChild;
		cRoot.removeChild(childNode);
		
		// insert the new clone into the real DOM-tree
		if (youngerBrother==null) {
			dady.appendChild( childNode );
		} else {
			dady.insertBefore(childNode, youngerBrother);
		}
	}
	
	cZone.innerHTML = "";
	console.timeEnd("loadSibling Time");
}
/* this functionality is declared in loadIndicator.js
*/
function disableLoadImage() {
    if ($('disabledImageZone')) {
	    $('disabledImageZone').style.visibility = 'hidden';
	} 
	notshow = true;
}

//creates a textareapopup and syncronize it with target inputfield
function txtareapopup(txtid) {
	draginit();
	disableZone(true);
	if (document.getElementById('txtareapopup')) {
		document.getElementById('txtareapopup').style['visibility']='';
	}
	else {
		var div1=document.createElement('DIV');
		div1.setAttribute('id','txtareapopup');
		div1.style['position'] = "absolute";
		div1.style['zIndex'] = "5010";
		div1.style['left'] = "0px";
		div1.style['top'] = "0px";
		div1.style['width'] = "280px";
		div1.style['height'] = "115px";
		div1.className='euhTxtPopup';
		div1.onmousedown=function() {dragstart(this);};
		var div2=document.createElement('DIV');
		div2.setAttribute('id','head');
		div2.style['width'] = "280px";
		div1.appendChild(div2);
		var img1=document.createElement('IMG');
		img1.setAttribute('align','right');
		img1.setAttribute('src','./images/gui_control/close.gif');
		img1.onclick=function(){document.getElementById('txtareapopup').style['visibility']='hidden';disableZone(false);document.getElementById(document.getElementById('txtpopuptargetid').value).value=document.getElementById('txtareapopupcontent').value;};
		div2.appendChild(img1);
		var input1=document.createElement('INPUT');
		input1.setAttribute('type','hidden');
		input1.setAttribute('id','txtpopuptargetid');
		div1.appendChild(input1);
		var textarea1=document.createElement('TEXTAREA');
		textarea1.setAttribute('id','txtareapopupcontent');
		textarea1.className='euhInputTextarea';
		textarea1.id = 'txtareapopupcontent';
		textarea1.style['width'] = "280px";
		textarea1.style['height'] = "100px";
		textarea1.style['zIndex'] = "5011";
		textarea1.onmousedown=stopEvent;
		div1.appendChild(textarea1);
		document.body.appendChild(div1);
	}
	if(byId(txtid).readOnly) {
		document.getElementById('txtareapopupcontent').readOnly = true;
		classAdd(document.getElementById('txtareapopupcontent'),'euhReadonly');
	}	else {
		document.getElementById('txtareapopupcontent').readOnly = false;
		classRemove(document.getElementById('txtareapopupcontent'),'euhReadonly');
	}
document.getElementById('txtpopuptargetid').value=txtid;
document.getElementById('txtareapopupcontent').value=document.getElementById(txtid).value;
centerDiv('txtareapopup');
}

//stop the event bubble
//http://ajaxcookbook.org/canceling-and-stopping-browser-events/
function stopEvent(e) {
    if (!e) e = window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}

function cancelEvent(e) {
    if (!e) e = window.event;
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
}

/*
set a class in the attributes or remove it.
onOff parameter is true/false to add/remove the className in the class 
attribute
*/
function setClass(node, clName, onOff) {
	if (onOff) {
		classAdd(node, clName);
	} else {
		classRemove(node, clName );
	}
}

//##################### File Upload #####################
var currentUpload = null;

function updateUploadProgress(uploadInfo, cssId )
{
	var fileIndex = uploadInfo[0];
	var totalSize = uploadInfo[1];
	var bytesRead = uploadInfo[2];
	var elapsedTime = uploadInfo[3];
	var status = uploadInfo[4];
	
    if ("progress" == status || "start" == status )
    {
        var fileIndex = fileIndex;
        var progressPercent = Math.ceil((bytesRead / totalSize) * 100);
        document.getElementById( cssId 	+ '_progressBarText').innerHTML = '&nbsp;upload in progress: ' + progressPercent + '%';
        document.getElementById( cssId 	+ '_progressBarBoxContent').style.width = parseInt(progressPercent * 1.58) + 'px';
	    window.setTimeout("fireEuHEvent('"+cssId+"','99');", 1500);
    }
    else if( "nofile" == status )
    {
	    document.getElementById( cssId 	+ '_progressBar').style.display = 'none';
        document.getElementById( cssId 	+ '_progressBarBoxContent').style.width = '0px';
	    document.getElementById( cssId 	+ '_progressBarText').innerHTML = '';
	    document.getElementById( cssId 	+ '_fileInput' ).value = '';
        document.getElementById( cssId  + '_uploadField').style.display = 'block';
	    currentUpload = null;
    }
    else
    {
        document.getElementById( cssId  + '_progressBar').style.display = 'none';
        document.getElementById( cssId  + '_progressBarBoxContent').style.width = '0px';
        document.getElementById( cssId  + '_progressBarText').innerHTML = '';
        document.getElementById( cssId  + '_fileInput' ).value = '';
        currentUpload = null;
    }
    return true;
}

function startUploadProgress( cssId )
{
	if( currentUpload )
	{
		alert("Upload in progess!");
		return false;
	}
	else
	{
		currentUpload = cssId;
		document.getElementById( currentUpload 	+ '_uploadField').style.display = 'none';
		document.getElementById( currentUpload 	+ '_progressBar').style.display = 'block';
		document.getElementById( currentUpload 	+ '_progressBarText').innerHTML = '&nbsp;upload in progress: 0%';
	    window.setTimeout("fireEuHEvent('"+cssId+"','99');", 1500);
	    return true;
    }
}

//##################### End File Upload #####################

function errorhandler(param0,param1) {
  showError('An error occurred!',param0,param1);
  disableLoadImage();
  bussy = false;
  processeQueue();
}
function timeouthandler() {
  window.alert("Your session has expired, please login again.");
  document.location.href = document.location.href;
}

function showError(message,errormessage,exception) {
	iconsrc = "./images/gui_control/error.gif"; 
	disableZone(true);
	if (!document.getElementById('errorBox')) {
		var messageBox=document.createElement('DIV');
		messageBox.style['zIndex'] = "5011";
		messageBox.style['position'] = "absolute";
		messageBox.style['left'] = "0px";
		messageBox.style['top'] = "0px";
		messageBox.style['height'] = "100px";
		messageBox.style['width'] = "250px";		
		messageBox.style['padding'] = "0px";
		messageBox.setAttribute('id','errorBox');
		var innermessageBox=document.createElement('DIV');
		innermessageBox.className='messageBox';
		innermessageBox.style['zIndex'] = "5011";
		innermessageBox.style['left'] = "0px";
		innermessageBox.style['top'] = "0px";
		innermessageBox.style['width'] = "250px";
		innermessageBox.style['margin'] = "0px";
		innermessageBox.style['padding'] = "0px";
		innermessageBox.style['paddingBottom'] = "2px";
		innermessageBox.setAttribute('id','innererrorBox');
		messageBox.appendChild(innermessageBox);
		var div1=document.createElement('div');
		div1.className='euhCanvasWindowTitelBar';
		var table1=document.createElement('table');
		table1.setAttribute('width','100%');
		table1.setAttribute('cellspacing','0');
		table1.setAttribute('cellpadding','0');
		div1.appendChild(table1);
		var tbody1=document.createElement('tbody');
		table1.appendChild(tbody1);
		var tr1=document.createElement('tr');
		tbody1.appendChild(tr1);
		var td1=document.createElement('td');
		td1.className='euhCanvasWindowTitel';
		tr1.appendChild(td1);
		var span1=document.createElement('span');
		td1.appendChild(span1);
		var txt2=document.createTextNode('Error');
		span1.appendChild(txt2);
		var td2=document.createElement('td');
		td2.setAttribute('align','right');
		tr1.appendChild(td2);
		var input1=document.createElement('input');
		input1.setAttribute('type','image');
		input1.className='euhButton';
		input1.setAttribute('src','images/gui_control/close.gif');
		input1.onclick=closeError;
		input1.style['margin'] = "1px";
		input1.setAttribute('title','close');
		td2.appendChild(input1);
		innermessageBox.appendChild(div1);
		innermessageBox.style['backgroundImage'] = "url("+iconsrc+")";
		innermessageBox.style['backgroundRepeat'] = "no-repeat";
		innermessageBox.style['backgroundPosition'] = "4px 23px";
		var messageText=document.createElement('DIV');
		messageText.setAttribute('id','message_text');
		messageText.style.marginLeft="35px";
		messageText.style['marginTop'] = "2px";
		innermessageBox.appendChild(messageText);
		messageText.innerHTML = message;
		var errordetailText=document.createElement('DIV');
		errordetailText.setAttribute('id','errorDetail');
		errordetailText.style.marginLeft="35px";
		errordetailText.style['marginTop'] = "5px";
		errordetailText.style['marginBottom'] = "5px";
		errordetailText.style['display'] = "none";
		errordetailText.innerHTML = createErrorOutput(errormessage,exception);
		innermessageBox.appendChild(errordetailText);
		var buttonarea=document.createElement('DIV');
		buttonarea.setAttribute('align','center');
		buttonarea.style.clear="left";
		buttonarea.style['marginTop'] = "5px";
		buttonarea.style['marginBottom'] = "5px";
		innermessageBox.appendChild(buttonarea);
		var closeButton=document.createElement('INPUT');
		closeButton.setAttribute('type','button');
		closeButton.className='messagebutton';
		closeButton.onclick=closeError;
		closeButton.setAttribute('value','OK');
		closeButton.setAttribute('id','message_okaybutton');
		closeButton.style['zIndex'] = "5011";
		buttonarea.appendChild(closeButton);
		var detailButton=document.createElement('INPUT');
		detailButton.setAttribute('type','button');
		detailButton.setAttribute('id','detailButton');
		detailButton.className='messagebutton';
		detailButton.onclick=function(){
		edt = document.getElementById('errorDetail');
		if (edt) {
			visible = isShown(edt);
			show(edt,!visible);	
			if (!visible) {
				document.getElementById('detailButton').value = 'Hide details';
			} else {
				document.getElementById('detailButton').value = 'Show details';
			}
		}
		return false;
		};
		detailButton.setAttribute('value','Show details');
		detailButton.style['zIndex'] = "5011";
		detailButton.style['marginLeft'] = "3px";
		buttonarea.appendChild(detailButton);
		document.body.appendChild(messageBox);
		} 
		else {
			document.getElementById('errorDetail').innerHTML = createErrorOutput(errormessage,exception);
			document.getElementById('errorBox').style['visibility']='';
		}
	centerDiv('errorBox');
}

function closeError() {
	document.getElementById('errorBox').style['visibility']='hidden';
	 disableZone(false); 
	 return false;
}

function createErrorOutput(errormessage,exception) {
	returnstring = '';
	if (exception.javaClassName) {
		returnstring +=  '<b>'+exception.javaClassName+':</b> ';	
	}
	returnstring += errormessage + '<br>';
	//returnstring += errormessage + '<br>';
	if (exception.cause) {
		returnstring += '<b>cause:</b> '+ exception.cause.javaClassName + '<br>' + exception.cause.message + '<br>';
	}
	return returnstring;
}

function trim (zeichenkette) {
     return zeichenkette.replace (/^\s+/, '').replace (/\s+$/, '');
}
    
function readCookie(cname) {
       a = trim(document.cookie);
       res = '';
       while(a != '') {
           cookiename = a.substring(0,a.search('='));
           cookiewert = a.substring(a.search('=')+1,a.search(';'));
           if(cookiewert == '' || a.search(';')==-1) {
               cookiewert = a.substring(a.search('=')+1,a.length);
           } else {
               cookiewert = a.substring(a.search('=')+1,a.search(';'));
           }
        if(cname == trim(cookiename)){
           res = cookiewert;
           return (res);
         }
        i = a.search(';')+1;
        if(i == 0){i = a.length}
        a = a.substring(i,a.length);
    }
    return(res)
}

function checkSessionCookie(url) {
    if(!url) {
        url = "./nosessioncookie.jsp";
    }
    document.cookie = 'sessioncookieallowed=true;';
    var check = readCookie('sessioncookieallowed');
    if (check != 'true') {
        window.location.href = url;
    } 
}

/**
################################## External Events #############################################
*/
function fireExternalEvent( params ){
    eventParam( document.body.id, params );
    
    window.setTimeout("fireEuHEvent('"+document.body.id+"','externalEvent');", 100 );
}
function callFrame( frameName, params ){
	if( "null" == frameName )
		eval( "window.parent" ).fireExternalEvent( params );
	else
		eval( "window.parent."+frameName ).fireExternalEvent( params );
}

/**
################################## Table #############################################
*/
function tableUp( nodeId ){
	var currentRow = jQuery("#"+nodeId+"_conf");
	var tbody = currentRow.parent().get(0);
	var prev = currentRow.prev().get(0);
	if( tbody.childNodes[1] != currentRow.get(0) )
		tbody.insertBefore(currentRow.get(0),prev);
}
function tableDown( nodeId ){
	var currentRow = jQuery("#"+nodeId+"_conf");
	var tbody = currentRow.parent().get(0);
	var next = currentRow.next().get(0);
	if( tbody.rows[ tbody.rows.length-3 ] != currentRow.get(0) )
		tbody.insertBefore( next, currentRow.get(0) );
}
function editTable( tableId ){
	var table = jQuery("#"+tableId+"_cols");
	var rows = jQuery("#"+tableId+"_cols > tbody > tr");
	var toServer = "";
	for(i=1; i < (rows.length-2); i++ ){
		var rowId = rows.get(i).id;
		var inputs = jQuery( "#"+rowId + " > td > input");
		if(inputs.get(1).checked){
			toServer += inputs.get(0).value + "," +inputs.get(2).value+ ";" ;
		}
	}
	var rowInput = jQuery( jQuery(rows.get( rows.length-2 )).children().get(1)).children("input").get(0);
    eventParam( tableId, new Array(  rowInput.value, toServer ) );
    fireEuHEvent( tableId, '11' );
	
	jQuery(table.parent().get(0)).css( 'display', 'none');
}

function onCheckAll( id ) {
	var check = $j( "#"+id+"\\.selAll" )[0].checked;
	var displayedRows =  getTableRows( id );
	
	var $cols = $j( "#"+id+" .euhTableColumnHeaderCell" );
	
	var allColl = 0;
	for( var i = 0; i < $cols.size(); i++ ){
		if( $j( $cols.get(i) ).find( "#"+id+"\\.selAll" ).size() == 1 ){
			allColl = i;
			break;
		}
	}
	 
	for( var i = 0; i < displayedRows; i++ ){
		$j( "#" + id + "\\.c" + allColl + "\\.r" + i + ">input" )[0].checked = check;
	}
    eventParam( id, new Array( ""+check ) );
	fireEuHEvent( id,'14' );
}

// Drag Drop
function initTableDroppable( tableId ){
	// init all rows of the table -> id = TaX.rY
	jQuery( '#'+tableId+' tr[@id*=\''+tableId+'.r\']' ).droppable( { 
			accept: 'tr', 
			hoverClass: 'euhDroppableHover',
			drop: function(ev, ui) {
				eventParam( tableId, new Array( ui.draggable.element.id, this.id ) );
		    	fireEuHEvent( tableId, '13' );
		    }
	    });
}
function initTableDraggable( tableId ){
	// init all rows of the table -> id = TaX.rY
	jQuery( '#'+tableId+' tr[@id*=\''+tableId+'.r\']' ).draggable( {
			helper: function(ev, ui) {
				return jQuery('#dragObject').clone().attr( 'id', 'dragObject_clone' );
		    }, 
			cursor: 'move',
			cursorAt: {top:5, left:5},
			appendTo: 'body',
			zIndex: 20,
			start: function(ev, ui) {
				eventParam( tableId, new Array( this.id ) );
		    	fireEuHEvent( tableId, '15' );
		    }
		} );
}

// Scrolling
var currentRow = new Array();

function initScrollbar( tableId ){
	console.debug("initScrollbar(" + tableId + ")" );
	var $drag = jQuery( '#'+tableId+'_drag');
	$drag.css({
			"position": "absolute"
		});
   	$drag.draggable({
   			axis: 'y',
   			containment: 'parent',
   			cursor: 'n-resize',
   			stop: function(ev, ui) {
					scrollTo(
						jQuery(this).parent().get(0), 
						jQuery(this).parents( 'table' ).get(1).id ,
						ui.position.top );
				}    			
   			});
   	resizeDrag( tableId, 0 );
}

function resizeDrag( tableId, rowNr ){
	currentRow[tableId] = rowNr;

	var $drag = jQuery( '#'+tableId+'_drag');
	if( $drag.size()==0 ) return;
	
	var $dragBar = jQuery( '#'+tableId+'_dragbar');
	var height = $dragBar.height();
	var allData = jQuery( '#'+tableId+'\\.size' ).html();
	var rowCount = getTableRows( tableId );
	
	var dragHeight = height; 
	if( allData > rowCount )
		dragHeight = height / ( allData/rowCount );
	if( dragHeight < 10 )
		dragHeight = 10;
	$drag.height( dragHeight );
	
	var newPos = rowNr / ( allData - rowCount ) * getScrollMaxPos(tableId);
	if( !newPos )
		newPos = 0;
	
	var offset = $dragBar.offset().top;
	jQuery( $drag ).css({
			"top": newPos+offset
		});
}
function calculateLineChange( dragBar, tableId, ereignis ){

	console.debug("calculateLineChange(" + tableId + " " + ereignis.clientY + ")" );
	if (!ereignis)
   		ereignis = window.event;

	var top = ereignis.clientY;
	var offset = jQuery(dragBar).offset().top;
	var winOffset = jQuery(document).scrollTop();
	var halfDrag = jQuery( '#'+tableId+'_drag' ).height()/2;
	var scrollMax = getScrollMaxPos(tableId);
	
	var newPos = top+winOffset-halfDrag;
	if( offset > newPos)
		newPos = offset;
	else if( newPos > ( scrollMax + offset ) )
		newPos = scrollMax + offset;
		
	
	jQuery( '#'+tableId+'_drag').css({
			"top": newPos
		});


	var allRows = byId( tableId+".size" ).innerHTML;
	var rowNr = ( ( newPos - offset ) / scrollMax * ( allRows - getTableRows( tableId ) ) ) | 0;
	currentRow[tableId] = rowNr;

	console.debug( " top " + top + " offset " + offset + " winOffset " + winOffset + " halfDrag " + halfDrag + " newPos " + newPos + " scrollMax " + scrollMax + " rowNr " + rowNr );

	eventParam( tableId, new Array( ''+rowNr ) );
	fireEuHEvent( tableId ,'12');

}

function scrollTo(dragBar, tableId, newPos ){
	console.debug("scrollTo(" + tableId + " " + newPos + ")" );
	var dragBarHeight = getScrollMaxPos(tableId);
	var offset = jQuery(dragBar).offset().top;
	var allData = jQuery( '#'+tableId+'\\.size' ).html();
	var rowCount = getTableRows( tableId );
	
	var rowNr = ( ( newPos - offset ) / dragBarHeight * (allData - rowCount) ) | 0;

	currentRow[tableId] = rowNr;

	eventParam( tableId, new Array( ''+rowNr ) );
	fireEuHEvent( tableId ,'12');
}

function getTableRows( tableId ){
	return jQuery( '#'+tableId+'>tbody>tr[@id]' ).size();
}
function getScrollMaxPos( tableId ){
	return ( jQuery( '#'+tableId+'_dragbar').height()-jQuery( '#'+tableId+'_drag').height() );
}

var currentSelected;
function onRowIn( inputField ){
	$row = jQuery( jQuery(inputField).parents('tr[@id]').get(0) );
	if( currentSelected && $row != currentSelected ){
		currentSelected.find('input[@type="text"]').removeClass( 'euhTableInputText_on' );
		currentSelected.find('input[@type="image"]').hide();
	}
	$row.find('input[@type="text"]').addClass( 'euhTableInputText_on' );
	$row.find('input[@type="image"]').show();
	currentSelected = $row;
}
function onRowOut( inputField ){
	currentSelected.find('input[@type="text"]').removeClass( 'euhTableInputText_on' );
	currentSelected.find('input[@type="image"]').hide();
}
function onTab( inputField ){
	$row = jQuery( jQuery(inputField).parents('tr[@id]').get(0) );
	$next = $row.next();
	if( $next.hasClass( 'euhTableFooter' ) || $next.length == 0 ){
		$inputs = $row.find('input');
		if( $inputs.get($inputs.length-1) == inputField ){
			var tableId = toLastDot( $row.get(0).id );
			fireEuHEvent(  tableId , '0' );
			//get first input and set set focus
			var firstInput = $row.find('input[type!="hidden"]').get(0);
			firstInput.focus();
			return false;
		}
	}
	return true;
}
function onArrowDown( inputField ){
	cellId = jQuery(inputField).parents('td[@id]').get(0).id;
	startC = cellId.indexOf( '.c' );
	startR = cellId.indexOf( '.r' );
	cellNo = cellId.substring( startC+2, startR );
	rowNo = cellId.substring( startR+2, cellId.length );
	type = inputField.type;
	
	newId = "#"+cellId.substring( 0,  startC ) + "\\.c" + cellNo + "\\.r" + (parseInt(rowNo)+1);
	$inputFileds = jQuery( newId + " input[@type='"+type+"']");
	if( $inputFileds.length > 0 ){
		if( type == "image" )
			$inputFileds.show();
		$inputFileds.get(0).focus();
	}
	else{
		fireEuHEvent(  cellId.substring( 0, startC ) , '0' );
	}
}
function onArrowUp( inputField ){
	cellId = jQuery(inputField).parents('td[@id]').get(0).id;
	startC = cellId.indexOf( '.c' );
	startR = cellId.indexOf( '.r' );
	cellNo = cellId.substring( startC+2, startR );
	rowNo = cellId.substring( startR+2, cellId.length );
	type = inputField.type;
	
	newId = "#"+cellId.substring( 0,  startC ) + "\\.c" + cellNo + "\\.r" + (parseInt(rowNo)-1);
	$inputFileds = jQuery( newId + " input[@type='"+type+"']");
	if( $inputFileds.length > 0 ){
		if( type == "image" )
			$inputFileds.show();
		$inputFileds.get(0).focus();
	}
	else{
		fireEuHEvent(  cellId.substring( 0, startC ) , '3' );
	}
}

function initTableEditor( tableId ){
	// init all rows of the table -> id = TaX.rY
	jQuery( '#'+tableId+'_cols tr[@id*=\'_conf\']' ).draggable( {
			helper: function(ev, ui) {
				return jQuery('#'+tableId+'_dragCol').clone().html( jQuery(jQuery( "#"+this.id+" td").get(1)).html() );
		    }, 
			cursor: 'move',
   			containment: '#'+tableId+'_cols',
			cursorAt: {top:5, left:5},
			appendTo: 'body',
			zIndex: 20
		} );
		
	jQuery( '#'+tableId+'_cols tr[@id*=\'_conf\']' ).droppable( { 
			accept: '#'+tableId+'_cols tr[@id*=\'_conf\']', 
			hoverClass: 'euhDroppableHover',
			drop: function(ev, ui) {
				var currentRow = jQuery("#"+ui.draggable.element.id );
				var beforeRow = jQuery("#"+this.id );
				var tbody = currentRow.parent().get(0);
				tbody.insertBefore( currentRow.get(0),beforeRow.get(0) );
		    }
	    });
		
}

function changeTableRowWidth( input, step ){
	console.debug("changeTableRowWidth(" + input.id + " " + input.value + ")" );
	var inputVal = input.value;
	var intVal = parseInt(input.value);
	var preFix = "";
	var postFix = "";
	if( intVal ){
		preFix = inputVal.substring( 0, inputVal.indexOf(intVal+"" ) );
		postFix = inputVal.substring( inputVal.indexOf(intVal+"") + (intVal+"").length );
		console.debug( preFix + " " + postFix );
	}
	else
		intVal = 0;
	
	newVal = intVal + ( step * 10 );
	if( newVal > 0 ){
		input.value = preFix + newVal + postFix;
	}
}

function changeTableRows( input, step ){
	console.debug("changeTableRows(" + input.id + " " + input.value + ")" );
	var newPos = parseInt(input.value) + step;
	if( newPos > 0 ){
		input.value = newPos;
	}
}

/*
################################### DOM Operations ########################################
*/

function addAsChild( cssId, value ){
	var cz = byIdReq('constructionZone');
	innerHTML2DOM( cz, value );
	var dlg = cz.firstChild;
	cz.removeChild(dlg);
	byIdReq( cssId ).appendChild( dlg );
}
function insertAsChild( cssId, value ){
	var cz = byIdReq('constructionZone');
	innerHTML2DOM( cz, value );
	var dlg = cz.firstChild;
	cz.removeChild(dlg);
	if( childNodes.legth>0 )
		byIdReq(cssId).insertBefore( byIdReq(cssId).childNodes[0] );
	else
		byIdReq(cssId).appendChild( dlg );
}
function replaceNode( cssId, value ){
	var cz = byIdReq('constructionZone');
	innerHTML2DOM( cz, value );
	var dlg = cz.firstChild;
	cz.removeChild(dlg);
	byIdReq( cssId ).parentNode.replaceChild( byIdReq(cssId), dlg );
}

function jQueryId( id ){
	return id.replace(/\./g, "\\.");
}

/*
################################### canvas ########################################
*/

function toggleTray(elemid,image){
    /**/
   var vista = toggleVisi(elemid);
    
    if (vista=='none') {
        image.src="./images/gui_control/opentray.gif"
    }  else {
        image.src="./images/gui_control/closetray.gif"
    }
}



