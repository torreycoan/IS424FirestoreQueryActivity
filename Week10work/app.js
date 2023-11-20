// firestore project database: https://console.firebase.google.com/u/0/project/is424week9practice/firestore/data/~2Fpeople
// FUNCTIONS
function del_doc(id) {
    db.collection('people')
        .doc(id).delete()
        .then(() => alert("user deleted"));
}

function update_doc(ele, id) {
    // console.log(ele)
    // when button is clicked, wanna make every hidden input element unhidden. 
    // here we only have one
    // gonna go to the parent of the button (a <p>) and change type -> text instead of "hidden"

    // change every input element that is hidden into a text input element
    // access parent of the button and look inside of it
    //console.log(ele.parentNode);
    let inputs = ele.parentNode.querySelectorAll('input') // will only look inside of the element (the parent) 
    //console.log(inputs)

    // change type: hidden -> text
    //inputs.forEach(i => i.type = "text")
    // inputs.forEach((i) => {
    //     i.type = "text";
    //     // read value of input element
    //     // click update button again (instead of a save button for time purposes)
    //     db.collection('people').doc(id).update({
    //         name: i.value
    //     })
    //     // this works but might not be good for every situation
    //     // refresh the page to see the update
    // })

    //console.log(inputs)
    inputs[0].type = "text";
    inputs[1].type = "text";

    db.collection('people').doc(id).update({
        name: inputs[0].value,
        color: inputs[1].value
    })


}


// today we will be adding to the firebase database thru the html form. 
// we want to add person to the db. need their name age and fav color. 

// attach click event listener to the submit button --------------------------------------------------------------
// method: queryselector. applies to all the html page. QS looks for element with this ID .
let btn = document.querySelector('#submit');
//use . to access element thru classnames
// use # to access element thru ID. 

//console.log(btn); // if the ID does not exist, this will return null. 

// once the button is click, i want certain events to happen. 
btn.addEventListener('click', () => {
    // alert("hello")
    //console.log(document.querySelector('#name').value) // only logged after i click

    let person = {
        name: document.querySelector('#name').value,
        age: parseInt(document.querySelector('#age').value), // string to integer
        color: document.querySelector('#favcolor').value
    }

    //console.log(person)

    // SUBMIT THE OBJECT TO FIRESTORE
    // database: https://console.firebase.google.com/u/0/project/is424week9practice/firestore/data/~2Fpeople~2FLRBsaOaohELkhL3xdItX
    db.collection('people').add(person).then(() => {
        alert('New person added')
    }) // if the people collection not exist, it'll be created.
    //.then() takes a callback function. use it bc some methods in js are asynchronous. .add() takes a few ms. .then will only execute AFTER the add. 

    // reset the form 
    document.querySelector('#name').value = "";
    document.querySelector('#age').value = "";
    document.querySelector('#favcolor').value = "";


    // typically also want to make a call to db so u can see the new addition to the database without refreshing the page. 

}) // callback function - no params, not assigning name to it. using arrow notation. 

// DISPLAY DATA FROM THE DATABASE-------------------------------------------------------------------------------
// .get() retrieves all documents from a collection. It returns an array of all docs in collection (even if only 1 obj) [{}, {}, ...]
// must call .data() to get the actual data from the object. 
// .where() allows us to put conditions in the (). 
// order: [.where()].get().data()

db.collection('people').get().then((data) => {
    //console.log(data.docs); // accessing the array. includes their doc id. 

    //console.log(data.docs[0].data()); // looking at the first record. to get their name, use .name at end. 
    //to access each object must loop thru them all and use the .data(). 

    let docs = data.docs //array to loop thru
    let html = ``; //can use ' or " too . empty string
    docs.forEach(doc => {
        //console.log(doc.data());
        // gonna give it its document ID as its ID
        html += `<p id = ${doc.id} class ="box">${doc.data().name} 

        <input type = "hidden" value = "${doc.data().name}"/>
        <button class="button is-pulled-right" onclick="update_doc(this, '${doc.id}')">update</button>

        
        ${doc.data().color}
        <input type = "hidden" value = "${doc.data().color}"/>

        <button onclick="del_doc('${doc.id}')" class = "button is-pulled-right"> X</button></p>` // the box class is bulma
        // when you click on the X button, can delete using the function del_doc that we will make above
        // the input tag is to be able to update the doc
        // when the update button is hit, gonna unhide the input

    });
    //console.log(html)

    //add content to an existing div - use innerHTML property
    document.querySelector('#all_people').innerHTML += html;


})
//use .then bc get is asynchronous function

