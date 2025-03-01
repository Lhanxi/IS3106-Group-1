import React, { useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

// Single dataset for Pie Chart
const data = [
    { name: "Group A", value: 400, color: "#8884d8" },
    { name: "Group B", value: 300, color: "#82ca9d" },
    { name: "Group C", value: 300, color: "#ffc658" },
    { name: "Group D", value: 200, color: "#ff8042" },
];

const PieChartWidget = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    return (
        <div style={{ width: "100%", height: "100%", background: "#fff", padding: "10px" }}>
            <h4 style={{ textAlign: "center" }}>📊 Interactive Pie Chart</h4>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius="50%"
                        fill="#8884d8"
                        label
                        onMouseEnter={onPieEnter}
                        onMouseLeave={onPieLeave}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke={index === activeIndex ? "#000" : "none"}
                                strokeWidth={index === activeIndex ? 3 : 1}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartWidget;

