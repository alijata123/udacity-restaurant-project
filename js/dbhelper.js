/**
 * Common database helper functions.
 */



class DBHelper {
  

  /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    static get DATABASE_URL() {
      const port = 1337 // Change this to your server port
      return `http://localhost:${port}/restaurants`;
    }


    static get REVIEWS_DATABASE_URL() {
      const port = 1337 // Change this to your server port
      return `http://localhost:${port}/reviews`;
      //`http://localhost:${port}/`;    
    }


  


     //Fetch all restaurants.
 
    static fetchRestaurants(callback) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', DBHelper.DATABASE_URL);
      xhr.onload = () => {
        if (xhr.status === 200) { // Got a success response from server!
          const restaurants = JSON.parse(xhr.responseText);
          callback(null, restaurants);
        } else { // Oops!. Got an error from server.
          const error = (`Request failed. Returned status of ${xhr.status}`);
          callback(error, null);
        }
      };
      xhr.send();
    }
    
    static fetchReviews(callback) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', DBHelper.REVIEWS_DATABASE_URL);
      xhr.onload = () => {
        if (xhr.status === 200) { // Got a success response from server!
          const reviews = JSON.parse(xhr.responseText);
          callback(null, reviews);
        } else { // Oops!. Got an error from server.
          const error = (`Request failed. Returned status of ${xhr.status}`);
          callback(error, null);
        }
      };
      xhr.send();
    }

    // Delete Reviews
    static deleteReviews(callback) {
      let xhr = new XMLHttpRequest();
      xhr.open('DELETE', DBHelper.REVIEWS_DATABASE_URL);
      xhr.onload = () => {
        if (xhr.status === 200) { // Got a success response from server!
          const reviews = JSON.parse(xhr.responseText);
          callback(null, reviews);
        } else { // Oops!. Got an error from server.
          const error = (`Request failed. Returned status of ${xhr.status}`);
          callback(error, null);
        }
      };
      xhr.send();
    }


    /*****************************************/
    static fetchReviewsApiById(id) {
      // fetch all reviews with proper error handling.
      // Using fetch
      return fetch(DBHelper.REVIEWS_DATABASE_URL+'/?restaurant_id='+id, {
        method: 'GET'
      })
      .then(response => {
        let json = response.json()
        if(!json) {
          return Promise.reject(new Error('Restaurant not found!!!'));
        }
        return json;
      })
      .catch(error => { 
        console.error(error)
      });
    }
 
  
 


    
    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id, callback) {
      // fetch all restaurants with proper error handling.
      DBHelper.fetchRestaurants((error, restaurants) => {
        if (error) {
          callback(error, null);
        } else {
          const restaurant = restaurants.find(r => r.id == id);
          if (restaurant) { // Got the restaurant
            callback(null, restaurant);
          } else { // Restaurant does not exist in the database
            callback('Restaurant does not exist', null);
          }
        }
      });
        
        
    }
      
  
    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine, callback) {
      // Fetch all restaurants  with proper error handling
      DBHelper.fetchRestaurants((error, restaurants) => {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given cuisine type
          const results = restaurants.filter(r => r.cuisine_type == cuisine);
          callback(null, results);
        }
      });
       
    }
  
    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants((error, restaurants) => {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given neighborhood
          const results = restaurants.filter(r => r.neighborhood == neighborhood);
          callback(null, results);
        }
      });
      
    }
  
    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants((error, restaurants) => {
        if (error) {
          callback(error, null);
        } else {
          let results = restaurants
          if (cuisine != 'all') { // filter by cuisine
            results = results.filter(r => r.cuisine_type == cuisine);
          }
          if (neighborhood != 'all') { // filter by neighborhood
            results = results.filter(r => r.neighborhood == neighborhood);
          }
          callback(null, results);
        }
      });
       
    }
  
    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants((error, restaurants) => {
        if (error) {
          callback(error, null);
        } else {
          // Get all neighborhoods from all restaurants
          const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
          // Remove duplicates from neighborhoods
          const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
          callback(null, uniqueNeighborhoods);
        }
      });   
    }
    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants((error, restaurants) => {
        if (error) {
          callback(error, null);
        } else {
          // Get all cuisines from all restaurants
          const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
          // Remove duplicates from cuisines
          const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
          callback(null, uniqueCuisines);
        }
      });
       
    } 
      
    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
      return (`./restaurant.html?id=${restaurant.id}`);
    }
    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
      return ( `/img/data-src/${restaurant.photograph}`+ '.webp');
    }
    
    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
      const marker = new google.maps.Marker({
        position: restaurant.latlng,
        title: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant),
        map: map,
        animation: google.maps.Animation.DROP}
      );
      return marker;
    }
  
  
  
  
  
    /******************************************** */
    static addReview(review) {
      let offline_rev = {
        name: 'addReview',
        data: review,
        object_type: 'review'
      };
      // Check if online
      if (!navigator.onLine && (offline_rev.name === 'addReview')) {
        DBHelper.getDataWhenConnection(offline_rev);
        return;
      }
      let reviewSend = {
        "name": review.name,
        "rating": parseInt(review.rating),
        "comments": review.comments,
        "restaurant_id": parseInt(review.restaurant_id),
        "createdAt": new Date(),
        "updatedAt": new Date()
      };
      console.log('Sending review: ', reviewSend);
      var fetch_options = {
        method: 'POST',
        body: JSON.stringify(reviewSend),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      };
      fetch(`http://localhost:1337/reviews`, fetch_options).then((response) => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          return response.json();
        } else { return 'API call successfull'}})
      .then((data) => {console.log(`Fetch successful!`)})
      .catch(error => console.log('error:', error));
    }
  
  
  
    static getDataWhenConnection(offline_rev) {
      console.log('Offline Review', offline_rev);
      localStorage.setItem('data', JSON.stringify(offline_rev.data));
      alert(`Success: Your ${offline_rev.object_type} was stored in offline mode!`);
      window.addEventListener('online', (event) => {
        console.log('Browser: Online again!');
        let data = JSON.parse(localStorage.getItem('data'));
        console.log('updating and cleaning ui');
        [...document.querySelectorAll(".reviews_offline")]
        .forEach(el => {
          el.classList.remove("reviews_offline")
          el.querySelector(".offline_label").remove()
        });
        if (data !== null) {
          console.log(data);
          if (offline_rev.name === 'addReview') {
            DBHelper.addReview(offline_rev.data);
          }
  
          console.log('Data sent to API');
  
          localStorage.removeItem('data');
          console.log(`Local Storage: ${offline_rev.object_type} removed`);
        }
      });
    }
  
 
    static updateFavouriteStatus(restaurantId, isFavourite) {
      console.log('changing status to: ', isFavourite);
  
      fetch(`http://localhost:1337/restaurants/${restaurantId}/?is_favorite=${isFavourite}`, {
          method: 'PUT'
        })
        .then(() => {
          console.log('changed');
          this.dbPromise()
            .then(db => {
              const tx = db.transaction('restaurants', 'readwrite');
              const restaurantsStore = tx.objectStore('restaurants');
              restaurantsStore.get(restaurantId)
                .then(restaurant => {
                  restaurant.is_favorite = isFavourite;
                  restaurantsStore.put(restaurant);
                });
            })
        })
  
    }
 

  
    /**
     * Fetch all reviews.
     */
  
    static storeIndexedDB(table, objects) {
      this.dbPromise.then(function(db) {
        if (!db) return;
  
        let tx = db.transaction(table, 'readwrite');
        const store = tx.objectStore(table);
        if (Array.isArray(objects)) {
          objects.forEach(function(object) {
            store.put(object);
          });
        } else {
          store.put(objects);
        }
      });
    }
  
  
    static getStoredObjectById(table, idx, id) {
      return this.dbPromise()
        .then(function(db) {
          if (!db) return;
  
          const store = db.transaction(table).objectStore(table);
          const indexId = store.index(idx);
          return indexId.getAll(id);
        });
    }


    /*************************** 
    static fetchReviewsByRestId(id) {
      return fetch(`${DBHelper.DATABASE_URL}reviews/?restaurant_id=${id}`)
        .then(response => response.json())
        .then(reviews => {
          this.dbPromise()
            .then(db => {
              if (!db) return;
  
              let tx = db.transaction('reviews', 'readwrite');
              const store = tx.objectStore('reviews');
              if (Array.isArray(reviews)) {
                reviews.forEach(function(review) {
                  store.put(review);
                });
              } else {
                store.put(reviews);
              }
            });
          console.log('revs are: ', reviews);
          return Promise.resolve(reviews);
        })
        .catch(error => {
          return DBHelper.getStoredObjectById('reviews', 'restaurant', id)
            .then((storedReviews) => {
              console.log('looking for offline stored reviews');
              return Promise.resolve(storedReviews);
            })
        });
    }
    */
  
   
  




  
  }