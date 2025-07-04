import React, { useState, useEffect } from 'react';
import { getUsers, createAppointment } from '../../services/api';

const AppointmentForm = () => {
    const [doctors, setDoctors] = useState([]); // Lista lekarzy
    const [appointment, setAppointment] = useState({ // Dane wizyty
        doctorId: '',
        date: '',
        time: '',
        procedure: ''
    });
    const [success, setSuccess] = useState(false); // Wiadomość o sukcesie
    const [error, setError] = useState(''); // Wiadomość o błędzie

    // Pobieranie listy lekarzy przy załadowaniu komponentu
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await getUsers(); // Wywołanie funkcji API
                console.log('Pobrani lekarze:', response.data);
                const filteredDoctors = response.data?.filter((user) => user.role === 'doctor') || [];
                setDoctors(filteredDoctors); // Ustawienie listy lekarzy
                if (filteredDoctors.length === 0) {
                    setError('Brak dostępnych lekarzy.');
                }
            } catch (err) {
                console.error('Błąd pobierania lekarzy:', err);
                setError('Nie udało się pobrać listy lekarzy.');
            }
        };
        fetchDoctors();
    }, []);

    // Obsługa formularza zapisu na wizytę
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createAppointment(appointment); // Wywołanie API
            if (response.success) {
                setSuccess(true);
                setAppointment({ doctorId: '', date: '', time: '', procedure: '' });
            } else {
                setError('Nie udało się zapisać wizyty.');
            }
        } catch (err) {
            console.error('Błąd zapisu wizyty:', err);
            setError('Wystąpił błąd podczas zapisywania wizyty.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Umów wizytę</h2>
            {success && <p style={{ color: 'green' }}>Wizyta została poprawnie zapisana!</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <label>Lekarz:</label>
            <select
                value={appointment.doctorId}
                onChange={(e) => setAppointment({ ...appointment, doctorId: e.target.value })}
                required
            >
                <option value="">-- Wybierz lekarza --</option>
                {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                        {doctor.imie} {doctor.nazwisko}
                    </option>
                ))}
            </select>

            <label>Data:</label>
            <input
                type="date"
                value={appointment.date}
                onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
                required
            />

            <label>Godzina:</label>
            <select
                value={appointment.time}
                onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
                required
            >
                <option value="">-- Wybierz godzinę --</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
            </select>

            <label>Procedura:</label>
            <input
                type="text"
                value={appointment.procedure}
                onChange={(e) => setAppointment({ ...appointment, procedure: e.target.value })}
                required
            />

            <button type="submit">Zarezerwuj wizytę</button>
        </form>
    );
};

export default AppointmentForm;