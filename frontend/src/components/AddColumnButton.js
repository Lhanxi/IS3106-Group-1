import { useState } from "react";
import CreateColumn from "./CreateColumn";

const AddColumnButton = ({ projectId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
        Add Column
      </button>
      {/* Pass projectId to CreateColumn */}
      <CreateColumn open={isOpen} onClose={() => setIsOpen(false)} projectId={projectId} />
    </div>
  );
};

export default AddColumnButton;
