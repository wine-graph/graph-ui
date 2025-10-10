import React, {type ReactNode} from "react";

const CrumbButton: React.FC<{ onClick?: () => void; active?: boolean; children: ReactNode }>
    = ({onClick, active, children}) => (
    <button
        type="button"
        onClick={onClick}
        className={`text-sm sm:text-base ${active ? "text-gray-900 font-semibold" : "text-gray-600 hover:text-gray-900"}`}
    >
        {children}
    </button>
);

export default CrumbButton;