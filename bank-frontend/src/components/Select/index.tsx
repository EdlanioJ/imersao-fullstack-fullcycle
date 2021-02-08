import slug from 'slug';
import { forwardRef } from 'react';

interface SelectProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  labelText?: string;
}

const Select = forwardRef<any, SelectProps>(({ labelText, ...rest }, ref) => {
  const id = rest.id ?? rest.name ?? slug(labelText ?? '');
  return (
    <div className="form-group">
      {labelText && <label htmlFor={id}>{labelText}</label>}
      <select id={id} className="form-control" ref={ref} {...rest} />
    </div>
  );
});

export default Select;
