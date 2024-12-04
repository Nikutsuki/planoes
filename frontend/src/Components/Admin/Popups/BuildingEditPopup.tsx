import React from 'react';
import './popup.css';

const BuildingEditPopup: React.FC<{ onClose: () => void }> = ({ onClose }, ) => {
    return (
        <div className="background" onClick={onClose}>
            <div className="main_window" onClick={(e) => e.stopPropagation()}>
                <h2>Edit Building</h2>
                <form>
                    {/* Form fields go here */}
                    <button type="button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    );
}

export default BuildingEditPopup;