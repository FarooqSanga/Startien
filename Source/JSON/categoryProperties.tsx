export const categoryProperties: { [key: string]: { [key: string]: { type: 'text' | 'dropdown'; options?: string[] } } } = {
    "Mobiles": {
      "Condition": { type: "dropdown", options: ["New", "Used"] },
      "Storage Capacity": { type: "dropdown", options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"] },
      "Color": { type: "dropdown", options: ["Black", "White", "Blue", "Red", "Gold", "Silver", "Green", "Gray"] },
      "Warranty": { type: "dropdown", options: ["Available", "Not Available"] },
      "Battery Health": { type: "text" },
      "Accessories Included": { type: "text" },
      "Network Compatibility": { type: "dropdown", options: ["2G", "3G", "4G", "5G"] },
      "Camera Quality": { type: "text" },
    },
    "Electronics": {
      "Condition": { type: "dropdown", options: ["New", "Used", "Refurbished"] },
      "Brand": { type: "text" },
      "Model": { type: "text" },
      "Warranty": { type: "dropdown", options: ["Available", "Not Available"] },
      "Year of Manufacture": { type: "text" },
      "Energy Efficiency Rating": { type: "dropdown", options: ["A++", "A+", "A", "B", "C"] },
      "Voltage": { type: "text" },
      "Features": { type: "text" },
      "Connectivity": { type: "dropdown", options: ["Wi-Fi", "Bluetooth", "NFC", "USB", "HDMI"] },
    },
    "Vehicles": {
      "Condition": { type: "dropdown", options: ["New", "Used"] },
      "Make": { type: "text" },
      "Model": { type: "text" },
      "Year": { type: "text" },
      "Mileage": { type: "dropdown", options: ["0-5,000 km", "5,001-10,000 km", "10,001-20,000 km", "20,001+ km"] },
      "Fuel Type": { type: "dropdown", options: ["Petrol", "Diesel", "Hybrid", "Electric", "CNG"] },
      "Transmission": { type: "dropdown", options: ["Manual", "Automatic", "Semi-Automatic"] },
      "Color": { type: "dropdown", options: ["White", "Black", "Blue", "Red", "Silver", "Gray", "Other"] },
      "Engine Capacity": { type: "text" },
      "Number of Owners": { type: "text" },
      "Insurance Validity": { type: "text" },
      "Registration City": { type: "text" },
      "Accident History": { type: "text" },
    },
    "Property": {
      "Property Type": { type: "dropdown", options: ["New Built", "Old Built", "Renovated"] },
      "Condition": { type: "dropdown", options: ["Furnished", "Unfurnished", "Semi-Furnished"] },
      "Bedrooms": { type: "dropdown", options: ["1", "2", "3", "4", "5+"] },
      "Bathrooms": { type: "dropdown", options: ["1", "2", "3", "4+"] },
      "Parking": { type: "dropdown", options: ["Available", "Not Available"] },
      "Floor Level": { type: "dropdown", options: ["Ground", "1st", "2nd", "3rd", "4th+"] },
      "Square Footage": { type: "text" },
      "Year Built": { type: "text" },
      "Amenities": { type: "text" },
      "Nearby Facilities": { type: "text" },
      "Security Features": { type: "text" },
    },
    "Animals": {
      "Type": { type: "text" },
      "Color": { type: "dropdown", options: ["Black", "White", "Brown", "Golden", "Gray", "Spotted", "Mixed"] },
      "Breed": { type: "text" },
      "Age": { type: "dropdown", options: ["Puppy/Kitten", "Young", "Adult", "Senior"] },
      "Vaccination Status": { type: "dropdown", options: ["Vaccinated", "Not Vaccinated"] },
      "Weight": { type: "text" },
      "Diet Preferences": { type: "text" },
      "Medical History": { type: "text" },
      "Training Level": { type: "dropdown", options: ["Basic", "Intermediate", "Advanced"] },
    },
    "Fashion & Beauty": {
      // For Clothing
      "Clothing Type": { type: "dropdown", options: ["Shirt", "Pants", "Dress", "Jacket", "Sweater", "T-Shirt", "Skirt"] },
      "Size": { type: "dropdown", options: ["XS", "S", "M", "L", "XL", "XXL"] },
      "Material": { type: "dropdown", options: ["Cotton", "Polyester", "Leather", "Denim", "Wool", "Silk"] },
      "Condition": { type: "dropdown", options: ["New", "Used"] },
      "Color": { type: "dropdown", options: ["Black", "White", "Blue", "Red", "Pink", "Green", "Yellow", "Multicolor"] },
      "Brand": { type: "text" },
      "Style": { type: "text" },
      "Occasion": { type: "dropdown", options: ["Casual", "Formal", "Party", "Sportswear", "Wedding", "Office"] },
      
      // For Beauty Products
      "Product Type": { type: "dropdown", options: ["Skincare", "Makeup", "Haircare", "Perfume", "Nail Polish"] },
      "Skin Type": { type: "dropdown", options: ["Normal", "Oily", "Dry", "Combination", "Sensitive"] },
      "Shade": { type: "text" },
      "Volume": { type: "text" },
      "Ingredients": { type: "text" },
      "Expiry Date": { type: "text" },
    },
    "Furniture": {
      "Condition": { type: "dropdown", options: ["New", "Used"] },
      "Material": { type: "dropdown", options: ["Wood", "Metal", "Plastic", "Glass", "Fabric", "Leather"] },
      "Color": { type: "dropdown", options: ["Black", "White", "Brown", "Gray", "Beige"] },
      "Size": { type: "text" },
      "Weight Capacity": { type: "text" },
      "Brand": { type: "text" },
      "Assembly Required": { type: "dropdown", options: ["Yes", "No"] },
      "Warranty": { type: "dropdown", options: ["Available", "Not Available"] },
    },
    "Books": {
      "Condition": { type: "dropdown", options: ["New", "Used"] },
      "Genre": { type: "dropdown", options: ["Fiction", "Non-Fiction", "Comics", "Educational", "Biographies", "Fantasy", "Science Fiction"] },
      "Language": { type: "dropdown", options: ["English", "Spanish", "French", "German", "Chinese", "Other"] },
      "Cover Type": { type: "dropdown", options: ["Paperback", "Hardcover"] },
      "Author": { type: "text" },
      "Publisher": { type: "text" },
      "ISBN": { type: "text" },
      "Edition": { type: "text" },
      "Pages": { type: "text" },
    },
    "Sports": {
      "Condition": { type: "dropdown", options: ["New", "Used"] },
      "Type": { type: "dropdown", options: ["Fitness Equipment", "Outdoor Sports", "Indoor Sports", "Accessories"] },
      "Brand": { type: "text" },
      "Material": { type: "text" },
      "Weight": { type: "text" },
      "Dimensions": { type: "text" },
      "Skill Level": { type: "dropdown", options: ["Beginner", "Intermediate", "Advanced"] },
      "Age Range": { type: "dropdown", options: ["Kids", "Adults", "All Ages"] },
    },
    "Kids": {
      "Condition": { type: "dropdown", options: ["New", "Used"] },
      "Age Range": { type: "dropdown", options: ["0-2 Years", "3-5 Years", "6-8 Years", "9-12 Years", "Teenagers"] },
      "Material": { type: "text" },
      "Color": { type: "dropdown", options: ["Multicolor", "Blue", "Pink", "Green", "Yellow", "Other"] },
      "Brand": { type: "text" },
      "Safety Features": { type: "text" },
      "Educational Value": { type: "text" },
      "Battery Required": { type: "dropdown", options: ["Yes", "No"] },
    },
    "Jobs": {
      "Job Type": { type: "dropdown", options: ["Full Time", "Part Time", "Freelance", "Contract"] },
      "Experience Level": { type: "dropdown", options: ["Entry Level", "Mid Level", "Senior Level"] },
      "Industry": { type: "dropdown", options: ["IT", "Healthcare", "Education", "Finance", "Construction", "Other"] },
      "Job Description": { type: "text" },
      "Required Qualifications": { type: "text" },
      "Location": { type: "text" },
      "Salary Range": { type: "text" },
      "Benefits": { type: "text" },
    },
    "Home Appliances": {
      "Condition": { type: "dropdown", options: ["New", "Used"] },
      "Brand": { type: "text" },
      "Model": { type: "text" },
      "Energy Efficiency": { type: "dropdown", options: ["A++", "A+", "A", "B", "C"] },
      "Warranty": { type: "dropdown", options: ["Available", "Not Available"] },
      "Year of Manufacture": { type: "text" },
      "Power Consumption": { type: "text" },
      "Capacity": { type: "text" },
      "Dimensions": { type: "text" },
    },
    "Services": {
      "Service Type": { type: "text" },
      "Availability": { type: "dropdown", options: ["Weekdays", "Weekends", "Anytime"] },
      "Experience": { type: "text" },
      "Location": { type: "text" },
      "Description": { type: "text" },
      "Service Area": { type: "text" },
      "Customer Reviews": { type: "text" },
      "Pricing": { type: "text" },
    },
    "Others": {
      "Condition": { type: "dropdown", options: ["New", "Used"] },
      "Details": { type: "text" },
      "Additional Information": { type: "text" },
      "Custom Fields": { type: "text" },
    },
  };