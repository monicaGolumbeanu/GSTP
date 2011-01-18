// navigator.js
// global navigation functions
// Copyright (c) 2002 ESIRION AG. All rights reserved. 
//
// creation: dirk.oppelt@esirion.com 
//
// mod: 28.05.2002 function makeEntryline() fixed for Mozilla 1.0 'out of memory' bug 
// mod: 10.06.2002 function check_activestatus() changed for noframe-Sites 
//                 function updateMenu() changed for noframe-Sites 
//                 function do_open() bugfixed 
// mod: 04.07.2002 function check_activestatus() fixed: not closing inactive tree  
// mod: 05.02.2003 zusammenfuehrung mit switcher
// mod: 20.03.2003 initialContent mit eingebetteten Modulen ermoeglicht
// mod: 29.04.2008 has2deeper - return
// mod: 13.08.2008 setTheme - try-catch
// mod: 20.04.2010 remove setTheme
ie=ns4=w3c=op=kq=mz=false;

function getBrowser() {
	if(navigator.userAgent.indexOf('Opera') != -1) op=true;
	else if(navigator.userAgent.indexOf('Konqueror') != -1) kq=true;
	else if(navigator.userAgent.indexOf('Gecko') != -1) mz = true;
	else if(document.all) ie=true;
	else if(document.layers) ns4=true;
	else if(document.getElementById) w3c=true;
}
getBrowser();
// w3c=true;
// alert('ie: '+ie+'\nns4: '+ns4+'\nw3c: '+w3c+'\nop: '+op+'\nkq: '+kq+'\nmz: '+mz);

var content;
var contentFrame;

var pages = new Array();
var pageAll = new Array();
var updatetimeout = new Array();

var menuContent = new Array();
var activeDoc = '~~~';
var activeEntry = -1;
var activeMenu = -1;
var activeLevel = -1;
var activeAction = -1;
var activeHas2deeper = -1;
var entryHas2deeper = new Array();

var activeTemplateLevel = -1;

var linkToParent = -1;

var menuStorage = new Array();
var opened = new Array();
var mixmenu = new Array();
var externalStructures = new Array();
var initialContent = '';
var pageArraySet = new Array();

// **************************************************************************************
var doTimingAlert = false;
var timing = new Array();

function timingMark(name) {
	timing.push([name, new Date()]);
}

function timingAlert() {
    if (!doTimingAlert) return;
	var text = "'" + timing[0][0] + "': - \n";
	var start, end;
    
	for (var i=1; i < timing.length; ++i) {
		start = timing[i-1][1].getTime();
		end = timing[i][1].getTime();
		text += "'" + timing[i][0] + "':" + ((end - start) / 1000.) +"\n"
	}
	start = timing[0][1].getTime()
    
	text += "Total: " + ((end - start) / 1000.)
	alert(text)
}

// **************************************************************************************

