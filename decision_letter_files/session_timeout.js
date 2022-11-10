 if (isStTimeOutEnabled === 'true') {
   var gSessionWarningTimer = window.setInterval('SessionWarningTimer()', aMinute);
   var gTimerCount = 0;
   var canTimeout;
   var isSubmissionPage;
   if (isStAuthorPage === 'true') {
     canTimeout = false;
     isSubmissionPage = true;
   } else {
     canTimeout = true;
     isSubmissionPage = false;
   }

   function getCurrentPage() {
     return stCurrentPageName;
   }

   function stopTimeout() {
     canTimeout = false;
   }

   function restartTimer() {
     window.clearInterval(gSessionWarningTimer);
     gSessionWarningTimer = window.setInterval('SessionWarningTimer()', aMinute);
   }

   function SessionWarningTimer() {
     gTimerCount++;
     if (gTimerCount == stWarning)
       if (canTimeout) {
         if (typeof(configWorkflow) != 'undefined') {
           var message = Resources.FOR_SECURITY_REASONS_PART1 + " " + eval(oT) + " " + Resources.FOR_SECURITY_REASONS_PART2;
           configWorkflow.showMessage(Resources.WARNING, message);
         } else {
           showSessionWarning(true);
         }

       }
   }
   var gSessionSaveTimer = window.setTimeout('SessionSave()', stSessionTimeOut);

   function SessionSave() {
     if (canTimeout) {
       if (isStFromSSOFl === 'true') {
         if (window.parent != null && window.parent.frames != null && window.parent.frames.length > 0) {
           window.parent.top.location = stErrorUrl;
         } else {
           window.location = stErrorUrl;
         }
         if (isStPopup === 'true') {
           window.close();
         }

       } else {
         if (isStPopup === 'true') {
           setField(IParameterName.EMAIL_POPUP_CLOSE_WIN_FL, 'Y');
           setField(IParameterName.CLOSE_WINDOW_FL, 'Y');
           setDataAndNextPage(IParameterName.NATURAL_TIMEOUT, 'true', stCurrentPageName);
         }
         if (window.parent != null && window.parent.frames != null && window.parent.frames.length > 0) {
           window.parent.top.setDataAndNextPage(IParameterName.NATURAL_TIMEOUT, 'true', stLoginPage);
         } else {
           setDataAndNextPage(IParameterName.NATURAL_TIMEOUT, 'true', stLoginPage);
         }
       }
     }
   }
 }