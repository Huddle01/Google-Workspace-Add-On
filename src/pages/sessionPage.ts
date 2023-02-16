const getService = () => {
  return createService("Wallet01Login")
    .setAuthorizationBaseUrl(AUTH_BASE_URL)
    .setTokenUrl(TOKEN_URL)
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction("authCallback")
    .setPropertyStore(PropertiesService.getUserProperties())
    .setCache(CacheService.getUserCache())
    .setScope(scopes.join(" "));
};

const authCallback = (callbackRequest) => {
  console.log(callbackRequest);

  // the callbackReq is a url req which needs to be parse
  // callback url will have code in body which we will store
  // then call handlecallback which will redirect the callbackrequest to https://api.identity.testing.huddle01.com/verify for verifaction
  // if repsonse code 200 then authorized is true else fa
  Logger.log("Run authcallback!");
  console.log("Run authcallback!");
  const authorized = getService().handleCallback(callbackRequest);
  console.log(`${authorized}`);
  return HtmlService.createHtmlOutput(
    "Success! <script>setTimeout(function() { top.window.close() }, 1)</script>"
  );
};

const create3PAuthorizationUi = () => {
  var service = getService();
  const hasAcc = service.hasAccess();
  console.log("Has access :", hasAcc);
  var authUrl = service.getAuthorizationUrl();
  console.log("Auth url :", authUrl);
  var loginButton = CardService.newTextButton()
    .setText("Login")
    .setAuthorizationAction(
      CardService.newAuthorizationAction().setAuthorizationUrl(authUrl)
    );
  var callbackUri = getService().getRedirectUri();
  Logger.log("Callback uri :", callbackUri);
  console.log("Callback uri :", callbackUri);

  var promptText = "Please login first";

  var card = CardService.newCardBuilder()
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(promptText))
        .addWidget(loginButton)
    )
    .build();
  return [card];
};

const checkAuth = () => {
  var service = getService();
  const hasAcc = service.hasAccess();
  console.log("Has access :", hasAcc);
  if (service.hasAccess()) return createHomeCard();

  CardService.newAuthorizationException()
    .setAuthorizationUrl(service.getAuthorizationUrl())
    .setResourceDisplayName("Display name to show to the user")
    .setCustomUiCallback("create3PAuthorizationUi")
    .throwException();
};

const buildAddOn = (e) => {
  //   var accessToken = e.messageMetadata.accessToken;
  //   GmailApp.setCurrentMessageAccessToken(accessToken);
  // // log the accesstoken
  //   Logger.log('Accesss token :',accessToken)
  //   console.log('Accesss token :',accessToken)
  checkAuth();
  const section = CardService.newCardSection();

  const resetButton = CardService.newTextButton()
    .setText("Logout")
    .setOnClickAction(CardService.newAction().setFunctionName("logout"));

  const textWidget = CardService.newTextParagraph().setText("Hello World");

  section.addWidget(textWidget).addWidget(resetButton);

  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Addon Demo"))
    .addSection(section)
    .build();

  return [card];
};

const logout = () => {
  const service = getService();
  service.reset();
};
