import React from 'react';

const ServiceList = ({ services, onServiceClick }) => {
    return (
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {services.map(service => (
                <li key={service.id}
                    style={{ padding: 10, borderBottom: '1px solid #ddd', cursor: 'pointer', color: '#2980b9' }}
                    onClick={() => onServiceClick(service)}>
                    {service.title}
                </li>
            ))}
        </ul>
    );
};

export default ServiceList;
