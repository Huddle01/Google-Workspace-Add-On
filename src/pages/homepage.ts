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
  const service = getService();

  var cardSection = CardService.newCardSection();

  if (checkAuth()) {
    cardSection = createAddMeetingCardSection("New Meeting");
    cardSection.addWidget(LogoutButton);
    // add text paragraph
    const address = service.getStorage().getValue("address");
    const MyWalletAddress =CardService.newTextParagraph().setText("My Wallet Address: " + address);
    cardSection.addWidget(MyWalletAddress);

    // allow for switching of available subdomain
    
    const subdomainResponse = fetchSubdomains(address);
    if(subdomainResponse.length>0){
    // subdomainResponse  = {id:string,name:string}[]
    let defaultSubdomainId = service.getStorage().getValue("defaultSubdomainId");
    let defaultSubdomainName = service.getStorage().getValue("defaultSubdomainName");
    
    if(!defaultSubdomainId||!defaultSubdomainName){
      const defaultSubdomainId = subdomainResponse[0].id;
      const defaultSubdomainName = subdomainResponse[0].name;
      service.getStorage().setValue("defaultSubdomainId", defaultSubdomainId);
      service.getStorage().setValue("defaultSubdomainName", defaultSubdomainName);
    }
    const subdomainSwitch = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.DROPDOWN)
      .setTitle("Subdomain")
      .setFieldName("subdomain")
      .addItem(defaultSubdomainName, defaultSubdomainId, true);
    subdomainResponse.forEach((subdomain) => {
      if(subdomain.id!=defaultSubdomainId){
        subdomainSwitch.addItem(subdomain.name, subdomain.id, false);
      }
    });
  }


  } else {
    cardSection.addWidget(welcomeImage).addWidget(LoginButton);
  }

  const home = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle(EMAIL))
    .addSection(cardSection);

  return home.build();
};
