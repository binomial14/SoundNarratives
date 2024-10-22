import React from 'react';

const Settings = ({ layoutTheme, fontSize, fontStyle, fontFamily, handleLayoutThemeChange, handleFontSizeChange, handleFontStyleChange, handleFontFamilyChange, model, handleModelChange}) => {
  return (
    <div>
      {/* <h2>Captions</h2> */}
      <div className="scrollable-container">    
        <div className="flex-container">
          <div className="flex-item">
              <label>
              Theme:{' '}
              <select value={layoutTheme} onChange={handleLayoutThemeChange} className='customSelect'>
                  <option value="dark-theme">Default</option>
                  <option value="light-theme">Light</option>
                  <option value="court-theme">Court</option>
              </select>
              </label>
          </div>
          <div className="flex-item">
              <label>
              Font Size:{' '}
              <input
                  type="number"
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  className="customInput"
              />
              </label>
          </div>
          <div className="flex-item">
              <label>
              Font Family:{' '}
              <select value={fontFamily} onChange={handleFontFamilyChange} className='customSelect'>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
              </select>
              </label>
          </div>
          <div className="flex-item">
              <label>
              Model:{' '}
              <select value={model} onChange={handleModelChange} className='customSelect'>
                  <option value="latest_long">Default</option>
                  <option value="medical_conversation">Medical Conversation</option>
              </select>
              </label>
          </div>
            {/* <div className="flex-item">
                <label>
                Font Style:
                <select value={fontStyle} onChange={handleFontStyleChange}>
                    <option value="normal">Normal</option>
                    <option value="italic">Italic</option>
                    <option value="oblique">Oblique</option>
                </select>
                </label>
            </div> */}
        </div>
      </div>
      <div className="separator"></div>
    </div>
  );
};

export default Settings;
