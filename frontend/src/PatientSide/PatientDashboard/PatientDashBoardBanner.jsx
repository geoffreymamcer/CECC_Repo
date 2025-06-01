import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PortalDashboard.css";

function PatientBanner() {
  const [time, setTime] = useState(new Date());
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const fetchUserData = async () => {
      // First try to get from localStorage (for performance)
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          if (userData.firstName) {
            setUserName(userData.firstName);
            return; // If we have the name, we're done
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      // If not found in localStorage, try to fetch from the backend
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.data?.data?.user?.firstName) {
            const firstName = response.data.data.user.firstName;
            setUserName(firstName);
            
            // Update localStorage for future use
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...currentUser, firstName }));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
    return () => clearInterval(timer);
  }, []);



  const getGreeting = (hour) => {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const greeting = getGreeting(time.getHours());

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="PortalBanner">
      <h1>
        {greeting}, {userName || 'there'}!
      </h1>
      <p>Your Eye Health Journey Matters to Us</p>
      


      <p className="lastLogin">Last Log in: {time.toLocaleDateString()}</p>
    </div>
  );
}

export default PatientBanner;
