import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/AudioPlayer.module.css";
import { BsArrowLeftShort } from "react-icons/bs";
import { BsArrowRightShort } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

const AudioPlayer = () => {
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // reference
  const audioPlayer = useRef(); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation

  // effect
  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const backTen = () => {
    progressBar.current.value = Number(progressBar.current.value - 10);
    changeRange();
  };

  const forwardTen = () => {
    progressBar.current.value = Number(progressBar.current.value) + 10;
    console.log(progressBar.current.value);
    changeRange();
  };

  return (
    <>
      <div className={styles.progressBarContainer}>
        {/* current time */}
        <div className={styles.currentTime}>{calculateTime(currentTime)}</div>

        {/* progress bar */}
        <input
          type="range"
          className={styles.progressBar}
          defaultValue="0"
          ref={progressBar}
          onChange={changeRange}
        />

        {/* duration */}
        <div className={styles.duration}>
          {duration && !isNaN(duration) && calculateTime(duration)}
        </div>
      </div>
      <div className={styles.audioPlayer}>
        <audio
          ref={audioPlayer}
          src="https://lazy-note.s3.ap-northeast-2.amazonaws.com/Mac_Miller-Knock_Knock.mp3"
          type="audio/mpeg"
        ></audio>
        <button className={styles.backward} onClick={backTen}>
          <BsArrowLeftShort />
          10
        </button>
        <button onClick={togglePlayPause} className={styles.playPause}>
          {isPlaying ? (
            <FaPause className={styles.pause} />
          ) : (
            <FaPlay className={styles.play} />
          )}
        </button>
        <button className={styles.forward} onClick={forwardTen}>
          10
          <BsArrowRightShort />
        </button>
      </div>
    </>
  );
};

export { AudioPlayer };
