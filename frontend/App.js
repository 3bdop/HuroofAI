import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react'
import RootNav from './navigation/RootNav';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

// const copyAudioFiles = async () => {
//   const audioFiles = [
//     { source: require('../frontend/assets/audio/siin.mp3'), target: 'siinOut.mp3' },
//     { source: require('../frontend/assets/audio/shiin.mp3'), target: 'shiinOut.mp3' },
//     { source: require('../frontend/assets/audio/ra.mp3'), target: 'raOut.mp3' },
//     { source: require('../frontend/assets/audio/kaf.mp3'), target: 'kafOut.mp3' },
//   ];

//   for (const file of audioFiles) {
//     const targetDir = `${FileSystem.documentDirectory}backend/app/uploads/`;
//     const targetPath = `${targetDir}${file.target}`;

//     try {
//       // Create the target directory if it doesn't exist
//       await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true });

//       // Check if the file already exists
//       const fileInfo = await FileSystem.getInfoAsync(targetPath);
//       if (!fileInfo.exists) {
//         // Copy the bundled file to the target location
//         const asset = Asset.fromModule(file.source);
//         await asset.downloadAsync(); // Ensure the asset is downloaded
//         await FileSystem.copyAsync({
//           from: asset.localUri,
//           to: targetPath,
//         });
//         console.log(`Copied file: ${file.target}`);
//       } else {
//         console.log(`File already exists: ${file.target}`);
//       }
//     } catch (error) {
//       console.error(`Error copying file ${file.target}:`, error);
//     }
//   }
// };


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [filesReady, setFilesReady] = useState(false);

  useEffect(() => {
    // Simulate loading process
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the time as needed
  }, []);
  // Run the function when the app launches
  // useEffect(() => {
  //   copyAudioFiles();
  // }, []);
  // if (!filesReady) {
  //   // Show a loading indicator while files are being created
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <ActivityIndicator size="large" color="snow" />
  //     </SafeAreaView>
  //   );
  // }
  return (
    <RootNav />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
