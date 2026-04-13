"use client";

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const BullShift = () => {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage('Welcome to BullShift!');
            setLoading(false);
            toast.success('Loaded! Ready to shift some bull!');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            {loading ? <h1>Loading... Please hold on!</h1> : <h1>{message}</h1>}
        </div>
    );
};

export default BullShift;