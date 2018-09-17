import React from "react";
import "./ExtraCard.less";

function ExtraCard(props) {
  return (
    <div className="ExtraCardContainer" onClick={()=>props.onClick(props.Images)}>
      <div
        className="ScreenShot"
        style={{
          backgroundImage:
            `url('${props.Images[0]}')`
        }}
      />
    </div>
  );
}

export default ExtraCard;
