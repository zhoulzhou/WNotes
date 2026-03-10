export const IPC_CHANNELS = {
  GET_ALL_NOTES: 'get-all-notes',
  CREATE_NOTE: 'create-note',
  DELETE_NOTE: 'delete-note',
  UPDATE_NOTE: 'update-note',
  READ_FILE: 'read-file',
  WRITE_FILE: 'write-file',
  SAVE_IMAGE: 'save-image',
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];
