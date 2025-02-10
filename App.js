import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList, TextInput, Animated } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { getCricScores } from './src/api/services/cricscore';
import { testData } from './src/appconstants/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const App = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useTestData, setUseTestData] = useState(true);
  const [countryInput, setCountryInput] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [averageScore, setAverageScore] = useState(null);
  const [animations, setAnimations] = useState([]);

  // Fetch cricket scores
  useEffect(() => {
    const fetchScores = async () => {
      try {
        if (useTestData) {
          setScores(testData);
        } else {
          const data = await getCricScores();
          setScores(data);
        }
      } catch (err) {
        setError('Failed to fetch cricket scores.');
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [useTestData]);

  // Setup animations for each score
  useEffect(() => {
    const initialAnimations = scores.map(() => new Animated.Value(0));
    setAnimations(initialAnimations);
  }, [scores]);

  const startAnimation = (index, score) => {
    Animated.timing(animations[index], {
      toValue: score,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const handleCountryInputChange = (input) => {
    setCountryInput(input);

    const countryScores = scores.filter(
      (score) => score[0].toLowerCase() === input.toLowerCase()
    );

    if (countryScores.length > 0) {
      setSelectedCountry(countryScores[0]);
      setAverageScore(calculateAverageScore(countryScores));
    } else {
      setSelectedCountry(null);
      setAverageScore(null);
    }
  };

  // Calculate average score for selected country
  const calculateAverageScore = (countryScores) => {
    const totalScore = countryScores.reduce((acc, curr) => acc + curr[1], 0);
    return totalScore / countryScores.length;
  };

  const handleRadioButtonChange = (isTestData) => {
    setUseTestData(isTestData);
    setCountryInput('');
    setSelectedCountry(null);
    setAverageScore(null);
  };

  const shouldDisplayFullList = !countryInput || !selectedCountry;

  return (
    <View style={styles.container}>
      <View style={styles.radioContainer}>
        <RadioButton
          status={useTestData ? 'checked' : 'unchecked'}
          onPress={() => handleRadioButtonChange(true)}
        />
        <Text style={styles.radioButtonLabel}>Test Dataaaa</Text>
        <RadioButton
          status={!useTestData ? 'checked' : 'unchecked'}
          onPress={() => handleRadioButtonChange(false)}
        />
        <Text style={styles.radioButtonLabel}>Server Data</Text>
      </View>

      {/* Input for country name */}
      <TextInput
        style={styles.input}
        placeholder="Enter Country Name"
        placeholderTextColor="gray"
        value={countryInput}
        onChangeText={handleCountryInputChange}
      />

      {/* If no country is selected, show the list of scores */}
      {shouldDisplayFullList ? (
        <FlatList
          data={scores}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.scoreRow}>
              <Text style={styles.country}>{item[0]}</Text>
              <Text style={styles.score}>{item[1]}</Text>
              <Animated.View
                style={{
                  width: animations[index],
                  height: 10,
                  backgroundColor: 'blue',
                  marginTop: 5,
                }}
              />
              {animations[index] && animations[index]._value === 0 && startAnimation(index, item[1])}
            </View>
          )}
        />
      ) : (
        // Show the selected country's average score and blue bar
        selectedCountry && (
          <View style={[styles.scoreRow, screenHeight > 600 ? styles.rowLayout : {}]}>
            <Text style={[styles.country, screenHeight > 600 ? styles.countryLargeScreen : {}]}>
              {selectedCountry[0]}
            </Text>
            <Text style={[styles.score, { paddingBottom: 5, fontSize: 11 }]}>
              Average Score: {averageScore ? averageScore.toFixed(2) : 'N/A'}
            </Text>
            {/* Blue bar proportional to the average score */}
            <View
              style={{
                width: averageScore ? averageScore * 2 : 0, // Scale width based on average score
                height: 10,
                backgroundColor: 'blue',
                marginTop: 3,
              }}
            />
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radioButtonLabel: {
    color: 'white',
    fontSize: 12,
    alignItems: 'center',
    alignSelf: 'center',
  },
  scoreRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginVertical: 8,
  },
  country: {
    fontWeight: 'bold',
    fontSize: 19,
    color: 'white',
  },
  countryLargeScreen: {
    fontWeight: 'bold',
    fontSize: 11,
    color: 'white',
  },
  score: {
    fontSize: 16,
    color: 'white',
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    borderColor: 'white',
    borderWidth: 1,
    padding: 8,
    marginBottom: 20,
    color: 'white',
    fontSize: 16,
  },
  rowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default App;