// making database, 4 things we have to be mindful of. CRUD: Create Read Update Delete. 
//We have done CR above. Did D too in IS371 but not U. 
// for U and D, document ID is essential. 

// UPDATING A DOCUMENT IN THE DB----------------------------------------------------------------
//.doc().update({}) 
// the object that update takes will be in the form key: value
// db.collection('people').doc('LRBsaOaohELkhL3xdItX').update({
//     age: 37,
//     name: "john w",
//     spouse: "mary" // update method allows u to add additional keys/fields
// }) // LRBsaOaohELkhL3xdItX is the document ID
// this is hardcoding. have the doc id. how do i give the option to 
// UPDATE THE DATA THRU THE APP?
// see above - the input and button elements added to html


// DELETING A DOCUMENT IN THE DB------------------------------------------------------------
// db.collection('people').doc('LRBsaOaohELkhL3xdItX').delete() 
// now we are gonna add an X button to the display of database data and make it able to delete stuff from database. 


// Database design
// we are gonna have good easy structure, not as good performance, ad nested subcollections
// see week 11 document "Firestore DB design" for quick in class work on db design

//week 11
// FILTERING
// Today: https://firebase.google.com/docs/firestore/query-data/queries (Web namespaced API versions)
// our query will look something like : db.collection('people').where(key, operator (e.g. < > ==), value).get()
// the datatype of key really matters. if its number, str, bool, easy. if array, different - we would have to call separate operator from firestore. 
// assume: see ppl where age = 20. .where('age', '==', 20). This is simple query - simple bc filtering based on one key. if wantt o filter based on more than that, is compound
// THIS WOULDNT WORK FOR COMPOUND QUERIES: .where('age', '==' ,20).where('location', '==', 'california')
// if want multiple levels of filtering, have to make index . 

// query
// db.collection('people')
//     .where('age', '>', 20)
//     //.where('name', '==', 'oldperson') // error: FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/is424week9practice/firestore/indexes?create_composite=ClFwcm9qZWN0cy9pczQyNHdlZWs5cHJhY3RpY2UvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3Blb3BsZS9pbmRleGVzL18QARoICgRuYW1lEAEaBwoDYWdlEAEaDAoIX19uYW1lX18QAQ
//     // COOL : if they were both == instead of > it may work without that error! but better practice is to go to that url and ake the index. 
//     .get()
//     .then((data) => {
//         let docs = data.docs;
//         docs.forEach((d) => {
//             console.log(d.data())
//         })
//     })

// SEARCH WITHIN AN ARRAY
//show all ppl who have jackie as a friend (manually added friends field (array) for most docs)
// another version: array-contains-any to look for >1 element in an array. e.g. jackie or john or both are in their friends array
// IMPORTANT btw when looking at documentation for firestore, we are using the Web namespaced API not the regular
// db.collection('people')
//     .where('friends', 'array-contains', 'jackie')
//     .get()
//     .then((data) => {
//         let docs = data.docs
//         docs.forEach((d) => {
//             console.log(d.data())
//         })
//     })

// db.collection('people')
//     .where('friends', 'array-contains-any', ['jackie', 'old fart'])
//     .get()
//     .then((data) => {
//         let docs = data.docs
//         docs.forEach((d) => {
//             //console.log('ARRAY CONTAINS ANY')
//             console.log(d.data())
//         })
//     })

// IN and NOT IN 
// // show ppl with blue or green as their color
// db.collection('people')
//     .where('color', 'in', ['blue', 'green'])
//     .get()
//     .then((data) => {
//         let docs = data.docs
//         docs.forEach((d) => {
//             //console.log('ARRAY CONTAINS ANY')
//             console.log(d.data())
//         })
//     })

// show all people that have not blue or green as their favoriate color
// db.collection('people')
//     .where('color', 'not-in', ['blue', 'green'])
//     .get()
//     .then((data) => {
//         let docs = data.docs
//         docs.forEach((d) => {
//             //console.log('ARRAY CONTAINS ANY')
//             console.log(d.data())
//         })
//     })



// ACTIVITY: Firestore Query Activity
//https://console.firebase.google.com/u/0/project/is424week9practice/firestore/data/~2Fteams~2F4nOuCnneX0RRVbAUNajJ
// display all output on the browser page

