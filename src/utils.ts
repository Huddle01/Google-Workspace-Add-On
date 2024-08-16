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
  const { access_token, refresh_token } = this.getToken(false);

  // Todo: add API_BASE_URL in secrets.ts
  const CREATE_NEW_ROOM_LINK =
    "https://api.huddle01.com/api/v1/admin/create-meeting";

  const responseHuddle = UrlFetchApp.fetch(CREATE_NEW_ROOM_LINK, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": access_token,
      "Refresh-Token": refresh_token,
    },
    payload: JSON.stringify({ ...data }),
  });

  const response = JSON.parse(responseHuddle.getContentText()) as {
    roomId: string;
    meetingLink: string;
  };

  return { response };
};

const fetchDomainNames = function () {
  const { access_token, refresh_token } = this.getToken(false);
  // Todo: add API_BASE_URL in secrets.ts
  const response = UrlFetchApp.fetch(`${API_BASE_URL}/gcal/subdomains`, {
    method: "get",
    contentType: "application/json",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": access_token,
      "Refresh-Token": refresh_token,
    },
    muteHttpExceptions: true,
  });

  console.log("GET CONTENT", response.getContentText(), response);
  const data = JSON.parse(response.getContentText());
  return { response: data };
};
