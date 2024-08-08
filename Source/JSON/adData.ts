// AdData.ts

export interface Location {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }
  
  export interface ContactInfo {
    name: string;
    phone: string;
    email: string;
  }
  
  export interface Rating {
    averageRating: number;
    reviews: {
      reviewId: string;
      userId: string;
      rating: number;
      comment: string;
    }[];
  }
  
  export interface Transaction {
    transactionId: string;
    buyerId: string;
    sellerId: string;
    price: number;
    status: string;
    date: string;
    paymentMethod: string;
    rating: {
      buyerRating: number;
      sellerRating: number;
      comments: {
        userId: string;
        comment: string;
      }[];
    };
  }
  
  export interface Message {
    messageId: string;
    fromUserId: string;
    toUserId: string;
    content: string;
    timestamp: string;
    read: boolean;
  }
  
  export interface Ad {
    listingId: string;
    categoryId: string;
    categoryName: string;
    subcategoryId: string;
    subcategoryName: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    images: string[];
    location: Location;
    datePosted: string;
    condition: string;
    contactInfo: ContactInfo;
    sellerInfo: {
      userId: string;
      name: string;
      email: string;
      phone: string;
      profilePicture: string;
      ratings: Rating;
    };
    views: number;
    interestedUsers: {
      userId: string;
      message: string;
      timestamp: string;
    }[];
    transaction: Transaction;
    messages: Message[];
  }
  