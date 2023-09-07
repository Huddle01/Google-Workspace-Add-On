const createHome = () => {
  const authUrl = getAuthUrl();

  const LoginButton = CardService.newTextButton()
    .setText("Login")
    .setBackgroundColor("blue")
    .setAuthorizationAction(
      CardService.newAuthorizationAction().setAuthorizationUrl(authUrl)
    )
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

 

  var cardSection = CardService.newCardSection();

  if (checkAuth()) {
    cardSection = createAddMeetingCardSection("New Meeting");
  } else {
    cardSection.addWidget(welcomeImage).addWidget(LoginButton);
  }

  const home = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle(EMAIL))
    .addSection(cardSection);

  return home.build();
};