// 1.	Show all teams in Spain.
let activityhtml = ``
db.collection('teams').where('country', '==', 'Spain')
    .get()
    .then((data) => {
        let docs = data.docs
        console.log('#1')
        document.querySelector('#activity').innerHTML += "#1\n"
        docs.forEach((d) => {
            //console.log('ARRAY CONTAINS ANY')
            console.log(d.data().teamname)
            document.querySelector('#activity').innerHTML += `<p>1. ${d.data().teamname}</p>`
        })
    })
// NOT WORKING ^ got correct answer using console.log tho its just about the displaying. 

// 2.	Show all teams in Madrid, Spain
db.collection('teams').where('country', '==', 'Spain').where('city', '==', 'Madrid')
    .get()
    .then((data) => {
        let docs = data.docs
        console.log('#2')
        document.querySelector('#activity').innerHTML += "#2\n"
        docs.forEach((d) => {
            //console.log('ARRAY CONTAINS ANY')
            console.log(d.data().teamname)
            document.querySelector('#activity').innerHTML += `2. <p>${d.data().teamname}</p>`
        })
    })

// 3.	Show all national teams (Remember there might be new national teams added later)
db.collection('teams').where('city', '==', 'Not applicable') // im guesssing this is how u tell if its  a national team?
    .get()
    .then((data) => {
        let docs = data.docs
        console.log('#3')
        document.querySelector('#activity').innerHTML += "#3\n"
        docs.forEach((d) => {
            //console.log('ARRAY CONTAINS ANY')
            console.log(d.data().teamname)
            document.querySelector('#activity').innerHTML += `<p>3. ${d.data().teamname}</p>`
        })
    })

// 4.	Show all teams that are not in Spain
db.collection('teams').where('country', '!=', 'Spain')
    .get()
    .then((data) => {
        let docs = data.docs
        console.log('#4')
        document.querySelector('#activity').innerHTML += "#4\n"
        docs.forEach((d) => {
            console.log(d.data().teamname)
            document.querySelector('#activity').innerHTML += `4. <p>${d.data().teamname}</p>`
        })
    })

// 5.	Show all teams that are not in Spain or England
db.collection('teams').where('country', 'not-in', ['Spain', 'England'])
    .get()
    .then((data) => {
        let docs = data.docs
        console.log('#5')
        document.querySelector('#activity').innerHTML += "#5\n"
        docs.forEach((d) => {
            //console.log('ARRAY CONTAINS ANY')
            console.log(d.data().teamname)
            document.querySelector('#activity').innerHTML += `<p>5. ${d.data().teamname}</p>`
        })
    })
// 6.	Show all teams in Spain with more than 700M fans
db.collection('teams').where('country', '==', 'Spain').where('millionsoffans', '>', 700)
    .get()
    .then((data) => {
        let docs = data.docs
        console.log('#6')
        document.querySelector('#activity').innerHTML += "#6\n"
        docs.forEach((d) => {
            console.log(d.data().teamname)
            document.querySelector('#activity').innerHTML += `6. <p>${d.data().teamname}</p>`
        })
    })

// 7.	Show all teams with a number of fans in the range of 500M and 600M 
db.collection('teams').where('millionsoffans', '>=', 500).where('millionsoffans', '<=', 600)
    .get()
    .then((data) => {
        let docs = data.docs
        console.log('#7')
        document.querySelector('#activity').innerHTML += "#7\n"
        docs.forEach((d) => {
            console.log(d.data().teamname)
            document.querySelector('#activity').innerHTML += `7. <p>${d.data().teamname}</p>`
        })
    })
// 8.	Show all teams where Ronaldo is a top scorer 
db.collection('teams').where('topscorers', 'array-contains', "Ronaldo")
    .get()
    .then((data) => {
        let docs = data.docs
        console.log('#8')
        document.querySelector('#activity').innerHTML += "#8\n"
        docs.forEach((d) => {
            console.log(d.data().teamname)
            document.querySelector('#activity').innerHTML += `8. <p>${d.data().teamname}</p>`
        })
    })

// 9.	Show all teams where Ronaldo,  Maradona, or Messi is a top scorer
db.collection('teams').where('topscorers', 'array-contains-any', ["Ronaldo", "Maradona", "Messi"])
    .get()
    .then((data) => {
        let docs = data.docs
        console.log('#9')
        document.querySelector('#activity').innerHTML += "#9\n"
        docs.forEach((d) => {
            console.log(d.data().teamname)
            document.querySelector('#activity').innerHTML += `9. <p>${d.data().teamname}</p>`
        })
    })

