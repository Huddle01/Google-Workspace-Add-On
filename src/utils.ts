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

const fetchSubdomains = (address:string) => {
  const GET_SUBDOMAIN_ID_LINK ="  "
  const GET_SUBDOMAIN_ID_OPTIONS: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": HUDDLE_API_KEY,
    },
    payload: JSON.stringify({walletAddress:address.toLowerCase()}) 
  };

  const subdomainResponse = UrlFetchApp.fetch(
    GET_SUBDOMAIN_ID_LINK,
    GET_SUBDOMAIN_ID_OPTIONS
  )

  const parsedSubdomainResponse = JSON.parse(subdomainResponse.getContentText())
  console.log({parsedSubdomainResponse})
  // add a subdomain with id app
  return parsedSubdomainResponse.subdomain
}

const createHuddleMeetingWithApi = (data) => {
 
  const CREATE_NEW_ROOM_LINK =
  "https://iriko.testing.huddle01.com/api/v1/admin/create-meeting";
  
  const CREATE_NEW_ROOM_OPTIONS: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions =
  {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": HUDDLE_API_KEY,
    },
    payload: JSON.stringify({...data}),
  };
  
  
  
  const responseHuddle = UrlFetchApp.fetch(
    CREATE_NEW_ROOM_LINK,
    CREATE_NEW_ROOM_OPTIONS
    );
    console.log(responseHuddle.getContentText())
    

  return {response:responseHuddle.getContentText()};
};
