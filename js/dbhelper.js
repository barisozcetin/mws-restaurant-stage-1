/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    // const port = 5500 // Change this to your server port
    // return `http://localhost:${port}/data/restaurants.json`;

    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants/`;
  }

  /**
   * Fetch all restaurants.
   */


  /// First checks idb for results. if results then returns them. if not fetches them. Fetching in sw adds them to idb
  static fetchRestaurants() {
    return readAllFromIdb('restaurants').then(response => {
      // console.log ('dbhelper readall :'+ response);
      if (!response.length == 0) {
        return response;
      }
      else {
        return fetch(DBHelper.DATABASE_URL).then(response => response.json());
      }
    }).catch(error => {
      console.error(error);
    })
    
  }

  /**
   * Fetch a restaurant by its ID.
   */
  // First checkes idb. if there is response, returns it. if not fetches.
  static fetchRestaurantById(id) {
    return readOneFromIdb('restaurants', id).then(response => {
      // console.log ('dbhelper readone :'+ response);
      if (response) {
        return response;
      }
      else {
        return fetch(DBHelper.DATABASE_URL+id).then(response => response.json());
      }
    }).catch(error => {
      console.error(error);
    })
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  //
  static fetchRestaurantByCuisine(cuisine) {
    return DBHelper.fetchRestaurants().then(restaurants => {
      const results = restaurants.filter(r => r.cuisine_type == cuisine);
      return results;
    }).catch(error => {
      console.log('error');
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood) {

    return DBHelper.fetchRestaurants().then(restaurants => {
      const results = restaurants.filter(r => r.neighborhood == neighborhood);
      return results;
    }).catch(error => {
      console.log(error);
    })
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */


  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
    return DBHelper.fetchRestaurants().then(restaurants => {
      let results = restaurants
      if (cuisine != 'all') { // filter by cuisine
        results = results.filter(r => r.cuisine_type == cuisine);
      }
      if (neighborhood != 'all') { // filter by neighborhood
        results = results.filter(r => r.neighborhood == neighborhood);
      }
      return results;
    })
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
borhoods() {
    return DBHelper.fetchRestaurants().then(restaurants => {
      const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        return uniqueNeighborhoods;
    }).catch(error => {
      console.error(error);
    })
  }

  /**
   * Fetch all cuisines with proper error handling.
   */

  static fetchCuisines() {
    return DBHelper.fetchRestaurants().then(restaurants => {
      const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
      const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
      return uniqueCuisines;
    }).catch(error => {
      console.log(error);
    })
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`/restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }
  // get image sourceset
  static imageSrcSetForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph + '-320w'}.jpg 320w, /img/${restaurant.photograph + '-480w'}.jpg 480w, /img/${restaurant.photograph}.jpg 800w`);
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

}
