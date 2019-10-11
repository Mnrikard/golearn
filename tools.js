/**Reusable javascript peices
*/

var dtrx = /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/]?((((0?[13578])|(1[02]))[\-\/]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s(((0?[0-9])|(1[0-9])|(2[0-3]))\:([0-5][0-9])((\s)|(\:([0-5][0-9])))?))?$/i;
var dtrxAmPm = /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s(((0?[1-9])|(1[0-2]))\:([0-5][0-9])((\s)|(\:([0-5][0-9])\s))([AM|PM|am|pm]{2,2})))?$/i;

//many thanks for the above regular expression to Sung Lee: http://regexlib.com/REDetails.aspx?regexp_id=390.
var hiddenSels = new Array();
var ptop = 0,pleft = 1;


///Whaaaat!!! cross browser, maintains "this", super awesome attach event
///Thanks: http://weblogs.asp.net/asmith/archive/2003/10/06/30744.aspx
var XBrowserAddHandler = function (target,eventName,handlerName) {
    if ( target.addEventListener ) {
        target.addEventListener(eventName, function(e){target[handlerName](e);}, false);
    } else if (target.attachEvent) {
        target.attachEvent("on" + eventName, function(e){
            target[handlerName](e);
        });
    } else {
        var originalHandler = target["on" + eventName];
        if ( originalHandler ) {
            target["on" + eventName] = function(e){
                originalHandler(e);
                target[handlerName](e);
            };
        } else {
            target["on" + eventName] = target[handlerName];
        }
    }
};


///hides select boxes based off of an object that would hover over them.
function HideSels(obj){ 
    //hides select boxes based off of where they are in relation to the object passed in
    ShowSels();
    var hs = 0;
    var t = obj.style.top.replace("px","");
    var l = obj.style.left.replace("px","");
    var r = obj.style.right.replace("px","");
    var b = obj.style.bottom.replace("px","");
    var h = obj.offsetHeight;
    var w = obj.offsetWidth;
    if(t+"" == "" || l+"" == ""){
        var pa = GetPos(obj);
        t = pa[ptop];
        l = pa[pleft];
    }
    if(r+"" == "") r = parseInt(l)+parseInt(w);
    if(b+"" == "") b = parseInt(t)+parseInt(h);
    var sels = document.getElementsByTagName("select");
    for(var i = 0;i < sels.length;i++){
        var pa = GetPos(sels[i]);
        if(pa[ptop] < b && (pa[ptop]+sels[i].offsetHeight) > t){//satisfies y axis
            if(pa[pleft] < r && (pa[pleft]+sels[i].offsetWidth) > l){
                hiddenSels[hs++] = sels[i];
                sels[i].style.visibility="hidden";
            }
        }
    }
}

///shows all hidden select boxes.
function ShowSels(){ 
    //shows all hidden select boxes
    for(var i = 0;i < hiddenSels.length;i++){
        hiddenSels[i].style.visibility="visible";
    }
    hiddenSels = new Array();
}    

///if the string is null or empty, it replaces it with the rep string (see isnull).
function IfNull(str,rep){ 
    return IsNull(str,rep);
}

///if the string is null or empty, it replaces it with the rep string (see ifnull).
function IsNull(str,rep){ 
    if(str == null || str == "" || str == '' || str.match(/^\s*$/)){
        return rep;
    }
    return str;
}

///kills all child elements of passed element.
function infanticide(obj){ 
    while(obj.childNodes[0]){
        obj.removeChild(obj.childNodes[0]);
    }
}

///checks if the value of the object id is blank and if it is, sets the value passed in.
function setIfBlank(objid,newval){ 
    if(gid(objid).value == ""){gid(objid).value = newval;}
}

///returns the value of a radio button collection.
function getRadio(obj){ 
    if(!obj.name && !obj.id){
        obj = gid(obj.toString());
    }
    var rval='';
    if(obj){
        var rads = document.getElementsByName(obj.name);
        for(var i=0;i<rads.length;i++){if(rads[i].checked==true)rval=rads[i].value;}
    }
    return rval;
}

