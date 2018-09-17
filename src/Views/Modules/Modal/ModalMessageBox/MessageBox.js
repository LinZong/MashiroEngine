import React from "react";
import "./MessageBox.css";
const defaultButtons = [
  {
    Text: "确定",
    ExtraClassName: "success Confirm",
    Value: 0
  },
  { Text: "取消", Value: 1, ExtraClassName: "danger Cancel" }
];
function MessageBox(props) {
  return (
    <div className="box MessageBox">
      <span className="MessageBoxTitle">{props.title}</span>
      <div className="MessageBoxChildren">{props.children}</div>
      <div className="SelectionButtons">
        {(props.buttons || defaultButtons).map((it, idx) => {
          return (
            <button
              className={`button is-${it.ExtraClassName}`}
              onClick={() => props.clickfunc && props.clickfunc(it.Value)}
            >
              {it.Text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MessageBox;
