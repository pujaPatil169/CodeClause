import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [originalUrl, setOriginalUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [qrCode, setQrCode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/shorten', { originalUrl, customAlias });
            setShortUrl(res.data.shortUrl);
            setQrCode(res.data.qrCode);
        } catch (error) {
            console.error('Error shortening URL', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>URL Shortener</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type='url' 
                    placeholder='Enter URL' 
                    value={originalUrl} 
                    onChange={(e) => setOriginalUrl(e.target.value)} 
                    required
                />
                <input 
                    type='text' 
                    placeholder='Custom Alias (optional)' 
                    value={customAlias} 
                    onChange={(e) => setCustomAlias(e.target.value)}
                />
                <button type='submit'>Shorten</button>
            </form>
            {shortUrl && (
                <div>
                    <p>Shortened URL: <a href={shortUrl} target='_blank' rel='noopener noreferrer'>{shortUrl}</a></p>
                    <img src={qrCode} alt='QR Code' />
                </div>
            )}
        </div>
    );
}

export default App;
