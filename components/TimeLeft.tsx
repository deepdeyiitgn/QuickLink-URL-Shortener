import React, { useState, useEffect } from 'react';

const TimeLeft: React.FC<{ expiryDate: number | null }> = ({ expiryDate }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (expiryDate === null) {
            setTimeLeft('Permanent');
            return;
        }

        const calculateTimeLeft = () => {
            const difference = expiryDate - Date.now();
            if (difference <= 0) {
                setTimeLeft('Expired');
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            
            let output = '';
            if (days > 0) output += `${days}d `;
            if (hours > 0) output += `${hours}h `;
            if (days === 0 && hours === 0) output += `${minutes}m`;

            setTimeLeft(output.trim() || '<1m');
        };

        // Set up the timer to update every second for a live countdown
        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // Initial call to display time immediately

        return () => clearInterval(timer);
    }, [expiryDate]);

    return <span className={timeLeft === 'Expired' ? 'text-red-500' : timeLeft === 'Permanent' ? 'text-green-400' : ''}>{timeLeft}</span>;
};

export default TimeLeft;
