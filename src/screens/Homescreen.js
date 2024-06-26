import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from '../components/Loader';
import Error from '../components/Error';
import { DatePicker, Space } from 'antd';
import 'antd/dist/reset.css'
import moment from 'moment'

const { RangePicker } = DatePicker;

function Homescreen() {

    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [rooms, setrooms] = useState([]);
    const [duplicateRooms, setduplicateRooms] = useState([]);
    const [loading, setloading] = useState();
    const [error, seterror] = useState();
    const [searchKey,setSearchKey] = useState('')
    const [type,setType] = useState('all') 
    const user = JSON.parse(localStorage.getItem('currentUser')).data
    // useEffect(() => {
    //     console.log("heelloo")
    //     if (!user) {
    //         window.location.href = '/login'
    //     }
    // }, [])
    console.log(user)
    useEffect(() => {
        async function fetchData() {
            try {
                setloading(true);
                const data = (await axios.get("http://localhost:5000/api/rooms/getAllRooms", {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })).data;
                setduplicateRooms(data);
                setrooms(data);
                setloading(false);
            } catch (error) {
                seterror(true);
                console.log(error);
                setloading(false);
            }
        }
        fetchData();
    }, []);

    function filterByDate(dates) {
        const selectedFromDate = dates[0].format('DD-MM-YYYY');
        const selectedToDate = dates[1].format('DD-MM-YYYY');
        
        setFromDate(selectedFromDate);
        setToDate(selectedToDate);
    
        const filteredRooms = duplicateRooms.filter(room => {
            let isAvailable = true;
            
            if (room.currentBookings.length > 0) {
                for (const booking of room.currentBookings) {
                    const existingFromDate = moment(booking.fromDate, 'DD-MM-YYYY');
                    const existingToDate = moment(booking.toDate, 'DD-MM-YYYY');
                    const selectedStart = moment(selectedFromDate, 'DD-MM-YYYY');
                    const selectedEnd = moment(selectedToDate, 'DD-MM-YYYY');
    
                    if (
                        selectedStart.isBetween(existingFromDate, existingToDate, undefined, '[]') ||
                        selectedEnd.isBetween(existingFromDate, existingToDate, undefined, '[]') ||
                        existingFromDate.isBetween(selectedStart, selectedEnd, undefined, '[]') ||
                        existingToDate.isBetween(selectedStart, selectedEnd, undefined, '[]')
                    ) {
                        isAvailable = false;
                        break;
                    }
                }
            }
            
            return isAvailable;
        });
    
        setrooms(filteredRooms);
    }

    function filterBySearch() {
        const temprooms = duplicateRooms.filter(room=>room.name.toLowerCase().includes(searchKey.toLowerCase()))
        setrooms(temprooms)
    }

    function filterByType(e) {
        setType(e)
        if(e!=='all')
        {
            const temprooms = duplicateRooms.filter(room=>room.type.toLowerCase()==e.toLowerCase())
            setrooms(temprooms)
        }
        else
        {
            setrooms(duplicateRooms)
        }
    }

    return (
        <div className="container btm">

            <div className="row mt-5 bs justify-content-center">
                <div className="col-md-3 newest">
                    <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
                </div>
                <div className="col-md-3">
                    <input type="text" className="form-control" placeholder="search rooms"
                    value={searchKey} onChange={(e) => setSearchKey(e.target.value)} onKeyUp={filterBySearch}/>
                </div>
                <div className="col-md-3">
                    <select className="form-control" value={type} onChange={(e)=>filterByType(e.target.value)}>
                        <option value="all">All</option>
                        <option value="delux">Delux</option>
                        <option value="nondelux">Non-delux</option>
                    </select>
                </div>
            </div>
            <div className="row justify-content-center mt-5">
                {loading ? (<Loader />) : (rooms.map(room => {
                    return <div className="col-md-9 mt-2">
                        <Room room={room} fromDate={fromDate} toDate={toDate} />
                    </div>
                }))}
            </div>
        </div>
    )

};

export default Homescreen;