export const sendMessage = (listingId, message) => ({
    type: 'SEND_MESSAGE',
    payload: { listingId, message },
  });
  