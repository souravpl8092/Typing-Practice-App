import React from "react";
import { useRef, useEffect, useState } from "react";
import { LuTimerReset } from "react-icons/lu";

const TypingTest = () => {
  const keyboardRef = useRef();
  const [inputChar, setInputChar] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [timer, setTimer] = useState(300);
  const [word, setWord] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(300);
  const [isTimeover, setIsTimeover] = useState(300);

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
    setWord(0);
  };

  // Callback function for timeover event and stops the timer and ends the typing test.
  const timeover = () => {
    setTimer(0);
    setIsPaused(false);
    setIsRunning(false);
    setIsTimeover(true);
  };

  // Resets all the stats and stops the typing test.
  const resetStats = () => {
    setIsRunning(false);
    setTimer(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsTimeover(false);
    setWord(0);
  };

  // Pauses the typing test.
  const handlePause = () => {
    setIsPaused(true);
  };

  // Resumes the typing test.
  const handlePlay = () => {
    setIsPaused(false);
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
      const time = Math.ceil((300 - timer) / 60);
      setWord(Math.ceil(correctCount + 1 / time));
      return;
    }
    setIncorrectCount(incorrectCount + 1);
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
      <h1 className="header">Typing Test</h1>
      <div className="score-board">
        <div className="Timer-box">
          {isRunning === true ? (
            <h3
              className="start-btn"
              style={{
                backgroundColor: "blue",
                border:
                  isRunning === true && isPaused === false
                    ? "4px solid white"
                    : "2px solid #555",
              }}
            >
              {formatTime(timer)}
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
              Start : 00:00
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
          <h3>WPM : {word}</h3>
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
        {isRunning === true ? (
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
            ref={keyboardRef}
            disabled
          />
        )}
        <br />
        {isTimeover === true && <h1 className="Time-out">Time Over!</h1>}
        <ul className="row row-1">
          <div className={getClassName("q")} id="Q">
            q
          </div>
          <div className={getClassName("w")} id="W">
            w
          </div>
          <div className={getClassName("e")} id="E">
            e
          </div>
          <div className={getClassName("r")} id="R">
            r
          </div>
          <div className={getClassName("t")} id="T">
            t
          </div>
          <div className={getClassName("y")} id="Y">
            y
          </div>
          <div className={getClassName("u")} id="U">
            u
          </div>
          <div className={getClassName("i")} id="I">
            i
          </div>
          <div className={getClassName("o")} id="O">
            o
          </div>
          <div className={getClassName("p")} id="P">
            p
          </div>
          <div className={getClassName("[")}>[</div>
          <div className={getClassName("]")}>]</div>
        </ul>
        <ul className="row row-2">
          <div className={getClassName("a")} id="A">
            a
          </div>
          <div className={getClassName("s")} id="S">
            s
          </div>
          <div className={getClassName("d")} id="D">
            d
          </div>
          <div className={getClassName("f")} id="F">
            f
          </div>
          <div className={getClassName("g")} id="G">
            g
          </div>
          <div className={getClassName("h")} id="H">
            h
          </div>
          <div className={getClassName("j")} id="J">
            j
          </div>
          <div className={getClassName("k")} id="K">
            k
          </div>
          <div className={getClassName("l")} id="L">
            l
          </div>
          <div className={getClassName(";")}>;</div>
          <div className={getClassName("'")}>'</div>
        </ul>
        <ul className="row row-3">
          <div className={getClassName("z")} id="Z">
            z
          </div>
          <div className={getClassName("x")} id="X">
            x
          </div>
          <div className={getClassName("c")} id="C">
            c
          </div>
          <div className={getClassName("v")} id="V">
            v
          </div>
          <div className={getClassName("b")} id="B">
            b
          </div>
          <div className={getClassName("n")} id="N">
            n
          </div>
          <div className={getClassName("m")} id="M">
            m
          </div>
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

export default TypingTest;
