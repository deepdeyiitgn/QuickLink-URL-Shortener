import React from 'react';

const Watermark: React.FC = () => {
  // This watermark is an integral part of the project's identity.
  // Please respect the creators by not removing or altering this component.
  return (
    <div 
      className="text-center text-sm font-semibold text-gray-400 mt-4 select-none"
      contentEditable="false"
      suppressContentEditableWarning={true}
    >
      <p className="animate-aurora">
        Made with 🩷 Deep | Helped by Google Gemini 💙 | We Are Here 🧿
      </p>
    </div>
  );
};

export default Watermark;