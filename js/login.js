// var testUserButton = document.querySelector("#TUButton");

// testUserButton.onclick = function(){
//     window.location.href = "app.html";
// };

//------

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAGBRWlsZsQmYjeHSphyRD7C_afl9NNjcg",
    authDomain: "watchlist-82dc5.firebaseapp.com",
    databaseURL: "https://watchlist-82dc5-default-rtdb.firebaseio.com",
    projectId: "watchlist-82dc5",
    storageBucket: "watchlist-82dc5.appspot.com",
    messagingSenderId: "149795006830",
    appId: "1:149795006830:web:44478d45cd9aeeb4db397f",
    measurementId: "G-YT79JFKSPF"
  };
  // Initialize Firebase

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  var ui = new firebaseui.auth.AuthUI(firebase.auth());




ui.start('#firebaseui-auth-container', {
  signInOptions: [
    // List of OAuth providers supported.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID
  ],
  // Other config options...
});


var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      window.location.href = "app.html";

      // return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
  ],
  // // Terms of service url.
  // tosUrl: '<your-tos-url>',
  // // Privacy policy url.
  // privacyPolicyUrl: '<your-privacy-policy-url>'
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

