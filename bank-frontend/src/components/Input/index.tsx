import { forwardRef } from 'react';
import slug from 'slug';

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  labelText?: string;
}

const formGroupStyles = {
  text: 'form-group',
  number: 'form-group',
  radio: 'form-check',
};

const inputStyles = {
  text: 'form-control',
  number: 'form-control',
  radio: 'form-check-input',
};

const labelStyles = {
  text: '',
  number: '',
  radio: 'form-check-label',
};
const Input = forwardRef<any, InputProps>(
  ({ labelText, type = 'text', ...rest }, ref) => {
    const id = rest.id ?? rest.name ?? slug(labelText ?? '');
    const Label = labelText && (
      <label className={labelStyles[type]} htmlFor={id}>
        {labelText}
      </label>
    );

    const CustomInput = (
      <input
        id={id}
        className={inputStyles[type]}
        type={type}
        {...rest}
        ref={ref}
      />
    );
    return (
      <div className={formGroupStyles[type]}>
        {type === 'radio' && (
          <>
            {CustomInput}
            {Label}
          </>
        )}
        {(type === 'text' || type === 'number') && (
          <>
            {Label}
            {CustomInput}
          </>
        )}
      </div>
    );
  }
);

export default Input;
