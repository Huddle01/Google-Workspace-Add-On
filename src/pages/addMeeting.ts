let lockRoom = false;

const createAddMeetingCardSection = (subject: string) => {
  const textParagraph1 =
    CardService.newTextParagraph().setText("<b>Meeting ID</b>");

  const textInput = CardService.newTextInput()
    .setFieldName("huddle01_form_title")
    .setTitle("Label")
    .setHint("*Room Name that can be changed*")
    .setValue(subject);

  //Button
  const action = CardService.newAction().setFunctionName("loginCallback");

  const button = CardService.newTextButton()
    .setText("Add Meeting")
    .setOnClickAction(action)
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  const buttonSet = CardService.newButtonSet().addButton(button);
  const cardSection = CardService.newCardSection()
    .addWidget(startMeetingStrip)
    .addWidget(textParagraph1)
    .addWidget(textInput)
    .addWidget(buttonSet);

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

  const data:any = {
    title: e.formInput.huddle01_form_title,
    roomLocked: true,
    hostWallets: [address.toLowerCase()],
  };
  
  const defaultSubdomainId = service.getStorage().getValue("defaultSubdomainId");

  if(!defaultSubdomainId){
    const subdomainResponse = fetchSubdomains(address);
    const subdomainId = subdomainResponse[0].id;
    const subdomainName = subdomainResponse[0].name

    if(subdomainId){
      data.subdomainId =subdomainId;
    service.getStorage().setValue("defaultSubdomainId", subdomainId);
    service.getStorage().setValue("defaultSubdomainName", subdomainName);
    }
  }
  else{
      data.subdomainId =defaultSubdomainId;
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
