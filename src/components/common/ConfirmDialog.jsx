import React from 'react';
import Button from './Button';
import Modal from './Modal';

const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  tone = 'danger',
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onCancel}
    title={title}
    size="sm"
    footer={(
      <>
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant={tone === 'danger' ? 'danger' : 'primary'}
        >
          {confirmLabel}
        </Button>
      </>
    )}
  >
    <p className="text-sm text-gray-600">{description}</p>
  </Modal>
);

export default ConfirmDialog;
