/**
 * Truncate a message to fit in the cat image.
 * @param {string} message The message to truncate.
 * @return {string} The truncated message.
 */
const truncate = (message) => {
  if (message.length > MAX_MESSAGE_LENGTH) {
    message = message.slice(0, MAX_MESSAGE_LENGTH);
    message = message.slice(0, message.lastIndexOf(" ")) + "...";
  }
  return message;
};

const createCard = (text: string) => {
  return CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle(text))
    .build();
};

function getSwitchGroup(label: string, text: string, name: string) {
  return CardService.newDecoratedText()
    .setTopLabel(label)
    .setText(text)
    .setWrapText(true)
    .setSwitchControl(
      CardService.newSwitch()
        .setFieldName(name)
        .setValue("true")
        .setOnChangeAction(
          CardService.newAction().setFunctionName("handleSwitchChange")
        )
    );
}
function getSwitchWithText(text: string, name: string) {
  return CardService.newDecoratedText()
    .setText(text)
    .setSwitchControl(
      CardService.newSwitch()
        .setFieldName(name)
        .setValue("form_input_switch_value")
        .setOnChangeAction(
          CardService.newAction().setFunctionName("handleSwitchChange")
        )
    );
}

function handleSwitchChange() {
  console.log("works");
  lockRoom = !lockRoom;
}

const createHuddleMeetingWithApi = (data: {
  title?: string;
  subdomain?: string;
}) => {
  const service = getService();
  const { identityToken } = service.getToken(false);

  console.log("subdomain fetching identityToken ~>", identityToken);

  const CREATE_NEW_ROOM_LINK = `${API_ENDPOINT_URL}/createMeeting`;

  const responseHuddle = UrlFetchApp.fetch(CREATE_NEW_ROOM_LINK, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": HUDDLE_THIRD_PARTY_API_KEY,
      "x-identity-token": identityToken,
    },
    payload: JSON.stringify({ ...data }),
  });

  const response = JSON.parse(responseHuddle.getContentText()) as {
    roomId: string;
    meetingLink: string;
  };

  console.log("CREATE MEETING RESPONSE", response);

  return { response };
};

const fetchSubdomains = function () {
  const service = getService();
  const { identityToken } = service.getToken(false);

  const GET_SUBDOMAIN_LIST = `${API_ENDPOINT_URL}/subdomains`;

  const response = UrlFetchApp.fetch(GET_SUBDOMAIN_LIST, {
    method: "get",
    contentType: "application/json",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": HUDDLE_THIRD_PARTY_API_KEY,
      "x-identity-token": identityToken,
    },
    muteHttpExceptions: true,
  });

  console.log("GET CONTENT", response.getContentText(), response);
  const data = JSON.parse(response.getContentText());
  return { response: data };
};
