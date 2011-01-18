//Arrays 1.ID: MenuID; 2.ID: LevelID

/*
mParams:
mParams[MenuID] = 'paramlist';

paramlist:
Menu Type | 1. Page laden (type 0 & 1) | Cat geöffnet lassen (type 0 only) | Cat schließbar (type 0 only) | Menu ist expanded (type 0 only) 

Menu Types:
0: Single (Explorer) Tree
1: Multi-Part (magix/esirion/staedtler/bulthaup/bulthaup partner)
*/ 

mParams = new Array();
mParams[0] = '1|0|0|0|0';
mParams[100] = '0|0|0|0|0';

mParams[1] = '0|0|1|0|1';

/*
mOutput:
mOutput[MenuID][Level] = 'TargetFrame~~TargetDIV';
*/

mOutput = new Array();
mOutput[0] = new Array();  //Menu-Tree
mOutput[0][0] = 'fTopnav~~m0';

mOutput[100] = new Array();  //Menu-Tree
mOutput[100][0] = 'fMainnav~~m0';

mOutput[1] = new Array();  //Menu-Tree
mOutput[1][0] = 'fContent~~m0';

// Twisties

var imgpage_n = new Array();
imgpage_n[1] = new Image();
imgpage_n[1].src = doc_path + 'imgref/N_twist_page_1n.gif/$FILE/twist_page_1n.gif';
imgpage_n[2] = new Image();
imgpage_n[2].src = doc_path + 'imgref/N_twist_page_2n.gif/$FILE/twist_page_2n.gif';
var imgpage_a = new Array();
imgpage_a[1] = new Image();
imgpage_a[1].src = doc_path + 'imgref/N_twist_page_1n.gif/$FILE/twist_page_1n.gif';
imgpage_a[2] = new Image();
imgpage_a[2].src = doc_path + 'imgref/N_twist_page_2a.gif/$FILE/twist_page_2a.gif';
var imgopen_n = new Array();
imgopen_n[1] = new Image();
imgopen_n[1].src = doc_path + 'imgref/N_twist_open_1n.gif/$FILE/twist_open_1n.gif';
imgopen_n[2] = new Image();
imgopen_n[2].src = doc_path + 'imgref/N_twist_open_2n.gif/$FILE/twist_open_2n.gif';
var imgopen_a = new Array();
imgopen_a[1] = new Image();
imgopen_a[1].src = doc_path + 'imgref/N_twist_open_1n.gif/$FILE/twist_open_1n.gif';
imgopen_a[2] = new Image();
imgopen_a[2].src = doc_path + 'imgref/N_twist_open_2n.gif/$FILE/twist_open_2n.gif';
var imgclose_n = new Array();
imgclose_n[1] = new Image();
imgclose_n[1].src = doc_path + 'imgref/N_twist_close_1n.gif/$FILE/twist_close_1n.gif';
imgclose_n[2] = new Image();
imgclose_n[2].src = doc_path + 'imgref/N_twist_close_2n.gif/$FILE/twist_close_2n.gif';
var imgclose_a = new Array();
imgclose_a[1] = new Image();
imgclose_a[1].src = doc_path + 'imgref/N_twist_close_1n.gif/$FILE/twist_close_1n.gif';
imgclose_a[2] = new Image();
imgclose_a[2].src = doc_path + 'imgref/N_twist_close_2n.gif/$FILE/twist_close_2n.gif';

var imgback = new Image();
imgback.src = doc_path + 'imgref/N_twist_up.gif/$FILE/twist_up.gif';

// Menu-Templates
mTemplateStart = new Array();
mTemplateLine = new Array();
mTemplateEnd = new Array();

// Menu-Templates Menu Switcher
mTemplateStart[0] = new Array();
mTemplateLine[0] = new Array();
mTemplateEnd[0] = new Array();

mTemplateStart[0][0] = '<TABLE CELLPADDING=0 CELLSPACING=0 BORDER=0 HEIGHT=14><TR HEIGHT=14>';
mTemplateLine[0][0] = '<TD CLASS="<entry-class>" NOWRAP HEIGHT=14><A HREF="javascript:parent.entryclick(<entry-id>)" CLASS="<entry-class>">&nbsp;&nbsp;&nbsp;&nbsp;<entry-label>&nbsp;&nbsp;&nbsp;&nbsp;</A></TD><TD><FONT COLOR=#666666>|</FONT></TD>';
mTemplateLine[0][1] = '';
mTemplateLine[0][2] = '';
mTemplateLine[0][3] = '';
mTemplateLine[0][4] = '';
mTemplateLine[0][5] = '';
mTemplateLine[0][6] = '';
mTemplateLine[0][7] = '';
mTemplateLine[0][8] = '';
mTemplateEnd[0][0] = '</TR></TABLE>\n';