///pass a name, get the selected value of the radio button group.
function getRadioByName(nm){ 
    //same as getRadio but by name, not object
    var rads = document.getElementsByName(nm);
    for(var i=0;i<rads.length;i++){
        if(rads[i].type && rads[i].type=="radio" && rads[i].checked){
            return rads[i].value;
        }
    }
    return "";
}

///returns the index of a radio button list where the value matches the passed string.
function radioIndex(str,obj){ 
    //returns the index of the radio button selected
    for(var i=0;i<obj.length;i++){if(obj[i].value==str)return(i);}
    return null;
}

///gets the position of an element.
function GetPos(obj){ 
    var tobj = obj;
    var posArr = new Array(tobj.offsetTop,tobj.offsetLeft);
    while(tobj.offsetParent){
        tobj = tobj.offsetParent;
        posArr[0] += tobj.offsetTop;
        posArr[1] += tobj.offsetLeft;
    }
    return posArr;
}

///same as GetPos but returns an object instead of array.
function GetPosO(obj){ 
    var tobj = obj;
    var posArr = new Array(tobj.offsetTop,tobj.offsetLeft);
    while(tobj.offsetParent){
        tobj = tobj.offsetParent;
        posArr[0] += tobj.offsetTop;
        posArr[1] += tobj.offsetLeft;
    }
    return {top:posArr[0],left:posArr[1]};
}

