import React, { useCallback, useEffect, useRef } from "react"

import { useHuddleStore } from "@huddle01/huddle01-client/store"

interface Props {
  peerIdAtIndex: string
}

const PeerVideo: React.FC<Props> = ({ peerIdAtIndex }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const peerCamTrack = useHuddleStore(
    useCallback((state) => state.peers[peerIdAtIndex]?.consumers?.cam, [peerIdAtIndex])
  )?.track

  const peerMicTrack = useHuddleStore(
    useCallback((state) => state.peers[peerIdAtIndex]?.consumers?.mic, [peerIdAtIndex])
  )?.track

  const getStream = (_track: MediaStreamTrack) => {
    const stream = new MediaStream()
    stream.addTrack(_track)
    return stream
  }

  useEffect(() => {
    const videoObj = videoRef.current

    if (videoObj && peerCamTrack) {
      videoObj.load()
      videoObj.srcObject = getStream(peerCamTrack)
      videoObj.play().catch((err) => {
        console.log({
          message: "Error playing video",
          meta: {
            err,
          },
        })
      })
    }

    return () => {
      if (videoObj) {
        videoObj?.pause()
        videoObj.srcObject = null
      }
    }
  }, [peerCamTrack])

  useEffect(() => {
    if (peerMicTrack && audioRef.current) {
      audioRef.current.srcObject = getStream(peerMicTrack)
    }
  }, [peerMicTrack])

  return (
    <div>
      <video
        ref={videoRef}
        className="w-full rounded-2xl border-2 p-[5px]"
        muted
        autoPlay
        playsInline
        style={{ width: "100%" }}
      />
      <audio ref={audioRef} autoPlay controls={false}></audio>
    </div>
  )
}

export default React.memo(PeerVideo)
