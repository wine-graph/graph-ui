import {forwardRef, type InputHTMLAttributes} from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement>;

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({className = "", ...props}, ref) => {
    return <input {...props} ref={ref} className={`input-field ${className}`.trim()} />;
  }
);

InputField.displayName = "InputField";

export default InputField;
