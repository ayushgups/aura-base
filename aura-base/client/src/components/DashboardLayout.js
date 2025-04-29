import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    const { userid } = useParams();  

    return (
        <div className="app">
            <Sidebar userid={userid} />
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
