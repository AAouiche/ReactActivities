import React from 'react';
import { Modal, Button, Image } from 'semantic-ui-react';
import { Attendee } from '../models/attendee';

interface AttendeeModalProps {
  attendee: Attendee;
  open: boolean;
  onClose: () => void;
}

const AttendeeModal: React.FC<AttendeeModalProps> = ({ attendee, open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} centered={false}>
      <Modal.Header>{attendee.displayName}'s Profile</Modal.Header>
      <Modal.Content image>
        <Image wrapped size='medium' src={attendee.imageUrl || '/assets/user.png'} />
        <Modal.Description>
          <p><strong>Username:</strong> {attendee.username}</p>
          <p><strong>Display Name:</strong> {attendee.displayName}</p>
          <p><strong>Bio:</strong> {attendee.bio}</p>
          {/* You can add more fields here if needed */}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AttendeeModal;