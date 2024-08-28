let lockRoom = false;

const subdomainSwitchCallback = (e) => {
  const service = getService();
  const subdomainId = e.formInput.subdomainId;
  const subdomainResponse = JSON.parse(e.parameters.subdomainResponse);
  let subdomainName = subdomainResponse.subdomains.find(
    (subdomain) => subdomain.id === subdomainId
  )?.name;

  if (subdomainId === "app" || !subdomainName) {
    service.getStorage().setValue("defaultSubdomainId", "app");
    service.getStorage().setValue("defaultSubdomainName", "app");
    subdomainName = "app";
  }
  console.log("subdomainId", subdomainId);
  console.log("subdomainName", subdomainName);
  service.getStorage().setValue("defaultSubdomainId", subdomainId);
  service.getStorage().setValue("defaultSubdomainName", subdomainName);
  return CardService.newActionResponseBuilder()
    .setStateChanged(true)
    .setNavigation(CardService.newNavigation().updateCard(createHome()))
    .build();
};

const createAddMeetingCardSection = (subject: string) => {
  const service = getService();

  const textParagraph1 =
    CardService.newTextParagraph().setText("<b>Meeting ID</b>");

  const textInput = CardService.newTextInput()
    .setFieldName("huddle01_form_title")
    .setTitle("Label")
    .setHint("*Room Name that can be changed*")
    .setValue(subject);

  const address = service.getStorage().getValue("address");
  const email = service.getStorage().getValue("email");

  const MyWalletAddress = CardService.newTextParagraph().setText(
    "<b>My Wallet Address: </b> " + address
  );

  const MyEmailAddress = CardService.newTextParagraph().setText(
    "<b>My Huddle01 Email Address: </b> " + email
  );

  const action = CardService.newAction().setFunctionName("loginCallback");

  const button = CardService.newTextButton()
    .setText("Add Meeting")
    .setOnClickAction(action)
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  const logoutButton = CardService.newTextButton()
    .setText("Logout")
    .setOnClickAction(CardService.newAction().setFunctionName("logout"));

  let defaultSubdomainName = service
    .getStorage()
    .getValue("defaultSubdomainName");

  if (defaultSubdomainName?.length === 32 || !defaultSubdomainName) {
    service.getStorage().setValue("defaultSubdomainName", "app");
    defaultSubdomainName = "app";
  }

  const buttonSet = CardService.newButtonSet().addButton(button);
  const cardSection = CardService.newCardSection().addWidget(
    address ? MyWalletAddress : MyEmailAddress
  );

  // Todo: refactor this
  const subdomainResponse = fetchSubdomains();
  if (subdomainResponse.subdomains && subdomainResponse.subdomains.length > 0) {
    let defaultSubdomainId = service
      .getStorage()
      .getValue("defaultSubdomainId");
    console.log("subdomainResponse exists", subdomainResponse);
    console.log("defaultSubdomainId", defaultSubdomainId);

    if (!defaultSubdomainId) {
      defaultSubdomainId = subdomainResponse.subdomains[0].id;
      defaultSubdomainName = subdomainResponse.subdomains[0].name;
      service.getStorage().setValue("defaultSubdomainId", defaultSubdomainId);
      service
        .getStorage()
        .setValue("defaultSubdomainName", defaultSubdomainName);
    }

    cardSection
      .addWidget(startMeetingStrip(defaultSubdomainName))
      .addWidget(textParagraph1)
      .addWidget(textInput)
      .addWidget(buttonSet);

    const subdomainSwitch = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.DROPDOWN)
      .setTitle("Subdomain")
      .setFieldName("subdomainId");

    subdomainResponse.subdomains.push({ id: "app", name: "app", value: "app" });
    subdomainResponse.subdomains.forEach((subdomain) => {
      if (subdomain.name?.length !== 32) {
        subdomainSwitch.addItem(
          subdomain.name,
          subdomain.id,
          subdomain.id === defaultSubdomainId
        );
      }
    });
    subdomainSwitch.setOnChangeAction(
      CardService.newAction()
        .setFunctionName("subdomainSwitchCallback")
        .setParameters({ subdomainResponse: JSON.stringify(subdomainResponse) })
    );
    const subdomainTextParagraph = CardService.newTextParagraph().setText(
      "<br><b>Select Default Subdomain for Meeting Creation</b><br>"
    );
    cardSection.addWidget(subdomainTextParagraph);
    cardSection.addWidget(subdomainSwitch);
  } else {
    cardSection
      .addWidget(startMeetingStrip(defaultSubdomainName))
      .addWidget(textParagraph1)
      .addWidget(textInput)
      .addWidget(buttonSet);
  }
  cardSection.addWidget(logoutButton);

  return cardSection;
};

const createAddMeetingCard = (subject: string) => {
  const cardSection = createAddMeetingCardSection(subject);
  return CardService.newCardBuilder().addSection(cardSection).build();
};

function loginCallback(e) {
  const service = getService();
  const address = service.getStorage().getValue("address");
  const email = service.getStorage().getValue("email");

  console.log("Address:", address);
  console.log("Email:", email);

  const data: any = {
    title: e.formInput.huddle01_form_title,
    // roomLocked: true,
    //  hostWallets: [address.toLowerCase()],
  };

  /* const defaultSubdomainId = service
    .getStorage()
    .getValue("defaultSubdomainId");
  const defaultSubdomainName = service
    .getStorage()
    .getValue("defaultSubdomainName");

  if (!defaultSubdomainId) {
    const subdomainResponse = fetchDomainNames();
    const subdomainId = subdomainResponse.subdomains[0]?.id;

    if (subdomainId) {
      data.subdomainId = subdomainId;
      service.getStorage().setValue("defaultSubdomainId", subdomainId);
    }
  } else if (defaultSubdomainName?.length === 32) {
    service.getStorage().setValue("defaultSubdomainId", null);
    service.getStorage().setValue("defaultSubdomainName", null);
  } else if (defaultSubdomainId !== "app") {
    data.subdomainId = defaultSubdomainId;
  } */

  const { response } = createHuddleMeetingWithApi(data);

  const button = CardService.newTextButton()
    .setText("Join Meeting")
    .setOpenLink(CardService.newOpenLink().setUrl(response.meetingLink));

  return CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Meeting Created"))
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newKeyValue().setContent(response.meetingLink))
        .addWidget(button)
    )
    .build();
}
