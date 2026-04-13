import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BullShift = () => {
    const [mode, setMode] = useState('light');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleTranslate = () => {
        // Translation logic goes here
        setOutput(`Translated: ${input}`);
        toast.success('Translation successful!');
    };

    const toggleMode = () => {
        setMode(mode === 'light' ? 'dark' : 'light');
    };

    return (
        <div className={mode}>
            <h1>BullShift Component</h1>
            <button onClick={toggleMode}>Toggle Mode</button>
            <textarea onChange={handleInputChange} value={input} placeholder='Enter text here...' />
            <button onClick={handleTranslate}>Translate</button>
            <div>
                <h2>Output:</h2>
                <p>{output}</p>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BullShift;
