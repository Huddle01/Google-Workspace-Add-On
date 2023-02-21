const checkAuth = () => {
  const service = getService();
  const hasAcc = service.hasAccess();
  return hasAcc;
};

const getService = () => {
  return createService("Wallet01Login")
    .setAuthorizationBaseUrl(AUTH_BASE_URL)
    .setTokenUrl(TOKEN_URL)
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction("authCallback")
    .setPropertyStore(PropertiesService.getUserProperties())
    .setCache(CacheService.getUserCache())
    .setScope(scopes.join(" "))
    .setTokenFormat(TOKEN_FORMAT.JSON);
};

const logout = () => {
  const service = getService();
  service.reset();
};
