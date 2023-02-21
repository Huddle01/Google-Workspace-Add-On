const camIcon = CardService.newIconImage().setIcon(
  CardService.Icon.VIDEO_CAMERA
);

const startMeetingStrip = CardService.newDecoratedText()
  .setText("https://app.huddle01.com/")
  .setStartIcon(camIcon)
  .setOpenLink(
    CardService.newOpenLink()
      .setUrl("https://app.huddle01.com/")
      .setOpenAs(CardService.OpenAs.FULL_SIZE)
      .setOnClose(CardService.OnClose.RELOAD_ADD_ON)
  )
  .setTopLabel("Start an instant Meeting");
