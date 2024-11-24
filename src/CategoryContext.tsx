import React, { createContext, useState, useContext } from "react";

interface CategoryContextType {
    selectedValues: any[];
    setSelectedValues: React.Dispatch<React.SetStateAction<any[]>>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedValues, setSelectedValues] = useState<any[]>([]);

    return (
        <CategoryContext.Provider value={{ selectedValues, setSelectedValues }}>
            {children}
        </CategoryContext.Provider>
    );
};

// Хук для использования контекста
export const useCategoryContext = (): CategoryContextType => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategoryContext must be used within a CategoryProvider");
    }
    return context;
};
