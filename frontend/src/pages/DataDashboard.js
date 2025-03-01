import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { BsThreeDotsVertical } from "react-icons/bs"; // Three-dot menu icon
import PieChartWidget from "../components/PieChartWidget";
import LineChartWidget from "../components/LineChartWidget";
import BarChartWidget from "../components/BarChartWidget";

const DataDashboard = () => {
    const [widgets, setWidgets] = useState([]);
    const [layout, setLayout] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [menuVisible, setMenuVisible] = useState(null); // Track which widget menu is open
    const [gridKey, setGridKey] = useState(Date.now()); // Force re-render fix

    // Available widget options
    const widgetOptions = [
        { id: "pie", name: "Pie Chart", component: <PieChartWidget /> },
        { id: "line", name: "Line Chart", component: <LineChartWidget /> },
        { id: "bar", name: "Bar Chart", component: <BarChartWidget /> },
    ];

    // Function to add a widget
    const addWidget = (widget) => {
        const newWidget = {
            i: `${widget.id}-${Date.now()}`,
            x: (widgets.length * 2) % 12,
            y: Infinity, // Places at the bottom
            w: 4,
            h: 3,
            type: widget.id,
        };

        setWidgets([...widgets, newWidget]);
        setLayout([...layout, newWidget]);
        setShowMenu(false);
    };

    // Function to remove a widget properly
    const removeWidget = (id) => {
        setWidgets((prevWidgets) => prevWidgets.filter((widget) => widget.i !== id));
        setLayout((prevLayout) => prevLayout.filter((item) => item.i !== id));

        // Force re-render of GridLayout
        setTimeout(() => {
            setGridKey(Date.now());
        }, 50);
    };

    // Function to toggle menu visibility for a specific widget
    const toggleMenu = (id) => {
        setMenuVisible(menuVisible === id ? null : id);
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
                    <h4>Select a Widget</h4>
                    {widgetOptions.map((widget) => (
                        <button
                            key={widget.id}
                            onClick={() => addWidget(widget)}
                            style={{ margin: "5px", padding: "10px", background: "#ddd", cursor: "pointer" }}
                        >
                            {widget.name}
                        </button>
                    ))}
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
                        {/* Three-Dot Menu Button */}
                        <button
                            onClick={() => toggleMenu(widget.i)}
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

                        {/* Dropdown Menu */}
                        {menuVisible === widget.i && (
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
                            >
                                <button
                                    onClick={() => removeWidget(widget.i)}
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "8px",
                                        border: "none",
                                        background: "transparent",
                                        cursor: "pointer",
                                    }}
                                >
                                    ❌ Remove Widget
                                </button>
                            </div>
                        )}

                        {/* Widget Content */}
                        {renderWidget(widget)}
                    </div>
                ))}
            </GridLayout>
        </div>
    );
};

export default DataDashboard;
