import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Bell, BellOff } from 'lucide-react';
import prime from "../audio/prime.mp3"
import saurav from "../images/useless.jpeg"
const AlarmClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [newAlarm, setNewAlarm] = useState({
    time: '',
    label: '',
    active: true
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // Check alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      
      alarms.forEach(alarm => {
        // Get original alarm time and add 1 hour
        const [hours, minutes] = alarm.time.split(':').map(Number);
        const originalAlarmTime = new Date(now);
        originalAlarmTime.setHours(hours, minutes, 0, 0);
        
        // Add one hour to the alarm time
        const actualAlarmTime = new Date(originalAlarmTime);
        actualAlarmTime.setHours(actualAlarmTime.getHours() + 1);
        
        // Check if current time matches alarm time (within the same minute)
        if (alarm.active && 
            now.getHours() === actualAlarmTime.getHours() && 
            now.getMinutes() === actualAlarmTime.getMinutes() &&
            !alarm.hasTriggered) {  // Add check to prevent multiple triggers
          triggerAlarm(alarm);
          // Mark alarm as triggered
          setAlarms(prevAlarms => prevAlarms.map(a => 
            a.id === alarm.id ? { ...a, hasTriggered: true } : a
          ));
        }
      });
    };

    checkAlarms();
  }, [currentTime, alarms]);

  const triggerAlarm = (alarm) => {
    // Get original time and calculate actual alarm time
    const [hours, minutes] = alarm.time.split(':').map(Number);
    const originalTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const actualTime = `${String((hours + 1) % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    try {
      // Play sound
      const audio = new Audio(prime);
      audio.play().catch(error => console.log('Audio playback error:', error));

      // Show notification
      if ('Notification' in window) {
        const notificationOptions = {
          body: `Alarm set for ${originalTime} has rung at ${actualTime} (1 hour later)`,
          icon: saurav,
          requireInteraction: true, // Keep notification until user interacts
          vibrate: [200, 100, 200] // Vibration pattern
        };

        // Check if we have permission and send notification
        if (Notification.permission === 'granted') {
          try {
            new Notification(alarm.label || 'Alarm', notificationOptions);
          } catch (error) {
            console.log('Notification creation error:', error);
          }
        } else {
          // Request permission again if not granted
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              try {
                new Notification(alarm.label || 'Alarm', notificationOptions);
              } catch (error) {
                console.log('Notification creation error:', error);
              }
            }
          });
        }
      }
    } catch (error) {
      console.log('Trigger alarm error:', error);
    }
  };

  const addAlarm = () => {
    if (!newAlarm.time) return;

    const alarm = {
      id: Date.now(),
      ...newAlarm,
      active: true,
      hasTriggered: false,  // Add flag to track if alarm has triggered
    };

    setAlarms([...alarms, alarm]);
    setNewAlarm({ time: '', label: '', active: true });
  };

  const toggleAlarmActive = (id) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === id ? { ...alarm, active: !alarm.active, hasTriggered: true } : alarm
    ));
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
    
    
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Calculate and format the actual alarm time (1 hour after set time)
  const getActualAlarmTime = (setTime) => {
    if (!setTime) return '';
    const [hours, minutes] = setTime.split(':').map(Number);
    return `${String((hours + 1) % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-xl mx-auto p-10 mt-10 bg-blue-200 rounded-full shadow-md">
      <div className="flex items-center justify-center mb-6">
        <Clock size={128} className="mr-4 text-blue-500" />
        <h2 className="text-2xl font-bold">
          {formatTime(currentTime)}
        </h2>
      </div>

      {/* Add Alarm Section */}
      <div className="flex mb-9 space-x-4 ">
        <input 
          type="time" 
          value={newAlarm.time}
          onChange={(e) => setNewAlarm({...newAlarm, time: e.target.value})}
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="text" 
          placeholder="Alarm Label (optional)"
          value={newAlarm.label}
          onChange={(e) => setNewAlarm({...newAlarm, label: e.target.value})}
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={addAlarm}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          <Plus size={40} />
        </button>
      </div>

      {/* Alarms List */}
      {alarms.length === 0 && (
        <p className="text-center text-red-400 font-bold">No alarms set</p>
      )}

      <ul className="space-y-2 mx-20 ">
        {alarms.map((alarm) => (
          <li 
            key={alarm.id} 
            className={`flex items-center justify-between p-2 rounded-3xl ${
              alarm.active 
                ? 'bg-gray-100' 
                : 'bg-gray-200 opacity-60'
            }`}
          >
            <div className=" flex items-center flex-col ">
              <div className="flex items-center">
                <span className="font-bold mr-4 h-8">Set for: {alarm.time}</span>
                {alarm.label && (
                  <span className="text-gray-500 text-lg pb-2">{alarm.label}</span>
                )}
              </div>
              <span className="text-s text-gray-500">
                Will ring at: {getActualAlarmTime(alarm.time)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => toggleAlarmActive(alarm.id)}
                className={`p-1 rounded ${
                  alarm.active 
                    ? 'text-green-500 hover:bg-green-200' 
                    : 'text-gray-500 hover:bg-gray-300'
                }`}
              >
                {alarm.active ? <Bell size={16} /> : <BellOff size={16} />}
              </button>
              
              <button 
                onClick={() => deleteAlarm(alarm.id)}
                className="text-red-500 hover:bg-red-200 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlarmClock