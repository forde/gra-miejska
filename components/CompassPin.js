import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

export default props => {
    const { color, rotation, outline } = props;
    const styles = pinStyles({color, rotation, outline });
    return(
        <View style={ styles.pin }>
            <View style={props.outline ? styles.pinHeadOutline : styles.pinHead} >
                {props.label && <Text style={styles.label}>{props.label}</Text>}
            </View>
        </View>
    );
}

const pinStyles = ({color, rotation, outline }) => {
    return StyleSheet.create({
        pin: {
            width: 1,
            height: 300,
            position: 'absolute',
            top: '50%',
            left: '50%',
            //borderWidth: 1,
            //borderColor: color,
            backgroundColor: color,
            transform: [
                //{ translateX: -10 },
                { translateY: -150 },
                { rotate: rotation }
            ]
        },
        pinHead: {
            position: 'absolute',
            width:20,
            height:20,
            top:-10,
            left: -10,
            backgroundColor: color,
            borderWidth: 2,
            borderColor: color,
            borderRadius: 10,
        },
        pinHeadOutline: {
            position: 'absolute',
            width:30,
            height:30,
            top:-15,
            left: -15,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: color,
            borderRadius: 15,
            backgroundColor: 'white',
        },
        label: {
            color: color,
            position: 'absolute',
            top: -20,
            left: 0,
            width: 100,
            textAlign: 'center',
            transform: [
                { translateX: -50+7.5 },
            ]
        }
    })
}