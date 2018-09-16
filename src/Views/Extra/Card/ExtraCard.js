import React from "react";
import "./ExtraCard.less";
function ExtraCard(props) {
  return (
    <div className="ExtraCardContainer">
      <div
        className="ScreenShot"
        style={{
          backgroundImage:
            "url('https://uploads.codesandbox.io/uploads/user/88687e13-c646-45b5-95d1-a6059788baf9/iQ6H-WelcomeBG.png')"
        }}
      />
    </div>
  );
}

export default ExtraCard;
