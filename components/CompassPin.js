import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

export default props => {
    const { color, rotation, outline, noArm, noDot } = props;
    const styles = pinStyles({color, rotation, noArm, noDot });
    return(
        <View style={ styles.pin }>
            <View style={outline ? styles.pinHeadOutline : styles.pinHead} >
                {props.label && <Text style={styles.label}>{props.label}</Text>}
            </View>
        </View>
    );
}

const pinStyles = ({color, rotation, noArm, noDot }) => {
    return StyleSheet.create({
        pin: {
            width: 1,
            height: 300,
            position: 'absolute',
            top: '50%',
            left: '50%',
            //borderWidth: 1,
            //borderColor: color,
            backgroundColor: noArm ? 'transparent' : color,
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
            backgroundColor: !noDot ? color : 'transparent',
            borderWidth: !noDot ? 2 : 0,
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
            borderWidth: 1,
            borderColor: color,
            borderRadius: 15,
            backgroundColor: '#F9F5ED',
        },
        label: {
            color: color,
            position: 'absolute',
            top: !noDot ? -24 : 0,
            fontSize: !noDot ? 15 : 18,
            fontWeight: !noDot ? 'normal' : 'bold',
            left: 0,
            width: 100,
            textAlign: 'center',
            transform: [
                { translateX: -50+7.5 },
            ]
        }
    })
}