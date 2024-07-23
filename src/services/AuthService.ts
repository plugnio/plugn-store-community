import axios from "@/services/AxiosService";
import store from "@/store";

/*declare var window: any;
declare var navigator: any;
declare var AppleID: any;*/

/**
 * Update email address
 * @param params params
 */
export async function updateEmail(params: any): Promise<any> {
  const response = await axios.post('/auth/update-email', params);
  return response.data;
}

/**
 * return user location detail by user ip address
 * @return Observable
 */
export async function locate(): Promise<any> {
  const response = await axios.get('/auth/locate');
  return response.data;
}

/**
 * Check if email already verified
 * @param res
 */
export async function isAlreadyVerified(params: any): Promise<any> {
  const response = await axios.post('/auth/is-email-verified', params);
  return response.data;
}

/**
 * Basic auth, exchanges access details for a bearer access token to use in
 * subsequent requests.
 * @param  {string} email
 * @param  {string} password
 */
export async function basicAuth(email: string, password: string): Promise<any> {
  const response = await axios.get('/auth/login', {
    headers: {
      'Authorization': 'Basic ' + btoa(`${email}:${password}`),
    }
  });
  return response.data;
}

/**
 * Create account
 * @param params
 */
export async function createAccount(params: any) {

  params['currency_pref'] = store.state.currency_pref;
  params['currency_label'] = store.state.currency_label;

  const response = await axios.post('/auth/register', params);
  return response.data;
}

/**
 * Redirect to google auth page in case google account
 * not available to login
 */
export async function redirectToGoogleAuth() {
  //todo window.location = environment.apiEndpoint + '/site/auth?authclient=google&language=' + translate.currentLang;
}

/**
 * Sign in with email and password
 * @param email
 * @param password
 *
export async function signInWithEmailAndPassword(email, password) {

  basicAuth(email, password).then(async res => {

    if (res.operation == 'success') {
      const view = (res.new_user == 1) ? 'welcome' : 'view';
      setAccessToken(res, view);
    } else if (res.operation == 'error' && res.errorType == 'email-not-verified') {

      Storage.set({ 'key': 'unVerifiedToken', value: JSON.stringify(res.unVerifiedToken) });

      router.navigateByUrl('/verify-email', { state: { email: email } });
    } else {
      const alert = await _alertCtrl.create({
        header: translate.transform('Unable to Log In'),
        message: res.message,
        buttons: [translate.transform('Ok')],
      });
      await alert.present();
    }

  }, async err => {

    // Incorrect email or password
    if (err.status == 401) {
      const alert = await _alertCtrl.create({
        header: translate.transform('Invalid login credential'),
        message: translate.transform('The information entered is incorrect. Please try again.'),
        buttons: [translate.transform('Try Again')],
      });
      await alert.present();

    } else {
      /**
       * Error not accounted for. Show Message
       *
      const alert = await _alertCtrl.create({
        header: translate.transform('Unable to Log In'),
        message: translate.transform('There seems to be an issue connecting to servers. Please contact us if the issue persists.'),
        buttons: [translate.transform('Ok')],
      });
      await alert.present();
    }
  });
}*/

/**
 * Login by otp
 * @param otp
 *
export async function loginByOtp(otp) {

  // Show Loading

  const loading = await _loadingCtrl.create({
    spinner: 'crescent',
    message: await translate.get('Logging in...').toPromise()
  });
  await loading.present();

  const url = environment.apiEndpoint + _urlLoginByOtp;
  const headers = _buildAuthHeaders();

  const params = {
    otp: otp,
    currency_pref: currency_pref
  };

  return _http.post(url, params, { headers: headers })
    .pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => _handleError(err)),
      first(),
      map((res) => res)
    )
    .then(async response => {

      //document.cookie = 'otp=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=' + environment.cookieDomain + ';';
      //cookieService.delete('otp', '/', environment.cookieDomain);

      loading.dismiss();

      if (response.operation == 'success') {

        const view = (response.new_user == 1) ? 'welcome' : 'view';
        setAccessToken(response, view);

        if (response.new_user == 1) {

          /*socialAnalyticsService.eventEmitter('sign-up-by-google', {
            email: response.email
          });*./

          eventService.newUserSignedUp$.next();

        } else {
         /* socialAnalyticsService.eventEmitter('login-by-google', {
            email: response.email
          });*
        }
      } else if (response.operation == 'error') {
        const alert = await _alertCtrl.create({
          message: translate.transform('Error getting login by Google+ API'), // JSON.stringify(err)
          buttons: [translate.transform('Ok')]
        });
        await alert.present();
      }
    }, err => {
      loading.dismiss();
    });
}

/**
 * Login by google idToken
 *
export async function useGoogleIdTokenForAuth(idToken: string, showLoader = true) {

  let loading;

  if (showLoader) {
    loading = await _loadingCtrl.create({
      spinner: 'crescent',
      message: translate.transform('Logging in...')
    });
    loading.present();
  }

  const url = environment.apiEndpoint + _urlLoginByGoogle;
  const headers = _buildAuthHeaders();

  return _http.post(url, {
    idToken: idToken,
    currency_pref: currency_pref,
    currency_label: currency_label
  }, {
    headers: headers
  })
    .pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => _handleError(err)),
      first(),
      map((res) => res)
    )
    .then(async response => {

      if (response.operation == 'success') {

        handleLogin(response, 'google');

      } else if (response.operation == 'error') {
        const alert = await _alertCtrl.create({
          message: translate.transform('Error getting login by Google+ API'), // JSON.stringify(err)
          buttons: [translate.transform('Ok')]
        });
        await alert.present();
      }

      eventService.googleLoginFinished$.next();

    }, err => {

      eventService.googleLoginFinished$.next(err);
    },
    () => {
      if (loading) {
        loading.dismiss();
      }
    });
}*/

