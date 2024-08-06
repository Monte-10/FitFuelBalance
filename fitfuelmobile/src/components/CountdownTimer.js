import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const CountdownTimer = ({ initialTime, onEnd, prepareTime = 5 }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPreparing, setIsPreparing] = useState(prepareTime > 0);
  const [prepareTimeLeft, setPrepareTimeLeft] = useState(prepareTime);

  useEffect(() => {
    let timer;
    if (isPreparing) {
      // Iniciar periodo de preparación
      timer = setInterval(() => {
        setPrepareTimeLeft((prev) => {
          if (prev - 1 === 0) {
            clearInterval(timer);
            setIsPreparing(false);
            setTimeLeft(initialTime); // Resetear al tiempo inicial para el ejercicio
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft > 0) {
      // Iniciar contador regresivo
      timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t - 1 === 0) {
            clearInterval(timer);
            if (onEnd) onEnd(); // Llamar a onEnd cuando el tiempo llegue a 0
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, isPreparing, initialTime, prepareTime, onEnd]);

  return (
    <View style={styles.container}>
      {isPreparing ? (
        <Text style={styles.text}>Prepárate... {prepareTimeLeft}</Text>
      ) : (
        <Text style={styles.text}>Tiempo restante: {timeLeft}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333', // Fondo oscuro
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  text: {
    color: '#f0f0f0', // Texto claro
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CountdownTimer;
