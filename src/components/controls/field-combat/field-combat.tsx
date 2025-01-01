import './field-combat.scss';

interface Props<T> {
	value: T;
	label?: string;
	className?: string;
}

export const FieldCombat = <T extends string | number | undefined,>({ value, label, className }: Props<T>) => {
	return (
		<div className={[className, 'field-combat'].filter(cn => cn).join(' ')}>
			<label>{ label }</label>
			<span>{ value }</span>
		</div>
	);
};
