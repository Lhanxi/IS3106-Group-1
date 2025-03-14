import React, { useState } from "react";
import PieChartWidget from "./PieChartWidget";
import LineChartWidget from "./LineChartWidget";
import BarChartWidget from "./BarChartWidget";
import WidgetMenuButton from "./WidgetMenuButton";
import WidgetTitle from "./WidgetTitle";
import WidgetMenu from "./WidgetMenu";

const Widget = ({ widget, onRemove, onRename, onOpenPopup }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(widget.title);

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

    const handleRenameConfirm = () => {
        if (newName.trim() === "") return;
        onRename(widget.i, newName);
        setIsRenaming(false);
    };

    return (
        <div
            style={{
                background: "#fff",
                padding: "10px",
                position: "relative",
                width: "100%",
                height: "100%"
            }}
        >
            <WidgetMenuButton
                menuVisible={menuVisible}
                setMenuVisible={setMenuVisible}
            />

            <WidgetMenu
                menuVisible={menuVisible}
                widget={widget}
                onRemove={onRemove}
                setIsRenaming={setIsRenaming}
                setMenuVisible={setMenuVisible}
                onOpenPopup={onOpenPopup}
            />

            <WidgetTitle
                isRenaming={isRenaming}
                newName={newName}
                setNewName={setNewName}
                handleRenameConfirm={handleRenameConfirm}
                setIsRenaming={setIsRenaming}
                widget={widget}
            />

            <div style={{ width: "100%", height: "calc(100% - 60px)", marginTop: "10px" }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default Widget;