//console.log('activityhtml: ', activityhtml)
//document.querySelector('#activity').innerHTML += activityhtml;


// activity task 3: updating data

// a. Update the worldwide fans and team name and top scorers
// a1. Real Madrid: 811 M worldwide fans. 
//      Also, change team name to Real Madrid FC. 
db.collection('teams').doc("9x568FxdqJ6CfIeybfXp").update({
    millionsoffans: 811,
    teamname: "Real Madrid FC"
})
//      Also, Remove Hazard from the topscorers list and add Crispo to the list
db.collection('teams').doc("9x568FxdqJ6CfIeybfXp").update({
    //topscorers: firebase.firestore.FieldValue.arrayUnion("Crispo"),
    topscorers: firebase.firestore.FieldValue.arrayRemove("Hazard")
})
db.collection('teams').doc("9x568FxdqJ6CfIeybfXp").update({
    topscorers: firebase.firestore.FieldValue.arrayUnion("Crispo"),
})
// a2. Barcelona: 747 M worldwide fans. 
//      Also, change team name to FC Barcelona . 
db.collection('teams').doc("4nOuCnneX0RRVbAUNajJ").update({
    millionsoffans: 747,
    teamname: "FC Barcelona"
})
//      Remove Puyol from the list and add Deco to the list
db.collection('teams').doc("4nOuCnneX0RRVbAUNajJ").update({
    topscorers: firebase.firestore.FieldValue.arrayRemove("Puyol")
})
db.collection('teams').doc("4nOuCnneX0RRVbAUNajJ").update({
    topscorers: firebase.firestore.FieldValue.arrayUnion("Deco"),
})

// b.	Adding new fields to existing documents
// Real Madrid: White (home). Black (away)
// Barcelona: Red (home). Gold (away)

db.collection('teams').doc("9x568FxdqJ6CfIeybfXp").update({
    colors: {
        home: "White",
        away: "Black"
    }
})
db.collection('teams').doc("4nOuCnneX0RRVbAUNajJ").update({
    colors: {
        home: "Red",
        away: "Gold"
    }
})

//update the object
// c.	Real Madrid: Purple jersey color for away matches
// d.	Barcelona: Pink jersey color for away matches
db.collection('teams').doc("9x568FxdqJ6CfIeybfXp").update({
    'colors.away': 'Purple'
})
db.collection('teams').doc("4nOuCnneX0RRVbAUNajJ").update({
    'colors.away': 'Pink'
})


//-------------------------------------------------------------------------------------------------
// continuing week 11: UPDATE AN EXISTING ARRAY
// 1. add new element : arrayUnion(element)
// 2. remove element: arrayRemove(element)
// https://firebase.google.com/docs/firestore/manage-data/add-data?authuser=0
// will be like doc("docID").update(friends: arrayUnion("newfiend"), friends:arrayremove("oldfriend"))
db.collection('people').doc("C6Rsxss9PDhMXbPHR0gg").update({
    friends: firebase.firestore.FieldValue.arrayUnion("mike"), // worked
    //friends: firebase.firestore.FieldValue.arrayUnion("julie"), // why not in db?? HELP: NOT WORK! why? SEE NOTE BELOW!
    friends: firebase.firestore.FieldValue.arrayRemove("old friend"), // worked
})
//NOTE: can only do one union/remove at a time (can do a union and remove in same function call). if want to union another person, have to do it in a separate function call. 

// // in firestore, an object is called a 'map'
// db.collection('people').doc("C6Rsxss9PDhMXbPHR0gg").update({
//     friends: firebase.firestore.FieldValue.arrayRemove("jackie"), // worked
//     favorites: {
//         color: 'pink',
//         food: 'pizza',
//         city: 'madison'
//     }
// })

// update an object - updating favorite color
// db.collection('people').doc("C6Rsxss9PDhMXbPHR0gg").update({
//     'favorites.color': 'purple'
// }) // help: not seeing the addition of favorites/ addition of julie so idk if this works
// //Alternative:
// db.collection('people').doc("C6Rsxss9PDhMXbPHR0gg").update({
//     favorites: {
//         color: "new purple"
//     }
// })