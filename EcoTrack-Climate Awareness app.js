const ComponentFunction = function() {
  // @section:imports @depends:[]
  const React = require('react');
  const { useState, useEffect, useContext, useMemo, useCallback } = React;
  const { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, Linking, Alert } = require('react-native');
  const { MaterialIcons } = require('@expo/vector-icons');
  const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
  const { useSafeAreaInsets } = require('react-native-safe-area-context');
  const { useShare } = require('platform-hooks');
  // @end:imports

  // @section:constants @depends:[]
  var TAB_MENU_HEIGHT = Platform.OS === 'web' ? 56 : 49;
  var SCROLL_EXTRA_PADDING = 16;
  var WEB_TAB_MENU_PADDING = 90;
  var FAB_SPACING = 16;
  // @end:constants

  // @section:theme @depends:[]
  var storageStrategy = 'all-local';
  var primaryColor = '#10B981';
  var accentColor = '#059669';
  var backgroundColor = '#F8FAFC';
  var cardColor = '#FFFFFF';
  var textPrimary = '#1F2937';
  var textSecondary = '#6B7280';
  var designStyle = 'modern';
  // @end:theme

  // @section:navigation-setup @depends:[]
  var Tab = createBottomTabNavigator();
  // @end:navigation-setup

  // @section:ThemeContext @depends:[theme]
  var ThemeContext = React.createContext({
    theme: { colors: { primary: primaryColor, accent: accentColor, background: backgroundColor, card: cardColor, textPrimary: textPrimary, textSecondary: textSecondary, border: '#E5E7EB', success: '#10B981', error: '#EF4444', warning: '#F59E0B' } },
    darkMode: false,
    toggleDarkMode: function() {},
    designStyle: designStyle,
  });
  var ThemeProvider = function(props) {
    var darkModeState = useState(false);
    var darkMode = darkModeState[0];
    var setDarkMode = darkModeState[1];
    var lightTheme = useMemo(function() {
      return {
        colors: {
          primary: primaryColor,
          accent: accentColor,
          background: backgroundColor,
          card: cardColor,
          textPrimary: textPrimary,
          textSecondary: textSecondary,
          border: '#E5E7EB',
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B'
        }
      };
    }, []);
    var darkTheme = useMemo(function() {
      return {
        colors: {
          primary: primaryColor,
          accent: accentColor,
          background: '#1F2937',
          card: '#374151',
          textPrimary: '#F9FAFB',
          textSecondary: '#D1D5DB',
          border: '#4B5563',
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B'
        }
      };
    }, []);
    var theme = darkMode ? darkTheme : lightTheme;
    var toggleDarkMode = useCallback(function() {
      setDarkMode(function(prev) { return !prev; });
    }, []);
    var value = useMemo(function() {
      return { theme: theme, darkMode: darkMode, toggleDarkMode: toggleDarkMode, designStyle: designStyle };
    }, [theme, darkMode, toggleDarkMode]);
    return React.createElement(ThemeContext.Provider, { testID: 'Provider-1', value: value }, props.children);
  };
  var useTheme = function() { return useContext(ThemeContext); };
  // @end:ThemeContext

  // @section:data @depends:[]
  var ecoScoreQuestions = [
    {
      question: 'Do you switch off lights when not needed?',
      correct: true
    },
    {
      question: 'Do you use reusable water bottles instead of plastic ones?',
      correct: true
    },
    {
      question: 'Do you walk, bike, or use public transport when possible?',
      correct: true
    },
    {
      question: 'Do you avoid single-use plastic bags?',
      correct: true
    },
    {
      question:'Do you conserve water while brushing?',
      correct: true
    }
  ];

  var quizQuestions = [
    {
      question: 'What is the main cause of climate change?',
      options: ['Solar radiation', 'Greenhouse gas emissions', 'Ocean currents'],
      correct: 1
    },
    {
      question: 'Which gas contributes most to global warming?',
      options: ['Oxygen', 'Carbon dioxide', 'Nitrogen'],
      correct: 1
    },
    {
      question: 'What percentage of Earth\'s surface is covered by oceans?',
      options: ['50%', '65%', '71%'],
      correct: 2
    },
    {
      question: 'Which renewable energy source is most widely used?',
      options: ['Solar', 'Wind', 'Hydroelectric'],
      correct: 2
    },
    {
      question: 'How much has global temperature increased since 1880?',
      options: ['0.5°C', '1.1°C', '2.0°C'],
      correct: 1
    },
    {
      question: 'What is the Paris Agreement target for temperature rise?',
      options: ['1.5°C', '2°C', '3°C'],
      correct: 0
    },
    {
      question: 'Which sector produces the most greenhouse gases?',
      options: ['Transportation', 'Agriculture', 'Energy production'],
      correct: 2
    },
    {
      question: 'How long does CO2 stay in the atmosphere?',
      options: ['10 years', '50 years', '300-1000 years'],
      correct: 2
    },
    {
      question: 'What is the largest source of methane emissions?',
      options: ['Cars', 'Livestock', 'Factories'],
      correct: 1
    },
    {
      question: 'By what year do scientists say we need to reach net zero?',
      options: ['2030', '2050', '2070'],
      correct: 1
    }
  ];

  var climateFacts = [
    {
      title: 'Ocean Warming',
      description: 'Ocean temperatures have risen by 0.6°C since 1969. Warmer oceans fuel stronger hurricanes and rising sea levels.',
      url: 'https://www.noaa.gov/news/2020-was-earth-s-2nd-hottest-year-just-behind-2016'
    },
    {
      title: 'Arctic Ice Loss',
      description: 'Arctic sea ice is shrinking by 13% per decade. This creates a feedback loop that accelerates warming.',
      url: 'https://climate.nasa.gov/evidence/'
    },
    {
      title: 'Species Migration',
      description: 'Climate change forces 1,700 species to migrate to new habitats. Many face extinction if they cannot adapt.',
      url: 'https://www.worldwildlife.org/threats/climate-change'
    },
    {
      title: 'Renewable Growth',
      description: 'Renewable energy capacity grew by 260GW in 2020. Solar and wind now provide the cheapest electricity.',
      url: 'https://www.irena.org/newsroom/pressreleases/2021/Apr/World-Adds-Record-New-Renewable-Energy-Capacity-in-2020'
    },
    {
      title: 'Forest Carbon Storage',
      description: 'Forests store 861 billion tons of carbon. Protecting them is crucial for climate stability and biodiversity.',
      url: 'https://www.fao.org/state-of-forests/en/'
    }
  ];

  var ecoTips = [
    'Switch to LED light bulbs - they use 75% less energy than regular bulbs',
    'Take shorter showers - save water and the energy needed to heat it',
    'Unplug electronics when not in use - they draw power even when off',
    'Choose reusable bags and bottles - reduce single-use plastic waste',
    'Eat less meat one day per week - livestock farming creates emissions',
    'Walk or bike for short trips - reduce transportation emissions'
  ];
  // @end:data

  // @section:share-hook @depends:[imports]
  var shareHook = useShare();
  var share = shareHook.share;
  // @end:share-hook

  // @section:HomeScreen @depends:[ThemeContext,styles]
  var HomeScreen = function() {
    var themeContext = useTheme();
    var theme = themeContext.theme;
    var insets = useSafeAreaInsets();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);
    var scrollTopPadding = insets.top;

    return React.createElement(ScrollView, { testID: 'ScrollView-1', style: { flex: 1, backgroundColor: theme.colors.background },
      contentContainerStyle: { paddingTop: scrollTopPadding, paddingBottom: scrollBottomPadding },
      componentId: 'home-scroll'
    },
      React.createElement(View, { testID: 'View-1', style: styles.homeContainer, componentId: 'home-container' },
        React.createElement(View, { testID: 'View-2', style: styles.headerSection, componentId: 'home-header' },
          React.createElement(Text, { testID: 'Text-1', style: [styles.appTitle, { color: theme.colors.textPrimary }], componentId: 'home-title' }, 'EcoTrack 🌍'),
          React.createElement(Text, { testID: 'Text-2', style: [styles.tagline, { color: theme.colors.textSecondary }], componentId: 'home-tagline' }, 'Track your habits. Save the planet.')
        ),
        React.createElement(View, { testID: 'View-3', style: styles.buttonGrid, componentId: 'home-button-grid' },
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-1', style: [styles.homeButton, { backgroundColor: theme.colors.primary }],
            componentId: 'home-button-eco-score'
          },
            React.createElement(Text, { testID: 'Text-3', style: styles.buttonEmoji, componentId: 'home-emoji-1' }, '⭐'),
            React.createElement(Text, { testID: 'Text-4', style: styles.buttonText, componentId: 'home-text-1' }, 'Eco Score')
          ),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-2', style: [styles.homeButton, { backgroundColor: theme.colors.accent }],
            componentId: 'home-button-quiz'
          },
            React.createElement(Text, { testID: 'Text-5', style: styles.buttonEmoji, componentId: 'home-emoji-2' }, '🎮'),
            React.createElement(Text, { testID: 'Text-6', style: styles.buttonText, componentId: 'home-text-2' }, 'Quiz')
          ),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-3', style: [styles.homeButton, { backgroundColor: theme.colors.primary }],
            componentId: 'home-button-facts'
          },
            React.createElement(Text, { testID: 'Text-7', style: styles.buttonEmoji, componentId: 'home-emoji-3' }, '💡'),
            React.createElement(Text, { testID: 'Text-8', style: styles.buttonText, componentId: 'home-text-3' }, 'Climate Facts')
          ),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-4', style: [styles.homeButton, { backgroundColor: theme.colors.accent }],
            componentId: 'home-button-tips'
          },
            React.createElement(Text, { testID: 'Text-9', style: styles.buttonEmoji, componentId: 'home-emoji-4' }, '🌱'),
            React.createElement(Text, { testID: 'Text-10', style: styles.buttonText, componentId: 'home-text-4' }, 'Tips')
          )
        )
      )
    );
  };
  // @end:HomeScreen

  // @section:EcoScoreScreen @depends:[ThemeContext,styles]
  var EcoScoreScreen = function() {
    var themeContext = useTheme();
    var theme = themeContext.theme;
    var insets = useSafeAreaInsets();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);
    var scrollTopPadding = insets.top;

    var answersState = useState({});
    var answers = answersState[0];
    var setAnswers = answersState[1];
    var showResultState = useState(false);
    var showResult = showResultState[0];
    var setShowResult = showResultState[1];

    var handleAnswer = function(questionIndex, answer) {
      setAnswers(function(prev) {
        var newAnswers = Object.assign({}, prev);
        newAnswers[questionIndex] = answer;
        return newAnswers;
      });
    };

    var calculateScore = function() {
      var score = 0;
      ecoScoreQuestions.forEach(function(question, index) {
        if (answers[index] === true) {
          score += 1;
        }
      });
      return score;
    };

    var getScoreMessage = function(score) {
      if (score >=4) return { emoji: '🌳', title: 'Eco Champ', message: 'Amazing! You\'re helping the planet.' };
      if (score >=3) return { emoji: '🌱', title: 'Eco Friendly', message: 'Good job! Keep improving.' };
      if (score >=2) return { emoji: '🌿', title: 'Beginner', message: 'You can do better!' };
      return { emoji: '😅', title: 'Needs Improvement', message: 'Start small, make a change.' };
    };

    var handleCheckScore = function() {
      if (Object.keys(answers).length === ecoScoreQuestions.length) {
        setShowResult(true);
      } else {
        if (Platform.OS === 'web') {
          window.alert('Please answer all questions first');
        } else {
          Alert.alert('Notice', 'Please answer all questions first');
        }
      }
    };

    var handleShare = function() {
      var score = calculateScore();
      var result = getScoreMessage(score);
      share({ 
        message: 'I scored ' + score + ' /5 on EcoTrack! ' + result.emoji + ' ' + result.title + ' - ' + result.message + ' Join me in taking climate action!'
      }).then(function(shareResult) {
        if (shareResult.error) {
          if (Platform.OS === 'web') {
            window.alert('Share failed');
          } else {
            Alert.alert('Error', 'Share failed');
          }
        }
      });
    };

    var score = calculateScore();
    var result = getScoreMessage(score);

    return React.createElement(ScrollView, { testID: 'ScrollView-2', style: { flex: 1, backgroundColor: theme.colors.background },
      contentContainerStyle: { paddingTop: scrollTopPadding, paddingBottom: scrollBottomPadding },
      componentId: 'eco-score-scroll'
    },
      React.createElement(View, { testID: 'View-4', style: styles.screenContainer, componentId: 'eco-score-container' },
        React.createElement(Text, { testID: 'Text-11', style: [styles.screenTitle, { color: theme.colors.textPrimary }], componentId: 'eco-score-title' }, 'Eco Score ⭐'),
        React.createElement(Text, { testID: 'Text-12', style: [styles.subtitle, { color: theme.colors.textSecondary }], componentId: 'eco-score-subtitle' }, 'Answer honestly about your daily habits'),
        
        ecoScoreQuestions.map(function(question, index) {
          return React.createElement(View, { testID: 'View-5', key: String(index), style: [styles.questionCard, { backgroundColor: theme.colors.card }], componentId: 'eco-question-' + index },
            React.createElement(Text, { testID: 'Text-13', style: [styles.questionText, { color: theme.colors.textPrimary }], componentId: 'eco-question-text-' + index }, question.question),
            React.createElement(View, { testID: 'View-6', style: styles.answerButtons, componentId: 'eco-answers-' + index },
              React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-5', style: [styles.answerButton, { backgroundColor: answers[index] === true ? theme.colors.success : theme.colors.border }],
                onPress: function() { handleAnswer(index, true); },
                componentId: 'eco-answer-yes-' + index
              },
                React.createElement(Text, { testID: 'Text-14', style: [styles.answerText, { color: answers[index] === true ? '#FFFFFF' : theme.colors.textSecondary }], componentId: 'eco-yes-text-' + index }, 'Yes')
              ),
              React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-6', style: [styles.answerButton, { backgroundColor: answers[index] === false ? theme.colors.error : theme.colors.border }],
                onPress: function() { handleAnswer(index, false); },
                componentId: 'eco-answer-no-' + index
              },
                React.createElement(Text, { testID: 'Text-15', style: [styles.answerText, { color: answers[index] === false ? '#FFFFFF' : theme.colors.textSecondary }], componentId: 'eco-no-text-' + index }, 'No')
              )
            )
          );
        }),

        React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-7', style: [styles.checkScoreButton, { backgroundColor: theme.colors.primary }],
          onPress: handleCheckScore,
          componentId: 'eco-check-button'
        },
          React.createElement(Text, { testID: 'Text-16', style: styles.checkScoreText, componentId: 'eco-check-text' }, 'Check My Eco Score')
        ),

        showResult ? React.createElement(View, { testID: 'View-7', style: [styles.resultCard, { backgroundColor: theme.colors.card }], componentId: 'eco-result' },
          React.createElement(Text, { testID: 'Text-17', style: styles.resultEmoji, componentId: 'eco-result-emoji' }, result.emoji),
          React.createElement(Text, { testID: 'Text-18', style: [styles.resultTitle, { color: theme.colors.textPrimary }], componentId: 'eco-result-title' }, result.title),
          React.createElement(Text, { testID: 'Text-19', style: [styles.resultMessage, { color: theme.colors.textSecondary }], componentId: 'eco-result-message' }, result.message),
          React.createElement(Text, { testID: 'Text-20', style: [styles.scoreText, { color: theme.colors.primary }], componentId: 'eco-result-score' }, 'Score: ' + score + '/3'),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-8', style: [styles.shareButton, { backgroundColor: theme.colors.accent }],
            onPress: handleShare,
            componentId: 'eco-share-button'
          },
            React.createElement(Text, { testID: 'Text-21', style: styles.shareButtonText, componentId: 'eco-share-text' }, 'Share Result 📤')
          )
        ) : null
      )
    );
  };
  // @end:EcoScoreScreen

  // @section:QuizScreen @depends:[ThemeContext,styles]
  var QuizScreen = function() {
    var themeContext = useTheme();
    var theme = themeContext.theme;
    var insets = useSafeAreaInsets();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);
    var scrollTopPadding = insets.top;

    var currentQuestionState = useState(0);
    var currentQuestion = currentQuestionState[0];
    var setCurrentQuestion = currentQuestionState[1];
    var shuffledQuestionsState = useState([]);
    var shuffledQuestions = shuffledQuestionsState[0];
    var setShuffledQuestions = shuffledQuestionsState[1];
    var selectedAnswerState = useState(null);
    var selectedAnswer = selectedAnswerState[0];
    var setSelectedAnswer = selectedAnswerState[1];
    var showFeedbackState = useState(false);
    var showFeedback = showFeedbackState[0];
    var setShowFeedback = showFeedbackState[1];
    var scoreState = useState(0);
    var score = scoreState[0];
    var setScore = scoreState[1];
    var quizCompleteState = useState(false);
    var quizComplete = quizCompleteState[0];
    var setQuizComplete = quizCompleteState[1];

    var shuffleArray = function(array) {
      var shuffled = array.slice();
      for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
      }
      return shuffled;
    };

    useEffect(function() {
      setShuffledQuestions(shuffleArray(quizQuestions));
    }, []);

    var handleAnswerSelect = function(answerIndex) {
      setSelectedAnswer(answerIndex);
      setShowFeedback(true);
      
      var isCorrect = answerIndex === shuffledQuestions[currentQuestion].correct;
      if (isCorrect) {
        setScore(function(prev) { return prev + 1; });
      }
    };

    var handleNextQuestion = function() {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(function(prev) { return prev + 1; });
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setQuizComplete(true);
      }
    };

    var resetQuiz = function() {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setScore(0);
      setQuizComplete(false);
      setShuffledQuestions(shuffleArray(quizQuestions));
    };

    if (shuffledQuestions.length === 0) {
      return React.createElement(View, { testID: 'View-8', style: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }, componentId: 'quiz-loading' },
        React.createElement(Text, { testID: 'Text-22', style: { color: theme.colors.textPrimary }, componentId: 'quiz-loading-text' }, 'Loading quiz...')
      );
    }

    if (quizComplete) {
      return React.createElement(ScrollView, { testID: 'ScrollView-3', style: { flex: 1, backgroundColor: theme.colors.background },
        contentContainerStyle: { paddingTop: scrollTopPadding, paddingBottom: scrollBottomPadding },
        componentId: 'quiz-complete-scroll'
      },
        React.createElement(View, { testID: 'View-9', style: styles.screenContainer, componentId: 'quiz-complete-container' },
          React.createElement(Text, { testID: 'Text-23', style: styles.completionEmoji, componentId: 'quiz-complete-emoji' }, '🎉'),
          React.createElement(Text, { testID: 'Text-24', style: [styles.completionTitle, { color: theme.colors.textPrimary }], componentId: 'quiz-complete-title' }, 'Quiz Complete!'),
          React.createElement(Text, { testID: 'Text-25', style: [styles.completionScore, { color: theme.colors.primary }], componentId: 'quiz-complete-score' }, 'Final Score: ' + score + '/' + shuffledQuestions.length),
          React.createElement(Text, { testID: 'Text-26', style: [styles.completionMessage, { color: theme.colors.textSecondary }], componentId: 'quiz-complete-message' }, 
            score >= 8 ? 'Excellent! You\'re a climate expert!' :
            score >= 6 ? 'Great job! You know a lot about climate.' :
            score >= 4 ? 'Good work! Keep learning about climate.' :
            'Keep studying! Every bit of knowledge helps.'
          ),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-9', style: [styles.retryButton, { backgroundColor: theme.colors.primary }],
            onPress: resetQuiz,
            componentId: 'quiz-retry-button'
          },
            React.createElement(Text, { testID: 'Text-27', style: styles.retryButtonText, componentId: 'quiz-retry-text' }, 'Take Quiz Again')
          )
        )
      );
    }

    var question = shuffledQuestions[currentQuestion];
    var isCorrect = selectedAnswer === question.correct;

    return React.createElement(ScrollView, { testID: 'ScrollView-4', style: { flex: 1, backgroundColor: theme.colors.background },
      contentContainerStyle: { paddingTop: scrollTopPadding, paddingBottom: scrollBottomPadding },
      componentId: 'quiz-scroll'
    },
      React.createElement(View, { testID: 'View-10', style: styles.screenContainer, componentId: 'quiz-container' },
        React.createElement(View, { testID: 'View-11', style: styles.quizHeader, componentId: 'quiz-header' },
          React.createElement(Text, { testID: 'Text-28', style: [styles.screenTitle, { color: theme.colors.textPrimary }], componentId: 'quiz-title' }, 'Climate Quiz 🎮'),
          React.createElement(Text, { testID: 'Text-29', style: [styles.questionCounter, { color: theme.colors.textSecondary }], componentId: 'quiz-counter' }, 
            'Question ' + (currentQuestion + 1) + ' of ' + shuffledQuestions.length
          )
        ),
        
        React.createElement(View, { testID: 'View-12', style: [styles.questionCard, { backgroundColor: theme.colors.card }], componentId: 'quiz-question-card' },
          React.createElement(Text, { testID: 'Text-30', style: [styles.questionText, { color: theme.colors.textPrimary }], componentId: 'quiz-question-text' }, question.question),
          
          question.options.map(function(option, index) {
            var isSelected = selectedAnswer === index;
            var isCorrectAnswer = index === question.correct;
            var buttonStyle = [styles.optionButton];
            var textStyle = [styles.optionText];
            
            if (showFeedback) {
              if (isSelected && isCorrectAnswer) {
                buttonStyle.push({ backgroundColor: theme.colors.success });
                textStyle.push({ color: '#FFFFFF' });
              } else if (isSelected && !isCorrectAnswer) {
                buttonStyle.push({ backgroundColor: theme.colors.error });
                textStyle.push({ color: '#FFFFFF' });
              } else if (isCorrectAnswer) {
                buttonStyle.push({ backgroundColor: theme.colors.success });
                textStyle.push({ color: '#FFFFFF' });
              } else {
                buttonStyle.push({ backgroundColor: theme.colors.border });
                textStyle.push({ color: theme.colors.textSecondary });
              }
            } else {
              if (isSelected) {
                buttonStyle.push({ backgroundColor: theme.colors.primary });
                textStyle.push({ color: '#FFFFFF' });
              } else {
                buttonStyle.push({ backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border });
                textStyle.push({ color: theme.colors.textPrimary });
              }
            }

            return React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-10', key: String(index),
              style: buttonStyle,
              onPress: showFeedback ? null : function() { handleAnswerSelect(index); },
              disabled: showFeedback,
              componentId: 'quiz-option-' + index
            },
              React.createElement(Text, { testID: 'Text-31', style: textStyle, componentId: 'quiz-option-text-' + index }, option)
            );
          })
        ),

        showFeedback ? React.createElement(View, { testID: 'View-13', style: [styles.feedbackCard, { backgroundColor: isCorrect ? theme.colors.success : theme.colors.error }], componentId: 'quiz-feedback' },
          React.createElement(Text, { testID: 'Text-32', style: styles.feedbackIcon, componentId: 'quiz-feedback-icon' }, isCorrect ? '🎉' : '❌'),
          React.createElement(Text, { testID: 'Text-33', style: styles.feedbackText, componentId: 'quiz-feedback-text' }, isCorrect ? 'Correct!' : 'Wrong!'),
          React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-11', style: [styles.nextButton, { backgroundColor: '#FFFFFF' }],
            onPress: handleNextQuestion,
            componentId: 'quiz-next-button'
          },
            React.createElement(Text, { testID: 'Text-34', style: [styles.nextButtonText, { color: isCorrect ? theme.colors.success : theme.colors.error }], componentId: 'quiz-next-text' }, 
              currentQuestion < shuffledQuestions.length - 1 ? 'Next Question' : 'View Results'
            )
          )
        ) : null
      )
    );
  };
  // @end:QuizScreen

  // @section:ClimateFactsScreen @depends:[ThemeContext,styles]
  var ClimateFactsScreen = function() {
    var themeContext = useTheme();
    var theme = themeContext.theme;
    var insets = useSafeAreaInsets();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);
    var scrollTopPadding = insets.top;

    var openLink = function(url) {
      Linking.openURL(url).catch(function(err) {
        if (Platform.OS === 'web') {
          window.alert('Failed to open link');
        } else {
          Alert.alert('Error', 'Failed to open link');
        }
      });
    };

    return React.createElement(ScrollView, { testID: 'ScrollView-5', style: { flex: 1, backgroundColor: theme.colors.background },
      contentContainerStyle: { paddingTop: scrollTopPadding, paddingBottom: scrollBottomPadding },
      componentId: 'facts-scroll'
    },
      React.createElement(View, { testID: 'View-14', style: styles.screenContainer, componentId: 'facts-container' },
        React.createElement(Text, { testID: 'Text-35', style: [styles.screenTitle, { color: theme.colors.textPrimary }], componentId: 'facts-title' }, 'Climate Facts 💡'),
        React.createElement(Text, { testID: 'Text-36', style: [styles.subtitle, { color: theme.colors.textSecondary }], componentId: 'facts-subtitle' }, 'Learn fascinating facts about our changing climate'),
        
        climateFacts.map(function(fact, index) {
          return React.createElement(View, { testID: 'View-15', key: String(index), style: [styles.factCard, { backgroundColor: theme.colors.card }], componentId: 'fact-card-' + index },
            React.createElement(Text, { testID: 'Text-37', style: [styles.factTitle, { color: theme.colors.textPrimary }], componentId: 'fact-title-' + index }, fact.title),
            React.createElement(Text, { testID: 'Text-38', style: [styles.factDescription, { color: theme.colors.textSecondary }], componentId: 'fact-description-' + index }, fact.description),
            React.createElement(TouchableOpacity, { testID: 'TouchableOpacity-12', style: [styles.learnMoreButton, { backgroundColor: theme.colors.primary }],
              onPress: function() { openLink(fact.url); },
              componentId: 'fact-learn-more-' + index
            },
              React.createElement(Text, { testID: 'Text-39', style: styles.learnMoreText, componentId: 'fact-learn-more-text-' + index }, 'Learn More 🔗')
            )
          );
        })
      )
    );
  };
  // @end:ClimateFactsScreen

  // @section:TipsScreen @depends:[ThemeContext,styles]
  var TipsScreen = function() {
    var themeContext = useTheme();
    var theme = themeContext.theme;
    var insets = useSafeAreaInsets();
    var scrollBottomPadding = Platform.OS === 'web' ? WEB_TAB_MENU_PADDING : (TAB_MENU_HEIGHT + insets.bottom + SCROLL_EXTRA_PADDING);
    var scrollTopPadding = insets.top;

    return React.createElement(ScrollView, { testID: 'ScrollView-6', style: { flex: 1, backgroundColor: theme.colors.background },
      contentContainerStyle: { paddingTop: scrollTopPadding, paddingBottom: scrollBottomPadding },
      componentId: 'tips-scroll'
    },
      React.createElement(View, { testID: 'View-16', style: styles.screenContainer, componentId: 'tips-container' },
        React.createElement(Text, { testID: 'Text-40', style: [styles.screenTitle, { color: theme.colors.textPrimary }], componentId: 'tips-title' }, 'Eco Tips 🌱'),
        React.createElement(Text, { testID: 'Text-41', style: [styles.subtitle, { color: theme.colors.textSecondary }], componentId: 'tips-subtitle' }, 'Simple actions you can take every day'),
        
        ecoTips.map(function(tip, index) {
          return React.createElement(View, { testID: 'View-17', key: String(index), style: [styles.tipCard, { backgroundColor: theme.colors.card }], componentId: 'tip-card-' + index },
            React.createElement(View, { testID: 'View-18', style: styles.tipHeader, componentId: 'tip-header-' + index },
              React.createElement(View, { testID: 'View-19', style: [styles.tipNumber, { backgroundColor: theme.colors.primary }], componentId: 'tip-number-' + index },
                React.createElement(Text, { testID: 'Text-42', style: styles.tipNumberText, componentId: 'tip-number-text-' + index }, String(index + 1))
              ),
              React.createElement(Text, { testID: 'Text-43', style: styles.tipEmoji, componentId: 'tip-emoji-' + index }, '💚')
            ),
            React.createElement(Text, { testID: 'Text-44', style: [styles.tipText, { color: theme.colors.textPrimary }], componentId: 'tip-text-' + index }, tip)
          );
        })
      )
    );
  };
  // @end:TipsScreen

  // @section:TabNavigator @depends:[HomeScreen,EcoScoreScreen,QuizScreen,ClimateFactsScreen,TipsScreen,navigation-setup]
  var TabNavigator = function() {
    var insets = useSafeAreaInsets();
    var themeContext = useTheme();
    var theme = themeContext.theme;
    return React.createElement(View, { testID: 'View-20', style: { flex: 1, width: '100%', height: '100%', overflow: 'hidden' }, componentId: 'tab-navigator-container' },
      React.createElement(Tab.Navigator, { testID: 'Navigator-1', screenOptions: {
          headerShown: false,
          tabBarStyle: { position: 'absolute', bottom: 0, height: TAB_MENU_HEIGHT + insets.bottom, borderTopWidth: 0, backgroundColor: theme.colors.card },
          tabBarItemStyle: { padding: 0 },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary
        }
      },
        React.createElement(Tab.Screen, { testID: 'Screen-1', name: 'Home',
          component: HomeScreen,
          options: { tabBarIcon: function(props) { return React.createElement(MaterialIcons, { testID: 'MaterialIcons-1', name: 'home', size: 24, color: props.color }); } }
        }),
        React.createElement(Tab.Screen, { testID: 'Screen-2', name: 'Eco Score',
          component: EcoScoreScreen,
          options: { tabBarIcon: function(props) { return React.createElement(MaterialIcons, { testID: 'MaterialIcons-2', name: 'star', size: 24, color: props.color }); } }
        }),
        React.createElement(Tab.Screen, { testID: 'Screen-3', name: 'Quiz',
          component: QuizScreen,
          options: { tabBarIcon: function(props) { return React.createElement(MaterialIcons, { testID: 'MaterialIcons-3', name: 'quiz', size: 24, color: props.color }); } }
        }),
        React.createElement(Tab.Screen, { testID: 'Screen-4', name: 'Facts',
          component: ClimateFactsScreen,
          options: { tabBarIcon: function(props) { return React.createElement(MaterialIcons, { testID: 'MaterialIcons-4', name: 'lightbulb', size: 24, color: props.color }); } }
        }),
        React.createElement(Tab.Screen, { testID: 'Screen-5', name: 'Tips',
          component: TipsScreen,
          options: { tabBarIcon: function(props) { return React.createElement(MaterialIcons, { testID: 'MaterialIcons-5', name: 'eco', size: 24, color: props.color }); } }
        })
      )
    );
  };
  // @end:TabNavigator

  // @section:styles @depends:[theme]
  var styles = StyleSheet.create({
    homeContainer: {
      flex: 1,
      padding: 20
    },
    headerSection: {
      alignItems: 'center',
      marginBottom: 40,
      marginTop: 20
    },
    appTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 8
    },
    tagline: {
      fontSize: 16,
      textAlign: 'center'
    },
    buttonGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    },
    homeButton: {
      width: '48%',
      aspectRatio: 1,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    buttonEmoji: {
      fontSize: 32,
      marginBottom: 8
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold'
    },
    screenContainer: {
      flex: 1,
      padding: 20
    },
    screenTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 24
    },
    questionCard: {
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    questionText: {
      fontSize: 18,
      marginBottom: 16,
      lineHeight: 24
    },
    answerButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    answerButton: {
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 8,
      minWidth: 80
    },
    answerText: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    checkScoreButton: {
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginVertical: 24
    },
    checkScoreText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold'
    },
    resultCard: {
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    resultEmoji: {
      fontSize: 48,
      marginBottom: 12
    },
    resultTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8
    },
    resultMessage: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 12
    },
    scoreText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16
    },
    shareButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8
    },
    shareButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold'
    },
    quizHeader: {
      alignItems: 'center',
      marginBottom: 24
    },
    questionCounter: {
      fontSize: 16,
      marginTop: 4
    },
    optionButton: {
      padding: 16,
      borderRadius: 8,
      marginBottom: 12
    },
    optionText: {
      fontSize: 16,
      textAlign: 'center'
    },
    feedbackCard: {
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      marginTop: 16
    },
    feedbackIcon: {
      fontSize: 32,
      marginBottom: 8
    },
    feedbackText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16
    },
    nextButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8
    },
    nextButtonText: {
      fontSize: 16,
      fontWeight: 'bold'
    },
    completionEmoji: {
      fontSize: 64,
      textAlign: 'center',
      marginBottom: 16
    },
    completionTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16
    },
    completionScore: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 12
    },
    completionMessage: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 32
    },
    retryButton: {
      borderRadius: 12,
      padding: 16,
      alignItems: 'center'
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold'
    },
    factCard: {
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    factTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8
    },
    factDescription: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 16
    },
    learnMoreButton: {
      borderRadius: 8,
      padding: 12,
      alignItems: 'center'
    },
    learnMoreText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold'
    },
    tipCard: {
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    tipHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12
    },
    tipNumber: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12
    },
    tipNumberText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold'
    },
    tipEmoji: {
      fontSize: 24
    },
    tipText: {
      fontSize: 16,
      lineHeight: 24
    }
  });
  // @end:styles

  // @section:return @depends:[ThemeProvider,TabNavigator]
  return React.createElement(ThemeProvider, { testID: 'ThemeProvider-1' },
    React.createElement(View, { testID: 'View-21', style: { flex: 1, width: '100%', height: '100%' }, componentId: 'app-root' },
      React.createElement(StatusBar, { testID: 'StatusBar-1', barStyle: 'dark-content' }),
      React.createElement(TabNavigator)
    )
  );
  // @end:return
};
return ComponentFunction;