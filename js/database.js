  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "AIzaSyAGBRWlsZsQmYjeHSphyRD7C_afl9NNjcg",
    authDomain: "watchlist-82dc5.firebaseapp.com",
    // For databases not in the us-central1 location, databaseURL will be of the
    // form https://[databaseName].[region].firebasedatabase.app.
    // For example, https://your-database-123.europe-west1.firebasedatabase.app
    databaseURL: "https://watchlist-82dc5-default-rtdb.firebaseio.com",
    storageBucket: "watchlist-82dc5.appspot.com",
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();