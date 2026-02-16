import React, { useState } from 'react';
import { testTMDBConnection } from '../utils/tmdb-test';

const ApiTest = () => {
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleTest = async () => {
        setIsLoading(true);
        const result = await testTMDBConnection();
        setStatus(result ? 'success' : 'error');
        setIsLoading(false);
    };

    return (
        <section className="api-test">
            <h2 className="section-title">TMDB Connection Test</h2>
            <button
                className="btn"
                type="button"
                onClick={handleTest}
                disabled={isLoading}
            >
                {isLoading ? 'Testing...' : 'Run Test'}
            </button>
            {status === 'success' && (
                <p className="status success">Connection successful.</p>
            )}
            {status === 'error' && (
                <p className="status error">Connection failed. Check the console for details.</p>
            )}
        </section>
    );
};

export default ApiTest;
