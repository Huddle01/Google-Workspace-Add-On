const authCallback = (callbackRequest) => {
  
  console.log('in authcallback')
  console.log({callbackRequest});

  // the callbackReq is a url req which needs to be parse
  // callback url will have code in body which we will store
  // then call handlecallback which will redirect the callbackrequest to https://iriko.testing.huddle01.com/verify for verifaction
  // if repsonse code 200 then authorized is true else fa
  console.log("Run authcallback!");
  const authorized = getService().handleCallback(callbackRequest);
  console.log('is Auth : ',`${authorized}`);
  if (authorized) {
    const addr = callbackRequest.parameter["address"];
    getService().getStorage().setValue("address", addr);
  }

  return HtmlService.createHtmlOutputFromFile("success");
};

const getAuthUrl = () => {
  const service = getService();

  const authUrl = service.getAuthorizationUrl();

  return authUrl;
};
