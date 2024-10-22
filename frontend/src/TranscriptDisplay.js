import React, {useState, useEffect, useRef} from 'react';

const TranscriptDisplay = ({ transcription, interimTranscription }) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const boxRef = useRef();

  useEffect(() => {
    const box = boxRef.current;

    const handleScroll = () => {
      // Disable auto-scrolling if the user has manually scrolled up
      if (box.scrollTop < box.scrollHeight - box.clientHeight - 10) {
        setAutoScrollEnabled(false);
      } else {
        // Enable auto-scrolling when the user is at the bottom
        setAutoScrollEnabled(true);
      }
    };

    box.addEventListener('scroll', handleScroll);

    return () => {
      // Remove the event listener on component unmount
      box.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom when component mounts or content changes
    if (autoScrollEnabled){
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [interimTranscription, autoScrollEnabled]);

  return (
    <div ref={boxRef} className="strings-container">
      {transcription.map((result, index) => (
        <div key={index} className="string-item">
          {result[1]}
        </div>
      ))}
      <div className="string-item">
        {interimTranscription}
      </div>
    </div>
  );
};

export default TranscriptDisplay;
