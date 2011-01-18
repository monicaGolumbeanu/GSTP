//milliseconds to wait before showing indicator
var notshow = false;

if (!timeout) {
    var timeout = 100;
}
if (!waitmessage) {
    var waitmessage = 'Please wait';
}

function setWaitMessage(message) {
    waitmessage = message;
}

function indicatorinit() {
  useBigLoadingImage();
}

if (window.addEventListener) {
  window.addEventListener("load", indicatorinit, false);
} else if (window.attachEvent) {
  window.attachEvent("onload", indicatorinit);
} else {
  window.onload = indicatorinit;
}

function showindicator() {
 var loadingImage = "./images/gui_control/loadingbar2.gif";
 if (!notshow) {
     disableZone(true, 'waitBox');
        if (!document.getElementById('waitBox')) {
            var messageBox=document.createElement('DIV');
            messageBox.style['zIndex'] = "5011";
            messageBox.style['position'] = "absolute";
            messageBox.style['left'] = "0px";
            messageBox.style['top'] = "0px";
            messageBox.style['height'] = "100px";
            messageBox.style['width'] = "300px";        
            messageBox.style['padding'] = "0px";
            messageBox.setAttribute('id','waitBox');
            var innermessageBox=document.createElement('DIV');
            innermessageBox.className='euhMessageBox';
            innermessageBox.style['zIndex'] = "5011";
            innermessageBox.style['left'] = "0px";
            innermessageBox.style['top'] = "0px";
            innermessageBox.style['width'] = "250px";
            innermessageBox.style['margin'] = "0px";
            innermessageBox.style['padding'] = "0px";
            innermessageBox.style['paddingBottom'] = "2px";
            innermessageBox.setAttribute('id','innerwaitBox');
            messageBox.appendChild(innermessageBox);
            var div1=document.createElement('div');
            div1.className='euhCanvasWindowTitelBar';
            div1.style['padding'] = "0px";
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
//          var txt2=document.createTextNode('');
//          span1.appendChild(txt2);
            var td2=document.createElement('td');
            td2.setAttribute('align','right');
            tr1.appendChild(td2);
            var input1=document.createElement('input');
            input1.setAttribute('type','image');
            input1.className='euhButton';
            input1.setAttribute('src','images/gui_control/close.gif');
            input1.onclick=cancelServerCall;
            input1.setAttribute('title','cancel');
            input1.style['margin'] = "1px;";
            td2.appendChild(input1);
            innermessageBox.appendChild(div1);
            var messageText=document.createElement('DIV');
            messageText.setAttribute('id','message_text');
            messageText.style['marginTop'] = "5px";
            messageText.style['marginBottom'] = "2px";
            messageText.style['textAlign'] = "center";

            
            innermessageBox.appendChild(messageText);
            messageText.innerHTML = waitmessage;
            
            var picturecontainer=document.createElement('DIV');
            picturecontainer.style['marginTop'] = "5px";
            picturecontainer.style['marginBottom'] = "10px";
            picturecontainer.style['textAlign'] = "center";
            var pleasewait=document.createElement('IMG');
            pleasewait.setAttribute('src',loadingImage);
            picturecontainer.appendChild(pleasewait);
            innermessageBox.appendChild(picturecontainer);
            document.body.appendChild(messageBox);
        } 
    else {
            document.getElementById('waitBox').style['visibility']='';
    }
    centerDiv('waitBox');
   }
  }

/* this functionality is declared in loadIndicator.js
*/
function disableLoadImage() {
    if ($('waitBox')) {
        $('waitBox').style.visibility = 'hidden';
    } 
    disableZone(false, 'waitBox'); 
    notshow = true;
}

function cancelServerCall() {
  disableLoadImage();
  bussy = false;
  processeQueue();
}


function useBigLoadingImage() {
    dwr.engine.setPreHook(function() {
        notshow = false;
        window.setTimeout("showindicator()",timeout);
    }
    );
/*  AS: move to fireEventBack in controlls.js
*/
    dwr.engine.setPostHook(function() {
    disableLoadImage()
  }
  );
}
