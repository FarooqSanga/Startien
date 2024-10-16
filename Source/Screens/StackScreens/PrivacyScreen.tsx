import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PrivacyScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.content}>
        Welcome to Startien, your online shopping center for classified ads. This privacy policy explains how Startien collects, uses, and shares information when you use our app, located at <Text style={styles.link}>https://www.startien.com</Text>. We value your privacy and are committed to protecting your personal information.
      </Text>

      <Text style={styles.heading}>1. Information We Collect</Text>
      <Text style={styles.content}>
        When you use Startien, we collect the following types of information:
      </Text>

      <Text style={styles.subheading}>1.1 User Information</Text>
      <Text style={styles.content}>
        - Personal Information: We collect personal information when you create an account, including your name, email address, contact details, and password.
        - Profile Information: If you create a shop or post ads, we may collect details such as your shop name, bio, address, shop type, and contact information.
      </Text>

      <Text style={styles.subheading}>1.2 Ad Information</Text>
      <Text style={styles.content}>
        - Ads: We collect information about the ads you post, including titles, descriptions, images, pricing, and location.
        - Uploaded Images: Users can upload images related to their ads and shops. These images are stored securely and are publicly displayed to other users browsing ads.
      </Text>

      <Text style={styles.subheading}>1.3 Usage Data</Text>
      <Text style={styles.content}>
        - We collect information on how you interact with the app, such as browsing patterns, clicks, and features used.
      </Text>

      <Text style={styles.heading}>2. How We Use Your Information</Text>
      <Text style={styles.content}>
        We use your information to:
        - Create and manage your user account and classified ads.
        - Display your ads and shop details to other users.
        - Facilitate communication between buyers and sellers, such as chat and call functionalities.
        - Improve our app by analyzing user behavior and preferences.
      </Text>

      <Text style={styles.heading}>3. Data Sharing and Disclosure</Text>
      <Text style={styles.content}>
        We do not sell, rent, or trade your personal information. We may share your information with:
        - Other Users: Your shop details, ads, and contact information may be shared with other users who are interested in your listings.
        - Service Providers: We may share data with third-party service providers to help us operate the app (e.g., cloud storage for images).
        - Legal Obligations: We may disclose your information to comply with legal requirements, protect our rights, or respond to claims.
      </Text>

      <Text style={styles.heading}>4. Data Security</Text>
      <Text style={styles.content}>
        We are committed to keeping your data secure. All user information is stored in a secure database, and we use encryption and other security measures to protect your personal data. However, no system is 100% secure, and we cannot guarantee absolute security.
      </Text>

      <Text style={styles.heading}>5. User Rights</Text>
      <Text style={styles.content}>
        You have the right to:
        - Access and update your personal information through your account settings.
        - Delete your account, along with all associated data, by contacting us at support@startien.com.
        - Request a copy of the data we have about you.
      </Text>

      <Text style={styles.heading}>6. Changes to This Privacy Policy</Text>
      <Text style={styles.content}>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our app and updating the date of revision.
      </Text>

      <Text style={styles.heading}>7. Contact Us</Text>
      <Text style={styles.content}>
        If you have any questions or concerns about this Privacy Policy, please contact us at support@startien.com.
      </Text>
      <View style = {{height:100}}>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200ea',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  link: {
    color: '#6200ea',
    textDecorationLine: 'underline',
  },
});

export default PrivacyScreen;