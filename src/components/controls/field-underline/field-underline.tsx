import './field-underline.scss';

interface Props<T> {
	value: T;
	label?: string;
	className?: string;
}

export const FieldUnderline = <T extends string | number | undefined,>({ value, label, className }: Props<T>) => {
	return (
		<div className={[className, 'field-underline'].filter(cn => cn).join(' ')}>
			<span>{ value }</span>
			<label>{ label }</label>
		</div>
	);
};
