import { useState } from "react";
import PieChartWidget from "./PieChartWidget";
import LineChartWidget from "./LineChartWidget";
import BarChartWidget from "./BarChartWidget";
import WidgetPopupSideBar from "./WidgetPopupSideBar";

const WidgetPopup = ({ widget, onClose }) => {
    const [showSettings, setShowSettings] = useState(false);

    const renderContent = () => {
        switch (widget.type) {
            case "pie":
                return <PieChartWidget />;
            case "line":
                return <LineChartWidget />;
            case "bar":
                return <BarChartWidget />;
            default:
                return null;
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <div
                style={{
                    background: "#fff",
                    width: "90%",
                    height: "90%",
                    position: "relative",
                    borderRadius: "8px",
                    display: "flex",
                    transition: "width 0.3s ease-in-out",
                }}
            >
                <div
                    style={{
                        flex: 1,
                        padding: "20px",
                        overflow: "hidden",
                        transition: "width 0.3s ease-in-out",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: showSettings ? "260px" : "10px",
                            display: "flex",
                            gap: "10px",
                        }}
                    >
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            style={{
                                background: "transparent",
                                border: "none",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                            }}
                        >
                            ⚙️
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                background: "transparent",
                                border: "none",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <h2>{widget.title}</h2>

                    <div
                        style={{
                            width: "100%",
                            height: "calc(100% - 60px)",
                            paddingTop: "20px",
                            boxSizing: "border-box",
                        }}
                    >
                        {renderContent()}
                    </div>
                </div>

                {showSettings && <WidgetPopupSideBar />}
            </div>
        </div>
    );
};

export default WidgetPopup;