function addExternalStructure(structureURL, anchorID, loadDoc, noLoad) {
	timingMark("ABC: 1")

	if(!externalStructures[structureURL]) {  // noch nicht geladen
		if(loadDoc && !noLoad && loadDoc != contentFrame.doc_id && loadDoc != "home") contentFrame.location.href = structureURL + 'contentview/' + loadDoc;
		fNavloader.location.href = contentpath + '../systemcontentview/X_navloader.html?Open&externalStructure=' + structureURL + '&anchorID=' + anchorID + '&loadDoc=' + loadDoc;
		return;
	}
	
	timingMark("ABC: 2")
	
	if(!loadDoc || loadDoc == '' || loadDoc == 'undefined' || loadDoc == 'false') loadDoc = false;
	
	if(externalStructures[structureURL] == 'loaded') {  // geladen
		if(loadDoc) {
			if(contentFrame.doc_id == loadDoc) noLoad = 1;
			loadMenu = getMenuEntryID(loadDoc, 'menu');
			loadEntry = getMenuEntryID(loadDoc, 'entry');
			entryclick(loadMenu,loadEntry,noLoad);
		}
		return;
	}
	
	if(!anchorID || anchorID == '' || anchorID == 'undefined') {
		anchorID = findExternalStructure(structureURL);
		if(!anchorID) return;
	}
	timingMark("ABC: 3")
	
	anchorID = anchorID.split('~~');
	if(parseInt(anchorID[0]) > 100) rootMenu = parseInt(anchorID[0]) - 100;
	else rootMenu = parseInt(anchorID[0]);
	anchorEntry = parseInt(anchorID[1]);
	
	menu0 = menu[rootMenu].slice(0,anchorEntry);
	menu2 = menu[rootMenu].slice(anchorEntry+1,menu[rootMenu].length);
	levelOffset = entryGet(rootMenu,anchorEntry,'level') + 1;

	timingMark("ABC: 3x")
	var curMenu = fNavloader.menu[0]
	var contentPath = fNavloader.contentpath
	for(var i=0; i < curMenu.length; ++i) {
		var curMenuEntry = curMenu[i]
		//curMenuEntry[4] = parseInt(curMenuEntry[4])+levelOffset;
		curMenuEntry[8] = contentPath;
	}
	timingMark("ABC: 3y")

	menu1 = fNavloader.menu[0];
	menu[rootMenu] = menu0.concat(menu1,menu2);
	if(menu[rootMenu+100]) if(menu[rootMenu+100].length) menu[rootMenu+100] = menu[rootMenu];

	externalStructures[structureURL] = 'loaded';
	timingMark("ABC: 3a")
	makePageArray(rootMenu);
	timingMark("ABC: 4")

	if(loadDoc) {
		if(loadDoc=='home') {
			loadEntry = -1;
			init(0,100);
			setInitialContent(0);
		}
		else loadEntry = getMenuEntryID(loadDoc, 'entry');
		//if(loadDoc == contentFrame.doc_id) noLoad = 1;
	}
	else {
		loadEntry = activeEntry;
		if(loadEntry > anchorEntry) loadEntry += fNavloader.menu[0].length;
		noLoad = 1;
	}
	if(loadEntry != -1) {
		entryclick(rootMenu,loadEntry,noLoad);
	}
	timingMark("ABC: 5")
	timingAlert()
}

function findExternalStructure(structureURL) {
	for(var i=0; i<5; i++) {
		if(!menu[i] || !menu[i].length) continue;	
		for(var j in menu[i]) {
			if(menu[i][j][1] == 20 || menu[i][j][1] == 21) {
				if(menu[i][j][3].indexOf(structureURL) != -1) return i+'~~'+j;
			}
		}
	}
	return false;
}
// **************************************************************************************

function init() {
	if(!contentFrame) contentFrame = self.frames['fContent'];
	menuID = parseInt(arguments[0]);
	opened[menuID]=new Array();

	if(menu.length <= arguments[0]) return;
	
	if(arguments.length > 1) { // mixed menu
		myargs = new Array();
		for(var i=0; i<arguments.length; i++) myargs[i] = parseInt(arguments[i]);
		for(var i=0; i<myargs.length; i++) {
			mixmenu[myargs[i]] = new Array();
			for(var j=0; j<myargs.length; j++) {
				if(myargs[j] != myargs[i]) mixmenu[myargs[i]][mixmenu[myargs[i]].length] = myargs[j];
			}
			if(i) {
				menu[myargs[i]] = menu[menuID];
				opened[myargs[i]] = opened[menuID];
			}
		}
	}

	if(!pageArraySet[menuID]) makePageArray(menuID);
	
	activeDoc = '~~~';
	activeEntry = -1;
	activeMenu = -1;
	activeLevel = -1;
	activeAction = -1;
	activeTemplateLevel = -1;
	linkToParent = -1;
	
	activateMenu(menuID);
	if(mixmenu[menuID]) for(var i=0; i<mixmenu[menuID].length; i++) activateMenu(mixmenu[menuID][i]);
}

var parents = new Array();

function makePageArray(menuID) { // Page-Liste aufbauen
	if(menuID>=100) return;
	parents = new Array();
	nextentry = new Array(false,false,false,false,false,false,false,false,false,false,false,false,false,false,false);
	var curMenu = menu[menuID]
	for(var i=0; i<curMenu.length; i++) {
		curMenuEntry = curMenu[i]

		pages[curMenuEntry[2]] = new Array(menuID, i);
		thisLevel = parseInt(curMenuEntry[4])
		parents[thisLevel] = i;
		if(thisLevel>0) curMenuEntry[6] = parents[thisLevel-1];
		else curMenuEntry[6] = -1;

		
		for(j=thisLevel; nextentry[j]; ++j) {
			nextentry[j][9] = i;
			nextentry[j] = false;
		}
		nextentry[thisLevel] = curMenuEntry;
		
	}
	pageArraySet[menuID] = true;
}

