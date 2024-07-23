const express = require('express');
const router = express.Router();

const { getTicketModel } = require('../common/models/Ticket');
const { getEventModel } = require('../common/models/Event');
const { getUserModel } = require('../common/models/User');

//Post
router.post('/', async (req, res) => {
    
    try {
        const Ticket = getTicketModel();
        const Event = getEventModel();
        const event_data = await Event.findByPk(req.body.eventID);
        if(!event_data){
            res.status(404).json({ message: "Event not found" });
        }

        const User = getUserModel();
        const user_data = await Event.findByPk(req.body.userID);
        if(!user_data){
            res.status(404).json({ message: "User does not exist" });
        }

        const data = {
            ticketID: req.body.ticketID,
            userID: req.body.userID,
            eventID: req.body.eventID,
            venueID: event_data.venueID
        }

        if(event_data.ticketsSold < event_data.totalTickets){
            const dataToSave = await Ticket.create(data);
            event_data.ticketsSold++;
            await event_data.save();
            res.status(200).json(dataToSave);
        }
        else{
            res.status(404).json({ message: "No Tickets left" });
        }
    } 
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})
// take away a ticket when booking, book only if tickets left

//Get by ticket ID 
router.get('/:id', async (req, res) => {
    try {
        const Ticket = getTicketModel();
        const data = await Ticket.findByPk(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get by event ID
router.get('/all/:eventID', async (req, res) => {
    try {
        const Ticket = getTicketModel();
        const data = await Ticket.findAll({
            where: {
                eventID: req.params.eventID
            }
          });
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const Ticket = getTicketModel();
        const id = req.params.id;
        const data = await Ticket.findByPk(id);
        if(data){
            const Event = getEventModel();
            const event_data = await Event.findByPk(data.eventID);
            if(!event_data){
                res.status(404).json({ message: "Event/Event Tickets not found" });
            }

            await Ticket.destroy({ where: { ticketID: id } });
            event_data.ticketsSold--;
            await event_data.save();
            res.send(`Ticket with id ${data.ticketID} has been deleted.`);
        } 
        else{
            res.status(404).json({ message: "Ticket not found" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// ticket freed up->add logic for that

module.exports = router;