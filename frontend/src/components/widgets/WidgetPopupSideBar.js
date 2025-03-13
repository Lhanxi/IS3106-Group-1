import React from "react";

const WidgetPopupSideBar = () => {
    return (
        <div
            style={{
                width: "25%",
                height: "100%",
                background: "#f9f9f9",
                borderLeft: "1px solid #ddd",
                padding: "20px",
                overflowY: "auto",
                transition: "width 0.3s ease-in-out",
            }}
        >
            <h2>⚙️ Settings</h2>
            <p>Chart type selection will go here.</p>

            <div style={{ marginTop: "20px", height: "80vh" }}>
                {[...Array(30)].map((_, index) => (
                    <p key={index} style={{ padding: "5px 0" }}>
                        Setting Option {index + 1}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default WidgetPopupSideBar;