///returns an xmlhttp object for AJAX.
function GetXmlHttpObject(){ 
    var objXMLHttp=null;
    if (window.XMLHttpRequest){
        objXMLHttp=new XMLHttpRequest();
    }else if (window.ActiveXObject){
        objXMLHttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    return objXMLHttp;
}

///gets element by id, allows for IE blunder.
function gid(str){ 
    var obj = document.getElementById(str);
    if(!obj || !obj.id || obj.id != str){
        /*
        Stupid IE 7
        IE chooses to return any object with the NAME if it finds it first, then the ID
        So we have to fix their error by getting elements by name and checking the id
        */
        if(document.getElementsByName(str).length > 1){
            for(var i=0;i<document.getElementsByName(str).length;i++){
                if(document.getElementsByName(str)[i].id == str){
                    obj = document.getElementsByName(str)[i];
                    break;
                }
            }
        }
    }
    return obj;
}

///takes something like 'onclick="doclick()" onmouseover="domouse()"' and makes it into obj.onclick=function(){doclick();};obj.onmouseover=function(){domouse();};.
function setAttrFromText(obj,txt){  
    var attrs = attrParse(txt);
    for(var i=0;i<attrs.length;i++){
        if(attrs[i].indexOf("=") != "-1"){
            var attr = attrs[i].substring(0,attrs[i].indexOf("="));
            var attrVal = attrs[i].substring(attrs[i].indexOf("=")+1);
            attrVal = attrVal.replace(/^"/,"");
            attrVal = attrVal.replace(/"$/,"");

            if(attr.match(/^on/i)){
                attr = attr.toLowerCase();
                //attr = attr.substring(0,2)+attr.substr(2,1).toUpperCase()+attr.substring(3);
                if(attr == "style"){
                    setStyleAttrParse(obj,attr)
                }else{
                    eval("obj."+attr+" = function(){"+attrVal+"}");
                }
            }else{
                obj.setAttribute(attr,attrVal);
            }
        }
    }
}

///parses the list of attributes for "setAttrFromText" to work with.
function attrParse(txt){ 
    var attrs = [];
    var ai=0;
    var inquot = false;
    var prevch = "";
    var buildString = "";
    for(var i=0;i<txt.length;i++){
        var ch = txt.charAt(i);
        if(ch == "\"" && prevch != "\\"){inquot = !inquot;}
        
        if(ch==" " && !inquot){
            attrs[ai++] = buildString;
            buildString = "";
        }else{
            buildString += ch;
        }
        
        if(prevch == "\\" && ch == "\\"){
            prevch = "backslash";
        }else{
            prevch = ch;
        }
    }
    attrs[ai++] = buildString;
    return attrs;
}

///parses  and splits based on "=".
function attrParse2(txt){ 
    var attrs = [];
    var ai=0;
    var inquot = false;
    var prevch = "";
    var buildString = "";
    for(var i=0;i<txt.length;i++){
        var ch = txt.charAt(i);
        if(ch == "\"" && prevch != "\\"){inquot = !inquot;}
        
        if(ch==" " && !inquot){
            var newarr = buildString.split("=");
            for(var j=0;j<newarr.length;j++){
                //trim and remove preceeding and trailing quotations
                newarr[j] = newarr[j].replace(/^\s+/g,"").replace(/\s+$/g,"").replace(/^"/,"").replace(/"$/,"");
            }            
            attrs[ai++] = newarr;
            buildString = "";
        }else{
            buildString += ch;
        }
        
        if(prevch == "\\" && ch == "\\"){
            prevch = "backslash";
        }else{
            prevch = ch;
        }
    }
    var newarr = buildString.split("=");
    for(var j=0;j<newarr.length;j++){
        //trim and remove preceeding and trailing quotations
        newarr[j] = newarr[j].replace(/^\s+/g,"").replace(/\s+$/g,"").replace(/^"/,"").replace(/"$/,"");
    }            
    attrs[ai++] = newarr;
    return attrs;
}

///special parser for style attributes pass it an object and a style argument list.
function setStyleAttrParse(obj,attr){ 
    var attrs = attr.split(";");
    for(var i=0;i<attrs.length;i++){
        var namval = attrs[i].split(":");
        if(namval.length>1){
            if(m = namval[0].match(/\-\w/)){
                for (k=0;k<m.length;k++){
                    namval[0] = namval[0].replace(m[k],m[k].replace("-","").toUpperCase());
                }
            }
            eval("obj.style."+namval[0]+"='"+namval[1]+"'");
        }
    }
}

///replaces the word "this" outside of a string with repwith param.
function repThis(txt,repwith) { 
    var outquotes = [];
    var inquot = false,currIndex=0;
    var prevch = "";
    
    for(var i=0;i<txt.length;i++){
        var ch = txt.charAt(i);
        if((ch == "\"" || ch == "'") && prevch != "\\"){//its the start or end of a string
            if(!inquot){//it's the start of the string
                outquotes.push([currIndex,i]);
            }
            currIndex=i;
            inquot = !inquot;
        }
    }
    if(!inquot){
        outquotes.push([currIndex,txt.length-1]);
    }
    
    var buildString = "";
    currIndex=0;
    for(var i=0;i<outquotes.length;i++){
        buildString += txt.substring(currIndex,outquotes[i][0]) + txt.substring(outquotes[i][0],outquotes[i][1]+1).replace("this",repwith);
        currIndex = outquotes[i][1]+1;
    }
    if(txt.length > outquotes[outquotes.length-1][1]){
        buildString += txt.substr(outquotes[outquotes.length-1][1]+1);
    }
    return buildString;
}

///document.createElement, but takes into account the IE bug for naming an element.
function createElement(el,nm,elid){ 
    //stupid IE again
    if (!elid) {
        elid = nm;
    }
    var element = null;
    // Try the IE way; this fails on standards-compliant browsers
    try{
        element = document.createElement('<' + el + ' name="' + nm + '" id="' + elid + '">');
    }catch(e){}
    if(!element || element.nodeName != el.toUpperCase()) {
        // Non-IE browser; use canonical method to create named element
        element = document.createElement(el);
        element.name = nm;
        element.id = elid;
    }
    return element;
}

///finds an element by it's name.
function FindEl(nm){ 
    if(gid(nm))
        return gid(nm);
    for(var i=0;i<document.forms.length;i++){
        var el;
        if(el=eval("document.forms["+i+"]."+nm))
            return el;            
    }
    return;
}

///selects a particular item in a select list (find by value).
function AutoSelect(nm,valu){ 
    var nv=FindEl(nm);
    if(nv.type.indexOf("select")!="-1"){
        for(j=0;j<nv.options.length;j++){
            if(nv.options[j].value==valu){
                nv.selectedIndex=j;
                break;
            }
        }
    }
}

///selects a particular item in a select list (find by regex).
function selectOne(slist,val){ 
    if(slist){
        var reval = new RegExp("^"+val+"$","i");
        for(var i=0;i<slist.options.length;i++){
            if(reval.test(slist.options[i].value)){
                slist.selectedIndex = i;
                break;
            }
        }
    }
}

///selects a particular item in a select list regex match to optText.
function selectOneText(slist,val){ 
    if(slist){
        var reval = new RegExp("^"+val+"$","i");
        for(var i=0;i<slist.options.length;i++){
            if(reval.test(optText(slist.options[i]))){
                slist.selectedIndex = i;
                break;
            }
        }
    }
}

///checks multiple radio buttons/check boxes based on a value passed.
function checkMult(elname,val){ 
    var els = document.getElementsByName(elname);
    if(els){
        for(var i=0;i<els.length;i++){
            if(els[i].value == val){
                els[i].checked = true;
            }else{
                els[i].checked = false;
            }
        }
    }
}

///selects multiple instances in a select-multiple drop down box.
function selectMult(slist,val){ 
    var els = slist.options;
    if(els){
        for(var i=0;i<els.length;i++){
            if(els[i].value == val){
                els[i].selected = true;
            }else{
                els[i].selected = false;
            }
        }
    }
}


///adds functions to the load event.
function addLoadEvent(func) { 
    //many thx, http://simonwillison.net/
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            eval(func);
        };
    }
}

///if you can't use addLoadEvent, this will do basically the same thing.
function winloadAppend(func){ 
    var oldonload = "";
    if(window.onload){
        oldonload = window.onload.toString();
    }
    if(oldonload+"" == ""){
        oldonload = "function(){\n"+func+"\n}";
    }else{
        moc1=oldonload.substring(0,oldonload.lastIndexOf("}"));
        moc2=oldonload.substring(oldonload.lastIndexOf("}"));
        oldonload=moc1+"\n"+func+"\n"+moc2;
    }
    eval("window.onload = "+oldonload);
}

///super-cool AJAX, tell it the function to act on the return text,the url to go to, and any options if you want to use post.
function connect(func,url,opts){ 
    if(opts == null)opts="";
    var xmlHttp;
    if (window.XMLHttpRequest){
        xmlHttp=new XMLHttpRequest();
    }else if (window.ActiveXObject){
        xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(xmlHttp == null){alert("Browser does not support AJAX");return;}
    var method="POST";
    if(opts == "") method="GET";
    xmlHttp.open(method,url,true);
    xmlHttp.onreadystatechange = function() {
        if(xmlHttp.readyState==4 || xmlHttp.readyState=="complete"){
            if(func.match(/\[xml\]/ig)){
                eval(func.replace(/\[xml\]/ig,"xmlHttp.responseText"));
            }else{
                eval(func + '(xmlHttp.responseText)');
            }
        }
    }
    if(method=="POST"){
        xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xmlHttp.send(opts);
    }else{
        xmlHttp.send(null);
    }
}//end function

///I'm pretty sure this is public domain by now
function insertAfter(inode, refNode) {
  refNode.parentNode.insertBefore(inode, refNode.nextSibling);
}

///just like node.insertBefore, but easier.
function preInsert(inode,refNode){
    refNode.parentNode.insertBefore(inode, refNode);
}

///sorts a tbody based off of a column number.
function tableSort(tbod,coln,ascdesc){ 
    var trs = [];
    for(var i=0;i<tbod.getElementsByTagName("tr").length;i++){
        trs[i] = {sorton:tbod.getElementsByTagName("tr")[i].getElementsByTagName("td")[coln].innerHTML.toLowerCase(),trow:tbod.getElementsByTagName("tr")[i]}
    }
    if(ascdesc=="desc"){
        trs.sort(compareClassDesc);
    }else{
        trs.sort(compareClass);
    }
    while(tbod.childNodes[0]){
        tbod.removeChild(tbod.childNodes[0]);
    }
    for(var i=0;i<trs.length;i++){
        tbod.appendChild(trs[i].trow);
    }
}

///compare used in tableSort function.
function compareClass(cls1,cls2){ 
    if(cls1.sorton > cls2.sorton){
        return 1;
    }
    if(cls1.sorton < cls2.sorton){
        return -1;
    }
    return 0;
}

///compare used in tableSort function (Descending).
function compareClassDesc(cls1,cls2){ 
    if(cls1.sorton > cls2.sorton){
        return -1;
    }
    if(cls1.sorton < cls2.sorton){
        return 1;
    }
    return 0;
}

///finds the first-parent table row and toggles it's display from none to "".
function toggleObjRow(obj){ 
    while(obj.tagName.toUpperCase()!="TR"){
        obj = obj.parentNode;
    }
    obj.style.display = (obj.style.display=="none")?"":"none";
}

///sets a cookies value.
function setCookie(c_name,value,expiredays){ 
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

///gets a cookie by the name.
function getCookie(c_name){ 
    if (document.cookie.length>0){
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){ 
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        } 
    }
    return "";
    
}

/// appends info to a cookie.
function appendCookie(c_name,value,expiredays){ 
    var curval = getCookie(c_name);
    if(curval==""){
        setCookie(c_name,value,expiredays);
    }else{
        curval += ", "+escape(value);
        setCookie(c_name,curval,expiredays);
    }
}

///creates an option for select lists but takes into account the differences between option text and option innerHTML
function createOption(val,txt){ 
    if(txt == null) txt = val;
    opt = document.createElement("option");
    if(opt.text){
        opt.text = txt;
        opt.value = val;
    }else{
        opt.innerHTML = txt;
        opt.value = val;
    }
    return opt;
}

///sets the text/innerHTML of an option.
function setOptText(opt,txt,val){ 
    if(val){
        opt.value = val;
    }
    if(opt.text){
        opt.text = txt;
    }else{
        opt.innerHTML = txt;
    }
}

/// returns if an array matches (bitw=1: match by bit, otherwise match by text).
function ArrayMatch(arr1,arr2,bitw){ 
    if(arr1.length != arr2.length){
        return false;
    }
    if(bitw){//bitwise
        for(var i=0;i<arr1.length;i++){
            if(arr1[i] != arr2[i]){
                return false;
            }
        }
    }else{//text compare
        for(var i=0;i<arr1.length;i++){
            if(arr1[i].toLowerCase() != arr2[i].toLowerCase()){
                return false;
            }
        }
    }
    return true;
}

///add an onclick event to an element (doesn't overwrite the current event).
function AddClick(el,func){ 
    var oldclick = el.onclick;
    if(typeof el.onclick != 'function'){
        el.onclick = func;
    }else{
        el.onclick = function(){
            if(oldclick){
                oldclick();
            }
            func();
        }
    }
}

///add an onchange event to an element (doesn't overwrite the current event).
function AddChange(el,func){ 
    var oldchange = el.onchange;
    if(typeof el.onchange != 'function'){
        el.onchange = func;
    }else{
        el.onchange = function(){
            if(oldchange){
                oldchange();
            }
            func();
        }
    }
}

///gets the text/innerHTML of an option (or option list for select-one elements).
function optText(obj){ 
    var opt;
    if(obj.tagName.toUpperCase() == "OPTION"){
        opt = obj;
    }else{
        opt = obj.options[obj.selectedIndex];
    }
    if(opt.innerHTML && opt.innerHTML != ""){
        return opt.innerHTML;
    }
    if(opt.text){
        return opt.text;
    }
    return opt.value;
}

///get the value of any object (radio|checkbox|select-one|select-multiple|textarea|etc).
function getValue(obj){ 
    var op = "";
    var comma = "";
    
    if(!obj){return "";}    

    if(obj.type == "select-one"){
        try{
            op = obj.options[obj.selectedIndex].value;
        }catch(err){
            op = "";
        }
    }
    if(obj.type == "select-mult"){
        for(var i=0;i<obj.options.length;i++){
            if(obj.options[i].selected){
                op += comma + obj.options[i].value;
                comma = ", ";
            }
        }
    }
    if(obj.type == "radio"){
        var rd = document.getElementsByName(obj.name);
        for(var i=0;i<rd.length;i++){
            if(rd[i].type == "radio" && rd[i].checked){
                op = rd[i].value;
                return op;
            }
        }
    }
    if(obj.type == "checkbox"){
        if(obj.checked){
            return obj.value;
        }else{
            return "";
        }
    }
    if(obj.value){
        return obj.value;
    }
    return op;
}

/// tell whether or not an element has a particular attribute (works even if the attribute is an empty string).
function hasAttribute(elem,attr) { 
    var isset;
    try {
        eval("isset=typeof elem."+attr+"!='undefined';");
    }catch(e){
        isset=false;
    }
    return isset;
}

///trims leading and trailing whitespace.
function trim(str){ 
    return str.replace(/\s+$/g,"").replace(/^\s+/g,"");
}

///travels down tree until the parent tagName matches.
function getParentByTagName(obj,tag){ 
    while(obj.parentNode && obj.parentNode.tagName.toLowerCase() != tag.toLowerCase()){
        obj = obj.parentNode;
    }
    return obj.parentNode;
}

///returns the label that belongs to that element id.
function getLabel(fr){ 
    var lbl = document.getElementsByTagName("label");
    for(var i=0;i<lbl.length;i++){
        if(lbl[i].htmlFor == fr){
            return lbl[i];
        }
    }
}

///universal true/false indicator.
function tf(val){ 
    if(val&"" == "" || val.toString().toLowerCase() == "false" || val.toString()=="0" || val.toString().toLowerCase()=="f"){
        return false;
    }
    return true;
}

///Appends an event to an object without destroying the current event.
///
///Does not specify whether this function runs before or after the current function
function addEvent(addTo,eventType,func){
    //pass in the element (addTo), the eventType (click,change,load), and the function to execute (func)
    if(addTo.addEventListener){//FF and others
        addTo.addEventListener(eventType,func,false);
    }else if(addTo.attachEvent){//IE
        addTo.attachEvent("on"+eventType,func);
    }
}

///set the value of any object (radio|checkbox|select-one|select-multiple|textarea|etc).
function setValue(obj,val) { 
    if (!obj) { return false; }
    var rx = new RegExp("(" + val.replace(/,\s*/g, "|") + ")", "i");
    if (obj.value) {
        obj.value = val;
        return true;
    }
    if (obj.type == "select-one") {
        for (var i = 0; i < obj.options.length; i++) {
            if (obj.options[i].value.toLowerCase() == val.toLowerCase()) {
                obj.selectedIndex = i;
                return true;
            }
        }
        return false;
    }
    if (obj.type == "select-mult") {            
        for (var i = 0; i < obj.options.length; i++) {
            if (rx.test(obj.options[i].value)) {
                obj.options[i].selected = true;
            } else {
                obj.options[i].selected = false;
            }
        }
        return true;
    }
    if (obj.type == "radio" || obj.type=="checkbox") {
        var rd = document.getElementsByName(obj.name);
        for (var i = 0; i < rd.length; i++) {
            if (rx.test(rd[i].value)) {
                rd[i].checked = true;
            } else {
                rd[i].checked = false;
            }
        }
        return true;
    }

    if (obj.innerHTML) {
        obj.innerHTML = val;
        return true;
    }
    return false;         
}

function defineOther(slist,otherval) {
    var updatestring = "Please specify:";
    if(slist.parentNode.tagName.toLowerCase() == "td" && slist.parentNode.previousSibling.tagName.toLowerCase() == "td") {
        updatestring = "Please specify "+slist.parentNode.previousSibling.innerHTML;
    }
    
    if(slist.options[slist.selectedIndex].value.toLowerCase() == otherval.toLowerCase()) {
        window.open('defineOther.aspx?updatestring='+updatestring+'&parid='+slist.id,'selectOther','menubar=no,toolbars=no,height=300,width=300,resizable=yes,scrollbars=yes');
    }
}





