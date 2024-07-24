const express = require('express');
const router = express.Router();

const { getEventModel } = require('../common/models/Event');
const { getVenueModel } = require('../common/models/Venue');
const { getTicketModel } = require('../common/models/Ticket');

function checkTimings(arr1, arr2){

    // for (let i = 0; i < arr1.length; i++) {
    //     if (arr1[i] != 0 && arr2[i] != 0) {
    //       return false; // new venue not free for event in old venue
    //     }
    // }

    const isNotFree = arr1.some((value, index) => arr1[index] !== 0 && arr2[index] !== 0);
    return !(isNotFree);
}

function updateTimings(arr1, arr2){

    // for (let i = 0; i < arr1.length; i++) {
    //     if (arr1[i] == 1) {
    //       arr2[i] = 1;
    //     }
    // }

    arr1.forEach((value, index) => {
        if (value == 1) {
            arr2[index] = 1;
        }
    });
    return arr2;
}

//Post
// venue id random
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
        const data = await Venue.findByPk(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Update Venue
// req id -> old venue
// req body -> new venue
router.put('/:id', async (req, res) => {
    try {
        const Venue = getVenueModel();
        const Event = getEventModel();
        const Ticket = getTicketModel();

        const old_venue_data = await Venue.findByPk(req.params.id)
        if (!old_venue_data) {
            res.status(404).json({ message: "Venue not found" });
        } 
        const venue_data = await Venue.findByPk(req.body.venueID);
        if(!venue_data){
            res.status(404).json({ message: "New Venue not found" });
        }

        const old_timings = old_venue_data.timings || [];
        if (!Array.isArray(old_timings)) {
            old_timings = JSON.parse(old_timings);
        }
        if (!Array.isArray(old_timings)) {
            res.status(400).json({ message: 'Invalid timings array' });
        }

        const timings = venue_data.timings || [];
        if (!Array.isArray(timings)) {
            timings = JSON.parse(timings);
        }
        if (!Array.isArray(timings)) {
            res.status(400).json({ message: 'Invalid timings array' });
        }

        // update only if venue is free
        if(checkTimings(old_timings, timings)){

            const newTimings = updateTimings(old_timings,timings);
            const updatedData = {
                venueID: req.body.venueID,
                timings: newTimings
            }

            const cnt = await Venue.update(updatedData, {
            where: { venueID: req.body.venueID},
            returning: true,
            });

            // for(let i = 0; i<12; i++){
            //     old_timings[i] = 0;
            // }
            old_timings.fill(0, 0, old_timings.length);
            const old_updatedData = {
                venueID: req.params.id,
                timings: old_timings
            }

            const cnt2 = await Venue.update(old_updatedData, {
            where: { venueID: req.params.id},
            returning: true,
            });

            // Update tickets
            const updateTickets = await Ticket.update(
                { venueID: req.body.venueID }, 
                {
                where: { venueID: req.params.id }, 
                }
            );

            // Update Events
            const updateEvents = await Event.update(
                { venueID: req.body.venueID }, 
                {
                where: { venueID: req.params.id }, 
                }
            );
            
            const data = await Venue.findByPk(req.body.venueID);
            res.json(data)
        }
        else{
            res.status(404).json({ message: "Venue not available" });
        }
      } 
      catch (error) {
        res.status(500).json({ message: error.message });
      }
})

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const Venue = getVenueModel();
        const id = req.params.id;
        const Event = getEventModel();
        const Ticket = getTicketModel();
        const data = await Venue.findByPk(id);
        if(data){
            await Venue.destroy({ where: { venueID: id } });
            await Event.destroy({ where: { venueID: id } });
            await Ticket.destroy({ where: { venueID: id } });
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

// router.delete('/:id', async (req, res) => {
//     const t = await sequelize.transaction();
//     try {
//         const Venue = getVenueModel();
//         const Event = getEventModel();
//         const Ticket = getTicketModel();
//         const id = req.params.id;

//         const data = await Venue.findByPk(id, { transaction: t });
//         if(data) {
//             await Venue.destroy({ where: { venueID: id }, transaction: t });
//             await Event.destroy({ where: { venueID: id }, transaction: t });
//             await Ticket.destroy({ where: { venueID: id }, transaction: t });

//             await t.commit();
//             res.send(`Venue with id ${data.venueID} has been deleted.`);
//         } 
//         else {
//             await t.rollback();
//             res.status(404).json({ message: "Venue not found" });
//         }
//     }
//     catch (error) {
//         await t.rollback();
//         res.status(400).json({ message: error.message });
//     }
// });

module.exports = router;