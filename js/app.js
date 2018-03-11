/** Decided to add the scripts which is complately written by me in an additional file
 * also registering the service worker in this file
 */

/** I intended to listen idle event on map but it didn't load all the links and buttons on map. so i had to use some hacky way and use set timeout */
function noTabOnMap() {
  setTimeout(function(){ 
    const mapDiv = document.querySelector('#map-container');
    let mapLinks = mapDiv.querySelectorAll("#map-container *");
    for (let link of mapLinks) {
      link.tabIndex = "-1";
    }
  }, 1000);
}