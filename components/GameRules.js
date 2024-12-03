import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const GameRules = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Treffipelin Säännöt</Text>

            <Text style={styles.subtitle}>Yleiset Säännöt:</Text>
            <Text style={styles.rule}>1. Jokainen pelaaja luo profiilikortin valitsemalla kuusi ominaisuutta treffikumppanilleen.</Text>
            <Text style={styles.rule}>2. Kortit sekoitetaan ja jaetaan satunnaisesti.</Text>
            <Text style={styles.rule}>3. Kierroksen aikana yksi pelaaja kerrallaan saa oman treffikorttinsa ja päättää, haluaako jatkaa seuraaville treffeille.</Text>

            <Text style={styles.subtitle}>Juomapelin Säännöt:</Text>
            <Text style={styles.rule}>1. Jos päätät jatkaa treffeille, juo 1 hörppy.</Text>
            <Text style={styles.rule}>2. Jos et halua jatkaa, kaikki muut pelaajat juovat 2 hörppyä.</Text>
            <Text style={styles.rule}>3. Erikoistilanteet ja juomasäännöt voivat vaihdella kierroksittain!</Text>

            <Text style={styles.subtitle}>Pelin Aloittaminen:</Text>
            <Text style={styles.rule}>1. Isäntä luo peliaulan ja jakaa pinkoodin muille pelaajille.</Text>
            <Text style={styles.rule}>2. Kaikki liittyvät peliaulaan syöttämällä pinkoodin.</Text>
            <Text style={styles.rule}>3. Kun kaikki ovat valmiita, isäntä aloittaa pelin.</Text>

            <Text style={styles.footer}>Nauti pelistä ja muista pitää hauskaa vastuullisesti!</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#555',
    },
    rule: {
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 24,
        color: '#666',
    },
    footer: {
        fontSize: 14,
        marginTop: 20,
        textAlign: 'center',
        color: '#888',
    },
});

export default GameRules;
