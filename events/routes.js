const express = require('express');
const router = express.Router();

const { getEventModel } = require('../common/models/Event');
const { getVenueModel } = require('../common/models/Venue');
const { getTicketModel } = require('../common/models/Ticket');

async function isVenueFree(venueID,start,end){

    try{
        // getting venue timings array
        const venue = await Venue.findByPk(venueID);
        const arr = venue.timings || [];
        if (!Array.isArray(arr)) {
            arr = JSON.parse(arr);
        }

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
        console.error(error.message);
        return false;
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

        const timings = venue_data.timings || [];
        if (!Array.isArray(timings)) {
            timings = JSON.parse(timings);
        }
        if (!Array.isArray(timings)) {
            res.status(400).json({ message: 'Invalid timings array' });
        }

        if(isVenueFree(req.body.venueID, req.body.startTime, req.body.endTime)){
            
            // update venue
            for(let i = req.body.startTime; i<req.body.endTime; i++){
                console.log("editing timings array");
                timings[i] = 1;
                console.log(timings[i]);
            }

            // venue_data.timings = timings;
            // await venue_data.save();

            const updatedData = {
                venueID: req.body.venueID,
                timings: timings
            }

            const cnt = await Venue.update(updatedData, {
            where: { venueID: req.body.venueID},
            returning: true,
            });

            console.log("finished editing timings array");

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
        const data = await Event.findByPk(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Update
router.put('/:id', async (req, res) => {
    try {
        const Event = getEventModel();
        const Venue = getVenueModel();
        const Ticket = getTicketModel();

        if (!(await Event.findByPk(req.params.id))) {
            res.status(404).json({ message: "Event not found" });
        } 
        const venue_data = await Venue.findByPk(req.body.venueID);
        if(!venue_data){
            res.status(404).json({ message: "Venue not found" });
        }

        const timings = venue_data.timings || [];
        if (!Array.isArray(timings)) {
            timings = JSON.parse(timings);
        }
        if (!Array.isArray(timings)) {
            res.status(400).json({ message: 'Invalid timings array' });
        }

        // update only if venue is free
        if(isVenueFree(timings, req.body.startTime, req.body.endTime)){
            const updatedData = req.body;    
            const cnt = await Event.update(updatedData, {
            where: { eventID : id },
            returning: true,
            });

            for(let i = req.body.startTime; i<req.body.endTime; i++){
                timings[i] = 1;
            }
            // await venue_data.save();
            const updatedVenueData = {
                venueID: req.body.venueID,
                timings: timings
            }

            await Venue.update(updatedVenueData, {
            where: { venueID: req.body.venueID},
            returning: true,
            });

            // Update tickets
            const updatedCount = await Ticket.update(
                { venueID: req.body.venueID }, 
                {
                where: { eventID: eventID }, 
                }
            );
            
            const data = await Event.findByPk(req.params.id);
            res.json(data);
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
        const Ticket = getTicketModel();
        const id = req.params.id;
        const data = await User.findByPk(id);

        if(data){
            await Event.destroy({ where: { eventID: id } });
            await Ticket.destroy({where: { eventID: id } });
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