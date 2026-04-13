"use client";

const LOADING_MSGS_ADD = ['Adding your information...','Processing your data...'];
const LOADING_MSGS_SHIFT = ['Shifting your details...','Loading your profile...'];

export default function BullShift() {
    const [mode, setMode] = useState('humanToLinkedin');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    
    const toggleMode = () => {
        setMode(prevMode => prevMode === 'humanToLinkedin' ? 'linkedinToHuman' : 'humanToLinkedin');
    };
    
    const handleSubmit = async () => {
        setLoading(true);
        const response = await fetch('/api/translate', {method: 'POST', body: JSON.stringify({input, mode})});
        const data = await response.json();
        setOutput(data.output);
        setLoading(false);
    };
    
    return (
        <div style={{padding: '20px', border: '1px solid #ccc'}}>
            <h1>BullShift</h1>
            <button onClick={toggleMode}>Toggle Mode</button>
            <textarea onChange={(e) => setInput(e.target.value)} value={input} />
            <button onClick={handleSubmit}>Submit</button>
            {loading && <p>{LOADING_MSGS_ADD[Math.floor(Math.random() * LOADING_MSGS_ADD.length)]}</p>}
            <div>{output}</div>
        </div>
    );
}