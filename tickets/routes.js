const express = require('express');
const router = express.Router();

const { getTicketModel } = require('../common/models/Ticket');

//Post
router.post('/', async (req, res) => {
    const data = {
        ticketID: req.body.ticketID,
        userID: req.body.userID,
        eventID: req.body.eventID,
        venueID: req.body.venueID
    }
    try {
        const Ticket = getTicketModel();
        const dataToSave = await Ticket.create(data);
        res.status(200).json(dataToSave);
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
        const data = await Ticket.findByPk(req.params.ticketID);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get by event ID
router.get('/all/:id', async (req, res) => {
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
        const ticketID = req.params.ticketID;
        const data = await User.findByPk(id)
        if(data){
            await Ticket.destroy({ where: { ticketID } });
            res.send(`Ticket with id ${data.ticketID} has been deleted.`);
        } 
        else{
            res.status(404).json({ message: "Venue not found" });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// ticket freed up->add logic for that

module.exports = router;