function getAsArrayLength(AsArray) { // L‰nge assoziativer Arrays ermitteln
	var x=0;
	for(var i in AsArray) x++;
	return x;
}

// Homepage definieren
// wenn Rootentry = Cat, 1. Menu-Eintrag als Homepage;
// wenn Rootentry = Page+Cat, Rootentry als Homepage;
// wenn Bookmark oder DirectURL, das als Homepage
function getInitialContent(menuID, home) {
	if(!home && initialContent != '') return initialContent;
	if(home || initialContent == '') {
		if(homepage[menuID][1] == 0) {
			for(var i=0; menu[menuID].length; i++) {
				if(menu[menuID][i][1] == 2 || menu[menuID][i][1] == 1) {
					initialContent = contentpath + entryGet(menuID,i,'docID');
					break;
				}
				else if(menu[menuID][i][1] == 3 || menu[menuID][i][1] == 4) {
					loadparams = "?Open&docid=" + entryGet(menuID,i,'docID') + "&external=" + contentpath + entryGet(menuID,i,'docURL');
					initialContent = contentpath + '../externalcontent.html' + loadparams;
					break;
				}
			}
		}
		else initialContent = contentpath + homepage[menuID][2];
		if(home) return initialContent;
	}
	var loc = self.location.href;
	if(loc.indexOf('?Open&')!=-1) {
	  initialContent = contentpath + loc.substr(loc.indexOf('?Open&')+6,32);
	}
	if(loc.indexOf('DirectURL=')!=-1) {
	  initialContent = contentpath + loc.substr(loc.indexOf('DirectURL=')+10,32);
	}
	if(loc.indexOf('bookmark=')!=-1) {
	  initialContent = contentpath + loc.substr(loc.indexOf('bookmark=')+9,32);
	}
	if(loc.indexOf('Initial=')!=-1) {
	  initialContent = contentpath + loc.substr(loc.indexOf('Initial=')+8,32);
	}
	return initialContent;
}

function setInitialContent(menuID, home) { // Homepage setzen
	contentFrame.location.href = getInitialContent(menuID, home);
}

function activateMenu(menuID) { // Menu in default-Zustand setzen
	if(getParam(menuID,'expanded') == 1) openAll(menuID);
	else closeAll(menuID);
	makeMenu(menuID);
}

function resetMenucontent(menuID) { // Menucontent leeren
	if(!mTemplateLine[menuID] || !mTemplateLine[menuID].length) return;
	menuContent[menuID] = new Array();
	for(var i=0; i<mTemplateLine[menuID].length; i++) menuContent[menuID][i]='';
}

function isCat(menuID,entryID) { // ist Entry Category?
	if(entryGet(menuID,entryID,'action') == 20 || entryGet(menuID,entryID,'action') == 21 || (menu[menuID][entryID+1] && entryGet(menuID,entryID+1,'level') == entryGet(menuID,entryID,'level')+1)) return true;
	else return false;
}

function do_open(menuID,entryID,noclose) { // ÷ffnen eines Eintrages; nur bei Cat
	if(!getParam(menuID,'keep_open') && !entryGet(menuID,entryID,'opened')) {
		closeAll(menuID);
		for(var i=0; i<entryGet(menuID,entryID,'level'); i++) {
			if(isCat(menuID,getLevelEntryID(menuID,entryID,i))) entrySet(menuID,getLevelEntryID(menuID,entryID,i),'opened',1);
		}
	}
	if(isCat(menuID,entryID)) {
		if(!noclose && getParam(menuID,'closeable')) entryGet(menuID,entryID,'opened') ? entrySet(menuID,entryID,'opened',0) : entrySet(menuID,entryID,'opened',1);
		else entrySet(menuID,entryID,'opened',1)
	}
}

