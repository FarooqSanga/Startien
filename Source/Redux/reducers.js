const initialState = {
  ads: [
    {
      listingId: '1',
      sellerInfo: {
        userId: 'seller1',
      },
      messages: [
        {
          messageId: 'm1',
          fromUserId: 'user1',
          toUserId: 'seller1',
          content: 'Hello',
          timestamp: '2023-06-25T18:25:43.511Z',
          read: false,
        },
      ],
    },
  ],
};
  
  const adsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SEND_MESSAGE':
        return {
          ...state,
          ads: state.ads.map((ad) =>
            ad.listingId === action.payload.listingId
              ? {
                  ...ad,
                  messages: [
                    ...ad.messages,
                    {
                      messageId: `m${ad.messages.length + 1}`,
                      fromUserId: 'currentUser', // Replace with current user ID
                      toUserId: ad.sellerInfo.userId,
                      content: action.payload.message,
                      timestamp: new Date().toISOString(),
                      read: false,
                    },
                  ],
                }
              : ad
          ),
        };
      default:
        return state;
    }
  };
  
  export default adsReducer;
  