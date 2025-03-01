import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import PieChartWidget from "../components/PieChartWidget";
import LineChartWidget from "../components/LineChartWidget";
import BarChartWidget from "../components/BarChartWidget";

const DataDashboard = () => {
    const [widgets, setWidgets] = useState([]);
    const [layout, setLayout] = useState([]);
    const [showMenu, setShowMenu] = useState(false);

    const widgetOptions = [
        { id: "pie", name: "Pie Chart", component: <PieChartWidget /> },
        { id: "line", name: "Line Chart", component: <LineChartWidget /> },
        { id: "bar", name: "Bar Chart", component: <BarChartWidget /> },
    ];

    // Function to add a widget
    const addWidget = (widget) => {
        const newWidget = {
            i: `${widget.id}-${Date.now()}`, // Unique key
            x: (widgets.length * 2) % 12,
            y: Infinity, // Places it at the bottom
            w: 4,
            h: 3,
            component: widget.component,
        };

        setWidgets([...widgets, newWidget]);
        setLayout([...layout, newWidget]);
        setShowMenu(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>📊 Project Management Dashboard</h2>

            <button onClick={() => setShowMenu(!showMenu)} style={{ marginBottom: "10px", padding: "10px" }}>
                ➕ Add Widget
            </button>

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

            <GridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={100}
                width={1200}
                onLayoutChange={(newLayout) => setLayout(newLayout)}
            >
                {widgets.map((widget) => (
                    <div key={widget.i} style={{ background: "#fff", padding: "10px" }}>
                        {widget.component}
                    </div>
                ))}
            </GridLayout>
        </div>
    );
};

export default DataDashboard;