function openAll(menuID) { // alle ˆffnen
	for(var i=0; i<menu[menuID].length; i++) {
		if(isCat(menuID,i)) entrySet(menuID,i,'opened',1)
	}
}

function closeAll(menuID) { // alle schlieﬂen 
	if(opened[menuID]) opened[menuID].length = 0;
	else {
		if(menuID >= 100) if(opened[menuID-100]) opened[menuID] = opened[menuID-100];
		else opened[menuID] = new Array();
	}
}

function getLevelEntryID(menuID,entryID,level) { // entryID des Parents auf definiertem Level
	var parents = new Array();
	var thisentry = entryID;
	while(entryGet(menuID,thisentry,'level')) {
		parents[entryGet(menuID,thisentry,'level')] = thisentry;
		thisentry = entryGet(menuID,thisentry,'parent')
	}
	parents[0] = thisentry;
	return parents[level];
}

function makeMenu(menuID) { // Menu erzeugen 
	activeTemplateLevel = -1;
	if(!menu[menuID] || !menu[menuID].length) return;
	resetMenucontent(menuID);
	var thisType = getParam(menuID,'menutype');
	for(var i=0; i<menu[menuID].length; i++) {
		if(thisType == 0) menuContent[menuID][0] += makeEntryline(menuID,i);
		else menuContent[menuID][entryGet(menuID,i,'level')] += makeEntryline(menuID,i);
		var thisLevel = entryGet(menuID,i,'level');
		if(menu[menuID][i+1] && entryGet(menuID,i+1,'level') == thisLevel+1) { // hat submenu
			if(!entryGet(menuID,i,'opened')) i = entryGet(menuID,i,'next')-1;
		}
	}
	setMenu(menuID);
}

function makeEntryline(menuID,entryID) { // Menu-Eintrag erzeugen 
	if(menuID==100) {
		var thisLevel = entryGet(menuID,entryID,'level');
		if(thisLevel == 0 || (thisLevel != activeLevel && thisLevel != activeLevel+1 && thisLevel != activeLevel-1)) return '';
		var templateLevel = 1;

		if(activeLevel == -1) return;
		
		if(activeLevel == 0) {  // Level 1 immer 1. Ebene
			if(thisLevel == 1) templateLevel = 1;
			else return ''; 
		}
		else {
			if(activeLevel == 1 || (activeHas2deeper==1 && activeAction!=6 && activeAction!=7 && activeAction!=11)) {  //springen / active auf 1. Ebene 
				if(thisLevel == activeLevel) templateLevel = 1;
				if(thisLevel == activeLevel+1) templateLevel = 2;
				if(thisLevel == activeLevel-1) return ''; 
			}
			else {  //nicht springen / active auf 2. Ebene
				if(thisLevel == activeLevel-1) {templateLevel = 1;};
				if(thisLevel == activeLevel) templateLevel = 2; 
			}	
		}
	}
	else templateLevel = entryGet(menuID,entryID,'level');
	
	if(mTemplateLine[menuID][templateLevel] && mTemplateLine[menuID][templateLevel] != '') {
		var menutemplate = mTemplateLine[menuID][templateLevel];
		var entryDoc     = entryGet(menuID,entryID,'docID');
		var entryOpened  = entryGet(menuID,entryID,'opened');
		var imgSrc = '';
		
		thisclass = 'entry-n';
		if(entryOpened) thisclass = 'entry-o';
		if(entryDoc == activeDoc) thisclass = 'entry-a';
		
		if(menutemplate.indexOf('<entry-imgsrc>') != -1) {  //twist-images
			if(isCat(menuID,entryID)) {  //Subentries
				if(entryOpened) {
					if(entryDoc == activeDoc) imgSrc = imgopen_a[templateLevel].src;
					else imgSrc = imgopen_n[templateLevel].src;
				}
				else {
					if(entryDoc == activeDoc) imgSrc = imgclose_a[templateLevel].src;
					else imgSrc = imgclose_a[templateLevel].src;
				}
			}
			else {
				if(entryDoc == activeDoc) imgSrc = imgpage_a[templateLevel].src;
				else imgSrc = imgpage_n[templateLevel].src;
			}
		}
		
		entryline = menutemplate.replace(/<entry-id>/g, '0,'+ entryID).split('<entry-label>').join(entryGet(menuID,entryID,'label')).replace(/<entry-class>/g, thisclass+templateLevel).split('<entry-imgsrc>').join(imgSrc);
		
		if(scrollCompat && menuID==100 && templateLevel > activeTemplateLevel && templateLevel==2) entryline = startSubmenu + entryline; // wechsel ins submenu
		if(scrollCompat && menuID==100 && templateLevel < activeTemplateLevel && templateLevel==1) entryline = endSubmenu + entryline;	 // wechsel aus submenu
	}
	else entryline = '';
	activeTemplateLevel = templateLevel;
	return entryline + '\n';
}

