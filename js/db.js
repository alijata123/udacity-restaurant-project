var db;
 
function indexedDBOk() {
    return "indexedDB" in window;
    
    document.addEventListener("DOMContentLoaded", function() {
 
    //No support? Go in the corner and pout.
    if(!indexedDBOk) return;
 
    var openRequest = indexedDB.open("restaurants",1);
 
    openRequest.onupgradeneeded = function(e) {
        var thisDB = e.target.result;
 
        if(!thisDB.objectStoreNames.contains("restaurant")) {
            thisDB.createObjectStore("restaurant");
        }
    }
 
    openRequest.onsuccess = function(e) {
        console.log("running onsuccess");
 
        db = e.target.result;
    }
 
    openRequest.onerror = function(e) {
        //Do something for the error
        console.log("Error")
    }
 
},false);
    
}
 





/*
 
function addPerson(e) {
    var name = document.querySelector("#name").value;
    var email = document.querySelector("#email").value;
 
    console.log("About to add "+name+"/"+email);
 
    var transaction = db.transaction(["people"],"readwrite");
    var store = transaction.objectStore("people");
 
    //Define a person
    var person = {
        name:name,
        email:email,
        created:new Date()
    }
 
    //Perform the add
    var request = store.add(person,1);
 
    request.onerror = function(e) {
        console.log("Error",e.target.error.name);
        //some type of error handler
    }
 
    request.onsuccess = function(e) {
        console.log("Woot! Did it");
    }
}
*/