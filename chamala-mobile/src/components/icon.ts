import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

/** Nome válido de ícone do Ionicons (checado pelo TypeScript). */
export type IoniconName = ComponentProps<typeof Ionicons>['name'];
