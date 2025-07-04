import React, { useEffect, useState } from 'react';
import * as api from '../../services/api';

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            const data = await api.getAppointments();
            setAppointments(data);
        };
        fetchAppointments();
    }, []);

    return (
        <div>
            <h2>Lista wizyt</h2>
            {appointments.length === 0 ? (
                <p>Brak wizyt</p>
            ) : (
                <ul>
                    {appointments.map((appt) => (
                        <li key={appt._id}>
                            Data: {appt.date} Godzina: {appt.time} Lekarz ID: {appt.doctorId}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AppointmentList;
