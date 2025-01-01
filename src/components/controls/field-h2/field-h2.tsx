import './field-h2.scss';

interface Props<T> {
	value: T;
	label?: string;
	className?: string;
}

export const FieldH2 = <T extends string | number,>({ value, label, className }: Props<T>) => {
	return (
		<div className={[className, 'field-h2'].filter(cn => cn).join(' ')}>
			<label>{ label }</label>
			<span>{ value }</span>
		</div>
	);
};
