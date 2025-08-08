import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface AutocompleteSelectProps {
  label: string;
  icon?: React.ReactNode;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
  label,
  icon,
  options,
  value,
  onChange,
  placeholder = "Digite para buscar...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const selectedOption = options.find((option) => option.value === value);
    setDisplayValue(selectedOption ? selectedOption.label : value);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setDisplayValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleOptionSelect = (option: Option) => {
    onChange(option.value);
    setDisplayValue(option.label);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setDisplayValue("");
    setSearchTerm("");
    inputRef.current?.focus();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchTerm : displayValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 pr-20 font-medium"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {displayValue && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              type="button"
            >
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              <>
                {searchTerm && (
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Search className="w-4 h-4" />
                      {`Buscando por: "${searchTerm}"`}
                    </div>
                  </div>
                )}
                {filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full text-left p-3 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    {option.label}
                  </button>
                ))}
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Nenhum resultado encontrado</p>
                {searchTerm && (
                  <p className="text-sm mt-1">{`para "${searchTerm}"`}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
