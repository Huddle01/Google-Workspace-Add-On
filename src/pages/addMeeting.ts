let lockRoom = false;

const createAddMeetingCardSection = (subject: string) => {
  const textParagraph1 =
    CardService.newTextParagraph().setText("<b>Meeting ID</b>");
  const textParagraph2 =
    CardService.newTextParagraph().setText("<b>Security</b>");
  const textParagraph3 = CardService.newTextParagraph().setText(
    "<b>Meeting Options</b>"
  );

  const textInput = CardService.newTextInput()
    .setFieldName("huddle01_form_title")
    .setTitle("Label")
    .setHint("*Room Name that can be changed*")
    .setValue(subject);

  const divider = CardService.newDivider();

  //Button
  const action = CardService.newAction().setFunctionName("loginCallback");

  const button = CardService.newTextButton()
    .setText("Add Meeting")
    .setOnClickAction(action)
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  const buttonSet = CardService.newButtonSet().addButton(button);
  const cardSection = CardService.newCardSection()
    .addWidget(startMeetingStrip)
    // .setHeader(subject)
    .addWidget(textParagraph1)
    .addWidget(textInput)
    // .addWidget(divider)
    // .addWidget(textParagraph2)
    // .addWidget(
    //   getSwitchGroup(
    //     "Waiting Room",
    //     "Only users admitted by the host can join the meeting",
    //     "huddle01_form_roomLock"
    //   )
    // )
    // .addWidget(divider)
    // .addWidget(textParagraph3)
    // .addWidget(
    //   getSwitchGroup(
    //     "Join before Host",
    //     "Users who join before the host will be taken to waiting room who then will need to be admitted by host",
    //     "huddle_form_join_before_host"
    //   )
    // )
    // .addWidget(
    //   getSwitchWithText(
    //     "Mute participants upon entry",
    //     "huddle_form_mute_participants"
    //   )
    // )
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

  console.log("Address :", address);

  const data = {
    title: e.formInput.huddle01_form_title,
    roomLocked: true,
    hostWallets: [address],
  };

  const result = JSON.parse(createHuddleMeetingWithApi(data));

  const button = CardService.newTextButton()
    .setText("Join Meeting")
    .setOpenLink(CardService.newOpenLink().setUrl(result.roomUrl));

  return CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Meeting Created"))
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newKeyValue().setContent(result.roomUrl))
        .addWidget(button)
    )
    .build();
}

// const submitForm = (e) => {};
