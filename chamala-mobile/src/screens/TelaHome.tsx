import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { SearchInput, Button, Chip, ProfessionalCard } from '../components';

interface TelaHomeProps {
  onNavigateToNewOrder: () => void;
}

export const TelaHome = ({ onNavigateToNewOrder }: TelaHomeProps) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'eletrica', label: 'Elétrica' },
    { id: 'hidraulica', label: 'Hidráulica' },
    { id: 'pintura', label: 'Pintura' },
  ];

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        <View style={globalStyles.headerLeftBlock}>
          <Text style={globalStyles.titleLeft}>Olá, Cliente 👋</Text>
          <Text style={globalStyles.subtitleLeft}>O que você precisa consertar ou instalar hoje?</Text>
        </View>

        <View style={globalStyles.cardBox}>
          <Text style={globalStyles.sectionTitle}>Precisa de um serviço agendado?</Text>
          <Text style={globalStyles.subtitleLeft}>
            Marque sua localização no mapa e defina o dia ideal para a visita.
          </Text>
          <View style={{ marginTop: 12 }}>
            <Button title="Criar Novo Pedido de Serviço" onPress={onNavigateToNewOrder} />
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <SearchInput
            placeholder="Buscar serviços ou categorias..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, marginBottom: 16 }}
        >
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.label}
              selected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id)}
            />
          ))}
        </ScrollView>

        <View style={globalStyles.sectionHeader}>
          <Text style={globalStyles.sectionTitle}>Profissionais em Destaque</Text>
          <Text style={globalStyles.sectionLink}>Ver todos</Text>
        </View>

        <View style={globalStyles.formSection}>
          <ProfessionalCard
            name="Carlos Eletricista"
            profession="Instalações Elétricas"
            avatarEmoji="⚡"
            rating={4.9}
            reviewsCount={38}
            location="Centro (1.8 km)"
            priceLabel="R$ 90/h"
            verified={true}
            onPress={() => {}}
          />
          <ProfessionalCard
            name="Mariana Encanadora"
            profession="Hidráulica e Desentupimento"
            avatarEmoji="🔧"
            rating={5.0}
            reviewsCount={62}
            location="Jardim Paulista (2.4 km)"
            priceLabel="R$ 110/h"
            verified={true}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </View>
  );
};