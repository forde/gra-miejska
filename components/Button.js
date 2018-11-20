import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';

export default props => {
    return(
        <TouchableOpacity onPress={props.onPress} style={[styles.button, props.style]}>
            <Text style={styles.buttonText}>{props.children}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderWidth:1,
        borderColor: Colors.tintColor,
        borderStyle: 'solid',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    buttonText: {
        color: Colors.tintColor,
        fontSize:15, 
    }
});