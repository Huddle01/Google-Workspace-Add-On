const BASE_DOMAIN = "app.huddle01.com";

interface IConferenceInfo {
  id: string;
  error: string;
  videoUri: string;
}

/**
 *  Creates a conference, then builds and returns a ConferenceData object
 *  with the corresponding conference information. This method is called
 *  when a user selects a conference solution defined by the add-on that
 *  uses this function as its 'onCreateFunction' in the add-on manifest.
 *
 *  @param {Object} arg The default argument passed to a 'onCreateFunction';
 *      it carries information about the Google Calendar event.
 *  @return {ConferenceData}
 */
function createConference(arg) {
  const eventData = arg.eventData;
  const calendarId = eventData.calendarId;
  const eventId = eventData.eventId;

  console.log("CREATING CONFRENCEEE", arg);

  // Retrieve the Calendar event information using the Calendar
  // Advanced service.

  // try {
  //   calendarEvent = Calendar.Events.get(calendarId, eventId);
  // } catch (err) {
  //   // The calendar event does not exist just yet; just proceed with the
  //   // given event ID and allow the event details to sync later.
  //   console.log(err);
  //   calendarEvent =
  // }

  // Create a conference on the third-party service and return the
  // conference data or errors in a custom JSON object.
  var conferenceInfo = create3rdPartyConference() as IConferenceInfo;

  // Build and return a ConferenceData object, either with conference or
  // error information.
  var dataBuilder = ConferenceDataService.newConferenceDataBuilder();

  if (!conferenceInfo.error) {
    // No error, so build the ConferenceData object from the
    // returned conference info.
    dataBuilder.setConferenceId(conferenceInfo.id);

    if (conferenceInfo.videoUri) {
      const meetingId = ConferenceDataService.newConferenceParameter()
        .setKey("ID")
        .setValue(conferenceInfo.videoUri);
      dataBuilder.addConferenceParameter(meetingId);

      const address = getService().getStorage().getValue("address");
      const email = getService().getStorage().getValue("email");

      const addressString = `<strong> Host Wallet Address : ${address} </strong><br><br>`;
      const emailString = `<strong> Host Email Address : ${email} </strong><br><br>`;

      const meetingNotes = `
     <font color="#767676">
      ------------------------------------<br>
<b>Huddle01 Meeting Details</b><br>
-----------------------------------<br><br>
      ${address ? addressString : ""}
      ${email ? emailString : ""}
      <strong> Join Huddle01 Meeting : ${conferenceInfo.videoUri}</strong>
         </font>
      `;
      dataBuilder.setNotes(meetingNotes);

      var videoEntryPoint = ConferenceDataService.newEntryPoint()
        .setEntryPointType(ConferenceDataService.EntryPointType.VIDEO)
        .setUri(conferenceInfo.videoUri);
      dataBuilder.addEntryPoint(videoEntryPoint);
    }
  } else if (conferenceInfo.error === "AUTH") {
    // Authenentication error. Implement a function to build the correct
    // authenication URL for the third-party conferencing system.
    var authenticationUrl = getAuthUrl();
    var error = ConferenceDataService.newConferenceError()
      .setConferenceErrorType(
        ConferenceDataService.ConferenceErrorType.AUTHENTICATION
      )
      .setAuthenticationUrl(authenticationUrl);
    dataBuilder.setError(error);
  } else {
    // Other error type;
    var error =
      ConferenceDataService.newConferenceError().setConferenceErrorType(
        ConferenceDataService.ConferenceErrorType.TEMPORARY
      );
    dataBuilder.setError(error);
  }

  // Don't forget to build the ConferenceData object.
  return dataBuilder.build();
}

/**
 *  Contact the third-party conferencing system to create a conference there,
 *  using the provided calendar event information. Collects and returns the
 *  conference data returned by the third-party system in a custom JSON object
 *  with the following fields:
 *
 *    data.adminEmail - the conference administrator's email
 *    data.conferenceLegalNotice - the conference legal notice text
 *    data.error - Only present if there was an error during
 *         conference creation. Equal to 'AUTH' if the add-on user needs to
 *         authorize on the third-party system.
 *    data.id - the conference ID
 *    data.phoneNumber - the conference phone entry point phone number
 *    data.phonePin - the conference phone entry point PIN
 *    data.videoPasscode - the conference video entry point passcode
 *    data.videoUri - the conference video entry point URI
 *
 *  The above fields are specific to this example; which conference information
 *  you add-on needs is dependent on the third-party conferencing system
 *  requirements.
 *
 * @param {Object} calendarEvent A Calendar Event resource object returned by
 *     the Google Calendar API.
 * @return {Object}
 */
function create3rdPartyConference(calendarEvent) {
  if (!checkAuth()) {
    return { error: "AUTH" };
  }

  const service = getService();

  const address = service.getStorage().getValue("address");
  const email = service.getStorage().getValue("email");
  if (!address && !email) {
    return { error: "AUTH" };
  }

  const data: any = {
    title: "GCal Meeting",
    // hostWallets: [address.toLowerCase()],
    roomLocked: true,
  };

  const defaultSubdomainName = service
    .getStorage()
    .getValue("defaultSubdomainName");

  if (defaultSubdomainName) {
    data.subdomain = defaultSubdomainName;
  }

  const { response } = createHuddleMeetingWithApi(data);

  const [_, id] = response.meetingLink.split("/");

  console.log("Huddle Response Obj :", {
    id: id,
    videoUri: response.meetingLink,
    data,
  });

  return {
    id: id,
    videoUri: response.meetingLink,
  };
}

/*
 * Returns true if the string 's' contains one of the
 * template strings.
 */
function hasTemplate(s, categories) {
  for (var template in categories) {
    if (s.indexOf(template) >= 0) {
      return true;
    }
  }
}

/**
 * Generates random int within the range [min, max]
 * @param min the minimum value for the generated number
 * @param max the maximum value for the generated number
 * @returns random int number
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get random element from array or string.
 * @param {Array|string} arr source
 * @returns array element or string character
 */
function randomElement(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

var PATTERNS = ["_ADJECTIVE__PLURALNOUN__VERB__ADVERB_"];

/**
 * Generates new room name.
 * @param customDictionary a dictionary containing keys pluralNouns, verbs,
 * adverbs and adjectives, values are array of strings.
 */
function generateRoomWithoutSeparator(customDictionary) {
  // Note that if more than one pattern is available, the choice of
  // 'name' won't have a uniform distribution amongst all patterns (names
  // from patterns with fewer options will have higher probability of
  // being chosen that names from patterns with more options).
  var name = randomElement(PATTERNS);
  var word;
  var categories = {
    _PLURALNOUN_: customDictionary.pluralNouns,
    _VERB_: customDictionary.verbs,
    _ADVERB_: customDictionary.adverbs,
    _ADJECTIVE_: customDictionary.adjectives,
  };
  while (hasTemplate(name, categories)) {
    for (var template in categories) {
      word = randomElement(categories[template]);
      name = name.replace(template, word);
    }
  }

  return name;
}
