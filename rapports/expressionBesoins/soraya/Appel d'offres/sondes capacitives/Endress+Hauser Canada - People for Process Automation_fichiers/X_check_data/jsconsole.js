var debug = false;

function ReadCookie(cname) {
	 a = document.cookie;
	 res = '';
	 while(a != '')	{
	 	cookiename = a.substring(0,a.search('='));
		cookiewert = a.substring(a.search('=')+1,a.search(';'));
	  	if(cookiewert == '') {
	  		cookiewert = a.substring(a.search('=')+1,a.length);
		}
		if(cname == cookiename){
		  res = cookiewert;
		 }
	  i = a.search(';')+1;
	  if(i == 0){i = a.length}
	  a = a.substring(i,a.length);
 }
 return(res)
}

if(document.cookie && !debug) {
	var debugcookie = ReadCookie('isdebug');
	if (debugcookie == 'true') {
		debug = true;
	} else {
		debug = false;
	}
}

if (debug) {
	//create console window for IE
	if (!("console" in window) || !("firebug" in console)) {
	  window.console = {
	    timers: {},
	    openwin: function() {
	      window.top.debugWindow =
	          window.open("",
	                      "Debug",
	                      "left=0,top=0,width=300,height=700,scrollbars=yes,"
	                      +"status=yes,resizable=yes");
	      window.top.debugWindow.opener = self;
	      window.top.debugWindow.document.open();
	      window.top.debugWindow.document.write('<html><head><title>debug window</title></head><body><hr /><pre>');
	    },
	
	    log: function(entry) {
	      window.top.debugWindow.document.write(entry+"\n");
	    },
	    debug: function(entry) {
	      window.top.debugWindow.document.write(entry+"\n");
	    },
	    info: function(entry) {
	      window.top.debugWindow.document.write("<font color='blue'>"+entry+"</font>\n");
	    },
	    warn: function(entry) {
	      window.top.debugWindow.document.write("<font color='red'>"+entry+"</font>\n");
	    },
    time: function(title) {
      window.console.timers[title] = new Date().getTime();
    },

    timeEnd: function(title) {
      var time = new Date().getTime() - window.console.timers[title];
      console.log(['<strong>', title, '</strong>: ', time, 'ms'].join(''));
    }	    
	
	  }
	
	  if (!window.top.debugWindow) { console.openwin(); }
	}
} else {
	//hide console in productive state
	window.console = {
  	log:function(){}, 
  	info:function(){}, 
  	debug:function(){}, 
  	warn:function(){},
  	time:function(){},
  	timeEnd:function(){}
	}
}