mTemplateStart[100] = new Array();
mTemplateLine[100] = new Array();
mTemplateEnd[100] = new Array();

// Tree 1. Level
treeStart  = '<TABLE CELLPADDING=0 CELLSPACING=0 BORDER=0 WIDTH=164><TR>';
treeStart += '<TD><IMG SRC="/icons/ecblank.gif" WIDTH=12 HEIGHT=1></TD>';
treeStart += '<TD><IMG SRC="/icons/ecblank.gif" WIDTH=10 HEIGHT=1></TD>';
treeStart += '<TD><IMG SRC="/icons/ecblank.gif" WIDTH=142 HEIGHT=1></TD></TR>';

// Tree 2. Level
subTreeStart  = '<TABLE CELLPADDING=0 CELLSPACING=0 BORDER=0 WIDTH=151 ID="scrollObj1Doc">\n<TR>';
subTreeStart += '<TD><IMG SRC="/icons/ecblank.gif" WIDTH=12 HEIGHT=1></TD>';
subTreeStart += '<TD><IMG SRC="/icons/ecblank.gif" WIDTH=10 HEIGHT=1></TD>';
subTreeStart += '<TD><IMG SRC="/icons/ecblank.gif" WIDTH=129 HEIGHT=1 ID="scrollSpacer"></TD></TR>\n';

subTreeEnd = '</TABLE>\n';

// Scrollbar + Buttons
scrollBar  = '<IMG ID="scrollButtonUp" SRC="'+doc_path+'imgref/N_scroll_up.gif/$FILE/scroll_up.gif" WIDTH=13 HEIGHT=14 onmousedown="scrollstart(0,\'scrollObj1\')" onmouseup="scrollstop()" unselectable="on">';
scrollBar += '<DIV ID="scrollObj1Bar" unselectable="on"><DIV ID="scrollObj1Handle" unselectable="on"></DIV></DIV>';
scrollBar += '<IMG ID="scrollButtonDown" SRC="'+doc_path+'imgref/N_scroll_down.gif/$FILE/scroll_down.gif" WIDTH=13 HEIGHT=14 onmousedown="scrollstart(1,\'scrollObj1\')" onmouseup="scrollstop()" unselectable="on">';

startSubmenu  = '</TABLE><TABLE CELLPADDING=0 CELLSPACING=0 BORDER=0 WIDTH=164><TR><TD WIDTH=151>';
startSubmenu += '<DIV ID="scrollObj1Frame">' + subTreeStart;

endSubmenu = subTreeEnd + '</DIV></TD><TD WIDTH=13 VALIGN=top>' + scrollBar + '</TD></TR></TABLE>' + treeStart;


mTemplateStart[100][0] = treeStart;

mTemplateLine[100][1] =  '<TR HEIGHT=4><TD HEIGHT=4></TD></TR>\n';
mTemplateLine[100][1] += '<TR><TD VALIGN=top CLASS="<entry-class>"><A HREF="javascript:parent.entryclick(<entry-id>)"><IMG VSPACE=2 BORDER=0 SRC="<entry-imgsrc>" WIDTH=12 HEIGHT=10></A></TD><TD COLSPAN=2 CLASS="<entry-class>"><A HREF="javascript:parent.entryclick(<entry-id>)" CLASS="<entry-class>"><entry-label></A></TD></TR>\n';

mTemplateLine[100][2] =  '<TR HEIGHT=15><TD VALIGN=top ALIGN=right HEIGHT=15 CLASS="<entry-class>" COLSPAN=2><A HREF="javascript:parent.entryclick(<entry-id>)"><IMG BORDER=0 SRC="<entry-imgsrc>" WIDTH=10 HEIGHT=11></A></TD><TD CLASS="<entry-class>"><A HREF="javascript:parent.entryclick(<entry-id>)" CLASS="<entry-class>"><entry-label></A></TD></TR>\n';
mTemplateLine[100][2] += '<TR HEIGHT=1><TD HEIGHT=1 COLSPAN=3 BGCOLOR="#FFFFFF"><SPACER TYPE="block" WIDTH=151 HEIGHT=1></TD></TR>\n';

mTemplateEnd[100][0] = '<TR><TD ID="menuheightmarker"></TD></TR></TABLE>\n';


treeheader  = '<TABLE BORDER=0 CELLPADDING=0 CELLSPACING=0 WIDTH=164 HEIGHT=32>';
treeheader += '<TR>';
treeheader += '<TD HEIGHT=32 CLASS="areahead" VALIGN=top>'+homenavcountry+'</TD>';
treeheader += '</TR>';
treeheader += '</TABLE>';
