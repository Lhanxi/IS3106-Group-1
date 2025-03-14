import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Widget from "../components/widgets/Widget";
import WidgetSelectionMenu from "../components/widgets/WidgetSelectionMenu";
import WidgetPopup from "../components/widgets/WidgetPopup";

const DataDashboard = () => {
    const [widgets, setWidgets] = useState([]);
    const [layout, setLayout] = useState([]);
    const [showMenu, setShowMenu] = useState(false);

    const [activePopupWidget, setActivePopupWidget] = useState(null);

    const removeWidgetById = (widgetId) => {
        setWidgets((prev) => prev.filter((w) => w.i !== widgetId));
        setLayout((prev) => prev.filter((item) => item.i !== widgetId));
    };

    const renameWidget = (widgetId, newTitle) => {
        setWidgets((prev) =>
            prev.map((widget) =>
                widget.i === widgetId ? { ...widget, title: newTitle } : widget
            )
        );
    };

    const onLayoutChange = (newLayout) => {
        setLayout(newLayout);
        setWidgets((prevWidgets) =>
            prevWidgets.map((widget) => {
                const updated = newLayout.find((l) => l.i === widget.i);
                return updated
                    ? { ...widget, x: updated.x, y: updated.y, w: updated.w, h: updated.h }
                    : widget;
            })
        );
    };

    const handleAddWidget = (widgetType, widgetName) => {
        if (!widgetType || !widgetName.trim()) return;

        const newWidget = {
            i: `${widgetType}-${Date.now()}`,
            x: (widgets.length * 2) % 12,
            y: Infinity,
            w: 4,
            h: 3,
            type: widgetType,
            title: widgetName,
        };

        setWidgets((prev) => [...prev, newWidget]);
        setLayout((prev) => [...prev, newWidget]);

        setShowMenu(false);
    };

    // 2) Function to open the popup for a given widget
    const openPopupForWidget = (widget) => {
        setActivePopupWidget(widget);
    };

    // 3) Function to close the popup
    const closePopup = () => {
        setActivePopupWidget(null);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Project Management Data Dashboard</h2>

            <button
                onClick={() => setShowMenu((prev) => !prev)}
                style={{ marginBottom: "10px", padding: "10px" }}
            >
                Add Widget
            </button>

            <WidgetSelectionMenu
                showMenu={showMenu}
                onWidgetSelected={handleAddWidget}
            />

            {/* 4) Conditionally render EITHER the popup OR the grid */}
            {activePopupWidget ? (
                // If we have an active popup widget, show the popup
                <WidgetPopup
                    widget={activePopupWidget}
                    onClose={closePopup}
                />
            ) : (
                // Otherwise, show the grid of widgets
                <GridLayout
                    className="layout"
                    layout={layout}
                    onLayoutChange={onLayoutChange}
                    cols={12}
                    rowHeight={100}
                    width={1200}
                >
                    {widgets.map((widget) => (
                        <div
                            key={widget.i}
                            data-grid={{
                                i: widget.i,
                                x: widget.x,
                                y: widget.y,
                                w: widget.w,
                                h: widget.h,
                            }}
                        >
                            <Widget
                                widget={widget}
                                onRemove={removeWidgetById}
                                onRename={renameWidget}
                                // 5) Pass down a callback so the widget can tell us to open its popup
                                onOpenPopup={openPopupForWidget}
                            />
                        </div>
                    ))}
                </GridLayout>
            )}
        </div>
    );
};

export default DataDashboard;
