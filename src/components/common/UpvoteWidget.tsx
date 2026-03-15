import { useEffect, useState } from 'react';

export default function UpvoteWidget({ userId, email }: { userId?: string, email?: string }) {
  const [remountKey, setRemountKey] = useState(0);

  useEffect(() => {
    // Force hard remount for cleanup when identity changes
    setRemountKey(k => k + 1);
    
    // Proactive cleanup of existing floating elements
    // @ts-ignore
    if (window.__upvote_cleanup) {
      // @ts-ignore
      window.__upvote_cleanup();
    }

    // Load the script
    const script = document.createElement('script');
    script.src = "https://upvote.entrext.com/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup the script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [userId, email]);

  return (
    <div key={remountKey}>
      <div className="upvote-widget"
           data-application-id="69b6d0fe5cc6277f2375180e"
           data-user-id={userId || ''}
           data-email={email || ''}
           data-position="right"
           data-theme="light"
           data-logo-url="/favicon.png"
           data-product-overview="Secret Room is a free anonymous chat platform."
           data-about-text="Ephemeral anonymous chat with complete privacy."
           data-faqs='[{"question":"How does anonymity work?","answer":"No signup or personal info is required. You are assigned a random avatar."}]'>
      </div>
    </div>
  );
}
