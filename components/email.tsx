import React, { useState } from 'react';

export function EmailCard({
  name,
  msg,
  type,
  fullEmail,
}: {
  name: string;
  msg: string;
  type?: any;
  fullEmail?: string;
}) {
  const typeStyles: any = {
    Important: 'border-green-500 text-green-500',
    Social: 'border-blue-500 text-blue-500',
    Promotions: 'border-[#800080] text-[#800080]',
    Marketing: 'border-yellow-500 text-yellow-500',
    Spam: 'border-red-500 text-red-500',
    General: 'border-gray-500 text-gray-500',
    '': 'none',
  };

  const defaultStyle = 'border-gray-500 text-gray-500';
  const currentStyle = type ? typeStyles[type] || defaultStyle : defaultStyle;

  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  return (
    <div
      className={`mb-4 cursor-pointer rounded-lg border-2 p-4`}
      onClick={() => setSelectedEmail(selectedEmail === name ? null : name)}
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-bold">{name}</h2>
        {type && <span className={`font-bold ${currentStyle}`}>{type}</span>}
      </div>
      <p className="font-normal">{msg}</p>
      {typeof fullEmail === 'string' && selectedEmail === name && (
        <div className="absolute right-0 top-0 h-full w-full overflow-y-auto bg-gray-200 bg-opacity-50 p-4 backdrop-blur-lg md:w-1/2">
          <h1
            onClick={() => setSelectedEmail(null)}
            className="flex cursor-pointer justify-end"
          >
            Close
          </h1>
          <div className="mb-2 flex items-center justify-evenly">
            <h1 className="text-xl font-bold">{name}</h1>
            {type && (
              <h1 className={`font-bold ${currentStyle} text-xl`}>{type}</h1>
            )}
          </div>
          <div className="email-content-container" style={{ zIndex: 9999 }}>
            <div
              className="email-content mt-4"
              dangerouslySetInnerHTML={{
                __html: Buffer.from(fullEmail, 'base64').toString('utf-8'),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
