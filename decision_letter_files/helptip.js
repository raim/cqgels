/*----------------------------------------------------------------------------\
|                               Help Tip 1.12                                 |
|-----------------------------------------------------------------------------|
|                         Created by Erik Arvidsson                           |
|                  (http://webfx.eae.net/contact.html#erik)                   |
|                      For WebFX (http://webfx.eae.net/)                      |
|-----------------------------------------------------------------------------|
|           A tool tip like script that can be used for context help          |
|-----------------------------------------------------------------------------|
|                  Copyright (c) 1999 - 2002 Erik Arvidsson                   |
|-----------------------------------------------------------------------------|
| This software is provided "as is", without warranty of any kind, express or |
| implied, including  but not limited  to the warranties of  merchantability, |
| fitness for a particular purpose and noninfringement. In no event shall the |
| authors or  copyright  holders be  liable for any claim,  damages or  other |
| liability, whether  in an  action of  contract, tort  or otherwise, arising |
| from,  out of  or in  connection with  the software or  the  use  or  other |
| dealings in the software.                                                   |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| This  software is  available under the  three different licenses  mentioned |
| below.  To use this software you must chose, and qualify, for one of those. |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| The WebFX Non-Commercial License          http://webfx.eae.net/license.html |
| Permits  anyone the right to use the  software in a  non-commercial context |
| free of charge.                                                             |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| The WebFX Commercial license           http://webfx.eae.net/commercial.html |
| Permits the  license holder the right to use  the software in a  commercial |
| context. Such license must be specifically obtained, however it's valid for |
| any number of  implementations of the licensed software.                    |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| GPL - The GNU General Public License    http://www.gnu.org/licenses/gpl.txt |
| Permits anyone the right to use and modify the software without limitations |
| as long as proper  credits are given  and the original  and modified source |
| code are included. Requires  that the final product, software derivate from |
| the original  source or any  software  utilizing a GPL  component, such  as |
| this, is also licensed under the GPL license.                               |
|-----------------------------------------------------------------------------|
| 2002-09-27 |                                                                |
| 2001-11-25 | Added a resize to the tooltip if the document width is too     |
|            | small.                                                         |
| 2002-05-19 | IE50 did not recognise the JS keyword undefined so the test    |
|            | for scroll support was updated to be IE50 friendly.            |
| 2002-07-06 | Added flag to hide selects for IE                              |
| 2002-10-04 | (1.1) Restructured and made code more IE garbage collector     |
|            | friendly. This solved the most nasty memory leaks. Also added  |
|            | support for hiding the tooltip if ESC is pressed.              |
| 2002-10-18 | Fixed verrical position in case of scrolled document.          |
| 2002-12-02 | Mozilla bug workaround related to mousedown and move.          |
|-----------------------------------------------------------------------------|
| Dependencies: helptip.css (To set up the CSS of the help-tooltip class)     |
|-----------------------------------------------------------------------------|
| Usage:                                                                      |
|                                                                             |
|   <script type="text/javascript" src="helptip.js">< /script>                |
|   <link type="text/css" rel="StyleSheet" href="helptip.css" />              |
|                                                                             |
|   <a class="helpLink" href="?" onclick="showHelp(event, 'String to show');  |
|      return false">Help</a>                                                 |
|-----------------------------------------------------------------------------|
| Created 2001-09-27 | All changes are in the log above. | Updated 2002-12-02 |

\----------------------------------------------------------------------------*/
function showHelpTip(e, sHtml, bHideSelects) {
  var el = e.target || e.srcElement;
  while (el.tagName != "A")
    el = el.parentNode;
  if (el._helpTip) {
    helpTipHandler.hideHelpTip(el);
  }
  helpTipHandler.hideSelects = Boolean(bHideSelects);
  helpTipHandler.createHelpTip(el, sHtml);
  helpTipHandler.positionToolTip(e);
  el.onblur = helpTipHandler.anchorBlur;
  el.onkeydown = helpTipHandler.anchorKeyDown;
}

