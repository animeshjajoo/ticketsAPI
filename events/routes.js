const express = require('express');
const router = express.Router();

const { getEventModel } = require('../common/models/Event');
const { getVenueModel } = require('../common/models/Venue');

async function isVenueFree(venueID,start,end){

    try{
        // getting venue timings array
        const venue = await Venue.findByPk(venueID);
        const arr = venue.timings;

        if (!Array.isArray(arr)) {
            throw new Error('Invalid timings array');
        }
        if (start < 0 || end > arr.length || start >= end) {
            throw new Error('Invalid start or end time');
        }

        for(let i = start; i<end; i++){
            if(arr[i] != 0) {
                return false;
            }
        }

        return true;
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
}

//Post
router.post('/', async (req, res) => {
    const data = {
        eventID: req.body.eventID,
        eventName: req.body.eventName,
        venueID: req.body.venueID,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        totalTickets: req.body.totalTickets,
        ticketsSold: req.body.ticketsSold
    }

    try {
        const Event = getEventModel();
        const Venue = getVenueModel();

        const venue_data = await Venue.findByPk(req.body.venueID);
        if(!venue_data){
            res.status(404).json({ message: "Venue not found" });
        }

        if(isVenueFree(venue_data.timings, req.body.startTime, req.body.endTime)){
            const dataToSave = await Event.create(data);
            res.status(200).json(dataToSave);
        }
        else{
            res.status(404).json({ message: "Requested time slot not available" });
        }
    } 
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// Get All
router.get('/all', async (req, res) => {
    try {
        const Event = getEventModel();
        console.log(Event);

        const data = await Event.findAll();
        console.log(Event);

        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID 
router.get('/:id', async (req, res) => {
    try {
        const Event = getEventModel();
        const data = await Event.findByPk(req.params.eventID);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// need to add -> only update if schedule/venue is free at updated time
// Update
router.put('/:id', async (req, res) => {
    try {
        const Event = getEventModel();
        const eventID = req.params.eventID;
        const venueID = req.params.venueID;

        if (!(await Event.findByPk(req.params.eventID))) {
            res.status(404).json({ message: "Event not found" });
        } 
        const venue_data = await Venue.findByPk(req.body.venueID);
        if(!venue_data){
            res.status(404).json({ message: "Venue not found" });
        }

        // update only if venue is free
        if(isVenueFree(venue_data.timings, req.body.startTime, req.body.endTime)){
            const updatedData = req.body;    
            const cnt = await User.update(updatedData, {
            where: { id },
            returning: true,
            });
            const data = await User.findByPk(req.params.id);
            res.json(data)

        }
        else{
            res.status(404).json({ message: "Requested time slot not available" });
        }
      } 
      catch (error) {
        res.status(500).json({ message: error.message });
      }
})

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const Event = getEventModel();
        const id = req.params.id;
        const data = await User.findByPk(eventID)
        if(data){
            await User.destroy({ where: { id } });
            res.send(`Event with id ${data.eventID}:${data.eventName} has been deleted.`);
        } 
        else{
            res.status(404).json({ message: "Event not found" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
module.exports = router;