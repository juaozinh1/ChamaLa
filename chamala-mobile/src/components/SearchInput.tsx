import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { Input } from './Input';

// Campo de busca com lupa. Ex.: <SearchInput placeholder="Buscar categoria..." value={q} onChangeText={setQ} />
export const SearchInput = forwardRef<TextInput, TextInputProps>(function SearchInput(
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
