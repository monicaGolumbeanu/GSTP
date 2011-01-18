// scrollbar.js
// inline scrollbar functions
// Copyright (c) 2004 ESIRION AG. All rights reserved. 
//
// creation: dirk.oppelt@esirion.com 
//
// mod: 23.03.2004 initial release 

var scrollamount = 10;	// pixel pro Scrollschritt
var scrolltimeout = 4;	// ms pro Scrollschritt

var scrollstep;
var scrolling = 0;
var scrolldoc;
var scrollhandle;
var offsetY;
var movingObj = false;

function scroll() { // scrollen
	if(scrollstep > 0 && scrollstep + scrolldoc.offsetTop >= 0) { //ganz oben
		scrolldoc.style.top = 0;
		scrollstop();
	}
	else if(scrollstep < 0 && scrolldoc.parentNode.offsetHeight - scrolldoc.offsetTop - scrollstep >= scrolldoc.offsetHeight) { //ganz unten
		scrolldoc.style.top = scrolldoc.parentNode.offsetHeight - scrolldoc.offsetHeight;
		scrollstop();
	}
	else scrolldoc.style.top = scrolldoc.offsetTop + scrollstep;
	adjustHandleToDoc();
	if(scrolling) setTimeout('scroll()',scrolltimeout)	
}

function adjustHandleToDoc() { // DocPos an HandlePos anpassen
	if(scrolldoc.offsetTop >= 0) scrollhandle.style.top = 0;
	else if(scrolldoc.offsetHeight + scrolldoc.offsetTop <= scrolldoc.parentNode.offsetHeight) scrollhandle.style.top = scrollhandle.parentNode.offsetHeight - scrollhandle.offsetHeight;
	else scrollhandle.style.top = Math.round(-scrolldoc.offsetTop * scrollhandle.offsetHeight / scrolldoc.parentNode.offsetHeight);
}

function adjustDocToHandle() { // HandlePos an DocPos anpassen
	thisTop = Math.round(-scrollhandle.offsetTop * scrolldoc.offsetHeight / scrollhandle.parentNode.offsetHeight);
	if(thisTop > 0) scrolldoc.style.top = 0;
	else if(scrolldoc.parentNode.offsetHeight - thisTop > scrolldoc.offsetHeight) scrolldoc.style.top = scrolldoc.parentNode.offsetHeight - scrolldoc.offsetHeight;
	else scrolldoc.style.top = thisTop;
}

function scrollstart(down, scrollObj) {  // scrollen starten
	scrolldoc = document.getElementById(scrollObj+'Doc');
	scrollhandle = document.getElementById(scrollObj+'Handle');
	scrolling = 1;
	if(down) {
		scrollstep = -scrollamount;
	}
	else {
		scrollstep = scrollamount;
	}
	scroll();
}

function scrollstop() { // scrollen beenden
	scrolling = 0;
	self.focus();
}

function initScroll(scrollObj) {  // init
	if(!document.getElementById || !document.getElementById(scrollObj+'Handle')) return;
	scrolldoc = document.getElementById(scrollObj+'Doc');
	scrollhandle = document.getElementById(scrollObj+'Handle');
	scrolldoc.parentNode.style.height = scrolldoc.offsetHeight;
	scrolldoc.style.top = 0;
	if(document.all) {
		frameheight = document.body.clientHeight;
		menuheight = document.getElementById('m0').offsetHeight;
	}
	else {
		frameheight = self.innerHeight;
		menuheight = getPos(document.getElementById('menuheightmarker'), 'top');
	}
	if(menuheight > frameheight) { // Scrollbar nötig ?
		showScrollbar()
	}
	else {
		hideScrollbar();
		return;
	}
	scrollhandle.style.height = parseInt(scrolldoc.parentNode.offsetHeight * scrollhandle.parentNode.offsetHeight / scrolldoc.offsetHeight);
	scrollhandle.parentNode.onmousedown = setHandle;
	scrollhandle.onmousedown = startMoveHandle;
	document.onmousemove = moveHandle;
	document.onmouseup = endMoveHandle;
	document.onmouseout = mouseOut;
	scrollToActive();
}

function showScrollbar() {
	document.getElementById('scrollSpacer').style.width = 129;
	scrolldoc.style.width = 151;
	scrolldoc.parentNode.style.width = 151;
	scrolldoc.parentNode.parentNode.style.width = 151;
	newHeight = scrolldoc.parentNode.offsetHeight - (menuheight - frameheight);
	if(newHeight<35) newHeight=35;
	scrolldoc.parentNode.style.overflow = 'hidden';
	scrolldoc.parentNode.style.height = newHeight;
	scrollhandle.parentNode.style.height = newHeight-28;
	scrollhandle.parentNode.style.display = 'block';
	scrollhandle.style.display = 'block';
	document.getElementById('scrollButtonUp').style.display = 'block';
	document.getElementById('scrollButtonDown').style.display = 'block';
}

