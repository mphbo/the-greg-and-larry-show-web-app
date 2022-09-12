import React, { useState, useEffect, createRef, useRef } from "react";
import { Button } from "@mui/material";

import loadscript from "load-script";

// SoundCloud widget API
//  https://developers.soundcloud.com/docs/api/html5-widget

export function SoundCloudWidget() {
  // state

  // used to communicate between SC widget and React
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistIndex, setPlaylistIndex] = useState(0);

  // populated once SoundCloud Widget API is loaded and initialized
  const [player, setPlayer] = useState(false);

  // ref for iframe element - https://reactjs.org/docs/refs-and-the-dom.html
  const iframeRef = useRef();

  // initialization - load soundcloud widget API and set SC event listeners

  useEffect(() => {
    // use load-script module to load SC Widget API
    loadscript("https://w.soundcloud.com/player/api.js", () => {
      // initialize player and store reference in state

      const player = window.SC.Widget(iframeRef.current);
      setPlayer(player);

      const { PLAY, PLAY_PROGRESS, PAUSE, FINISH, ERROR } =
        window.SC.Widget.Events;

      // NOTE: closures created - cannot access react state or props from within and SC callback functions!!

      player.bind(PLAY, () => {
        // update state to playing
        setIsPlaying(true);

        // check to see if song has changed - if so update state with next index
        player.getCurrentSoundIndex((playerPlaylistIndex) => {
          setPlaylistIndex(playerPlaylistIndex);
        });
      });

      player.bind(PAUSE, () => {
        // update state if player has paused - must double check isPaused since false positives
        player.isPaused((playerIsPaused) => {
          if (playerIsPaused) setIsPlaying(false);
        });
      });
    });
  }, []);

  // integration - update SC player based on new state (e.g. play button in React section was click)

  // adjust playback in SC player to match isPlaying state
  useEffect(() => {
    if (!player) return; // player loaded async - make sure available

    player.isPaused((playerIsPaused) => {
      if (isPlaying && playerIsPaused) {
        player.play();
      } else if (!isPlaying && !playerIsPaused) {
        player.pause();
      }
    });
  }, [isPlaying]);

  // adjust seleted song in SC player playlist if playlistIndex state has changed
  useEffect(() => {
    if (!player) return; // player loaded async - make sure available

    player.getCurrentSoundIndex((playerPlaylistIndex) => {
      if (playerPlaylistIndex !== playlistIndex) player.skip(playlistIndex);
    });
  }, [playlistIndex]);

  // React section button click event handlers (play/next/previous)
  //  - adjust React component state based on click events

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const changePlaylistIndex = (skipForward = true) => {
    // get list of songs from SC widget
    player.getSounds((playerSongList) => {
      let nextIndex = skipForward ? playlistIndex + 1 : playlistIndex - 1;

      // ensure index is not set to less than 0 or greater than playlist
      if (nextIndex < 0) nextIndex = 0;
      else if (nextIndex >= playerSongList.length)
        nextIndex = playerSongList.length - 1;

      setPlaylistIndex(nextIndex);
    });
  };

  return (
    <div style={{ backgrounColor: "black" }}>
      <iframe
        ref={iframeRef}
        id="sound-cloud-player"
        style={{
          border: "none",
          height: 350,
          width: "100%",
          background: "black",
        }}
        scrolling="no"
        allow="autoplay"
        src={
          "https://w.soundcloud.com/player/?url=https://soundcloud.com/logan-norman-thomas/sets/old-tunes&amp;auto_play=true;color=#0066CC;"
        }
      ></iframe>

      <Button onClick={() => changePlaylistIndex(false)}>{"<"}</Button>
      <Button onClick={togglePlayback}>{isPlaying ? "Pause" : "Play"}</Button>
      <Button onClick={() => changePlaylistIndex(true)}>{">"}</Button>
    </div>
  );
}
