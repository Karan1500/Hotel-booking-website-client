import { useState, useEffect, React } from 'react'
import { Tabs } from 'antd'
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2'

const { TabPane } = Tabs;
function Adminscreen() {

    useEffect(() => {
        if(!(JSON.parse(localStorage.getItem('currentUser')).data.isAdmin))
        {
            window.location.href='/home'    
        }

    },[])

    return (
        <div className='mt-3 ml-3 mr-3 bs'>
            <h2 className='text-center' style={{ fontSize: '30px' }}><b>Admin Panel</b></h2>
            <Tabs defaultActiveKey='1'>
                <TabPane tab='Bookings' key='1'>
                    <Bookings />
                </TabPane>
                <TabPane tab='Rooms' key='2'>
                    <Rooms />
                </TabPane>
                <TabPane tab='Add room' key='3'>
                    <Addroom />
                </TabPane>
                <TabPane tab='Users' key='4'>
                    <Users />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Adminscreen;

//Bookings list

export function Bookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState()
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setloading(true)
                const result = (await axios.get('http://localhost:5000/api/bookings/getAllBookings')).data
                setBookings(result)
                setloading(false)
            } catch (error) {
                setloading(false)
                console.log(error)
                seterror(error)
            }
        }
        fetchBookings()
    },[])
    return (
        <div className='row'>
            <div className='col-md-12'>
                <h1>Bookings</h1>
                {loading && <Loader />}
                <table className='table table-bordered table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>Booking ID</th>
                            <th>User ID</th>
                            <th>Room</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length && bookings.map((booking) => {
                            return <tr>
                                <td>{booking._id}</td>
                                <td>{booking.userid}</td>
                                <td>{booking.room}</td>
                                <td>{booking.fromDate}</td>
                                <td>{booking.toDate}</td>
                                <td>{booking.status}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

//Rooms list

export function Rooms() {
    const [rooms, setRooms] = useState([])
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState()
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setloading(true)
                const result = (await axios.get('http://localhost:5000/api/rooms/getAllRooms')).data
                setRooms(result)
                setloading(false)
            } catch (error) {
                setloading(false)
                console.log(error)
                seterror(error)
            }
        }
        fetchRooms()
    },[])
    return (
        <div className='row'>
            <div className='col-md-12'>
                <h1>Rooms</h1>
                {loading && <Loader />}
                <table className='table table-bordered table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>Room ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Rent per day</th>
                            <th>Max count</th>
                            <th>Phone number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.length && rooms.map((room) => {
                            return <tr>
                                <td>{room._id}</td>
                                <td>{room.name}</td>
                                <td>{room.type}</td>
                                <td>{room.rentPerDay}</td>
                                <td>{room.maxCount}</td>
                                <td>{room.phoneNumber}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

//Users list

export function Users() {
    const [users, setUsers] = useState([])
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState()
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setloading(true)
                const result = (await axios.get('http://localhost:5000/api/users/getAllUsers')).data
                setUsers(result)
                setloading(false)
            } catch (error) {
                setloading(false)
                console.log(error)
                seterror(error)
            }
        }
        fetchUsers()
    },[])
    return (
        <div className='row'>
            <div className='col-md-12'>
                <h1>Users</h1>
                {loading && <Loader />}
                <table className='table table-bordered table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Is Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length && users.map((user) => {
                            return <tr>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin?'YES':'NO'}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

//Add room

export function Addroom() {

    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();
    const[name, setname] = useState('');
    const[rentPerDay, setrentPerDay] = useState();
    const[maxCount, setmaxCount] = useState();
    const[description, setdescription] = useState();
    const[phoneNumber, setphoneNumber] = useState();
    const[type, settype] = useState();
    const[imageUrl1, setimageUrl1] = useState();
    const[imageUrl2, setimageUrl2] = useState();
    const[imageUrl3, setimageUrl3] = useState();

    async function addRoom(){

        const newroom = {
            name, 
            maxCount,
            phoneNumber,
            rentPerDay,
            imageUrls: [imageUrl1, imageUrl2, imageUrl3],
            type,
            description
        }

        try {
            setloading(true);
            const response = await axios.post('http://localhost:5000/api/rooms/addroom', newroom);
            console.log(response.data);
            setloading(false);
            Swal.fire('Congrats', 'New room added successfully', 'success').then(result=>{
                window.location.href = '/home';
            });
        } catch (error) {
            console.log(error);
            setloading(false);
            Swal.fire('Oops', 'Something went wrong', 'error');
        }
    }

    return (
        <div className='row'>
            <div className='col-md-5 nm'>
                {loading && <Loader />}
                <input type='text' className='form-control mb-2' placeholder='room name'
                value={name} onChange={(e)=>{setname(e.target.value)}} />
                <input type='number' className='form-control mb-2' placeholder='rent per day'
                value={rentPerDay} onChange={(e)=>{setrentPerDay(e.target.value)}} />
                <input type='number' className='form-control mb-2' placeholder='max count'
                value={maxCount} onChange={(e)=>{setmaxCount(e.target.value)}} />
                <input type='text' className='form-control mb-2' placeholder='description'
                value={description} onChange={(e)=>{setdescription(e.target.value)}} />
                <input type='number' className='form-control mb-2' placeholder='phone number'
                value={phoneNumber} onChange={(e)=>{setphoneNumber(e.target.value)}} />
            </div>
            <div className='col-md-5'>
                <input type='text' className='form-control mb-2' placeholder='type'
                value={type} onChange={(e)=>{settype(e.target.value)}} />
                <input type='text' className='form-control mb-2' placeholder='Image URL 1'
                value={imageUrl1} onChange={(e)=>{setimageUrl1(e.target.value)}} />
                <input type='text' className='form-control mb-2' placeholder='Image URL 2'
                value={imageUrl2} onChange={(e)=>{setimageUrl2(e.target.value)}} />
                <input type='text' className='form-control mb-2' placeholder='Image URL 3'
                value={imageUrl3} onChange={(e)=>{setimageUrl3(e.target.value)}} />

                <div className='text-right'>
                    <button className='btn btn-primary mt-2' onClick={addRoom}>Add room</button>
                </div>
            </div>
        </div>
    )
}