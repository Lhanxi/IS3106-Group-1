// WidgetMenu.js
import React from "react";

const WidgetMenu = ({
    menuVisible,
    widget,
    onRemove,
    setIsRenaming,
    setMenuVisible,
    onOpenPopup,
}) => {
    if (!menuVisible) return null;

    return (
        <div
            style={{
                position: "absolute",
                top: "30px",
                right: "5px",
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "5px",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                zIndex: 10,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
        >
            {/* Remove Widget */}
            <button
                onClick={() => onRemove(widget.i)}
                style={{
                    padding: "8px",
                    display: "block",
                    width: "100%",
                    color: "red",
                }}
            >
                Remove Widget
            </button>

            <button
                onClick={() => {
                    setIsRenaming(true);
                    setMenuVisible(false);
                }}
                style={{
                    padding: "8px",
                    display: "block",
                    width: "100%",
                }}
            >
                ✏ Rename Widget
            </button>

            <button
                onClick={() => {
                    onOpenPopup(widget);
                    setMenuVisible(false);
                }}
                style={{
                    padding: "8px",
                    display: "block",
                    width: "100%",
                }}
            >
                ⚙ Settings
            </button>
        </div>
    );
};

export default WidgetMenu;
