import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Typography, message as antdMessage } from 'antd';
import { AudioOutlined, SoundTwoTone, SoundOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

function ChatBox({ closeChat, pacientes, usuario }) {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null); // Para scroll automático

  useEffect(() => {
    if (usuario && usuario.username && !hasGreeted) {
      const greetingMessage = {
        sender: 'ArquiRefri',
        content: `¡Hola, ${usuario.username}! ¿En qué puedo ayudarte hoy?`
      };
      setMessages(prev => [...prev, greetingMessage]);
      speak(greetingMessage.content);
      setHasGreeted(true);
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = 'es-ES';
      recog.interimResults = false;
      recog.maxAlternatives = 1;

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setTimeout(() => sendMessage(transcript), 100);
      };

      recog.onerror = (event) => {
        antdMessage.error('Error en reconocimiento de voz: ' + event.error);
      };

      recognitionRef.current = recog;
    }
  }, [usuario, hasGreeted]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const speak = (text) => {
    if (isMuted) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    synth.speak(utterance);
  };

  const sendMessage = async (inputText) => {
    const messageToSend = inputText || userInput;
    if (!messageToSend.trim()) return;

    const newMessage = { sender: 'user', content: messageToSend };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setUserInput('');
    setIsTyping(true);

    const lowerText = messageToSend.toLowerCase();

    if (lowerText.includes("dame la lista de pacientes")) {
      const patientList = pacientes.map(p => `${p.nombre} (Estado: ${p.estado}, SpO2: ${p.SpO2}%)`).join('\n');
      const response = { sender: 'ArquiRefri', content: `Lista de pacientes:\n${patientList}` };
      setMessages(prev => [...prev, response]);
      speak(response.content);
      setIsTyping(false);
      return;
    }

    if (lowerText.includes("dame pacientes criticos")) {
      const criticos = pacientes.filter(p => p.estado === "Crítico");
      const list = criticos.length > 0
        ? criticos.map(p => `${p.nombre} (SpO2: ${p.SpO2}%)`).join('\n')
        : "No hay pacientes críticos.";
      const response = { sender: 'ArquiRefri', content: `Pacientes críticos:\n${list}` };
      setMessages(prev => [...prev, response]);
      speak(response.content);
      setIsTyping(false);
      return;
    }

    if (lowerText.includes("dame pacientes estables")) {
      const estables = pacientes.filter(p => p.estado === "Estable");
      const list = estables.length > 0
        ? estables.map(p => `${p.nombre} (SpO2: ${p.SpO2}%)`).join('\n')
        : "No hay pacientes estables.";
      const response = { sender: 'ArquiRefri', content: `Pacientes estables:\n${list}` };
      setMessages(prev => [...prev, response]);
      speak(response.content);
      setIsTyping(false);
      return;
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            { role: 'system', content: 'Responde siempre en español.' },
            ...updatedMessages.map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.content
            }))
          ]
        }),
      });

      if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);

      const data = await response.json();
      const botMessage = {
        sender: 'ArquiRefri',
        content: data.choices?.[0]?.message?.content || 'No se recibió respuesta.',
      };
      setMessages(prev => [...prev, botMessage]);
      speak(botMessage.content);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'ArquiRefri', content: 'Error: no se pudo obtener respuesta.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceRecognition = () => {
    if (!recognitionRef.current) {
      antdMessage.error('Tu navegador no soporta reconocimiento de voz.');
      return;
    }
    recognitionRef.current.start();
  };

  return (
    <Card
      title="Chatbot"
      style={{ width: "50%"}}
      extra={
        <Button type="primary" danger onClick={closeChat}>
          Cerrar
        </Button>
      }
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: 12,
          maxHeight: 'calc(100vh - 200px)',
          paddingRight: 8,
        }}
      >
        {messages.map((msg, index) => (
          <Card
            key={index}
            type="inner"
            size="small"
            style={{
              marginBottom: 8,
              backgroundColor: msg.sender === 'ArquiRefri' ? '#f0f5ff' : '#e6fffb',
              textAlign: 'center',
            }}
            title={<Text strong>{msg.sender}</Text>}
          >
            {msg.content}
          </Card>
        ))}
        {isTyping && (
          <div style={{ textAlign: 'center', color: 'blue' }}>
            <Text italic>ArquiRefri está escribiendo...</Text>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <TextArea
        rows={2}
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje (Shift+Enter para nueva línea)"
        style={{ marginBottom: 8 }}
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="primary" onClick={sendMessage}>Enviar</Button>
        <Button onClick={startVoiceRecognition} icon={<AudioOutlined />}>Hablar</Button>
        <Button onClick={() => setIsMuted(prev => !prev)} icon={isMuted ? <SoundOutlined /> : <SoundTwoTone />}>
          {isMuted ? 'Activar Voz' : 'Mute'}
        </Button>
      </div>
    </Card>
  );
}

export default ChatBox;
