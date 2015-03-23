Instagram = {};

Instagram.requestCredential = function (options, credentialRequestCompleteCallback) {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

    /**
     * Decide service configuration name on DB (default=instagram).
     * We use this to enable 2 different Instagram configurations, one for the enterprise version and one production
     */
    var defaultServiceConfigName = 'instagram',
        globalServiceConfigName;
    try{
        globalServiceConfigName =  Meteor.settings.public.serviceConfigNames[defaultServiceConfigName];
    }catch(e){

    }
    var serviceConfigName =  globalServiceConfigName || defaultServiceConfigName;

  var config = ServiceConfiguration.configurations.findOne({service: serviceConfigName});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }
  var credentialToken = Random.secret();
  var loginStyle = OAuth._loginStyle('instagram', config, options);
  var scope = (options && options.requestPermissions) || ['basic', 'likes', 'relationships', 'comments'];
  var flatScope = _.map(scope, encodeURIComponent).join('+');

  var loginUrl =
    'https://instagram.com/oauth/authorize' +
      '?client_id=' + config.clientId +
      '&response_type=code' +
      '&scope=' + flatScope +
      '&redirect_uri=' + OAuth._redirectUri('instagram', config) +
      '&state=' + OAuth._stateParam(loginStyle, credentialToken);

  OAuth.launchLogin({
    loginService: "instagram"
    , loginStyle: loginStyle
    , loginUrl: loginUrl
    , credentialRequestCompleteCallback: credentialRequestCompleteCallback
    , credentialToken: credentialToken
  });
};
