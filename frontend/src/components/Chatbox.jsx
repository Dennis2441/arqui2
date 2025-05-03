import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Typography, message as antdMessage } from 'antd';
import { AudioOutlined, SoundTwoTone, SoundOutlined } from '@ant-design/icons';
import axios from 'axios';

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

    // Gestión de saludos
    if (lowerText.includes("hola")) {
      const responseMessage = { sender: 'ArquiRefri', content: '¡Hola! ¿En qué puedo ayudarte hoy?' };
      setMessages(prev => [...prev, responseMessage]);
      speak(responseMessage.content);
      setIsTyping(false);
      return;
    }

    // Lógica para manejar los comandos sobre los productos
    if (lowerText.includes("qué hay en la refri")) {
      try {
        const response = await axios.get('http://localhost:3000/producto/listado'); // Cambia según tu API
        const data = response.data;
        if (data.length > 0) {
          const productList = data.map(product => `${product.nombre} (Cantidad: ${product.cantidad})`).join('\n');
          const responseMessage = { sender: 'ArquiRefri', content: `Productos en la refri:\n${productList}` };
          setMessages(prev => [...prev, responseMessage]);
          speak(responseMessage.content);
        } else {
          const responseMessage = { sender: 'ArquiRefri', content: 'No hay productos en la refri.' };
          setMessages(prev => [...prev, responseMessage]);
          speak(responseMessage.content);
        }
      } catch (error) {
        console.error('Error al obtener productos:', error); // Mensajes detallados de error
        const responseMessage = { sender: 'ArquiRefri', content: 'Hubo un problema al obtener los productos.' };
        setMessages(prev => [...prev, responseMessage]);
        speak(responseMessage.content);
      }
      setIsTyping(false);
      return;
    }

    const match = lowerText.match(/cuál es la cantidad del producto (.+)/);
    if (match) {
      const nombreProducto = match[1].trim(); // Usa trim para evitar espacios adicionales
      try {
        const response = await axios.get('http://localhost:3000/producto/listado'); // Cambia según tu API
        const data = response.data;
        const producto = data.find(p => p.nombre.toLowerCase() === nombreProducto.toLowerCase());
        if (producto) {
          const responseMessage = { sender: 'ArquiRefri', content: `La cantidad de ${nombreProducto} es ${producto.cantidad}.` };
          setMessages(prev => [...prev, responseMessage]);
          speak(responseMessage.content);
        } else {
          const responseMessage = { sender: 'ArquiRefri', content: `No se encontró el producto ${nombreProducto}.` };
          setMessages(prev => [...prev, responseMessage]);
          speak(responseMessage.content);
        }
      } catch (error) {
        console.error('Error al obtener la cantidad del producto:', error); // Mensajes detallados de error
        const responseMessage = { sender: 'ArquiRefri', content: 'Hubo un problema al obtener la cantidad del producto.' };
        setMessages(prev => [...prev, responseMessage]);
        speak(responseMessage.content);
      }
      setIsTyping(false);
      return;
    }

    // Consulta a OpenRouter para otras solicitudes
    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'deepseek/deepseek-prover-v2:free',
        messages: [
          { role: 'system', content: 'Responde siempre en español y utiliza un lenguaje natural, sin formato de código o Markdown.' },
          ...updatedMessages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        ]
      }, {
        headers: {
          'Authorization': 'Bearer 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'
        }
      });

      const botMessage = {
        sender: 'ArquiRefri',
        content: response.data.choices?.[0]?.message?.content || 'No se recibió respuesta.',
      };

      // Eliminar formatos de código en la respuesta
      if (botMessage.content.includes('```')) {  
        botMessage.content = 'Lo siento, no puedo procesar esa solicitud.';  
      }  

      setMessages(prev => [...prev, botMessage]);  
      speak(botMessage.content);  

    } catch (error) {  
      console.error('Error desde OpenRouter:', error); // Mensajes detallados de error  
      setMessages(prev => [...prev, { sender: 'ArquiRefri', content: 'Error: no se pudo obtener respuesta de OpenRouter.' }]);  
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
      style={{ width: "50%" }}  
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