var pageViewSent = false;
var snowplowPageViewAdditionalData;

function snowplowSetUserId(userId) {
	if (snowplowEnabled) {
		if (!isSnowplowTrackParameterEmpty(userId)) {
			s1_snowplow("setUserId", userId);
		}
	}
}

function snowplowPageView(pageName) {
	if (snowplowEnabled) {
		if (!isSnowplowTrackParameterEmpty(pageName)) {
			if (!isSnowplowTrackParameterEmpty(snowplowPageViewAdditionalData)) {
				pageName = pageName + '_' + snowplowPageViewAdditionalData;
			}
			s1_snowplow("trackPageView", pageName);
		}
	}
}

function snowplowPageViewJSessionId(pageName, currentJSESSIONID) {
	if (snowplowEnabled) {
		if (!isSnowplowTrackParameterEmpty(currentJSESSIONID)) {
			if (!isSnowplowTrackParameterEmpty(pageName)) {
				if (!isSnowplowTrackParameterEmpty(snowplowPageViewAdditionalData)) {
					pageName = pageName + '_' + snowplowPageViewAdditionalData;
				}
				s1_snowplow("trackPageView", pageName, [ {
					schema : "iglu:ne.clarivate.com/usage/jsonschema/1-0-0",
					data : {
						appSessionId : currentJSESSIONID,
						// S1M-1730 s
						email: accountPrimaryEmail,
						publisherName: publisherName,
						journalName: journalName,
						journal_ISSN_EISSN: issn + "/" + eissn
						//S1M-1730 e
					}
				} ]);
			}
		} else {
			snowplowPageView(pageName);
		}
	}
}

function snowplowUserIdPageNameJSessionId(userId, pageName, currentJSESSIONID) {
	if (snowplowEnabled) {
		snowplowSetUserId(userId);
		snowplowPageViewJSessionId(pageName, currentJSESSIONID);
	}
}

function addSnowplowPageViewAdditionalData(additionalPageViewData) {
	if (!isSnowplowTrackParameterEmpty(additionalPageViewData)) {
		if (isSnowplowTrackParameterEmpty(snowplowPageViewAdditionalData))
			snowplowPageViewAdditionalData = additionalPageViewData;
		else
			snowplowPageViewAdditionalData = snowplowPageViewAdditionalData
					+ '_' + additionalPageViewData;
	}
}

function isSnowplowTrackParameterEmpty(trackParameter) {
	return (trackParameter == 'undefined' || trackParameter == null
			|| trackParameter == 'null' || trackParameter == '');
}
