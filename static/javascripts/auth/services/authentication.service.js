/**
 * Authentication
 * @namespace thinkster.authentication.services
 */
(function() {
  'use strict';

  angular
    .module('thinkster.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http'];

  /**
   * @namespace Authentication
   * @returns {Factory}
   */
  function Authentication($cookies, $http) {
    /**
     * @name Authentication
     * @desc The Factory to be returned
     */
    var Authentication = {
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      login: login,
      register: register,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate: unauthenticate,
      logout: logout
    };

    return Authentication;

    ////////////////////

    /**
     * @name getAuthenticatedAccount
     * @desc Return the currently authenticated account
     * @returns {object|undefined} Account if authenticated, else `undefined`
     * @memberOf thinkster.authentication.services.Authentication
     */
    function getAuthenticatedAccount() {
      if (!$cookies.authenticatedAccount) {
        return;
      }

      return JSON.parse($cookies.authenticatedAccount);
    }

    /**
     * @name isAuthenticated
     * @desc Check if the current user is authenticated
     * @returns {boolean} True is user is authenticated, else false.
     * @memberOf thinkster.authentication.services.Authentication
     */
    function isAuthenticated() {
      return !!$cookies.authenticatedAccount;
    }

    /**
     * @name login
     * @desc Try to log in with email `email` and password `password`
     * @param {string} email The email entered by the user
     * @param {string} password The password entered by the user
     * @returns {Promise}
     * @memberOf thinkster.authentication.services.Authentication
     */

    function login(email, username, password) {
      var username = email
      return $http.post('/auth/jwt/create/', {
        email: email,
        username: username,
        password: password
      }).then(authToken, loginErrorFn);

      function authToken(data) {
        $cookies.token = data.data.token;
        return $http.get('/auth/me/', {
          token: $cookies.token,
          headers: {'Authorization': 'JWT ' + $cookies.token}
        }).then(loginSuccessFn, loginErrorFn);
      }

      /**
       * @name loginSuccessFn
       * @desc Set the authenticated account and redirect to index
       */
      function loginSuccessFn(data, status, headers, config) {
        Authentication.setAuthenticatedAccount(data.data);

        window.location = '/';
      }

      /**
       * @name loginErrorFn
       * @desc Log "data.data.detail" to the console
       */
      function loginErrorFn(data, status, headers, config) {
        error(data.statusText);
      }
    }

    /**
     * @name logout
     * @desc Try to log the user out
     * @returns {Promise}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function logout() {
      return $http.post('/auth/token/destroy/', {
          headers: {'Authorization': 'JWT ' + $cookies.token}
      }).then(logoutSuccessFn, logoutErrorFn);

      /**
       * @name logoutSuccessFn
       * @desc Unauthenticate and redirect to index with page reload
       */
      function logoutSuccessFn(data, status, headers, config) {

        Authentication.unauthenticate();

        window.location = '/';
      }

      /**
       * @name logoutErrorFn
       * @desc Log "data.data.detail" to the console
       */
      function logoutErrorFn(data, status, headers, config) {
        console.error(data.data.detail);
      }
    }

    /**
     * @name register
     * @desc Try to register a new user
     * @param {string} email The email entered by the user
     * @param {string} password The password entered by the user
     * @param {string} username The username entered by the user
     * @returns {Promise}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function register(email, password, username) {
      var username = email
      return $http.post('/auth/users/create/', {
        username: username,
        password: password,
        email: email
      }).then(registerSuccessFn, registerErrorFn);
      /**
       * @name registerSuccessFn
       * @desc Log the new user in
       */
      function registerSuccessFn(data, status, headers, config) {
        Authentication.login(email, username, password);
      }
      /**
       * @name registerErrorFn
       * @desc Log "data.data.detail" to the console
       */
      function registerErrorFn(data, status, headers, config) {
        console.error(data.data.detail);
      }
    }

    /**
     * @name setAuthenticatedAccount
     * @desc Stringify the account object and store it in a cookie
     * @param {Object} user The account object to be stored
     * @returns {undefined}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function setAuthenticatedAccount(account) {
      $cookies.authenticatedAccount = JSON.stringify(account);
    }

    /**
     * @name unauthenticate
     * @desc Delete the cookie where the user object is stored
     * @returns {undefined}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function unauthenticate() {
      delete $cookies.authenticatedAccount;
      delete $cookies.token;
    }
  }
})();
