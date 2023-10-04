"use client"

import React, { useState, FocusEvent, useRef } from 'react';
import { Input, InputProps, Listbox, ListboxItem } from '@nextui-org/react';
import { IItemAutocomplete } from '@/interfaces/types';

interface IAutocompleteFieldProps extends InputProps {
	suggestions: IItemAutocomplete[]
	onSuggestionSelected: (key: React.Key) => void
  children?: React.ReactNode
}

const AutocompleteField: React.FC<IAutocompleteFieldProps> = ({
  suggestions,
  onSuggestionSelected,
  children,
  ...opts
}) => {

	const [isOpen, setIsOpen] = useState(false);

	const ref = useRef<HTMLElement>(null);
	const onBlur = (e: FocusEvent) => {
		if (ref?.current?.contains(e.relatedTarget)) {
			return;
		}
		setIsOpen(false);
	};

	return (
		<div>
			<Input 
        {...opts}
				onFocus={() => setIsOpen(true)}
				onBlur={onBlur}
			/>
			{isOpen && (
				
				<Listbox
					ref={ref}
					className={`rounded rounded-xl shadow-xl mt-1 border-1 max-h-48 overflow-auto`}
					onAction={(key) => {
						onSuggestionSelected(key);
						setIsOpen(false);
					}}
				>
					{suggestions.map((suggestion, i) => {
						return (
							<ListboxItem key={suggestion.key}>
								{ suggestion.description }
							</ListboxItem>
						);
					})}
				</Listbox>
			)}
		</div>
	);
}

export default AutocompleteField;
