import "../Styles/VideoCall.css";
import { useRef } from 'react';

const VideoCall = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);


    return (
        <>
            <div className="Videocall-page-container">
                <div className="container-fluid video-call-container">
                    <div className="video-container">
                        {/* Remote Video */}
                        <video ref={remoteVideoRef} className="remote-video" autoPlay></video>
                        {/* Local Video (floating) */}
                        <video ref={localVideoRef} className="local-video" autoPlay muted></video>

                        {/* Call Controls (inside video container) */}
                        <div className="call-controls">
                            <button className="btn btn-danger">End Call</button>
                            <button className="btn btn-secondary">Mute</button>
                            <button className="btn btn-info">Share Screen</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default VideoCall;