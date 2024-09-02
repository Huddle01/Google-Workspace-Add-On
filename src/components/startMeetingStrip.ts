const camIcon = CardService.newIconImage().setIcon(
  CardService.Icon.VIDEO_CAMERA
);

const getSubdomainURL = (subdomainName: string) => {
  if (subdomainName === "app") {
    return `https://huddle01.app/`;
  }

  return `https://${subdomainName}.huddle01.app/`;
};

const startMeetingStrip = (defaultSubdomainName: string) => {
  const url = getSubdomainURL(defaultSubdomainName);

  return CardService.newDecoratedText()
    .setText(url)
    .setStartIcon(camIcon)
    .setOpenLink(
      CardService.newOpenLink()
        .setUrl(url)
        .setOpenAs(CardService.OpenAs.FULL_SIZE)
        .setOnClose(CardService.OnClose.RELOAD_ADD_ON)
    )
    .setTopLabel("Start an instant Meeting");
};
