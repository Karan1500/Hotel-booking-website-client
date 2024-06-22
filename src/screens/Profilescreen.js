import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2'
import { Divider, Flex, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;
function Profilescreen() {
    // const navigate=useNavigate()
    // useEffect(() => {
    //     console.log("heelloo")
    //     if (!(JSON.parse(localStorage.getItem('currentUser')))) {
    //         navigate('/login')
    //     }

    // }, [])
    const user = JSON.parse(localStorage.getItem('currentUser')).data

    

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
    )
}

export default Profilescreen

// async function CancelBooking(bookingid,roomid) {
//     const [loading, setloading] = useState(false);
//     const [error, seterror] = useState();
//     try {
//         setloading(true)
//         const result = await axios.post('http://localhost:5000/api/bookings/cancelbooking',{bookingid,roomid}).data
//         console.log(result)
//         setloading(false)  
//     } catch (error) {
//         console.log(error)
//         setloading(false)
//         seterror(error)
//     }
// }

async function CancelBooking(bookingid, roomid, setloading, seterror, setBookings,token) {
    try {
        setloading(true);
        const result = await axios.post('http://localhost:5000/api/bookings/cancelbooking', { bookingid, roomid}, {
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
        Swal.fire('Congrats','Your booking has been cancelled','success').then(result=>{
            window.location.reload()
        })
    } catch (error) {
        console.error(error);
        setloading(false);
        seterror(error);
        Swal.fire('Oops','Something went wrong','error')
    }
}

export function MyBookings() {
    const user = JSON.parse(localStorage.getItem('currentUser')).data
    console.log(user)
    const [bookings, setBookings] = useState([])
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();
    console.log(user)
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setloading(true)
                const rooms = await (await axios.post("http://localhost:5000/api/bookings/getbookingsbyuserid", { userid: user.id}, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })).data
                console.log(rooms)
                setBookings(rooms)
                setloading(false)
            } catch (error) {
                console.log(error)
                setloading(false)
                seterror(error)
            }
        }
        fetchBookings();
    }, [])

    return (
        <div>
            <div className='row'>
                <div className='col-md-6'>
                    {loading && <Loader />}
                    {bookings && (bookings.map((booking) => {
                        return (<div className='bs'>
                            <h1>{booking.room}</h1>
                            <p><b>Booking Id</b>: {booking._id}</p>
                            <p><b>Transaction Id</b>: {booking.transactionId}</p>
                            <p><b>Checkin date</b>: {booking.fromDate}</p>
                            <p><b>Checkout date</b>: {booking.toDate}</p>
                            <p><b>Amount</b>: {booking.totalAmount}</p>
                            <p><b>Status</b>: {booking.status==='cancelled'?(<Tag color="red">CANCELLED</Tag>):(<Tag color="green">CONFIRMED</Tag>)}</p>
                            {booking.status!=='cancelled' && (<div className='text-right'>
                                <button className='btn btn-primary' onClick={() => CancelBooking(booking._id,booking.roomid,setloading,seterror,setBookings,user.token)}>CANCEL BOOKING</button>
                            </div>)}
                        </div>
                        )
                    }))}
                </div>
            </div>
        </div>
    )

}