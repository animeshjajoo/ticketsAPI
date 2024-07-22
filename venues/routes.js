const express = require('express');
const router = express.Router();

const { getVenueModel } = require('../common/models/Venue');

function checkTimings(arr1, arr2){

    for (let i = 0; i < arr1.length; i++) {
        if (arr[i] == 1 && arr2[i] != 0) {
          return false; // new venue not free for event in old venue
        }
    }

    return true;
}

//Post
router.post('/', async (req, res) => {
    const data = {
        venueID: req.body.venueID
    }
    try {
        const Venue = getVenueModel();
        const dataToSave = await Venue.create(data);
        res.status(200).json(dataToSave);
    } 
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// Get All
router.get('/all', async (req, res) => {
    try {
        const Venue = getVenueModel();
        console.log(Venue);

        const data = await Venue.findAll();
        console.log(Venue);

        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID 
router.get('/:id', async (req, res) => {
    try {
        const Venue = getVenueModel();
        const data = await Venue.findByPk(req.params.venueID);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Update Venue


// update only using ID, so can only change when new venue is free 
// when old venue wants to shift events

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const Venue = getVenueModel();
        const venueID = req.params.venueID;
        const data = await User.findByPk(id)
        if(data){
            await Venue.destroy({ where: { venueID } });
            res.send(`Venue with id ${data.venueID} has been deleted.`);
        } 
        else{
            res.status(404).json({ message: "Venue not found" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// Venue deleted -> Delete all Events -> Delete all tickets of events

module.exports = router;