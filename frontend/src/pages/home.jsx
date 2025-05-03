import React from 'react';
import ChatBox from '../components/Chatbox';

const Home = () => {
    const pacientes = [
        { nombre: "Paciente 1", estado: "Estable", SpO2: 98 },
        { nombre: "Paciente 2", estado: "Crítico", SpO2: 85 },
        { nombre: "Paciente 3", estado: "Estable", SpO2: 92 },
    ];

    const usuario = JSON.parse(window.localStorage.getItem("usuario")); 

    const closeChat = () => {
        console.log('Chat cerrado');
    };

    return (
        <div style={{ display: "flex", justifyContent: 'center'}}>
            <ChatBox closeChat={closeChat} pacientes={pacientes} usuario={usuario} />
        </div>
    );
};

export default Home;