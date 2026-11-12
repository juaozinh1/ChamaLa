import { forwardRef } from 'react';
import { TextInputProps } from 'react-native';
import { Input, TextInputRef } from './Input';

// Campo de busca com lupa. Ex.: <SearchInput placeholder="Buscar categoria..." value={q} onChangeText={setQ} />
export const SearchInput = forwardRef<TextInputRef, TextInputProps>(function SearchInput(
  props,
  ref,
) {
  return (
    <Input
      ref={ref}
      leftIcon="search-outline"
      returnKeyType="search"
      accessibilityLabel="Buscar"
      containerStyle={{ marginBottom: 0 }}
      {...props}
    />
  );
});
