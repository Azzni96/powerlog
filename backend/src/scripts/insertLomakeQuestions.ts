import pool from '../database/db';

const insertLomakeData = async () => {
  const conn = await pool.getConnection();

  try {
    const questions = [
      ['Profile', 'What is your gender?', 1, 'text'],
      ['Basic Info', 'What is your age?', 1, 'number'],
      ['Basic Info', 'What is your height?', 1, 'number'],
      ['Basic Info', 'What is your weight?', 1, 'number'],
      ['About You', 'How would you describe yourself?', 1, 'select'],
      ['Motivation', 'What is your primary motivation?', 1, 'select'],
      ['Fitness Status', 'What is your current fitness level?', 1, 'select'],
      ['Fitness Goal', 'What is your main fitness goal?', 1, 'select'],
      ['Weekly Activity', 'How many workout days per week?', 1, 'select'],
      ['Feedback', 'How do you rate your experience?', 1, 'select']
    ];

    const insertedIds = [];

    for (const q of questions) {
      const result = await conn.query(
        'INSERT INTO FormsQuestions (category, question, max, answer) VALUES (?, ?, ?, ?)',
        q
      );
      insertedIds.push(result.insertId);
    }

    const answersMap = {
      1: ['Male', 'Female'],
      5: ['Low Activity', 'Lightly Active', 'Active', 'Very Active'],
      6: ['Lose Weight', 'Build Muscle', 'Stay Fit', 'Gain Energy', 'Improve Health'],
      7: ['Beginner', 'Intermediate', 'Advanced', 'Athlete'],
      8: ['Lose Fat', 'Build Muscle', 'Get Strong', 'Maintain'],
      9: ['1', '2', '3', '4', '5', '6', '7'],
      10: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor']
    };

    for (const [qIndex, options] of Object.entries(answersMap)) {
      const questionId = insertedIds[Number(qIndex) - 1];
      for (const answer of options) {
        await conn.query(
          'INSERT INTO FormsAnswers (question_id, answer_text) VALUES (?, ?)',
          [questionId, answer]
        );
      }
    }

    console.log('✅ LOMAKE questions and answers inserted successfully.');
  } catch (err) {
    console.error('❌ Error inserting LOMAKE:', err);
  } finally {
    conn.release();
  }
};

insertLomakeData();
