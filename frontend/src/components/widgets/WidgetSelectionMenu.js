import React, { useState } from "react";

const WidgetSelectionMenu = ({ showMenu, onWidgetSelected }) => {
    const [widgetName, setWidgetName] = useState("");
    const [selectedWidget, setSelectedWidget] = useState(null);

    const widgetOptions = [
        { id: "pie", name: "Pie Chart" },
        { id: "line", name: "Line Chart" },
        { id: "bar", name: "Bar Chart" },
    ];

    const isValidName = (name) => /^[^\s]+(\s+[^\s]+)*$/.test(name);

    const handleConfirm = () => {
        if (!selectedWidget || !isValidName(widgetName)) return;
        onWidgetSelected(selectedWidget.id, widgetName);
        setSelectedWidget(null);
        setWidgetName("");
    };

    return (
        <div>
            {showMenu && (
                <div
                    style={{
                        background: "#f5f5f5",
                        padding: "10px",
                        borderRadius: "5px",
                        marginBottom: "10px",
                    }}
                >
                    <h4>Select a Widget & Name It</h4>
                    <input
                        type="text"
                        placeholder="Enter widget name"
                        value={widgetName}
                        onChange={(e) => setWidgetName(e.target.value)}
                        style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
                    />
                    {widgetOptions.map((widget) => (
                        <button
                            key={widget.id}
                            onClick={() => setSelectedWidget(widget)}
                            style={{
                                margin: "5px",
                                padding: "10px",
                                background:
                                    selectedWidget?.id === widget.id ? "#8884d8" : "#ddd",
                                color: selectedWidget?.id === widget.id ? "white" : "black",
                                cursor: "pointer",
                            }}
                        >
                            {widget.name}
                        </button>
                    ))}
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedWidget || !isValidName(widgetName)}
                        style={{
                            padding: "10px",
                            background:
                                !selectedWidget || !isValidName(widgetName) ? "#ccc" : "#28a745",
                            color: "white",
                            cursor:
                                !selectedWidget || !isValidName(widgetName)
                                    ? "not-allowed"
                                    : "pointer",
                        }}
                    >
                        Confirm & Add Widget
                    </button>
                </div>
            )}
        </div>
    );
};

export default WidgetSelectionMenu;
