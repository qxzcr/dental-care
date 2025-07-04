// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { getUsers, getAppointments, createAppointment } from '../services/api';
//
// const AppointmentPage = () => {
//     const { user } = useAuth();
//     const navigate = useNavigate();
//
//     const [doctors, setDoctors] = useState([]);
//     const [myAppointments, setMyAppointments] = useState([]);
//     const [appointment, setAppointment] = useState({ doctorId: '', date: '', time: '', message: '' });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const fetchData = async () => {
//         try {
//             const usersData = await getUsers();
//             const doctors = usersData.data.filter((u) => u.role === 'doctor');
//             setDoctors(doctors);
//
//             const appointmentsData = await getAppointments();
//             setMyAppointments(appointmentsData.data);
//         } catch (err) {
//             console.error('Błąd ładowania danych:', err);
//             setError('Błąd ładowania danych!');
//         }
//     };
//
//     const handleBook = async (e) => {
//         e.preventDefault();
//         try {
//             setLoading(true);
//             await createAppointment(appointment);
//             setAppointment({ doctorId: '', date: '', time: '', message: '' });
//             fetchData(); // Reload data
//         } catch (err) {
//             console.error('Błąd tworzenia wizyty:', err);
//             setError('Nie udało się stworzyć wizyty');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         if (!user || user.role !== 'patient') {
//             navigate('/login');
//         } else {
//             fetchData();
//         }
//     }, [user, navigate]);
//
//     return (
//         <div>
//             <h1>Umów wizytę</h1>
//             <form onSubmit={handleBook}>
//                 <select
//                     value={appointment.doctorId}
//                     onChange={(e) => setAppointment({ ...appointment, doctorId: e.target.value })}
//                     required
//                 >
//                     <option value="">Wybierz lekarza</option>
//                     {doctors.map((doc) => (
//                         <option key={doc._id} value={doc._id}>
//                             {doc.imie} {doc.nazwisko}
//                         </option>
//                     ))}
//                 </select>
//                 <input
//                     type="date"
//                     value={appointment.date}
//                     onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
//                     required
//                 />
//                 <input
//                     type="time"
//                     value={appointment.time}
//                     onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
//                     required
//                 />
//                 <textarea
//                     placeholder="Dodatkowe informacje"
//                     value={appointment.message}
//                     onChange={(e) => setAppointment({ ...appointment, message: e.target.value })}
//                 ></textarea>
//                 <button type="submit" disabled={loading}>
//                     {loading ? 'Trwa zapisywanie...' : 'Zapisz się'}
//                 </button>
//             </form>
//
//             <h2>Moje wizyty</h2>
//             {myAppointments.map((appt) => (
//                 <div key={appt._id}>
//                     <p>
//                         {appt.date} {appt.time} - {appt.doctorId.imie} {appt.doctorId.nazwisko}
//                     </p>
//                 </div>
//             ))}
//         </div>
//     );
// };
//
// export default AppointmentPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, getAppointments, createAppointment } from '../services/api';
import styled from 'styled-components';

const AppointmentPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [myAppointments, setMyAppointments] = useState([]);
    const [appointment, setAppointment] = useState({ doctorId: '', date: '', time: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const usersData = await getUsers();
            const doctors = usersData.data.filter((u) => u.role === 'doctor');
            setDoctors(doctors);

            const appointmentsData = await getAppointments();
            setMyAppointments(appointmentsData.data);
        } catch (err) {
            console.error('Błąd ładowania danych:', err);
            setError('Błąd ładowania danych!');
        }
    };

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createAppointment(appointment);
            setAppointment({ doctorId: '', date: '', time: '', message: '' });
            fetchData(); // Reload data
        } catch (err) {
            console.error('Błąd tworzenia wizyty:', err);
            setError('Nie udało się stworzyć wizyty');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'patient') {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [user, navigate]);

    return (
        <Wrapper>
            <Header>
                <h1>Umów wizytę</h1>
            </Header>
            <FormSection>
                <Form onSubmit={handleBook}>
                    <Select
                        value={appointment.doctorId}
                        onChange={(e) => setAppointment({ ...appointment, doctorId: e.target.value })}
                        required
                    >
                        <option value="">Wybierz lekarza</option>
                        {doctors.map((doc) => (
                            <option key={doc._id} value={doc._id}>
                                {doc.imie} {doc.nazwisko}
                            </option>
                        ))}
                    </Select>
                    <Input
                        type="date"
                        value={appointment.date}
                        onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
                        required
                    />
                    <Input
                        type="time"
                        value={appointment.time}
                        onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
                        required
                    />
                    <Textarea
                        placeholder="Dodatkowe informacje"
                        value={appointment.message}
                        onChange={(e) => setAppointment({ ...appointment, message: e.target.value })}
                    ></Textarea>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Trwa zapisywanie...' : 'Zapisz się'}
                    </Button>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </Form>
            </FormSection>
            <Section>
                <SectionTitle>Moje wizyty:</SectionTitle>
                {myAppointments.length > 0 ? (
                    <AppointmentList>
                        {myAppointments.map((appt) => (
                            <AppointmentItem key={appt._id}>
                                <p>
                                    {appt.date} {appt.time} - {appt.doctorId.imie} {appt.doctorId.nazwisko}
                                </p>
                            </AppointmentItem>
                        ))}
                    </AppointmentList>
                ) : (
                    <NoDataMessage>Brak zarezerwowanych wizyt.</NoDataMessage>
                )}
            </Section>
        </Wrapper>
    );
};

export default AppointmentPage;

const Wrapper = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
    color: #333;
`;

const Header = styled.header`
    text-align: center;

    h1 {
        font-size: 2rem;
        color: #4a90e2;
    }
`;

const FormSection = styled.section`
    margin-top: 20px;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
`;

const Select = styled.select`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
`;

const Textarea = styled.textarea`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    height: 100px;
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        background-color: #357ab8;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 0.9rem;
`;

const Section = styled.section`
    margin-top: 30px;
`;

const SectionTitle = styled.h2`
    font-size: 1.5rem;
    color: #4a90e2;
    margin-bottom: 10px;
`;

const AppointmentList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const AppointmentItem = styled.div`
    background-color: #f1f1f1;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const NoDataMessage = styled.p`
    color: #777;
    font-size: 1rem;
    text-align: center;
`;

