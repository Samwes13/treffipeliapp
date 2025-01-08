import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const GameRules = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Treffipelin Säännöt</Text>

            <Text style={styles.subtitle}>Pelin Aloittaminen:</Text>
            <Text style={styles.rule}>1. Jokainen pelaaja kirjoittaa kolme hyvää ja kolme huonoa piirrettä fiktiivisestä treffikumppanista.</Text>
            <Text style={styles.rule}>2. Pelin voi aloittaa vasta, kun kaikki pelaajat ovat kirjoittaneet kaikki piirteet.</Text>
            <Text style={styles.rule}>3. Pelin luonut pelaaja (isäntä) pystyy ainoastaan aloittamaan pelin.</Text>

            <Text style={styles.subtitle}>Pelin Kulku:</Text>
            <Text style={styles.rule}>1. Pelissä on 6 kierrosta.</Text>
            <Text style={styles.rule}>2. Jokaisella kierroksella peli antaa yhden piirteen jokaiselle pelaajalle vuoron perään.</Text>
            <Text style={styles.rule}>3. Pelaaja päättää, haluaako jatkaa treffeille vastaamalla "Yes" tai erota vastaamalla "No".</Text>

            <Text style={styles.subtitle}>Juomapelin Säännöt:</Text>
            <Text style={styles.rule}>1. Jokaisen pelaajan 1., 3., 5. ja 6. treffeille nostetaan malja ja onnitellaan sanomalla esimerkiksi "Ensimmäisille treffeille!" ja otetaan huikka omasta juomasta.</Text>
            <Text style={styles.rule}>2. Piirteen nostanut pelaaja onnittelee myös itseään ja juo huikan.</Text>
            <Text style={styles.rule}>3. Jos pelaaja päättää erota treffikumppanista, nostetaan malja eroille ja otetaan huikka. Seuraavalla kierroksella pelaaja pääsee uusille treffeille.</Text>

            <Text style={styles.subtitle}>Juomismäärät:</Text>
            <Text style={styles.rule}>Ensimmäiset treffit = 1 huikka jokainen</Text>
            <Text style={styles.rule}>Kolmannet treffit = 1 huikka jokainen</Text>
            <Text style={styles.rule}>Viidennet treffit = 1 huikka jokainen</Text>
            <Text style={styles.rule}>Kuudennet treffit = 1 huikka jokainen</Text>
            <Text style={styles.rule}>Erotilanne = 1 huikka jokainen</Text>

            <Text style={styles.footer}>Nauti pelistä ja muista pelata vastuullisesti!</Text>
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
