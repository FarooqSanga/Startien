import React from 'react';
import MyStack from './Source/Navigation/StackNavigation';

const App: React.FC = () => {
  return <MyStack />;
};

export default App;


// import React from 'react';
// import type {PropsWithChildren} from 'react';
// // import { Provider } from 'react-redux';

// import 'react-native-gesture-handler';
// import {
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// // import MyStack from './Source/Navigation/tabsNavigation';
// // import store from './Source/Redux';
// import TabNavigation from './Source/Navigation/TabNavigation';
// import MyStack from './Source/Navigation/StackNavigation';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): React.JSX.Element {
//   // const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View>
//       <Text>New App</Text>
//     </View>
    
//   );
// }

// function App(): React.JSX.Element {
//   // const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     // backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//       <TabNavigation />

//   );
// }
// export default App;