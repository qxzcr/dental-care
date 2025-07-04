// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Изменено с AuthContext
// import { getUsers } from '../services/api';
// import axios from 'axios';
//
// const HomePage = () => {
//     const { user } = useAuth(); // Изменено с useContext(AuthContext)
//     const navigate = useNavigate();
//     const [doctors, setDoctors] = useState([]);
//     const [expandedService, setExpandedService] = useState(null);
//     const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
//
//     useEffect(() => {
//         const fetchDoctors = async () => {
//             try {
//                 const data = await getUsers();
//                 setDoctors(data.filter(u => u.role === 'doctor'));
//             } catch (error) {
//                 console.error('Błąd pobierania lekarzy:', error);
//             }
//         };
//         fetchDoctors();
//     }, []);
//
//     const services = [
//         { id: 1, name: 'Implantologia', icon: '🦷', description: 'Zaawansowane zabiegi implantacji zębów...', duration: '60-90 min', price: '2000-3000 PLN' },
//         { id: 2, name: 'Estetyka Medyczna', icon: '✨', description: 'Whitening i poprawa estetyki uśmiechu...', duration: '45-60 min', price: '500-1000 PLN' },
//         { id: 3, name: 'Parodontologia', icon: '🌱', description: 'Leczenie chorób przyzębia...', duration: '30-60 min', price: '300-700 PLN' },
//         { id: 4, name: 'Endodoncja', icon: '🔧', description: 'Leczenie kanałowe zębów...', duration: '60-120 min', price: '400-800 PLN' },
//         { id: 5, name: 'Protetyka', icon: '👄', description: 'Protezy i korony zębowe...', duration: '90-150 min', price: '1000-2500 PLN' },
//         { id: 6, name: 'Chirurgia', icon: '🔪', description: 'Usuwanie zębów i zabiegi chirurgiczne...', duration: '30-90 min', price: '500-1500 PLN' },
//     ];
//
//     const handleBookAppointment = () => {
//         if (!user) {
//             navigate('/login');
//         } else {
//             navigate('/appointment');
//         }
//     };
//
//     const handleProfile = () => {
//         if (!user) {
//             navigate('/login');
//         } else {
//             navigate('/profile');
//         }
//     };
//
//     const handleContactSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post('/api/messages', {
//                 content: contactForm.message,
//                 from: contactForm.name,
//                 email: contactForm.email,
//                 to: 'admin'
//             }, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             });
//             alert('Wiadomość wysłana do administratora!');
//             setContactForm({ name: '', email: '', message: '' });
//         } catch (error) {
//             console.error('Błąd wysyłania wiadomości:', error);
//             alert('Nie udało się wysłać wiadomości.');
//         }
//     };
//
//     return (
//         <div id="home" style={{ padding: 20, backgroundImage: 'url(https://via.placeholder.com/1200x800)', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
//             <section style={{ textAlign: 'center', marginBottom: 60, padding: '40px 0', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
//                 <h1>Klinika Dentystyczna Usługi</h1>
//                 <p style={{ maxWidth: 800, margin: '0 auto', fontSize: '1.2em', color: '#555' }}>
//                     Jesteśmy nowoczesną kliniką stomatologiczną oferującą najwyższej jakości usługi...
//                 </p>
//                 <div style={{ height: 2, background: 'linear-gradient(to right, #007bff, #ff4444)', margin: '20px auto', width: '200px' }} />
//             </section>
//
//             <section style={{ textAlign: 'center', marginBottom: 60 }}>
//                 <button onClick={handleBookAppointment} style={{ padding: '15px 30px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: '1.1em', marginRight: 10 }}>
//                     Umów wizytę
//                 </button>
//                 <button onClick={handleProfile} style={{ padding: '15px 30px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: '1.1em' }}>
//                     Profil
//                 </button>
//             </section>
//
//             <section id="uslugi" style={{ marginBottom: 60 }}>
//                 <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Nasze Usługi</h2>
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, justifyItems: 'center' }}>
//                     {services.map(service => (
//                         <div key={service.id} style={{ width: 300, padding: 20, border: '1px solid #ddd', borderRadius: 10, textAlign: 'center', backgroundColor: '#e6f0fa' }}>
//                             <div style={{ fontSize: 50, color: '#0000ff' }}>{service.icon}</div>
//                             <h3 style={{ margin: '10px 0' }}>{service.name}</h3>
//                             <button onClick={() => setExpandedService(expandedService === service.id ? null : service.id)} style={{ padding: '8px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: 5 }}>
//                                 {expandedService === service.id ? 'Zwiń' : 'Czytaj więcej'}
//                             </button>
//                             {expandedService === service.id && (
//                                 <div style={{ marginTop: 15 }}>
//                                     <p>{service.description}</p>
//                                     <p><strong>Czas trwania:</strong> {service.duration}</p>
//                                     <p><strong>Cena:</strong> {service.price}</p>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </section>
//
//             <section id="lekarze" style={{ marginBottom: 60 }}>
//                 <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Nasi Lekarze</h2>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 30, justifyContent: 'center' }}>
//                     {doctors.map(doctor => (
//                         <div key={doctor._id} style={{ width: 250, padding: 20, border: '1px solid #ddd', borderRadius: 10, textAlign: 'center', backgroundColor: '#f7fbff' }}>
//                             <img
//                                 src={`http://localhost:5000${doctor.photo || '/images/default.jpg'}`}
//                                 alt={`Dr ${doctor.imie} ${doctor.nazwisko}`}
//                                 style={{ width: '100%', borderRadius: '50%', marginBottom: 15, objectFit: 'cover', height: 200 }}
//                             />
//                             <h4 style={{ margin: '10px 0' }}>{doctor.imie} {doctor.nazwisko}</h4>
//                             <p><strong>Specjalność:</strong> {doctor.specialty}</p>
//                             <p>{doctor.description || 'Doświadczony specjalista.'}</p>
//                         </div>
//                     ))}
//                 </div>
//             </section>
//
//             <section id="kontakt" style={{ marginBottom: 60, padding: '40px 0', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
//                 <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Kontakt z Nami</h2>
//                 <p style={{ textAlign: 'center' }}><strong>Telefon:</strong> 02 / 980 62 89, 02 / 986 46 36</p>
//                 <p style={{ textAlign: 'center' }}><strong>Adres:</strong> ul. Dentystyczna 12, 00-123 Warszawa</p>
//                 <p style={{ textAlign: 'center' }}><strong>Email:</strong> kontakt@klinikadentystyczna.pl</p>
//                 <h3 style={{ textAlign: 'center', marginTop: 20 }}>Formularz kontaktowy</h3>
//                 <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: 500, margin: '0 auto' }}>
//                     <input
//                         type="text"
//                         placeholder="Twoje imię"
//                         value={contactForm.name}
//                         onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
//                         style={{ padding: 12, marginBottom: 15, borderRadius: 5, border: '1px solid #ccc' }}
//                         required
//                     />
//                     <input
//                         type="email"
//                         placeholder="Twój email"
//                         value={contactForm.email}
//                         onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
//                         style={{ padding: 12, marginBottom: 15, borderRadius: 5, border: '1px solid #ccc' }}
//                         required
//                     />
//                     <textarea
//                         placeholder="Twoje pytanie"
//                         value={contactForm.message}
//                         onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
//                         style={{ padding: 12, marginBottom: 15, borderRadius: 5, border: '1px solid #ccc', height: 120 }}
//                         required
//                     />
//                     <button type="submit" style={{ padding: '12px 25px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
//                         Wyślij
//                     </button>
//                 </form>
//             </section>
//
//             <footer style={{ textAlign: 'center', padding: 20, backgroundColor: '#333', color: '#fff' }}>
//                 <p>© 2025 Klinika Dentystyczna Usługi. Wszelkie prawa zastrzeżone.</p>
//             </footer>
//         </div>
//     );
// };
//
// export default HomePage;
// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, api } from '../services/api';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [expandedService, setExpandedService] = useState(null);
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getUsers();
                setDoctors(data.data.filter(u => u.role === 'doctor'));
            } catch (error) {
                console.error('Błąd pobierania lekarzy:', error);
            }
        };
        fetchDoctors();
    }, []);

    const services = [
        {
            id: 1,
            name: 'Implantologia',
            icon: '🦷',
            description: 'Zaawansowane zabiegi implantacji zębów...',
            duration: '60-90 min',
            price: '2000-3000 PLN',
        },
        {
            id: 2,
            name: 'Estetyka Medyczna',
            icon: '✨',
            description: 'Whitening i poprawa estetyki uśmiechu...',
            duration: '45-60 min',
            price: '500-1000 PLN',
        },
        {
            id: 3,
            name: 'Parodontologia',
            icon: '🌱',
            description: 'Leczenie chorób przyzębia...',
            duration: '30-60 min',
            price: '300-700 PLN',
        },
        {
            id: 4,
            name: 'Endodoncja',
            icon: '🔧',
            description: 'Leczenie kanałowe zębów...',
            duration: '60-120 min',
            price: '400-800 PLN',
        },
        {
            id: 5,
            name: 'Protetyka',
            icon: '👄',
            description: 'Protezy i korony zębowe...',
            duration: '90-150 min',
            price: '1000-2500 PLN',
        },
        {
            id: 6,
            name: 'Chirurgia',
            icon: '🔪',
            description: 'Usuwanie zębów i zabiegi chirurgiczne...',
            duration: '30-90 min',
            price: '500-1500 PLN',
        },
    ];

    const handleBookAppointment = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/appointment');
        }
    };

    const handleProfile = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/profile');
        }
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/messages', {
                content: contactForm.message,
                from: contactForm.name,
                email: contactForm.email,
                to: 'admin',
            });
            alert('Wiadomość wysłana do administratora!');
            setContactForm({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Błąd wysyłania wiadomości:', error);
            alert('Nie udało się wysłać wiadomości.');
        }
    };

    return (
        <div
            id="home"
            style={{
                padding: 20,
                backgroundImage: 'url(https://via.placeholder.com/1200x800)',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
            }}
        >
            <section
                style={{
                    textAlign: 'center',
                    marginBottom: 60,
                    padding: '40px 0',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
            >
                <h1>Klinika Dentystyczna Usługi</h1>
                <p
                    style={{
                        maxWidth: 800,
                        margin: '0 auto',
                        fontSize: '1.2em',
                        color: '#555',
                    }}
                >
                    Jesteśmy nowoczesną kliniką stomatologiczną oferującą najwyższej jakości
                    usługi...
                </p>
                <div
                    style={{
                        height: 2,
                        background: 'linear-gradient(to right, #007bff, #ff4444)',
                        margin: '20px auto',
                        width: '200px',
                    }}
                />
            </section>

            <section style={{ textAlign: 'center', marginBottom: 60 }}>
                <button
                    onClick={handleBookAppointment}
                    style={{
                        padding: '15px 30px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        cursor: 'pointer',
                        fontSize: '1.1em',
                        marginRight: 10,
                    }}
                >
                    Umów wizytę
                </button>
                <button
                    onClick={handleProfile}
                    style={{
                        padding: '15px 30px',
                        backgroundColor: '#6c757d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        cursor: 'pointer',
                        fontSize: '1.1em',
                    }}
                >
                    Profil
                </button>
            </section>

            <section id="uslugi" style={{ marginBottom: 60 }}>
                <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Nasze Usługi</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 20,
                        justifyItems: 'center',
                    }}
                >
                    {services.map(service => (
                        <div
                            key={service.id}
                            style={{
                                width: 300,
                                padding: 20,
                                border: '1px solid #ddd',
                                borderRadius: 10,
                                textAlign: 'center',
                                backgroundColor: '#e6f0fa',
                            }}
                        >
                            <div style={{ fontSize: 50, color: '#0000ff' }}>
                                {service.icon}
                            </div>
                            <h3 style={{ margin: '10px 0' }}>{service.name}</h3>
                            <button
                                onClick={() =>
                                    setExpandedService(
                                        expandedService === service.id ? null : service.id
                                    )
                                }
                                style={{
                                    padding: '8px 15px',
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 5,
                                }}
                            >
                                {expandedService === service.id ? 'Zwiń' : 'Czytaj więcej'}
                            </button>
                            {expandedService === service.id && (
                                <div style={{ marginTop: 15 }}>
                                    <p>{service.description}</p>
                                    <p>
                                        <strong>Czas trwania:</strong> {service.duration}
                                    </p>
                                    <p>
                                        <strong>Cena:</strong> {service.price}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section id="lekarze" style={{ marginBottom: 60 }}>
                <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Nasi Lekarze</h2>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 30,
                        justifyContent: 'center',
                    }}
                >
                    {doctors.map(doctor => (
                        <div
                            key={doctor._id}
                            style={{
                                width: 250,
                                padding: 20,
                                border: '1px solid #ddd',
                                borderRadius: 10,
                                textAlign: 'center',
                                backgroundColor: '#f7fbff',
                            }}
                        >
                            <img
                                src={`http://localhost:5000${doctor.photo || '/images/default.jpg'}`}
                                alt={`Dr ${doctor.imie} ${doctor.nazwisko}`}
                                style={{
                                    width: '100%',
                                    borderRadius: '50%',
                                    marginBottom: 15,
                                    objectFit: 'cover',
                                    height: 200,
                                }}
                            />
                            <h4 style={{ margin: '10px 0' }}>
                                {doctor.imie} {doctor.nazwisko}
                            </h4>
                            <p>
                                <strong>Specjalność:</strong> {doctor.specialty}
                            </p>
                            <p>{doctor.description || 'Doświadczony specjalista.'}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section
                id="kontakt"
                style={{
                    marginBottom: 60,
                    padding: '40px 0',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: 30 }}>
                    Kontakt z Nami
                </h2>
                <p style={{ textAlign: 'center' }}>
                    <strong>Telefon:</strong> 02 / 980 62 89, 02 / 986 46 36
                </p>
                <p style={{ textAlign: 'center' }}>
                    <strong>Adres:</strong> ul. Dentystyczna 12, 00-123 Warszawa
                </p>
                <p style={{ textAlign: 'center' }}>
                    <strong>Email:</strong> kontakt@klinikadentystyczna.pl
                </p>
                <h3 style={{ textAlign: 'center', marginTop: 20 }}>
                    Formularz kontaktowy
                </h3>
                <form
                    onSubmit={handleContactSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: 500,
                        margin: '0 auto',
                    }}
                >
                    <input
                        type="text"
                        placeholder="Twoje imię"
                        value={contactForm.name}
                        onChange={(e) =>
                            setContactForm({ ...contactForm, name: e.target.value })
                        }
                        style={{
                            padding: 12,
                            marginBottom: 15,
                            borderRadius: 5,
                            border: '1px solid #ccc',
                        }}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Twój email"
                        value={contactForm.email}
                        onChange={(e) =>
                            setContactForm({ ...contactForm, email: e.target.value })
                        }
                        style={{
                            padding: 12,
                            marginBottom: 15,
                            borderRadius: 5,
                            border: '1px solid #ccc',
                        }}
                        required
                    />
                    <textarea
                        placeholder="Twoje pytanie"
                        value={contactForm.message}
                        onChange={(e) =>
                            setContactForm({ ...contactForm, message: e.target.value })
                        }
                        style={{
                            padding: 12,
                            marginBottom: 15,
                            borderRadius: 5,
                            border: '1px solid #ccc',
                            height: 120,
                        }}
                        required
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '12px 25px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 5,
                            cursor: 'pointer',
                        }}
                    >
                        Wyślij
                    </button>
                </form>
            </section>

            <footer
                style={{
                    textAlign: 'center',
                    padding: 20,
                    backgroundColor: '#333',
                    color: '#fff',
                }}
            >
                <p>© 2025 Klinika Dentystyczna Usługi. Wszelkie prawa zastrzeżone.</p>
            </footer>
        </div>
    );
};

export default HomePage;