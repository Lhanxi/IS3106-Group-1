import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import BarChartWidget from "../components/BarChartWidget";
import PieChartWidget from "../components/PieChartWidget";
import LineChartWidget from "../components/LineChartWidget";

const DataDashboard = () => {
    const [layout, setLayout] = useState([
        { i: "bar-chart", x: 0, y: 0, w: 4, h: 3 },
    ]);

    return (
        <div style={{ padding: "20px" }}>
            <h2>📊 My Dashboard</h2>
            <GridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={100}
                width={1200}
                onLayoutChange={(newLayout) => setLayout(newLayout)}
            >
                <div key="bar-chart" style={{ background: "#fff", padding: "10px" }}>
                    <BarChartWidget />
                </div>
                <div key="pie-chart" style={{ background: "#fff", padding: "10px" }}>
                    <PieChartWidget />
                </div>
                <div key="line-chart" style={{ background: "#fff", padding: "10px" }}>
                    <LineChartWidget />
                </div>
            </GridLayout>
        </div>
    );
};

export default DataDashboard;
