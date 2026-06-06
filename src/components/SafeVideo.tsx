import React, { useRef, useEffect } from "react";

interface SafeVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

export const SafeVideo: React.FC<SafeVideoProps> = ({ src, ...props }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let active = true;
    const video = videoRef.current;
    if (!video) return;

    if (props.autoPlay) {
      // Force programmatic play to safely catch interruptions / abort occurrences
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Silence AbortErrors or document removals since they are benign unmount events
          if (error.name !== "AbortError" && !error.message?.includes("removed from the document")) {
            console.debug("SafeVideo playback feedback:", error);
          }
        });
      }
    }

    return () => {
      active = false;
      if (video) {
        try {
          video.pause();
        } catch (e) {
          // ignore any pause exceptions
        }
      }
    };
  }, [src, props.autoPlay]);

  // Strip autoPlay out from native element properties, as we handle it programmatically inside useEffect
  const { autoPlay, ...nativeProps } = props;

  return <video ref={videoRef} src={src} {...nativeProps} />;
};