/**
 * handle login response
 * @param response
 */
function handleLogin(response: any) {
  store.dispatch('setAccessToken', response);
}

/**
 * Login by Google for mobile app
 *
loginByGoogle() {

  Plugins.GoogleAuth.signIn().then(async googleUser => {

    if (googleUser && googleUser.authentication && googleUser.authentication.idToken) {
      useGoogleIdTokenForAuth(googleUser.authentication.idToken, false);
    } else {
      eventService.googleLoginFinished$.next();

      showLoginError('Error getting login by Google+ API');
    }
  }).catch(async err => {

    eventService.googleLoginFinished$.next();

    if (err = 'popup_closed_by_user') {
      return false;
    }

    showLoginError('Error getting login by Google+ API');

  });
}

async function showLoginError(err) {

  const alert = await _alertCtrl.create({
    message: translate.transform(err),
    buttons: [translate.transform('Ok')]
  });
  await alert.present();
}

/**
 * login with AppleJS for PWA
 *
export async function loginByAppleJs() {

  appleAuthLoading = true;

  try {
    const data = await AppleID.auth.signIn();

    const params = {
      identityToken: data.authorization.id_token,
      'email': data.user.email,
      'familyName': data.user.name.familyName,
      'givenName': data.user.name.givenName
    };

    handleAppleLoginResponse(params);

  } catch ( error ) {
    // popup_closed_by_user
    appleAuthLoading = false;
  }
}

/**
 * login by Apple sign in
 *
loginByApple() {

  appleAuthLoading = true;

  SignInWithApple.Authorize().then(async (data) => {
      handleAppleLoginResponse(data);
    })
    .catch(data => {

      // login/signup with private email

      handleAppleLoginResponse(data);
    });
}*/

/**
 * handle response from apple login popup
 * @param data
 *
async function handleAppleLoginResponse(data: any) {
  if (!data || !data.response || !data.response.identityToken) {
    
      store.state.appleAuthLoading = false;

    if (data.message && data.message.indexOf('AuthorizationError') == -1) {
      showLoginError(data.message);//todo translation
    }

    return null;
  }

  let params = {
    currency_pref: store.state.currency_pref
  };

  if (data.response.givenName) {

    Storage.set({ key: 'appleUserDetail', value: JSON.stringify({
        'email': data.response.email,
        'familyName': data.response.familyName,
        'user': data.response.user,
        'givenName': data.response.givenName
      })
    });

    params = Object.assign(params, data.response);
  } 
  else 
  {
    const { value } = await Storage.get({ key: 'appleUserDetail' });

    const oldData = JSON.parse(value);

    params = Object.assign((oldData) ? oldData : {}, data.response);
  }

  useAppleIdTokenForAuth(params);
}

/**
 * login/sign up by apple auth code
 * @param params
 *
export async function useAppleIdTokenForAuth(params) {
  const response = await axios.post('/auth/login-by-apple', params)
    .then((response: any) => {
      handleLogin(response, 'apple');
      store.state.appleAuthLoading = false;
    }, () => {
      store.state.appleAuthLoading = false;
    });
  return response.data;  
}

/**
 * Request password reset token
 * @param email
 */
export async function requestResetPassword(email: string) {
  const response = await axios.post('/auth/request-reset-password', {
    'email': email
  });
  return response.data;
}

/**
 * Update password
 * @param params
 */
export async function updatePassword(params: any) {
  const response = await axios.patch('/auth/update-password', params);
  return response.data;
}

/**
 * Resend verification email
 * @param email
 */
export async function resendVerificationEmail(email: string) {
  const response = await axios.post('/auth/resend-verification-email', { 'email': email });
  return response.data;
}

/**
 * Verify email
 * @param email
 * @param code
 */
export async function verifyEmail(email: string, code: string) {
  const response = await axios.post('/auth/verify-email', { email: email, 'code': code });
  return response.data;
}