function setMenu(menuID) { // Menu zusammensetzen und ausgeben 
	for(var i=0; i<mTemplateLine[menuID].length; i++) {
		menuout = '';
		if(menuID==100) {
			thisLabel = entryGet(activeMenu, activeEntry, 'label');
			if(!thisLabel) thisLabel = '';
			menuout += treeheader.split('<entry-label>').join(thisLabel);
		}
		menuout += mTemplateStart[menuID][i];
		if(menuID==100) {
			if(linkToParent != -1) menuout += mTemplateLine[100][1].split('<entry-id>').join('0,'+linkToParent).split('<entry-label>').join(strBack).split('<entry-class>').join('entry-n1').split('<entry-imgsrc>').join(imgback.src);
			else menuout += '<TR HEIGHT=4><TD HEIGHT=4></TD></TR><TR><TD>&nbsp;</TD></TR>';
		}
		menuout += menuContent[menuID][i];
		if(menuID==100 && activeTemplateLevel == 2) menuout += endSubmenu;  // special, Submenu am Ende
		menuout += mTemplateEnd[menuID][i];
		storeMenu(menuout, menuID, i);
	}
	updateMenu(menuID);
}

/*
Klick auf Menueintrag
- Action-IDs:
0:  Cat only 
1:  Page + Cat 
2:  Page only 
3:  ext. Struct, Page + Cat  
4:  ext. Struct, Page 
5:  Clone Page + Cat 
6:  Clone Page 
7:  int. Link, Content Win 
8:  ext. Link + Category 
9:  ext. Link, new Win 
10: ext. Link, same Win 
11: ext. Link, Content Win 
12: Link thru JS-Script 

- Parameter:
menuID, entryID, nicht laden (nur ausklappen), nicht ausklappen (nur laden), nicht zuklappen, klick kommt aus MixedMenu 
*/
function entryclick(menuID,entryID,noload,noopen,noclose,ismixedmenu) {
	if(!ismixedmenu) if(menuID >= 100) { //Mixmenu? Root-Menu w‰hlen
		menuID-=100;
	}
	closeAll(menuID);
	if(!ismixedmenu && activeMenu != menuID) { //Menuwechsel? Altes Menu schlieﬂen
		if(activeMenu != -1) closeAll(activeMenu);
		activeMenu = menuID;
	}
	var action = entryGet(menuID,entryID,'action');
	activeAction = action;
	var externalpath = '';
	if(!noopen && action != 9) do_open(menuID,entryID,noclose);
	if(self.isIntranet && isIntranet==true && action != 0 && action != 3 && action != 4 && action != 8 && action != 9) parent.fActionbar.location.assign(contentpath + '../systemcontentview/X_actionbar.html');
	if(action != 0) {
		if(!noload) {
			if(entryGet(menuID,entryID,'contentpath')) thisPath = entryGet(menuID,entryID,'contentpath');
			else thisPath = contentpath;
			switch (action) {
				case 1: //Page+Cat
				case 2: //Page only
				case 5: //Clone Page+Cat
				case 6: //Clone Page only
				self.contentFrame.location.href = thisPath + entryGet(menuID,entryID,'docID');
				break;
				
				case 7: //int. Link + Content Win
				self.contentFrame.location.href = thisPath + entryGet(menuID,entryID,'docURL').split('internallink:\/\/').join('');
				break;
				
				case 8: //ext. Link + Cat
				case 9: //ext. Link, new Win
				window.open(entryGet(menuID,entryID,'docURL'));
				break;
								
				case 10: //ext. Link, same Win
				location.href = entryGet(menuID,entryID,'docURL');
				break;
				
				case 21: //ext. Page+Structure
				self.contentFrame.location.href = thisPath + entryGet(menuID,entryID,'docID');
				case 20: //ext. Structure
				addExternalStructure(entryGet(menuID,entryID,'docURL').split('homelink:\/\/').join(contentpath.split('\/')[0]), menuID+'~~'+entryID);
				break;
				
				case 3:  //ext. Struct Page + Cat 
				case 4:  //ext. Page+Structure
				externalpath = thisPath;
				case 11: //ext. Link, Content Win
				loadparams = "?ReadForm&docid=" + entryGet(menuID,entryID,'docID') + "&external=" + externalpath + entryGet(menuID,entryID,'docURL');
				self.contentFrame.location.href = thisPath + '../externalcontent.html' + loadparams;
				break;				

				case 12: //Link thru JS-Script
				call_js(entryGet(menuID,entryID,'docURL'));
				break;		
				
				default:
				break;
			}
		}
		activeDoc = entryGet(menuID,entryID,'docID');
	}
	activeEntry = entryID;
	activeLevel = entryGet(menuID,entryID,'level');
	activeHas2deeper = has2deeper(activeMenu,entryGet(activeMenu,activeEntry,'parent'));

	if(fPathinfo) fPathinfo.set_pathstring(getPathinfo(activeDoc, fPathinfo.pathstring_delimiter));
	
	if(action != 9) {
		makeMenu(menuID);
		if(mixmenu.length && mixmenu[menuID]) for(var i=0; i<mixmenu[menuID].length; i++) makeMenu(mixmenu[menuID][i]);
	}
	if(action == 0 && getParam(menuID,'load_first_page') && menu[menuID][entryID+1] && !noload && entryGet(menuID,entryID+1,'level') > activeLevel) { // erste Page laden 
		var openentry=entryID+1;
		while(entryGet(menuID,openentry,'action')==0 && entryGet(menuID,openentry,'level') > activeLevel) {
			entrySet(menuID,openentry++,'opened',1);
		}
		if(op) setTimeout('entryclick('+menuID+','+openentry+')',500);
		else entryclick(menuID,openentry);
	}
}

