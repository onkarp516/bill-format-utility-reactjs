import React from 'react';
import '../assets/css/SplashScreen.css';
import euu from "../assets/images/128.png";
const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <img
        src={euu}
        alt="Loading..."
        className="fade-in-out" 
      />
    </div>
  );
};

export default SplashScreen;
