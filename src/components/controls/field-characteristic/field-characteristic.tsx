import './field-characteristic.scss';

interface Props<T> {
	value: T;
	label?: string;
	className?: string;
}

export const FieldCharacteristic = <T extends string | number | undefined,>({ value, label, className }: Props<T>) => {
	return (
		<div className={[className, 'field-characteristic'].filter(cn => cn).join(' ')}>
			<label>{ label }</label>
			<span>{ value }</span>
		</div>
	);
};
