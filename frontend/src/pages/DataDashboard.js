import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import PieChartWidget from "../components/PieChartWidget";
import LineChartWidget from "../components/LineChartWidget";
import BarChartWidget from "../components/BarChartWidget";

const DataDashboard = () => {
    const [widgets, setWidgets] = useState([]);
    const [layout, setLayout] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [widgetName, setWidgetName] = useState(""); // Stores user-entered name
    const [selectedWidget, setSelectedWidget] = useState(null); // Stores selected widget type
    const [gridKey, setGridKey] = useState(Date.now());

    // Widget options
    const widgetOptions = [
        { id: "pie", name: "Pie Chart", component: <PieChartWidget /> },
        { id: "line", name: "Line Chart", component: <LineChartWidget /> },
        { id: "bar", name: "Bar Chart", component: <BarChartWidget /> },
    ];

    // Function to validate widget name (not empty & no only spaces)
    const isValidName = (name) => /^[^\s]+(\s+[^\s]+)*$/.test(name);

    // Function to handle adding a widget
    const handleAddWidget = () => {
        if (!selectedWidget || !isValidName(widgetName)) return; // Prevents empty or invalid names

        const newWidget = {
            i: `${selectedWidget.id}-${Date.now()}`,
            x: (widgets.length * 2) % 12,
            y: Infinity,
            w: 4,
            h: 3,
            type: selectedWidget.id,
            title: widgetName, // Store the user-entered name
        };

        setWidgets([...widgets, newWidget]);
        setLayout([...layout, newWidget]);
        setShowMenu(false);
        setWidgetName(""); // Reset name input
        setSelectedWidget(null); // Reset selection
    };

    // Function to remove a widget
    const removeWidgetById = (widgetId) => {
        setWidgets((prevWidgets) => prevWidgets.filter((widget) => widget.i !== widgetId));
        setLayout((prevLayout) => prevLayout.filter((item) => item.i !== widgetId));
    };

    // Function to render the correct widget component
    const renderWidget = (widget) => {
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
        <div style={{ padding: "20px" }}>
            <h2>📊 Project Management Data Dashboard</h2>

            {/* Add Widget Button */}
            <button onClick={() => setShowMenu(!showMenu)} style={{ marginBottom: "10px", padding: "10px" }}>
                ➕ Add Widget
            </button>

            {/* Widget Selection Menu */}
            {showMenu && (
                <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
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
                                background: selectedWidget?.id === widget.id ? "#8884d8" : "#ddd",
                                color: selectedWidget?.id === widget.id ? "white" : "black",
                                cursor: "pointer",
                            }}
                        >
                            {widget.name}
                        </button>
                    ))}
                    <button
                        onClick={handleAddWidget}
                        disabled={!selectedWidget || !isValidName(widgetName)} // Disable if name is invalid
                        style={{
                            padding: "10px",
                            background: !selectedWidget || !isValidName(widgetName) ? "#ccc" : "#28a745",
                            color: "white",
                            cursor: !selectedWidget || !isValidName(widgetName) ? "not-allowed" : "pointer",
                        }}
                    >
                        ✅ Confirm & Add Widget
                    </button>
                </div>
            )}

            {/* Dashboard Layout */}
            <GridLayout
                key={gridKey}
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={100}
                width={1200}
                onLayoutChange={(newLayout) => setLayout(newLayout)}
            >
                {widgets.map((widget) => (
                    <div key={widget.i} style={{ background: "#fff", padding: "10px", position: "relative" }}>
                        {/* Three-dot menu */}
                        <button
                            onClick={() => removeWidgetById(widget.i)}
                            style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                background: "red",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                padding: "5px",
                                borderRadius: "50%",
                            }}
                        >
                            ❌
                        </button>

                        {/* Widget Title */}
                        <h4 style={{ textAlign: "center", marginBottom: "5px" }}>{widget.title}</h4>

                        {/* Widget Content */}
                        {renderWidget(widget)}
                    </div>
                ))}
            </GridLayout>
        </div>
    );
};

export default DataDashboard;
