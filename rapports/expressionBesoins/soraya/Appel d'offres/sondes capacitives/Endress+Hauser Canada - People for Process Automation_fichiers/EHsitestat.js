// nedstat: function sitestat
function sitestat(ns_l){// FromURL v1.5 Copyright (c) 2001-2007 Nedstat B.V. All rights reserved. 
var ns_type=''          // leave empty for normal/ppc measurement, fill in for clickin, clickout or pdf 
var r=''                // yes=only parse url when there is a real document.referrer, 
                        // no=only parse url when there is no real document.referrer, empty=always parse url   
var t='?'               // tag in url where parameters follow; default '?' could be replaced by "#" 
var p=new Array();var w='';var l='';var d=document;var n=navigator;var ns_0='' 
;if(top!=self){if('\u0041'=='A'){var u=n.userAgent;if(u.indexOf('Safari')==-1) 
{var b=u.indexOf('Opera');if(b==-1||(u.charAt(b+6)+0)>5){b=u.indexOf('Mozilla' 
);var xb=b!=-1?u.charAt(b+8)>4:1;if(u.indexOf('compatible')!=-1||xb){var c= 
'try{ns_0=top.document.referrer}catch(e){}';eval(c);c= 
'try{l=top.document.location.href}catch(e){}';eval(c);}}}}}else{ns_0= 
d.referrer;l=d.location.href;}if(ns_0.lastIndexOf('/')==ns_0.length-1){ns_0= 
ns_0.substring(ns_0.lastIndexOf('/'),0);}var f=ns_l.indexOf('?');if(f!=-1){ 
var q=ns_l.substring(f+1);ns_l=ns_l.substring(0,f);if(q){var m=q.indexOf('&'); 
w=q.substring(0,m==-1?q.length:m);if(w.indexOf('=')!=-1){w='';}if(w){q= 
q.substring(m==-1?q.length:m+1);q+=(q?'&':'')+'ns_name='+w;}if(ns_0.length>0){ 
q+=(q?'&':'')+'ns_referrer='+escape(ns_0);}var s=0;var e=0;while(q.length){e= 
q.indexOf('&');if(e==-1){e=q.length;}var o=q.substring(s,e);if(o.substring(0,4 
)=='amp;'){o=o.substring(4);}if(o)p[p.length]=o;q=q.substring(e+1);}}}var a= 
l.indexOf(t);a=a==-1?0:l.substring(a+1);var j;if(r=='yes')j=ns_0.length;else 
if(r=='no')j=!ns_0.length;else if(r=='')j=1;if(a&&j){while(a.length){var e= 
a.indexOf('&');if(e==-1){e=a.length;}var k=a.substring(0,a.substring(0,e) 
.indexOf('='));var v=a.substring(a.substring(0,e).indexOf('=')+1,e);if( 
k.substring(0,4)=='amp;'){k=k.substring(4);}while(v.substring(0,1)=='='){v= 
v.substring(1);}if(k=='ns_name'){w=v;}else if(k=='ns_or'){var g='ns_referrer=' 
;for(var z=0;z<p.length;z++){if(p[z].substring(0,g.length)==g){p[z]= 
'ns_referrer='+v;}}}else{if(k.substring(0,3)=='ns_'&&v&&k){var h=0;for(var x=0 
;x<p.length;x++){if(p[x].substring(0,p[x].indexOf('='))==k){p[x]=k+"="+v;h=1}} 
if(!h){p[p.length]=k+"="+v;}}}a=a.substring(e+1);}}if(!w){return;}var s=''; 
var y='';for(var i=0;i<p.length;i++)if(p[i].substring(0,8)!='ns_name='){if(p[i 
].substring(0,12)!='ns_referrer='){s+='&'+p[i];}else{y='&'+p[i];}}s+=ns_type? 
'&ns_type='+ns_type+'&ns_action=view':'';ns_pixelUrl=ns_l+'?'+w+"&ns__t="+( 
new Date()).getTime();ns_l=ns_pixelUrl+s+y;if(d.images){ns_1=new Image(); 
ns_1.src=ns_l;}else{d.write('<img src='+ns_l+' width="1" height="1">');}}