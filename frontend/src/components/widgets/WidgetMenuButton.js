import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const WidgetMenuButton = ({ menuVisible, setMenuVisible }) => {
    return (
        <div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setMenuVisible(!menuVisible);
                }}
                onMouseDown={(e) => {
                    e.stopPropagation()
                }}
                onTouchStart={(e) => {
                    e.stopPropagation()
                }}
                style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px",
                }}
            >
                <BsThreeDotsVertical size={20} />
            </button>
        </div>
    );
};

export default WidgetMenuButton;