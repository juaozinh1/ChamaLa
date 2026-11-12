import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Input, InputProps } from './Input';
import { Select, SelectOption } from './Select';
import { TextArea } from './TextArea';
import type { TextInputProps } from 'react-native';

// Ligações entre os componentes e o react-hook-form, para as telas não repetirem <Controller>.

type FormInputProps<T extends FieldValues> = Omit<InputProps, 'value' | 'onChangeText' | 'error'> & {
  control: Control<T>;
  name: Path<T>;
  /** Aplica uma máscara enquanto digita (ex.: maskPhone). */
  mask?: (text: string) => string;
};

export function FormInput<T extends FieldValues>({ control, name, mask, ...rest }: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
        <Input
          ref={ref}
          value={(value as string | undefined) ?? ''}
          onChangeText={(text) => onChange(mask ? mask(text) : text)}
          onBlur={onBlur}
          error={error?.message}
          {...rest}
        />
      )}
    />
  );
}

type FormSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
};

export function FormSelect<T extends FieldValues>({ control, name, ...rest }: FormSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Select value={(value as string | undefined) || undefined} onChange={onChange} error={error?.message} {...rest} />
      )}
    />
  );
}

type FormTextAreaProps<T extends FieldValues> = Omit<TextInputProps, 'value' | 'onChangeText' | 'multiline'> & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  maxLength?: number;
  minHeight?: number;
};

export function FormTextArea<T extends FieldValues>({ control, name, ...rest }: FormTextAreaProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <TextArea
          value={(value as string | undefined) ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...rest}
        />
      )}
    />
  );
}
