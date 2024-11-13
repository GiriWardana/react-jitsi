import React, { useEffect, useRef, useState } from 'react';

const JitsiMeeting = () => {
  const jitsiContainerRef = useRef(null);
  const [isModerator, setIsModerator] = useState(false);
  var api;

  useEffect(() => {
    // Initialize the Jitsi Meet API
    const domain = "meet.example.org"; // Your Jitsi domain
    const options = {
      roomName: "g", // Your room name
      parentNode: jitsiContainerRef.current,
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'fullscreen', 'hangup', 'raisehand'],
      },
    };

    api = new window.JitsiMeetExternalAPI(domain, options);

    // Event listener to check for participant role changes
    api.addEventListener('participantRoleChanged', (event) => {
      const { participantId, role } = event; // Get participantId and role from event

      if (role === 'moderator') {
        setIsModerator(true);
        console.log(`Participant ${participantId} is a moderator.`);
      } else {
        setIsModerator(false);
        console.log(`Participant ${participantId} is not a moderator.`);
      }
    });

    const participants = api.getParticipantsInfo();
    let currentUserIsModerator = false;

    participants.forEach((participant) => {
      if (participant.isModerator) {
        currentUserIsModerator = true;
      }
    });

    setIsModerator(currentUserIsModerator);


    // Cleanup when component is unmounted
    return () => api.dispose();
  }, []);

  useEffect(() => {
    if (!isModerator) {
      // If the participant is not a moderator, update toolbar options
     api = new window.JitsiMeetExternalAPI("meet.example.org", {
        roomName: "g",
        parentNode: jitsiContainerRef.current,
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: ['camera'], // Limit toolbar buttons for non-moderators
        },
      });
      console.log("User is not a moderator, toolbar updated.");
    }
  }, [isModerator]);

  return (
    <div
      ref={jitsiContainerRef}
      style={{ height: '100vh', width: '100%' }}
    />
  );
};

export default JitsiMeeting;
