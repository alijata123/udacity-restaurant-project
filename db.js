const dbName = "restaurants-data";

// This is what our restaurants data looks like.
const restaurantData = [
  { address: "444-44-4444", name: "Mission Chinese Food", cuisine_type: "Asian", operating_hours: "09:00-21:00", reviews: "awesome restaurant" },
  { address: "555-55-5555", name: "Emily", cuisine_type: "Pizza", operating_hours: "09:00-21:00", reviews: "great restaurant" }
];

var request = indexedDB.open(dbName, 3);

request.onerror = function(event) {
  // Handle errors.
    console.log("Something went wrong");
};
request.onupgradeneeded = function(event) {
  var db = event.target.result;

  var objectStore = db.createObjectStore('restaurants', { keyPath: "name"});
    


  objectStore.createIndex("name", "name", { unique: true });
    
  objectStore.createIndex("address", "address", { unique: true });
  objectStore.createIndex("cuisine_type", "cuisine_type", { unique: false });
  objectStore.createIndex("operating_hours", "operating_hours", { unique: false });
  objectStore.createIndex("reviews", "reviews", { unique: false });    

       
    

  // Use transaction oncomplete to make sure the objectStore creation is 
  // finished before adding data into it.
  objectStore.transaction.oncomplete = function(event) {
    // Store values in the newly created objectStore.
    var restaurantObjectStore = db.transaction("restaurants", "readwrite").objectStore("restaurants");
    restaurantData.forEach(function(restaurant) {
      restaurantObjectStore.add(restaurant);
    });
  };
    

};