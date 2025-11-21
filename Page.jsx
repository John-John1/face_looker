import React from 'react';
import FaceTracker from './FaceTracker';
import './Page.css';

export default function Page() {
  return (
    <div className="page">
      <div className="author-name">KYLAN O'CONNOR</div>

      <div className="avatar-wrapper">
        <FaceTracker className="avatar-face" basePath="/faces/" />
      </div>

      <div className="buttons">
        <button className="btn">ABOUT</button>
        <button className="btn">PROJECTS</button>
      </div>
    </div>
  );
}
