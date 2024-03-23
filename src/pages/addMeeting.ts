let lockRoom = false;

const subdomainSwitchCallback = (e) => {
  const service = getService();
  const subdomainId = e.formInput.subdomainId;
  const subdomainResponse = JSON.parse(e.parameters.subdomainResponse);
  let subdomainName = subdomainResponse.find(
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
  const MyWalletAddress = CardService.newTextParagraph().setText(
    "<b>My Wallet Address: </b> " + address
  );
  //Button
  const action = CardService.newAction().setFunctionName("loginCallback");

  const button = CardService.newTextButton()
    .setText("Add Meeting")
    .setOnClickAction(action)
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  const logoutButton = CardService.newTextButton()
    .setText("Logout")
    // .setBackgroundColor("blue")
    .setOnClickAction(CardService.newAction().setFunctionName("logout"));

  let defaultSubdomainName = service
    .getStorage()
    .getValue("defaultSubdomainName");

  // to tackle issue with db
  if (defaultSubdomainName?.length === 32) {
    service.getStorage().setValue("defaultSubdomainName", null);
    defaultSubdomainName = "app";
  }

  if (!defaultSubdomainName) {
    defaultSubdomainName = "app";
  }
  const buttonSet = CardService.newButtonSet().addButton(button);
  const cardSection = CardService.newCardSection().addWidget(MyWalletAddress);

  // allow for switching of available subdomain

  const subdomainResponse = fetchSubdomains(address);
  if (subdomainResponse.length > 0) {
    // subdomainResponse  = {id:string,name:string}[]
    let defaultSubdomainId = service
      .getStorage()
      .getValue("defaultSubdomainId");
    console.log("subdomainResponse exists", subdomainResponse);
    console.log("defaultSubdomainId", defaultSubdomainId);

    if (!defaultSubdomainId) {
      const defaultSubdomainId = subdomainResponse[0].id;
      const defaultSubdomainName = subdomainResponse[0].name;
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

    subdomainResponse.push({ id: "app", name: "app" });
    subdomainResponse.forEach((subdomain) => {
      if (subdomain.name?.length === 32) {
        // to tackle issue with db where it returns subdomain for sdk purpose
        // ignore this entry
        return;
      }
      if (subdomain.id != defaultSubdomainId) {
        subdomainSwitch.addItem(subdomain.name, subdomain.id, false);
      } else {
        subdomainSwitch.addItem(subdomain.name, subdomain.id, true);
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

  const card = CardService.newCardBuilder().addSection(cardSection);

  return card.build();
};

function loginCallback(e) {
  const service = getService();

  const address = service.getStorage().getValue("address");

  console.log("Address:", address);

  const data: any = {
    title: e.formInput.huddle01_form_title,
    roomLocked: true,
    hostWallets: [address.toLowerCase()],
  };

  const defaultSubdomainId = service
    .getStorage()
    .getValue("defaultSubdomainId");
  const defaultSubdomainName = service
    .getStorage()
    .getValue("defaultSubdomainName");

  if (!defaultSubdomainId) {
    const subdomainResponse = fetchSubdomains(address);
    const subdomainId = subdomainResponse[0]?.id;

    if (subdomainId) {
      data.subdomainId = subdomainId;
      service.getStorage().setValue("defaultSubdomainId", subdomainId);
    }
  } else if (defaultSubdomainName?.length === 32) {
    service.getStorage().setValue("defaultSubdomainId", null);
    service.getStorage().setValue("defaultSubdomainName", null);
  } else if (defaultSubdomainId !== "app") {
    data.subdomainId = defaultSubdomainId;
  }

  const huddleResponse = createHuddleMeetingWithApi(data);
  const result = JSON.parse(huddleResponse.response);

  const button = CardService.newTextButton()
    .setText("Join Meeting")
    .setOpenLink(CardService.newOpenLink().setUrl(result.data.meetingLink));

  return CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Meeting Created"))
    .addSection(
      CardService.newCardSection()
        .addWidget(
          CardService.newKeyValue().setContent(result.data.meetingLink)
        )
        .addWidget(button)
    )
    .build();
}