function storeMenu(content,menuID,level) { // MenuInhalt (HTML) speichern 
	if(!menuStorage[menuID] || !menuStorage[menuID].length) menuStorage[menuID] = new Array();
	menuStorage[menuID][level] = content;
}

function getMenu(menuID,level) { // MenuInhalt (HTML) auslesen 
	menuTop = '';
	if(menuStorage[menuID] && menuStorage[menuID].length && menuStorage[menuID][level]) return menuTop + menuStorage[menuID][level];
	else return '';
}

function updateMenu(menuID) { // Menu-Inhalt gepuffert in Browser ausgeben 
	if(!frames.length) return;
	if(updatetimeout[menuID]) clearTimeout(updatetimeout[menuID]);
	updatetimeout[menuID] = setTimeout('updateMenu1('+menuID+')',200);
}

function updateMenu1(menuID) {
	for(var i=0; i<mOutput[menuID].length; i++) {
		targetframe = eval(mOutput[menuID][i].split('~~')[0]);
		targetdiv = mOutput[menuID][i].split('~~')[1];
		
		if(activeEntry == -1) {
			if(fMainnav.location.href.indexOf('homenav.html')==-1) {
				fMainnav.location.href = docpath + 'systemcontentview/x_homenav.html';
				if(menuID==100) return;
			}
		}
		else {
			if(fMainnav.location.href.indexOf('mainnav.html')==-1) {
				fMainnav.location.href = docpath + 'systemcontentview/x_mainnav.html';
				if(menuID==100) return;
			}
		}
		
		if(ie) {
			if(targetframe.document.all[targetdiv]) targetframe.document.all[targetdiv].innerHTML = getMenu(menuID,i);
			if(targetframe.name == 'fMainnav') if(targetframe.initScroll) targetframe.initScroll('scrollObj1');
		}
		else if(w3c || mz || op) {
			if(targetframe.document.getElementById(targetdiv)) targetframe.document.getElementById(targetdiv).innerHTML = getMenu(menuID,i);
			if(targetframe.name == 'fMainnav') if(targetframe.initScroll) targetframe.initScroll('scrollObj1');
		}
		else if(ns4) {
			targetframe.location.reload();
		}
		else if(kq) {
			targetframe.document.location.href = targetframe.document.location.href;
		}
	}
	//setTimeout('setTheme()',500);
}

