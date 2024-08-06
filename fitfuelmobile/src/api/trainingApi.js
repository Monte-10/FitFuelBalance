import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchTrainingDetails = async (trainingId) => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('AuthToken not found');
    }

    const response = await fetch(`http://10.0.2.2:8000/sport/trainings/${trainingId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error fetching training details:', error);
    throw error; // Propagar el error para manejarlo en el componente llamador
  }
};
