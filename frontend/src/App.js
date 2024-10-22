import React, {useState, useEffect} from "react";
import {AudioStreamer, BACKEND_URL, socket} from "./AudioStreamer";
import Settings from "./Setting";
import TranscriptDisplay from "./TranscriptDisplay";
import LoadingDots from "./LoadingDots";

import './App.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false);

  const [showOverlay, setShowOverlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // State for input values in settings
  const [descriptionLength, setDescriptionLength] = useState(10);
  const [style, setStyle] = useState('Narrative');
  const [displayAudioLength, setDisplayAudioLength] = useState(10);

  // State for codes
  const [selectedCodes, setSelectedCodes] = useState({
    loudness: true,
    speech: true,
    motion: true,
    pace: true,
    pattern: true,
    prominence: true,
  });

  const [captions, setCaptions] = useState([{"time":"", "description":"Audio Scene Description..."}])

  function handleDataReceived(data) {
    setIsLoading(false);
    const currentTime = new Date().toLocaleTimeString();
    setCaptions(prevCaption => [...prevCaption, {"time":currentTime,"description":data}]);
  }

  function handleLoading(isLoading) {
    setIsLoading(isLoading);
  }

  useEffect(() => {
    async function testBackend() {
      try {
        const response = await fetch(BACKEND_URL);
        if (response.status === 200){
          setIsConnected(true)
        }
        else{
          setIsConnected(false)
        }
      } catch (error) {
        setIsConnected(false)
        console.error("Error fetching data:", error);
      }
    }
    testBackend();
  }, []);

  useEffect(() => {
    // Listen for changes in the microphone status

    socket.on('captionData', (response) => {
      handleDataReceived(response.data);
      console.log("data")
    });

    socket.on('systemInfo', (response) => {
      handleLoading(response.data);
    });
  }, []);

  function onStart() {
    let audioLength = displayAudioLength -7 
    let config = {
      descriptionLength,
      style,
      audioLength,
      selectedCodes
    }
    setCaptions([]);
    setIsRecording(true);
    setShowSettings(false);
    AudioStreamer.startRecording(handleDataReceived, handleLoading, config);
    console.log(config)
  }

  function onStop() {
    setIsRecording(false);
    AudioStreamer.stopRecording();
    setIsLoading(false);
    // setCaption("Audio Scene Description...")
  }


  // Handle settings dropdown toggle
  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  // Handle code selection toggles
  const handleCodesClick = () => {
    setShowOverlay(true);
  };

  const toggleCodeSelection = (code) => {
    setSelectedCodes((prevState) => ({
      ...prevState,
      [code]: !prevState[code],
    }));
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false); // Close overlay when clicking outside
  };

  return (
    <div className="app-container">
      {/* Header Section with Menu Button and Settings */}
      <div className={`header ${isRecording ? 'disabled' : ''}`}>
        <button className={showSettings ? 'menu-button-click': 'menu-button'} onClick={handleSettingsClick}>
          ☰ {/* The three-bar icon */}
        </button>

        {/* Settings Row in Same Line */}
        {showSettings && (
          <div className="settings-row">
            <button className="code-button" onClick={handleCodesClick}>Parameters</button>
            <div className="setting-item">
              Sensing Length: <input type="number" placeholder={displayAudioLength} onChange={(e) => setDisplayAudioLength(e.target.value)} /> <div className="setting-item-unit">seconds</div>
            </div>
            <div className="setting-item">
              Description Length: <input type="number" placeholder={descriptionLength} onChange={(e) => setDescriptionLength(e.target.value)} /> <div className="setting-item-unit">words</div>
            </div>
            <div className="setting-item">
              <label>Writing Style: </label>
              <select className="style-dropdown" defaultValue={style} onChange={(e) => setStyle(e.target.value)}>
                <option value='Essential'>Essential</option>
                <option value='Storyline'>Storyline</option>
                <option value='Narrative'>Narrative</option>
              </select>
            </div>
            
          </div>
        )}
      </div>
      
      <div classname='contents'>
        {/* Circular Listen button */}
        <button className="listen-button" onClick={() => isRecording ? onStop() :onStart() }>
          {isRecording ? 'Stop' : 'Listen'}
        </button>
        
        {/* Main Audio Description Area */}
        <div className={`audio-description ${isRecording ? '' : 'disabled'}`}>
          {isLoading ? (
              <LoadingDots className='loading-dots'/> 
            ) : (
              <div className="captions-list">
                {captions.slice().reverse().map((item, index) => (
                  <div key={index} className="caption-item">
                    <span className="caption-time">{item.time}</span>
                    <span className="caption-text">{item.description}</span>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>

      {/* Full-page overlay for code selection */}
      <div className={`overlay ${showOverlay ? 'active' : ''}`} onClick={handleCloseOverlay}>
        <div className="codes-modal" onClick={(e) => e.stopPropagation()}>
          <div
            className="code-item"
            style={{ opacity: selectedCodes.prominence ? 1 : 0.5 }}
            onClick={() => toggleCodeSelection('prominence')}
          >
            <span className="checkbox-symbol">{selectedCodes.prominence ? '☑': '☐'}</span> Prominence <span className="code-description">(the most prominent sound)</span>
            
          </div>
          <div
            className="code-item"
            style={{ opacity: selectedCodes.loudness ? 1 : 0.5 }}
            onClick={() => toggleCodeSelection('loudness')}
          >
            <span className="checkbox-symbol">{selectedCodes.loudness ? '☑': '☐'}</span> Loudness <span className="code-description">(the loudness of the sound)</span>
          </div>
          <div
            className="code-item"
            style={{ opacity: selectedCodes.speech ? 1 : 0.5 }}
            onClick={() => toggleCodeSelection('speech')}
          >
            <span className="checkbox-symbol">{selectedCodes.speech ? '☑': '☐'}</span> Speech <span className="code-description">(sounds related to human speech)</span>
          </div>
          <div
            className="code-item"
            style={{ opacity: selectedCodes.motion ? 1 : 0.5 }}
            onClick={() => toggleCodeSelection('motion')}
          >
            <span className="checkbox-symbol">{selectedCodes.motion ? '☑': '☐'}</span> Motion <span className="code-description">(sounds that are moving)</span>
          </div>
          <div
            className="code-item"
            style={{ opacity: selectedCodes.pace ? 1 : 0.5 }}
            onClick={() => toggleCodeSelection('pace')}
          >
            <span className="checkbox-symbol">{selectedCodes.pace ? '☑': '☐'}</span> Pace <span className="code-description">(information related to the pace of sounds)</span>
          </div>
          <div
            className="code-item"
            style={{ opacity: selectedCodes.pattern ? 1 : 0.5 }}
            onClick={() => toggleCodeSelection('pattern')}
          >
            <span className="checkbox-symbol">{selectedCodes.pattern ? '☑': '☐'}</span> Pattern <span className="code-description">(patterns of sounds related information)</span>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
