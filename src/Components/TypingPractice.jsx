import React from "react";
import { useRef, useEffect, useState } from "react";
import { LuTimerReset } from "react-icons/lu";
import soundFile from "../sound/sound.mp3";

const TypingPractice = () => {
  const keyboardRef = useRef();
  const [inputChar, setInputChar] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [timer, setTimer] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(300);
  const [isTimeover, setIsTimeover] = useState(300);
  const [sound, setSound] = useState(null);

  // Calculates the accuracy percentage of typing test.
  const accuracy =
    correctCount + incorrectCount === 0
      ? 0
      : Math.floor((correctCount / (correctCount + incorrectCount)) * 100);

  const keys = [..."asdfjkl;"];

  //Handles the start of the typing test.
  const handleStart = () => {
    setIsRunning(true);
    setTimer(seconds);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsTimeover(false);
  };

  // Callback function for timeover event and stops the timer and ends the typing test.
  const timeover = () => {
    setInputChar("");
    setTimer(0);
    setIsPaused(false);
    setIsRunning(false);
    setIsTimeover(true);
  };

  // Resets all the stats and stops the typing test.
  const resetStats = () => {
    setInputChar("");
    setIsRunning(false);
    setTimer(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsTimeover(false);
    setIsPaused(false);
  };

  // Pauses the typing test.
  const handlePause = () => {
    setIsPaused(true);
  };

  // Resumes the typing test.
  const handlePlay = () => {
    setIsPaused(false);
  };

  // Play sound after pressing the wrong key
  const playsound = () => {
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  };

  useEffect(() => {
    let intervalId;
    if (isRunning && !isPaused) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : timeover()));
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, isPaused]);

  // Load the audio files
  useEffect(() => {
    const loadAudioFiles = async () => {
      try {
        const soundObj = new Audio(soundFile);
        await soundObj.load();
        setSound(soundObj);
      } catch (error) {
        console.error("Failed to load audio files:", error);
      }
    };
    loadAudioFiles();
  }, []);

  useEffect(() => {
    keyboardRef.current && keyboardRef.current.focus();
  });

  // Sets focus to the keyboard input.
  const handleInputBlur = (event) => {
    keyboardRef.current && keyboardRef.current.focus();
  };

  // Handles the keydown event and sets the current input character.
  const handleKeyDown = (event) => {
    setInputChar(event.key);
    event.preventDefault();
    return;
  };

  /**
   * Handles the keyup event.
   * Clears the current input character.
   * Checks if the input is correct or incorrect and updates the stats accordingly.
   * Prevents default behavior.
   */
  const handleKeyUp = (event) => {
    setInputChar("");
    if (event.key === randomKey) {
      let newRandom = getRandomKeyIndex();
      let newKey = keys[newRandom];
      if (newKey === randomKey) {
        if (newRandom === 0 || newRandom === keys.length - 1) {
          newRandom = 1;
        } else {
          newRandom = newRandom + 1;
        }
      }
      setRandomKey(keys[newRandom]);
      setCorrectCount(correctCount + 1);
      return;
    }
    setIncorrectCount(incorrectCount + 1);
    playsound();
    event.preventDefault();
    return;
  };

  const getRandomKeyIndex = () => {
    return Math.floor(Math.random() * 8);
  };

  const [randomKey, setRandomKey] = useState(() => {
    return keys[getRandomKeyIndex()];
  });

  // Returns the CSS class name for a given key string based on the current input and correctness.
  const getClassName = (keyString) => {
    if (keyString !== randomKey) {
      if (inputChar !== "" && inputChar === keyString) {
        return "UNITKEY VIBRATE-ERROR";
      }
      return "UNITKEY";
    }
    if (inputChar !== "" && inputChar === keyString) {
      return "UNITKEY NOVIBRATE-CORRECT";
    }
    return "UNITKEY VIBRATE";
  };

  // Returns the CSS class name for the space key based on the current input and incorrectness.
  const getSpaceKeyClassName = () => {
    if (" " !== randomKey) {
      if (inputChar !== "" && inputChar === " ") {
        return "SPACEKEY VIBRATE-ERROR";
      }
      return "SPACEKEY";
    }
    if (inputChar !== "" && inputChar === " ") {
      return "SPACEKEY NOVIBRATE-CORRECT";
    }
    return "SPACEKEY VIBRATE";
  };

  // Formats the time in seconds to a string in the format 'mm:ss'.
  const formatTime = (timeInSecond) => {
    var minutes = Math.floor(timeInSecond / 60);
    var seconds = timeInSecond % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div>
      <h1 className="header">Typing Practice App</h1>
      <div className="score-board">
        <div className="Timer-box">
          {isRunning === true ? (
            <h3
              className="start-btn"
              style={{
                backgroundColor: isPaused === false ? "blue" : "gray",
                border:
                  isRunning === true ? "4px solid white" : "2px solid #555",
              }}
            >
              Time Remaining: {formatTime(timer)}
            </h3>
          ) : (
            <h3
              className="start-btn"
              onClick={handleStart}
              style={{
                backgroundColor: "blue",
                border:
                  isRunning === true && isPaused === false
                    ? "4px solid white"
                    : "2px solid #555",
              }}
            >
              Start
            </h3>
          )}
          <select
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            placeholder="Change Duration"
          >
            <option>Change Duration</option>
            <option value="10">10 seconds</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="120">2 minutes</option>
            <option value="300">5 minutes</option>
          </select>
        </div>

        <div className="btn-box">
          {isRunning === true ? (
            isPaused === false ? (
              <h3
                className="restart-btn"
                onClick={handlePause}
                style={{ backgroundColor: "blue" }}
              >
                Pause
              </h3>
            ) : (
              <h3
                className="restart-btn"
                onClick={handlePlay}
                style={{
                  backgroundColor: "blue",
                  border:
                    isPaused === true ? "4px solid white" : "2px solid #555",
                }}
              >
                Play
              </h3>
            )
          ) : null}

          <h3
            className="restart-btn"
            onClick={() => {
              resetStats();
            }}
            style={{ backgroundColor: "red" }}
          >
            <LuTimerReset />
            Reset
          </h3>
        </div>
      </div>
      <br />
      <div className="score-board">
        <div>
          <h3>Correct : {correctCount}</h3>
        </div>
        <div>
          <h3 className="incorrect-count">Incorrect : {incorrectCount}</h3>
        </div>
        <div>
          <h3>Total keys pressed : {correctCount + incorrectCount}</h3>
        </div>
        <div>
          <h3>Accuracy: {accuracy} %</h3>
        </div>
      </div>

      <h1>
        Letter:{" "}
        {isRunning === true ? (
          <span className="current-key">{randomKey}</span>
        ) : null}
      </h1>

      <div className="keyboard">
        {isRunning === true && isPaused === false ? (
          <input
            className="input"
            value={inputChar}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            ref={keyboardRef}
          />
        ) : (
          <input
            className="input"
            value={inputChar}
            disabled
            style={{ border: "1px solid white" }}
          />
        )}
        <br />
        {isTimeover === true && <h1 className="Time-out">Time Over!</h1>}
        <ul className="row row-1">
          <div className={getClassName("q")}>q</div>
          <div className={getClassName("w")}>w</div>
          <div className={getClassName("e")}>e</div>
          <div className={getClassName("r")}>r</div>
          <div className={getClassName("t")}>t</div>
          <div className={getClassName("y")}>y</div>
          <div className={getClassName("u")}>u</div>
          <div className={getClassName("i")}>i</div>
          <div className={getClassName("o")}>o</div>
          <div className={getClassName("p")}>p</div>
          <div className={getClassName("[")}>[</div>
          <div className={getClassName("]")}>]</div>
        </ul>
        <ul className="row row-2">
          <div className={getClassName("a")}>a</div>
          <div className={getClassName("s")}>s</div>
          <div className={getClassName("d")}>d</div>
          <div className={getClassName("f")}>f</div>
          <div className={getClassName("g")}>g</div>
          <div className={getClassName("h")}>h</div>
          <div className={getClassName("j")}>j</div>
          <div className={getClassName("k")}>k</div>
          <div className={getClassName("l")}>l</div>
          <div className={getClassName(";")}>;</div>
          <div className={getClassName("'")}>'</div>
        </ul>
        <ul className="row row-3">
          <div className={getClassName("z")}>z</div>
          <div className={getClassName("x")}>x</div>
          <div className={getClassName("c")}>c</div>
          <div className={getClassName("v")}>v</div>
          <div className={getClassName("b")}>b</div>
          <div className={getClassName("n")}>n</div>
          <div className={getClassName("m")}>m</div>
          <div className={getClassName(",")}>,</div>
          <div className={getClassName(".")}>.</div>
          <div className={getClassName("/")}>/</div>
        </ul>
        <ul className="row row-4">
          <div className={getSpaceKeyClassName()} id="SPACE">
            SPACE
          </div>
        </ul>{" "}
      </div>
    </div>
  );
};

export default TypingPractice;
