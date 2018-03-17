//* Common scripts to use both dbhelper and sw for fetching and reading data with idb *//

const dbPromise = idb.open('restaurants-store', 2, function(db) {
  if (!db.objectStoreNames.contains('restaurants')) {
    db.createObjectStore('restaurants', {keyPath: 'id'});
  }
});


function writeToIdb(st, data) {
  return dbPromise.then(db => {
    const tx = db.transaction(st, 'readwrite');
    const store = tx.objectStore(st);
    store.put(data);
    return tx.complete;
  }).catch(error => {
    console.error(error)
  })
}

function readAllFromIdb(st) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(st, 'readonly');
      var store = tx.objectStore(st);
      return store.getAll();
    });
}

function readOneFromIdb(st, id) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(st, 'readonly');
      var store = tx.objectStore(st);
      return store.get(Number(id));
    }).then(obj => {
      // console.log(obj)
      return obj
    })
}