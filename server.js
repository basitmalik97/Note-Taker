// Import all required dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
var PORT = process.env.PORT || 3001;
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Redirect the user to the appropriate page based on the URL.
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});
app.get("/notes", (req, res) => {
   res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// Send a JSON response containing all notes when the user accesses /api/notes.
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
      if (error) {
          return console.log(error)
      }
      res.json(JSON.parse(notes))
  })
});

// Implement the POST method to send user input to the backend.
app.post("/api/notes", (req, res) => {
// Declare a const to represent the note currently being saved by the user.
const currentNote = req.body;
// Retrieve notes from db.json, get the ID of the last note, and add 1 to it to create a new ID for the next note.
// Create a new ID and save the current note with the new ID.
fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error, notes) => {
      if (error) {
          return console.log(error)
      }
      notes = JSON.parse(notes)
// Assign a unique ID to each new note based on the last ID.
// If there are no items in the notes array, assign the ID as 10.
if (notes.length > 0) {
      let lastId = notes[notes.length - 1].id
      var id =  parseInt(lastId)+ 1
      } else {
        var id = 10;
      }
// Create a new note object.
let newNote = { 
        title: currentNote.title, 
        text: currentNote.text, 
        id: id 
        }
// Merge the new note with the existing notes array.
var newNotesArr = notes.concat(newNote)
// Write the new array to the db.json file and return it to the user.
fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(newNotesArr), (error, data) => {
        if (error) {
          return error
        }
        console.log(newNotesArr)
        res.json(newNotesArr);
      })
  });
 
});

// Delete the chosen note using the DELETE HTTP method.
app.delete("/api/notes/:id", (req, res) => {
  let deleteId = JSON.parse(req.params.id);
  console.log("ID to be deleted: " ,deleteId);
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
    if (error) {
        return console.log(error)
    }
   let notesArray = JSON.parse(notes);
// Loop through the notes array and remove the note with an ID matching the deleteId.
for (var i=0; i<notesArray.length; i++){
     if(deleteId == notesArray[i].id) {
       notesArray.splice(i,1);

       fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notesArray), (error, data) => {
        if (error) {
          return error
        }
        console.log(notesArray)
        res.json(notesArray);
      })
     }
  }
  
}); 
});

// Initialize the port to start listening for incoming requests.
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
