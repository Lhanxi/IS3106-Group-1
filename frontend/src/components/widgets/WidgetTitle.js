import React from "react";

const WidgetTitle = ({ isRenaming, newName, setNewName, handleRenameConfirm, setIsRenaming, widget }) => {
    return (
        <div>
            {isRenaming ? (
                <div>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        style={{ padding: "5px", width: "80%" }}
                    />
                    <button onMouseDown={(e) => {
                        e.stopPropagation()
                    }}
                        onTouchStart={(e) => {
                            e.stopPropagation()
                        }}
                        onClick={handleRenameConfirm} disabled={newName.trim() === ""}>
                        Confirm
                    </button>
                    <button
                        onClick={() => setIsRenaming(false)}
                        onMouseDown={(e) => {
                            e.stopPropagation()
                        }}
                        onTouchStart={(e) => {
                            e.stopPropagation()
                        }}>Cancel</button>
                </div>
            ) : (
                <h4
                    onClick={() => setIsRenaming(true)}
                    onMouseDown={(e) => {
                        e.stopPropagation()
                    }}
                    onTouchStart={(e) => {
                        e.stopPropagation()
                    }}
                    style={{
                        textAlign: "center",
                        marginBottom: "5px",
                        cursor: "pointer",
                        border: "1px solid transparent",
                    }}
                >
                    {widget.title}
                </h4>
            )}
        </div>
    );
};

export default WidgetTitle;