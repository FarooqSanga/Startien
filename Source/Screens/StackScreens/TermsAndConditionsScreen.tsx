import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TermsAndConditionsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>

      <Text style={styles.heading}>1. Acceptance of Terms</Text>
      <Text style={styles.content}>
        By using the Startien app, you agree to the following terms and conditions. These terms apply to all users of the app, including those who create accounts, post ads, or browse ads. If you do not agree to these terms, please discontinue the use of the app.
      </Text>

      <Text style={styles.heading}>2. User Accounts</Text>
      <Text style={styles.content}>
        To use certain features of the app, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials, and you agree to provide accurate and complete information. Startien reserves the right to terminate accounts at our discretion.
      </Text>

      <Text style={styles.heading}>3. Classified Ads</Text>
      <Text style={styles.content}>
        Users are allowed to post classified ads for their products or services. By posting an ad, you agree that:
        - You are solely responsible for the content of the ad, including any text, images, or pricing information.
        - The ad must comply with all applicable laws and regulations.
        - You grant Startien the right to display and promote your ad within the app.
      </Text>

      <Text style={styles.heading}>4. User Conduct</Text>
      <Text style={styles.content}>
        You agree not to use Startien to post any harmful, misleading, or unlawful content. This includes but is not limited to:
        - Ads that are fraudulent or deceptive.
        - Content that infringes upon the intellectual property rights of others.
        - Posts containing malware, spam, or harmful links.
      </Text>

      <Text style={styles.heading}>5. Data Collection and Privacy</Text>
      <Text style={styles.content}>
        Startien collects personal information and user-generated content as part of our service. By using the app, you agree to the collection and use of your data as described in our Privacy Policy. Startien will not sell or share your personal data with third parties, except as required by law.
      </Text>

      <Text style={styles.heading}>6. Liability</Text>
      <Text style={styles.content}>
        Startien is not liable for any loss or damage that may occur as a result of using our platform, including but not limited to:
        - Loss of data or information.
        - Issues related to buyer-seller transactions.
        - Unlawful behavior by other users.
        Users are responsible for their interactions within the app, including transactions, communications, and any agreements made with other users.
      </Text>

      <Text style={styles.heading}>7. Termination of Service</Text>
      <Text style={styles.content}>
        Startien reserves the right to terminate your access to the app at any time, for any reason, including violation of these terms. Upon termination, you will no longer be able to access your account or post ads.
      </Text>

      <Text style={styles.heading}>8. Changes to Terms</Text>
      <Text style={styles.content}>
        We may modify these terms and conditions at any time. Users will be notified of any changes through updates in the app. Continued use of the app after changes are made constitutes acceptance of the updated terms.
      </Text>

      <Text style={styles.heading}>9. Governing Law</Text>
      <Text style={styles.content}>
        These terms are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising out of the use of this app will be resolved in the courts of [Your Jurisdiction].
      </Text>

      <Text style={styles.heading}>10. Contact Information</Text>
      <Text style={styles.content}>
        If you have any questions or concerns regarding these terms, please contact us at support@startien.com.
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
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default TermsAndConditionsScreen;