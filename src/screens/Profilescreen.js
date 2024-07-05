// src/screens/ProfileScreen.js

import React, { useEffect, useState } from 'react';
import { Tabs, Modal, Button, Tag } from 'antd';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2';
import StarRating from '../components/StarRating';

const { TabPane } = Tabs;

function Profilescreen() {
  const user = JSON.parse(localStorage.getItem('currentUser')).data;

  return (
    <div className='ml-3 mt-3'>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Profile' key='1'>
          <h1>My profile</h1>
          <br />
          <h1>Name: {user.name}</h1>
          <h1>Email: {user.email}</h1>
          <h1>isAdmin: {user.isAdmin ? "YES" : "NO"}</h1>
        </TabPane>
        <TabPane tab='Bookings' key='2'>
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Profilescreen;

async function CancelBooking(bookingid, roomid, setloading, seterror, setBookings, token) {
  try {
    setloading(true);
    const result = await axios.post('http://localhost:5000/api/bookings/cancelbooking', { bookingid, roomid }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).data;
    console.log(result);
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking._id === bookingid ? { ...booking, status: 'cancelled' } : booking
      )
    );
    setloading(false);
    Swal.fire('Congrats', 'Your booking has been cancelled', 'success').then(result => {
      window.location.reload();
    });
  } catch (error) {
    console.error(error);
    setloading(false);
    seterror(error);
    Swal.fire('Oops', 'Something went wrong', 'error');
  }
}

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem('currentUser')).data;
  const [bookings, setBookings] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setloading(true);
        const rooms = await (await axios.post("http://localhost:5000/api/bookings/getbookingsbyuserid", { userid: user.id }, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })).data;
        console.log(rooms);
        setBookings(rooms);
        setloading(false);
      } catch (error) {
        console.log(error);
        setloading(false);
        seterror(error);
      }
    };
    fetchBookings();
  }, []);

  const showModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      await axios.post("http://localhost:5000/api/bookings/ratebooking", {
        bookingid: selectedBooking._id,
        rating
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setIsModalVisible(false);
      Swal.fire('Thank you!', 'Your rating has been submitted.', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Oops', 'Something went wrong', 'error');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <div className='row'>
        <div className='col-md-6'>
          {loading && <Loader />}
          {bookings && (bookings.map((booking) => {
            return (
              <div className='bs' key={booking._id}>
                <h1>{booking.room}</h1>
                <p><b>Booking Id</b>: {booking._id}</p>
                <p><b>Transaction Id</b>: {booking.transactionId}</p>
                <p><b>Checkin date</b>: {booking.fromDate}</p>
                <p><b>Checkout date</b>: {booking.toDate}</p>
                <p><b>Amount</b>: {booking.totalAmount}</p>
                <p><b>Status</b>: {booking.status === 'cancelled' ? (<Tag color="red">CANCELLED</Tag>) : (<Tag color="green">CONFIRMED</Tag>)}</p>
                {booking.status !== 'cancelled' && (
                  <div className='text-right'>
                    <button className='btn btn-primary' onClick={() => CancelBooking(booking._id, booking.roomid, setloading, seterror, setBookings, user.token)}>CANCEL BOOKING</button>
                    <button className='btn btn-secondary' onClick={() => showModal(booking)}>RATE BOOKING</button>
                  </div>
                )}
              </div>
            );
          }))}
        </div>
      </div>
      <Modal title="Rate Your Booking" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <StarRating rating={rating} setRating={setRating} />
      </Modal>
    </div>
  );
}
