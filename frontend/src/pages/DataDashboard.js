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
    const [menuVisible, setMenuVisible] = useState(null); // Track menu visibility
    const [renamingWidget, setRenamingWidget] = useState(null); // Track widget being renamed
    const [newName, setNewName] = useState(""); // Stores the new name during renaming
    const [editingInline, setEditingInline] = useState(null); // Track inline renaming

    // Widget options
    const widgetOptions = [
        { id: "pie", name: "Pie Chart", component: <PieChartWidget /> },
        { id: "line", name: "Line Chart", component: <LineChartWidget /> },
        { id: "bar", name: "Bar Chart", component: <BarChartWidget /> },
    ];

    // Function to validate widget name (not empty & no only spaces)
    const isValidName = (name) => /^[^\s]+(\s+[^\s]+)*$/.test(name);

    // Function to rename a widget
    const renameWidget = (widgetId) => {
        if (!isValidName(newName)) return; // Prevent renaming if invalid

        setWidgets((prevWidgets) =>
            prevWidgets.map((widget) =>
                widget.i === widgetId ? { ...widget, title: newName } : widget
            )
        );
        setRenamingWidget(null); // Hide rename input
        setEditingInline(null); // Hide inline rename input
    };

    // Function to start renaming from the dropdown menu
    const startRenameFromMenu = (widget) => {
        setRenamingWidget(widget.i);
        setNewName(widget.title);
        setMenuVisible(null); // Close the menu
    };

    // Function to enable inline renaming on hover
    const startInlineEdit = (widget) => {
        setEditingInline(widget.i);
        setNewName(widget.title);
    };

    // Function to apply inline rename
    const applyInlineRename = (widgetId) => {
        if (!isValidName(newName)) return;
        renameWidget(widgetId);
    };

    // Function to handle adding a widget
    const handleAddWidget = () => {
        if (!selectedWidget || !isValidName(widgetName)) return; // Prevent empty or invalid names

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
                        disabled={!selectedWidget || !isValidName(widgetName)}
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
            <GridLayout className="layout" layout={layout} cols={12} rowHeight={100} width={1200}>
                {widgets.map((widget) => (
                    <div key={widget.i} style={{ background: "#fff", padding: "10px", position: "relative" }}>
                        {/* Three-dot menu */}
                        <button onClick={() => setMenuVisible(widget.i)} style={{ position: "absolute", top: "5px", right: "5px", background: "transparent", border: "none", cursor: "pointer", padding: "5px" }}>
                            <BsThreeDotsVertical size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {menuVisible === widget.i && (
                            <div style={{ position: "absolute", top: "30px", right: "5px", background: "#fff", border: "1px solid #ddd", borderRadius: "5px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", zIndex: 10 }}>
                                <button onClick={() => startRenameFromMenu(widget)} style={{ padding: "8px", display: "block", width: "100%" }}>✏ Rename Widget</button>
                            </div>
                        )}

                        {/* Widget Title - Rename Options */}
                        {renamingWidget === widget.i ? (
                            <div>
                                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ padding: "5px", width: "80%" }} />
                                <button onClick={() => renameWidget(widget.i)} disabled={!isValidName(newName)}>✅ Confirm</button>
                                <button onClick={() => setRenamingWidget(null)}>❌ Cancel</button>
                            </div>
                        ) : (
                            <h4 onClick={() => startInlineEdit(widget)} style={{ textAlign: "center", marginBottom: "5px", cursor: "pointer", border: "1px solid transparent" }}>{widget.title}</h4>
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
