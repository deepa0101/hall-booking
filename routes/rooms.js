const express = require('express')
const { format } = require('date-fns');
let router = express.Router();
let rooms = [
  {
    room_id: 1,
    room_name: "room-1",
    room_status: "available",
    amenities: "AC,TV,Complementry_snacks,1-bed",
    seats: 4,
    price_per_hrs: 1000,
  },
  {
    room_id: 2,
    room_name: "room-2",
    room_status: "available",
    amenities: "AC,TV,Complementry_snacks,2-Beds",
    seats: 6,
    price_per_hrs: 1500,
  },
  {
    room_id: 3,
    room_name: "room-3",
    room_status: "available",
    amenities: "AC,TV,Complementry_snacks,3-Beds,LoungeArea,iron-box",
    seats: 6,
    price_per_hrs: 2500,
  },
];
let bookingRoom = [];

router.post("/createRoom",async (req, res) => {
    try {
      let id = rooms.length ? rooms[rooms.length - 1].room_id + 1 : 1;
      req.body.room_id = id;
      rooms.push(req.body);
      await res.status(200).json({
        message: "Room Created Succesfully",
        Room: rooms,
      });
    } catch (error) {
      res.status(500).json({
        comment: "Internel server error",
      });
    }
  })

  router.get("/getAllRoom", async (req, res) => {
  try {
    await res.status(200).json({
      comment: "Fetch All Room Succesfully",
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      comment: "Internel server error",
    });
  }
})

 router.post("/bookRoom" ,async (req, res) => {
    try {
      let { customer_name, start_time, end_time, roomID } = req.body;
      let date = format(new Date(), "dd-MM-yyyy");
      let room = rooms.filter((e) => e.room_status === "available" && parseInt(e.room_id) == parseInt(roomID));
      console.log(room)
      if (!room) {
        res.status(400).json({
          message: "Room is not Available",
        });
        return;
      } else {
        let booking = {
          customer_name,
          start_time,
          end_time,
          roomID,
          Date: date,
          booking_id: bookingRoom.length + 1,
          booking_date: new Date(),
          status: "booked",
        };
        console.log(booking)
        bookingRoom.push(booking);
        console.log(bookingRoom)
        res.status(200).json({
          message: "Succesfully Booked Room",
          BookingRoom: booking,
          bookingRoom,
        });
      }
    } catch (error) {
        console.log(error)
      res.status(500).json({
        message: "Internal server Error",
       
      });
    }
  })

   router.get("/bookedRoom", async (req, res) => {
    try {
      let roomList = rooms.map((room) => {
        let booking = bookingRoom.find(
          (booking) => booking.roomID === room.room_id
        );
        return {
          room_name: room.room_name,
          bookedStatus: booking ? "Booked" : "Available",
          customer_name: booking ? booking.customer_name : null,
          date: booking ? booking.Date : null,
          start_time: booking ? booking.start_time : null,
          end_time: booking ? booking.end_time : null,
        };
      });
      res.status(200).json({
        message: "Succesfully Fetched All Room with Booked Details",
        roomList,
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        comment: "Internel server error",
      });
    }
  })
  
 
  router.get("/getAllCustomerData", async (req, res) => {
    try {
      const customerList = bookingRoom.map((booking) => {
        return {
          customer_Name: booking.customer_name,
          room_name:  booking.room_name,
          Date: booking.date,
          start_time: booking.start_time,
          end_time: booking.end_time,
        };
      });
      await res.status(200).json({
        message: "Succesfully Fetched All Customer with Booked Details",
        customerList,
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        comment: "Internel server error",
      });
    }
  })
  
   router.get("/bookedCount", async (req, res) => {
    try {
      const { customer_name } = req.body;
      console.log("Requested Customer Name:", customer_name); 
      const customerBooking = bookingRoom.filter((e) => {
        console.log("Booking Customer Name:", e.customer_name); 
        return e.customer_name === customer_name;
      });
      console.log("Customer Booking:", customerBooking); 
      res.status(200).json({
        message: "Successfully fetched",
        customer_name,
        booking_count: bookingRoom.length,
        bookings: bookingRoom,
      });
    } catch (error) {
      console.error("Error in bookCount:", error); 
      res.status(500).json({
        comment: "Internal server error",
      });
    }
  })
  
  module.exports = router;