var helpTipHandler = {
  hideSelects : false,
  helpTip : null,
  showSelects : function (bVisible) {
    if (!this.hideSelects)
      return;
    var selects = [];
    if (document.all)
      selects = document.all.tags("SELECT");
    var l = selects.length;
    for (var i = 0; i < l; i++)
      selects[i].runtimeStyle.visibility = bVisible ? "" : "hidden";
  },
  
  create : function () {
    var d = document.createElement("DIV");
    d.id = "help-tooltip-id"
    d.className = "help-tooltip";
    d.onmousedown = this.helpTipMouseDown;
    d.onmouseup = this.helpTipMouseUp;
    document.body.appendChild(d);
    this.helpTip = d;
  },
  
  createHelpTip : function (el, sHtml) {
    if (this.helpTip == null) {
      this.create();
    }
    var d = this.helpTip;
    d.innerHTML = sHtml;
    d._boundAnchor = el;
    el._helpTip = d;
    return d;
  },
  
  helpTipMouseDown : function (e) {
    var d = this;
    var el = d._boundAnchor;
    if (!e)
      e = event;
    var t = e.target || e.srcElement;
    while (t.tagName != "A" && t != d)
      t = t.parentNode;
    if (t == d)
      return;
    el._onblur = el.onblur;
    el.onblur = null;
  },
  
  helpTipMouseUp : function () {
    var d = this;
    var el = d._boundAnchor;
    el.onblur = el._onblur;
    el._onblur = null;
    el.focus();
  },
  
  anchorBlur : function (e) {
    var el = this;
    helpTipHandler.hideHelpTip(el);
  },
  
  anchorKeyDown : function (e) {
    if (!e)
      e = window.event
        if (e.keyCode == 27) {
          helpTipHandler.hideHelpTip(this);
        }
  },
  
  removeHelpTip : function (d) {
    d._boundAnchor = null;
    d.style.filter = "none";
    d.innerHTML = "";
    d.onmousedown = null;
    d.onmouseup = null;
    d.parentNode.removeChild(d);
  },
  
  hideHelpTip : function (el) {
    var d = el._helpTip;
    d.style.visibility = "hidden";
    el.onblur = null;
    el._onblur = null;
    el._helpTip = null;
    el.onkeydown = null;
    this.showSelects(true);
  },
  
  positionToolTip : function (e) {
    this.showSelects(false);
    var scroll = this.getScroll();
    var d = this.helpTip;
    
    if (d.offsetWidth >= scroll.width)
      d.style.width = scroll.width - 10 + "px";
    else
      d.style.width = "";
    
    if (e.clientX > scroll.width - d.offsetWidth)
      d.style.left = scroll.width - d.offsetWidth + scroll.left + "px";
    else
      d.style.left = e.clientX - 2 + scroll.left + "px";
    
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = this.fixTop(e, scroll);
      d.style.top = posy + "px"
    } else if (e.clientX || e.clientY) {
      if (e.clientY + d.offsetHeight + 18 < scroll.height) {
        d.style.top = e.clientY + 18 + scroll.top + "px";
      } else if (e.clientY - d.offsetHeight > 0) {
        d.style.top = e.clientY + scroll.top - d.offsetHeight + "px";
      } else {
        d.style.top = scroll.top + 5 + "px";
      }
    }
    d.style.visibility = "visible";
  },
  
  getScroll : function () {
    if (document.all && typeof document.body.scrollTop != "undefined") {
      var ieBox = document.compatMode != "CSS1Compat";
      var cont = ieBox ? document.body : document.documentElement;
      return {
        left : cont.scrollLeft,
        top : cont.scrollTop,
        width : cont.clientWidth,
        height : cont.clientHeight
      };
    } else {
      return {
        left : window.pageXOffset,
        top : window.pageYOffset,
        width : window.innerWidth,
        height : window.innerHeight
      };
    }
  },
  
  fixTop : function (e, scroll) {
    if ((os.isWin8 || os.isWin81) && ie10) {
      return e.pageY + scroll.top;
    } else {
      return e.pageY;
    }
  }
};