function setTheme() { // Theme-Icon laden 
	try {
		if(fMainnav.document.images['themeimage'] && fContent.themeimage &&  fContent.themeimage != '' && fMainnav.document.images['themeimage'].src != fContent.themeimage) fMainnav.document.images['themeimage'].src = fContent.themeimage;
	} catch (e) {}
		
}

function loadDoc(docID) { // Doc nach docID laden 
	var thismenu = getMenuEntryID(docID, 'menu');
	var thisentry = getMenuEntryID(docID, 'entry');
	if(entryGet(thismenu,thisentry,'contentpath')) thisPath = entryGet(thismenu,thisentry,'contentpath');
	else thisPath = contentpath;

	if(thismenu == -1 || thisentry == -1) self.contentFrame.location.href = thisPath + docID;  //nur laden? nix ‰ndern? 
	else entryclick(thismenu,thisentry);
}

function getMenuEntryID(docID, IDtype) { // Eintragswerte zu docID finden 
	if(pages[docID]) {
		if(IDtype == 'menu') return pages[docID][0];
		if(IDtype == 'entry') return pages[docID][1];
	}
	else return -1;
}

function getPathinfo(docID, pathdelimiter) { // Pfad zu docID ausgeben 
	var islastentry = true;
	var isparentlevel = true;
	
	var thismenu = getMenuEntryID(docID, 'menu');
	var thisentry = getMenuEntryID(docID, 'entry');
	var pathinfo = '';
	if(thisentry !=-1) {
		do {
			if(islastentry) {
				pathinfo = fPathinfo.pathstring_delimiter_a + '<A CLASS="active" HREF="javascript:parent.entryclick('+thismenu+','+thisentry+')">'+entryGet(thismenu, thisentry, 'label')+'</A>' + pathinfo;
				linkToParent = -1;
				islastentry = false;
			}
			else {
				if(isparentlevel) {
					linkToParent = thisentry; 
					isparentlevel = false
				}
				pathinfo = fPathinfo.pathstring_delimiter + '<A HREF="javascript:parent.entryclick('+thismenu+','+thisentry+')">'+entryGet(thismenu, thisentry, 'label')+'</A>' + pathinfo;
			}
			thisentry = entryGet(thismenu, thisentry, 'parent');
		}
		while(thisentry != -1);
	}
	return fPathinfo.pathstring_delimiter + '<A HREF="javascript:parent.startinit(1);">'+strHome+'</A>' + pathinfo;
}

function check_activestatus(docID) { //passt Menu zum Content? 
	if(!contentFrame) return;
	if(productpath != '' && contentFrame.location.href.indexOf(productpath) != -1 && !externalStructures[productpath]) {
		addExternalStructure(productpath, '', docID, 1);
		return;
	}
	if(docID) {
		var thismenu = getMenuEntryID(docID, 'menu');
		var thisentry = getMenuEntryID(docID, 'entry');
		if(thismenu == -1 || thisentry == -1) {
			if(fPathinfo) fPathinfo.set_pathstring('');
			init(0,100);
			return;  //nicht im Array? nix ‰ndern?
		}
		if(!mParams[thismenu]) return;	//kein Menu definiert?
		else {
			if(activeDoc != docID) {
				entryclick(thismenu,thisentry,1,0,1);
			}
		}
	}
	setTimeout('setTheme()',500);
	if(contentFrame) if(contentFrame.doc_id) if(activeDoc != contentFrame.doc_id) check_activestatus(contentFrame.doc_id);	//Opera-Bug?
}

