// src/screens/OnboardingQuestionsScreen.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import useUser from '../hooks/userHooks';

const OnboardingQuestionsScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Record<string, any[]>>({});
  const [currentCategory, setCurrentCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [questionChoices, setQuestionChoices] = useState<
    Record<string, string[]>
  >({});
  const {BASE_URL, saveOnboardingResponses} = useUser();
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(false);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let questionsArray = [];
      try {
        console.log(`Requesting: ${BASE_URL}/forms-questions`);
        const questionsResponse = await axios.get(
          `${BASE_URL}/forms-questions`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );

        console.log('Questions response status:', questionsResponse.status);
        console.log('Questions response type:', typeof questionsResponse.data);

        // Handle both array and single object responses
        if (Array.isArray(questionsResponse.data)) {
          questionsArray = questionsResponse.data;
          console.log(`Found ${questionsArray.length} questions in array`);
        } else if (questionsResponse.data && questionsResponse.data.id) {
          questionsArray = [questionsResponse.data];
          console.log('Found a single question, wrapped in array');
        } else {
          throw new Error('Invalid question data format');
        }
      } catch (questionsError) {
        console.error('Error fetching questions:', questionsError);
        setError(true);
        setLoading(false);
        return; // Exit early - can't continue without questions
      }

      const choicesMap: Record<string, string[]> = {};
      try {
        // Use the /choices endpoint to get predefined choices
        console.log(`Requesting: ${BASE_URL}/forms-answers/choices`);
        const choicesResponse = await axios.get(
          `${BASE_URL}/forms-answers/choices`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );

        // Add these detailed debug logs
        console.log('Choices response status:', choicesResponse.status);
        console.log('Response data type:', typeof choicesResponse.data);

        // Handle the case when the response is an empty string
        if (choicesResponse.data === '') {
          console.log('Empty response from server - no choices available');
        }
        // Handle array data
        else if (Array.isArray(choicesResponse.data)) {
          console.log('Number of choices found:', choicesResponse.data.length);

          choicesResponse.data.forEach((choice) => {
            if (!choicesMap[choice.question_id]) {
              choicesMap[choice.question_id] = [];
            }
            choicesMap[choice.question_id].push(choice.answer_text);
          });
        }
        // Handle if the server sends a JSON string that needs parsing
        else if (
          typeof choicesResponse.data === 'string' &&
          choicesResponse.data !== ''
        ) {
          try {
            const parsedData = JSON.parse(choicesResponse.data);
            if (Array.isArray(parsedData)) {
              parsedData.forEach((choice) => {
                if (!choicesMap[choice.question_id]) {
                  choicesMap[choice.question_id] = [];
                }
                choicesMap[choice.question_id].push(choice.answer_text);
              });
            }
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
          }
        }
      } catch (choicesError) {
        console.error('Error fetching choices:', choicesError);
      }

      // Group questions by category
      const questionsByCategory = {};
      questionsArray.forEach((q) => {
        if (!q || !q.category) return;
        if (!questionsByCategory[q.category]) {
          questionsByCategory[q.category] = [];
        }
        questionsByCategory[q.category].push(q);
      });

      const categoryList = Object.keys(questionsByCategory);
      if (categoryList.length === 0) {
        throw new Error('No question categories found');
      }

      // Update state all at once
      setQuestionChoices(choicesMap);
      setCategories(categoryList);
      setCurrentCategory(categoryList[0]);
      setQuestions(questionsByCategory);
    } catch (error) {
      console.error('Overall error in fetchQuestions:', error);
      setError(true);
      Alert.alert('Error', 'Failed to load questions. Please try again.', [
        {
          text: 'Go Back',
          onPress: () => navigation.navigate('OnboardingWelcome'),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Format responses for API
      const formattedResponses = Object.keys(responses).map((id) => ({
        questionId: parseInt(id),
        answer: responses[id],
      }));

      // Save responses using your custom hook
      const token = (await AsyncStorage.getItem('token')) || '';
      const result = await saveOnboardingResponses(formattedResponses, token);

      if (result.ok) {
        navigation.navigate('OnboardingComplete');
      } else {
        Alert.alert('Error', result.data?.error || 'Failed to save responses');
      }
    } catch (error) {
      console.error('Error submitting responses:', error);
      Alert.alert('Error', 'Failed to submit responses');
    } finally {
      setLoading(false);
    }
  };

  // Add safety checks in your render method
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00D0FF" />
      </SafeAreaView>
    );
  }

  if (error || !currentCategory || Object.keys(questions).length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          Something went wrong loading the questions.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('OnboardingWelcome')}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Safe to continue with rendering questions
  const currentQuestions = questions[currentCategory] || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{currentCategory}</Text>
        {currentQuestions.map((q) => (
          <View key={q.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{q.question}</Text>

            {/* Add this debug info */}
            <Text style={{color: 'red', fontSize: 12}}>
              ID: {q.id} | Choices:{' '}
              {questionChoices[q.id] ? questionChoices[q.id].length : 'None'}
            </Text>

            <View style={styles.answerContainer}>
              {questionChoices[q.id] && questionChoices[q.id].length > 0 ? (
                // Render choices
                questionChoices[q.id].map((choice, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.answerButton,
                      responses[q.id] === choice && styles.selectedButton,
                    ]}
                    onPress={() => handleAnswer(q.id, choice)}
                  >
                    <Text style={styles.answerText}>{choice}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                // No choices available
                <TouchableOpacity
                  style={styles.answerButton}
                  onPress={() => {}}
                >
                  <Text style={styles.answerText}>No choices available</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
        <View style={styles.navigationButtons}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                currentCategory === category && styles.activeCategoryButton,
              ]}
              onPress={() => setCurrentCategory(category)}
            >
              <Text style={styles.categoryText}>{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Complete</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00D0FF',
    marginBottom: 20,
  },
  questionContainer: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  questionText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 15,
  },
  answerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 10,
  },
  answerButton: {
    backgroundColor: '#414141',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    margin: 5,
  },
  selectedButton: {
    backgroundColor: '#00D0FF',
  },
  answerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  categoryButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#414141',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeCategoryButton: {
    backgroundColor: '#00D0FF',
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#00D0FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00D0FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OnboardingQuestionsScreen;