function hideScrollbar() {
	scrolldoc.style.width = 164;
	scrolldoc.parentNode.style.width = 164;
	scrolldoc.parentNode.parentNode.style.width = 164;
	document.getElementById('scrollSpacer').style.width = 142;
	scrolldoc.parentNode.style.height = scrolldoc.offsetHeight;
	scrollhandle.parentNode.style.display = 'none';
	scrollhandle.style.display = 'none';
	document.getElementById('scrollButtonUp').style.display = 'none';
	document.getElementById('scrollButtonDown').style.display = 'none';
}

function scrollToActive() {  // Wenn aktiver Menueintrag, diesen in sichtbaren Bereich scrollen
	var activeNode = false;
	for(var i=0; i<scrolldoc.childNodes.length; i++) {
		if(activeNode) break;
		if(scrolldoc.childNodes[i].tagName == 'TBODY') {
			var tbodyNode = scrolldoc.childNodes[i];
			for(var j=0; j<tbodyNode.childNodes.length; j++) {
				if(activeNode) break;
				if(tbodyNode.childNodes[j].tagName == 'TR') {
					var trNode = tbodyNode.childNodes[j];
					for(var k=0; k<trNode.childNodes.length; k++) {
						if(trNode.childNodes[k].tagName == 'TD' && trNode.childNodes[k].className == 'entry-a2') {
							activeNode = trNode.childNodes[k];
							break;
						}
					}
				}
			}
		}
	}
	if(activeNode) {
		activeTop = Math.abs(activeNode.offsetTop);
		if(activeTop + activeNode.offsetHeight > scrolldoc.parentNode.offsetHeight) {
			if(scrolldoc.offsetHeight - activeTop < scrolldoc.parentNode.offsetHeight) scrollstep = scrolldoc.parentNode.offsetHeight - scrolldoc.offsetHeight;
			else scrollstep = - activeTop;
			scroll();
		}
	}
}

function setHandle(evt) { // per Scrollbar-Klick aktualisieren
	if(evt && evt.target) {
		var srcObj = evt.target;
		var mouseY = evt.layerY;
	}
	else {
		var srcObj = window.event.srcElement;
		var mouseY = window.event.offsetY;
	}
	if(srcObj.id.indexOf('Bar')!=-1) {
		sObj = srcObj.id.split('Bar')[0];
		fHeight = document.getElementById(sObj+'Frame').offsetHeight;
		fTop = document.getElementById(sObj+'Handle').offsetTop;
		dHeight = document.getElementById(sObj+'Doc').offsetHeight;
		dTop = document.getElementById(sObj+'Doc').offsetTop;
		hHeight = document.getElementById(sObj+'Handle').offsetHeight;
		if(mouseY < fTop + hHeight)	{ // drüber
			if(fHeight + dTop >= 0) scrollstep = -dTop;
			else scrollstep = fHeight;
		}
		else { // drunter
			if(2*fHeight - dTop >= dHeight) scrollstep = fHeight - dHeight - dTop;
			else scrollstep = -fHeight;
		}
		scroll();
	}
}

function startMoveHandle(evt) {  // Slider bewegen start
	if(evt && evt.target) {
		movingObj = evt.target;
		var mouseY = evt.pageY;
	}
	else {
		movingObj = event.srcElement;
		var mouseY = event.clientY;
	}
	scrolldoc = document.getElementById(movingObj.id.split('Handle')[0]+'Doc');
	offsetY = mouseY - movingObj.offsetTop;
}

function moveHandle(evt) {  // Slider bewegen
	if(!movingObj) return;
	if(evt && evt.target) {
		var mouseY = evt.pageY;
	}
	else {
		evt = event;
		if(evt.button == 0) {
			endMoveHandle();
			return;
		}
		var mouseY = event.clientY;
	}
	if(mouseY - offsetY <=0) movingObj.style.top=0;
	else {
		if(movingObj.offsetHeight + mouseY - offsetY >= movingObj.parentNode.offsetHeight) movingObj.style.top = movingObj.parentNode.offsetHeight - movingObj.offsetHeight;
		else movingObj.style.top = mouseY - offsetY;
	}
	adjustDocToHandle();
}

function mouseOut(evt) { // non-IE
	if(evt && (evt.pageX <= 0 || evt.pageY <= 0 || evt.pageX >= self.innerWidth || evt.pageY >= self.innerHeight)) endMoveHandle();
}

function endMoveHandle(evt) {  // Slider bewegen end
	movingObj = false;
	scrollstop();
}

function mousewheelscroll(scrollObj) {  // mousewheel für IE
	if(!document.getElementById(scrollObj+'Handle')) return;
	scrolling = 1;
	if (event.wheelDelta >= 120) scrollstep = 20;	
	else if (event.wheelDelta <= -120)  scrollstep = -20;
	scroll();
	scrolling = 0;
}

function getPos(obj, direction) {  //abs. Position ermitteln; Element-ID, 'left'|'top'
	var xpos = 0;
	var ypos = 0;
	myElement = obj;
	do {
		xpos += myElement.offsetLeft;
		ypos += myElement.offsetTop;
		myElement = myElement.offsetParent;
	}
	while(myElement.tagName != 'BODY');
	if(direction == 'left') return xpos;
	if(direction == 'top') return ypos;
}
