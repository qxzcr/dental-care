import React from 'react';

const DoctorCard = ({ doctor }) => {
    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 15,
            width: 250,
            textAlign: 'center',
            backgroundColor: '#f7fbff',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
            <img
                src={doctor.photo}
                alt={`Dr ${doctor.name}`}
                style={{ width: '100%', borderRadius: '50%', marginBottom: 10, objectFit: 'cover', height: 200 }}
            />
            <h4 style={{ margin: '10px 0 5px' }}>{doctor.name}</h4>
            <p style={{ color: '#555' }}>{doctor.specialization}</p>
        </div>
    );
};

export default DoctorCard;
