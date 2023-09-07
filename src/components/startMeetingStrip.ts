const camIcon = CardService.newIconImage().setIcon(
  CardService.Icon.VIDEO_CAMERA
);


const startMeetingStrip = (defaultSubdomainName:string)=>CardService.newDecoratedText()
  .setText(`https://${defaultSubdomainName}.huddle01.com/`)
  .setStartIcon(camIcon)
  .setOpenLink(
    CardService.newOpenLink()
      .setUrl(`https://${defaultSubdomainName}.huddle01.com/`)
      .setOpenAs(CardService.OpenAs.FULL_SIZE)
      .setOnClose(CardService.OnClose.RELOAD_ADD_ON)
  )
  .setTopLabel("Start an instant Meeting");
