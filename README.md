# ticketsAPI
A REST API to manage users, events, venues and tickets.

## Endpoints

- User: Create a User, Get a User, Get all Users, Update a User, Delete a User
- Event: Create an Event, Get an Event, Get all Events, Update an Event, Delete an Event
- Venue: Create a Venue, Get a Venue, Get all Venues, Update (Shift) a Venue, Delete a Venue
- Tickets: Create (Buy) a ticket, Get a Ticket, Get all Event Tickets, Delete (Cancel) a Ticket

## Assumptions
- A user can buy 1 ticket at a time
- The minimum unit of time is 1
- The Venues are available from 12PM (0) to 12AM (0)

## Known Bugs
- Creating an Event without a Venue [crashes app]
- Creating a Ticket without an Event or User [crashes app]
- Updating an Event does not work for certain cases [overlapping timings, fix known, will fix soon]

## To be Implemented Soon
- DB Transactions
- Additional Features
