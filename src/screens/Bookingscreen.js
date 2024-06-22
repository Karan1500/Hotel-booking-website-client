import React, {useState, useEffect} from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment'

function Bookingscreen() {
    let { roomid,fromDate,toDate } = useParams(); 

    const [room, setroom] = useState();
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();

    const totalDays = moment.duration(moment(toDate,'DD-MM-YYYY').diff(moment(fromDate,'DD-MM-YYYY'))).asDays()+1
    const [totalAmount,setTotalAmount] = useState()
    const user = JSON.parse(localStorage.getItem('currentUser')).data
    console.log(user)
    useEffect(() => {
        if(!localStorage.getItem('currentUser')){
            window.location.reload='/login'
        }
        async function fetchData() {
            try {
                setloading(true);
                const data = (await axios.post("http://localhost:5000/api/rooms/getroombyid", {roomid: roomid}, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })).data;
                setroom(data);
                setTotalAmount(totalDays*data.rentPerDay)
                setloading(false);
            } catch (error) {
                seterror(true);
                console.log(error);
                setloading(false);
            }
        }
        fetchData();
      }, []);
    

      const wrapperFunction = () => {
        checkoutHandler(totalAmount);
    }
    
    const checkoutHandler = async (amount) => {

        try {
            const {data: {key}} = await axios.get("http://localhost:5000/api/getkey");

            const {data:{order}} = await axios.post("http://localhost:5000/api/payment/checkout", {
                amount
            });

            const options = {
                key: key,
                amount: order.amount,
                currency: "INR",
                name: "Karan Jivanramjiwala", 
                description: "Test Transaction", 
                image: "",
                order_id: order.id, 
                // callback_url: "http://localhost:5000/api/payment/paymentverification",
                handler: function (response){
                    // alert(response.razorpay_payment_id);
                    // alert(response.razorpay_order_id);
                    // alert(response.razorpay_signature)
                    bookRoom();
                    window.location.href = "/home";
                },            
                prefill: { 
                    name: "Gaurav Kumar", 
                    email: "gaurav.kumar@example.com", 
                    contact: "9000090000"  
                },
                notes: {
                    address: "Razorpay Corporate Office"
                },
                theme: {
                    color: "#000000"
                }
            };
            var razor = new window.Razorpay(options);
            razor.open();

        } catch (error) {
            console.log(error);
        }
    };


    async function bookRoom() {
        const token = JSON.parse(localStorage.getItem('currentUser')).data.token
        const tmp = JSON.parse(localStorage.getItem('currentUser')).data.id
        console.log(tmp)
        console.log(token)
        const bookingDetails = {
            roomname:room.name,
            roomid:room._id,
            userid: JSON.parse(localStorage.getItem('currentUser')).data.id,
            fromDate,
            toDate,
            totalAmount,
            totalDays,
            token
        }

        try {
            const result = await axios.post("http://localhost:5000/api/bookings/bookroom", bookingDetails, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
        } catch (error) {
            
        }
    }  
      
    return (
        <div style={{margin: '50px'}}>
            {loading ? (<Loader/>) : room ? (<div>
                <div className='row justify-content-center mt-5 bs'>
                    <div className='col-md-6'>
                        <h1>{room.name}</h1>
                        <img src={room.imageUrls[0]} className='bigimg'/>
                    </div>
                    <div className='col-md-6'>
                        <div style={{textAlign: 'right'}}>
                            <h1>Booking Details</h1>
                            <hr/>
                            <b>
                                <p>Name : {JSON.parse(localStorage.getItem('currentUser')).data.name}</p>
                                <p>From Date : {fromDate}</p>
                                <p>To Date : {toDate}</p>
                                <p>Max Count : {room.maxCount}</p>
                            </b>
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <h1>Amount</h1>
                            <hr/>
                            <b>
                                <p>Total days : {totalDays}</p>
                                <p>Rent per day : {room.rentPerDay}</p>
                                <p>Total Amount : {totalAmount}</p>
                            </b>
                        </div>
                        <div style={{float: 'right'}}>
                            <button className='btn btn-primary' onClick={wrapperFunction}>Pay Now</button>
                        </div>
                    </div>
                </div>
            </div>
            ): (<Error/>)}
        </div>
    );
}

export default Bookingscreen;