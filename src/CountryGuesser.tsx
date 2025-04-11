import { Select, Button } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { WorldCountryEntry } from './types/WorldCountryDataset';

function getRandomCountry(countries: string[], guessedCountries: string[]) {
  const filteredCountries = countries.filter(
    country => !guessedCountries.includes(country),
  );
  const randomIndex = Math.floor(Math.random() * filteredCountries.length);
  return countries[randomIndex];
}

function generateQuiz(numberOfQuestions: number, countries: string[]): Quiz {
  const quiz: Quiz = {
    questions: [],
    currentQuestionNumber: 0,
  };
  const guessedCountries: string[] = [];
  for (let i = 0; i < numberOfQuestions; i++) {
    const randomCountry = getRandomCountry(countries, guessedCountries);
    quiz.questions.push({
      index: i,
      answer: randomCountry,
    });
  }
  return quiz;
}

interface Quiz {
  questions: {
    index: number;
    answer: string;
  }[];
  currentQuestionNumber: number;
}

type QuizMode = 'entire-world';

const isQuizMode = (value: string): value is QuizMode => {
  return ['entire-world', 'mode1', 'mode2'].includes(value);
};

interface Props {
  countries: string[];
  clickedPolygon: WorldCountryEntry | null;
  resetClickedPolygon: (newPolygon: WorldCountryEntry | null) => void;
}

export default function CountryGuesser({
  countries,
  clickedPolygon,
  resetClickedPolygon,
}: Props) {
  const [status, setStatus] = useState<'not-started' | 'completed' | 'started'>(
    'not-started',
  );

  const quizModes: { label: string; value: QuizMode }[] = [
    {
      label: 'Entire world',
      value: 'entire-world',
    },
  ];

  const [quiz, setQuiz] = useState<Quiz>({
    questions: [],
    currentQuestionNumber: 0,
  });

  const currentQuestion = quiz?.questions[quiz.currentQuestionNumber];

  const [selectedMode, setSelectedMode] = useState<QuizMode>('entire-world');

  const [answeredCountry, setAnsweredCountry] = useState<string | null>(null);

  const [correctAnsweredTotal, setCorrectAnsweredTotal] = useState(0);

  const [hasAnsweredCorrectly, setHasAnsweredCorrectly] = useState(false);

  useEffect(() => {
    let clickedObject = clickedPolygon as WorldCountryEntry | null;
    if (clickedObject) {
      if (answeredCountry) return;

      const clickedCountry = clickedObject.properties.NAME;
      setAnsweredCountry(clickedCountry);
      if (clickedCountry === currentQuestion.answer) {
        setHasAnsweredCorrectly(true);
        setCorrectAnsweredTotal(prev => prev + 1);
      }
    }
  }, [clickedPolygon, countries]);

  const startGame = () => {
    setQuiz(generateQuiz(3, countries));

    setCorrectAnsweredTotal(0);
    setStatus('started');
    setAnsweredCountry(null);
    setHasAnsweredCorrectly(false);
    resetClickedPolygon(null);
  };

  const quitGame = () => {
    setStatus('not-started');
    setAnsweredCountry(null);
    setHasAnsweredCorrectly(false);
    resetClickedPolygon(null);
  };

  const getNextAnswer = () => {
    if (currentQuestion.index >= quiz.questions.length - 1) {
      setStatus('completed');
      return;
    }
    resetClickedPolygon(null);
    quiz.currentQuestionNumber = currentQuestion.index + 1;
    setAnsweredCountry(null);
    setHasAnsweredCorrectly(false);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    if (isQuizMode(value)) {
      setSelectedMode(value);
    }
  };

  return (
    <div className="box-sizing flex h-full flex-col gap-y-4 py-2">
      {status === 'not-started' ? (
        <>
          <h1 className="text-3xl text-white">Country Guesser</h1>
          <p>
            Do you know shapes of countries? Challenge yourself by clicking on
            correct country
          </p>
          <label htmlFor="selected-mode">Select mode</label>
          <Select
            className="rounded bg-gray-600 p-2 hover:bg-gray-700"
            name="selected-mode"
            onChange={e => handleModeChange(e)}
          >
            {quizModes.map(mode => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </Select>
          <Button
            className="rounded bg-gray-600 px-4 py-2 font-bold hover:bg-gray-700 active:scale-103"
            onClick={() => startGame()}
          >
            Start
          </Button>
        </>
      ) : status === 'completed' ? (
        <>
          <h1 className="text-3xl">Finished!</h1>
          <p className="flex-grow">
            {correctAnsweredTotal} / {quiz.questions.length} correct
          </p>
          <Button
            className="rounded bg-green-600 px-4 py-2 text-xl font-bold hover:bg-green-700 active:scale-103"
            onClick={() => startGame()}
          >
            Restart
          </Button>
        </>
      ) : (
        <>
          <div className="flex flex-row justify-between">
            <p>
              {quiz.currentQuestionNumber + 1} / {quiz.questions.length}
            </p>
            <p>Correct: {correctAnsweredTotal}</p>
          </div>
          {!answeredCountry ? (
            <>
              <p className="flex-grow">
                Click on &nbsp;
                <span className="font-bold">{currentQuestion.answer}</span>
              </p>
              <Button
                className="rounded bg-red-600 px-4 py-2 text-xl font-bold hover:bg-red-700 active:scale-103"
                onClick={() => getNextAnswer()}
              >
                Skip
              </Button>
            </>
          ) : (
            <>
              <p className="flex-grow">
                {hasAnsweredCorrectly ? (
                  <span className="font-bold text-green-600">Correct</span>
                ) : (
                  <>
                    <span className="font-bold text-red-600">Wrong</span>
                    <br></br>
                    <span>You clicked on {answeredCountry}</span>
                  </>
                )}
              </p>
              <Button
                className="rounded bg-gray-600 px-4 py-2 text-xl font-bold hover:bg-gray-700 active:scale-103"
                onClick={() => getNextAnswer()}
              >
                {quiz.currentQuestionNumber + 1 === quiz.questions.length
                  ? 'Finish'
                  : 'Next'}
              </Button>
            </>
          )}
          <Button
            className="rounded bg-red-600 px-4 py-2 text-xl font-bold hover:bg-red-700 active:scale-103"
            onClick={() => quitGame()}
          >
            Quit
          </Button>
        </>
      )}
    </div>
  );
}
