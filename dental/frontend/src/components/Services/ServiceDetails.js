import React from 'react';

const ServiceDetails = ({ service, onClose }) => {
    return (
        <div style={{
            backgroundColor: '#eaf2f8',
            padding: 20,
            marginTop: 15,
            borderRadius: 8,
            position: 'relative'
        }}>
            <button
                onClick={onClose}
                style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer', background: 'none', border: 'none', fontSize: 18 }}
                aria-label="Zamknij opis usługi"
            >
                ×
            </button>
            <h3>{service.title}</h3>
            <p>{service.fullDesc}</p>
            <p><strong>Cena: </strong>{service.price}</p>
        </div>
    );
};

export default ServiceDetails;