function has2deeper(menuID,entryID) { // hat Eintrag 2 tiefere Levels?
	if(!entryID) return -1;		// return - case: call_js 
	if(entryHas2deeper[menuID+'~'+entryID]) return entryHas2deeper[menuID+'~'+entryID];
	else {
		entryHas2deeper[menuID+'~'+entryID] = -1;
		var thisLevel = entryGet(menuID,entryID,'level');
		var dLev = thisLevel;
		for(var i=entryID+1; i<menu[menuID].length; i++) {
			if(menu[menuID][i]) {
				testLev = entryGet(menuID,i,'level');
				if(testLev > dLev) dLev = testLev;
				if(dLev >= thisLevel+2) {
					entryHas2deeper[menuID+'~'+entryID] = 1;
					return 1;
				}
				if(testLev <= thisLevel) {	
					return -1;
				}
			}
		}
		return -1;
	}
}


// **************************************************************************************

function entryGet(menuID, entryID, type) { // Eintrags-Eigenschaften holen 
	if(!menu[menuID] || !menu[menuID][entryID]) return false;
	menuentry = menu[menuID][entryID];
	if(type == 'label')   return menuentry[0];
	if(type == 'action')  return parseInt(menuentry[1]);
	if(type == 'docID')  	return menuentry[2];
	if(type == 'docURL')  return menuentry[3];
	if(type == 'level')   return parseInt(menuentry[4]);
	if(type == 'hilight') return parseInt(menuentry[5]);
	if(type == 'parent') return parseInt(menuentry[6]);
	if(type == 'mousetext') return menuentry[7];
	if(type == 'contentpath') return menuentry[8];
	if(type == 'next')  return menuentry[9];
	if(type == 'opened')  return opened[menuID][entryID]; 
	//return parseInt(menuentry[6]);
	return false;
}

function entrySet(menuID, entryID, type, value) { // Eintrags-Eigenschaften setzen 
	if(!menu[menuID] || !menu[menuID][entryID]) return false;
	menuentry = menu[menuID][entryID];
	if(type == 'label')   menuentry[0] = value;
	if(type == 'action')  menuentry[1] = value;
	if(type == 'docID')  	menuentry[2] = value;
	if(type == 'docURL')  menuentry[3] = value;
	if(type == 'level')   menuentry[4] = value;
	if(type == 'hilight') menuentry[5] = value;
	if(type == 'parent') menuentry[6] = value;
	if(type == 'mousetext') menuentry[7] = value;
	if(type == 'contentpath') menuentry[8] = value;
	if(type == 'next') menuentry[9] = value;
	if(type == 'opened')  opened[menuID][entryID] = value;
	//menuentry[6] = value;
	return false;
}

function getParam(menuID, type) { // Menu-Eigenschaften holen 
	if(!mParams[menuID]) return;
	mparam = mParams[menuID].split('|');
	if(type == 'menutype') 	return parseInt(mparam[0]);
	if(type == 'load_first_page') return parseInt(mparam[1]);
	if(type == 'keep_open') return parseInt(mparam[2]);
	if(type == 'closeable') return parseInt(mparam[3]);
	if(type == 'expanded') 	return parseInt(mparam[4]);
	if(type == 'highlight') return mparam[5];
}


function do_download(prodArea,prodID,bundleID,conttype,type) {
	currentDoc="";
	alt_url=contentFrame.location.href;
	if(alt_url.indexOf(productpath)>-1) alt_url='&DirectProductURL='+alt_url.substring(alt_url.lastIndexOf('/')+1,alt_url.length);
	else alt_url='&DirectURL='+alt_url.substring(alt_url.lastIndexOf('/')+1,alt_url.length);
	alt_url=docpath+'systemcontentview/index.html?Open'+alt_url;
	theUrl=systempath+'DLsprungFrame.html?Open';
	theUrl+='&'+String(Math.random()).split(".")[1];
	if(prodID) root_id=prodID;
	if(prodArea) product_area=prodArea;
	if(bundleID) bundle_id=bundleID;	// neu 19.02.2002
	if(conttype) dl_cont_type=conttype;	// neu 21.03.2005
	if(type) dl_type=type;				// neu 21.03.2005
	contentFrame.location.href=theUrl; 
}

function do_shop(docID,prodArea,prodID) {
	alt_url=contentFrame.location.href;
	root_id=prodID;
	product_area=prodArea;
	SAPwin = window.open(systempath+'SAPsprung.html','fFrame','width=790,height=710,resizable=yes');
	SAPwin.focus();
}

function call_js(jsValue) {
	jsValue=jsValue.split('&#39;').join('"');
	eval(jsValue);
} 