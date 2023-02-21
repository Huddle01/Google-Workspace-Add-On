const onGmailMessageOpen = (e) => {
  if (!checkAuth()) {
    const authUrl = getAuthUrl();

    const LoginButton = CardService.newTextButton()
      .setText("Login")
      .setBackgroundColor("blue")
      .setAuthorizationAction(
        CardService.newAuthorizationAction().setAuthorizationUrl(authUrl)
      )
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

    const LogoutButton = CardService.newTextButton()
      .setText("Logout")
      .setBackgroundColor("blue")
      .setOnClickAction(CardService.newAction().setFunctionName("logout"));

    var cardSection = CardService.newCardSection();
    cardSection.addWidget(welcomeImage).addWidget(LoginButton);
    const home = CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader().setTitle(EMAIL))
      .addSection(cardSection);

    return home.build();
  }

  const messageId = e.gmail.messageId;

  // Get an access token scoped to the current message and use it for GmailApp
  // calls.
  const accessToken = e.gmail.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  // Get the subject of the email.
  const message = GmailApp.getMessageById(messageId);
  let subject = message.getThread().getFirstMessageSubject();

  // Remove labels and prefixes.
  subject = subject
    .replace(/^([rR][eE]|[fF][wW][dD])\:\s*/, "")
    .replace(/^\[.*?\]\s*/, "");

  // If neccessary, truncate the subject to fit in the image.
  subject = truncate(subject);

  return createAddMeetingCard(subject);
};

const onGmailCompose = () => {
  return createCard("onGmailCompose");
};
