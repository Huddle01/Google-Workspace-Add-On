const createHomeCard = () => {
  const email = Session.getActiveUser().getEmail();

  const camIcon = CardService.newIconImage().setIcon(
    CardService.Icon.VIDEO_CAMERA
  );
  const calIcon = CardService.newIconImage().setIcon(CardService.Icon.INVITE);

  const camDecoratedText = CardService.newDecoratedText()
    .setText("https://app.huddle01.com/")
    .setStartIcon(camIcon)
    .setOpenLink(
      CardService.newOpenLink()
        .setUrl("https://app.huddle01.com/")
        .setOpenAs(CardService.OpenAs.FULL_SIZE)
        .setOnClose(CardService.OnClose.RELOAD_ADD_ON)
    )
    .setTopLabel("Start a Meeting");

  // const textParagraph = CardService.newTextParagraph().setText(
  //   "<b>Scheduled Meetings</b>"
  // );

  // const calDecoratedText = CardService.newDecoratedText()
  //   .setText("https://app.huddle01.com/roomId")
  //   .setStartIcon(calIcon)
  //   .setOpenLink(
  //     CardService.newOpenLink()
  //       .setUrl("https://app.huddle01.com/roomId")
  //       .setOpenAs(CardService.OpenAs.FULL_SIZE)
  //       .setOnClose(CardService.OnClose.RELOAD_ADD_ON)
  //   )
  //   .setTopLabel("EventName/RoomName");

  const cardSection = CardService.newCardSection().addWidget(camDecoratedText);
  // .addWidget(textParagraph)
  // .addWidget(calDecoratedText);

  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle(email))
    .addSection(cardSection);

  return card.build();
};
