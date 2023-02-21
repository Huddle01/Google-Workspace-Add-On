const createHome = () => {
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

  if (checkAuth()) {
    cardSection = createAddMeetingCardSection("New Meeting");
    cardSection.addWidget(LogoutButton);
  } else {
    cardSection.addWidget(welcomeImage).addWidget(LoginButton);
  }

  // const cardSectionWithWidgets = CardService.newCardSection()
  //   .addWidget(camDecoratedText)
  //   .addWidget(welcomeImage)
  //   .addWidget(LoginButton);

  const home = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle(EMAIL))
    .addSection(cardSection);

  return home.build();
};
