import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Icon } from 'expo';

import Colors from '../constants/Colors';

export default class Popup extends React.Component {

    constructor() {
        super();

        this.state = {
            
        };
    }

    render() {
        const { visible, onCloseRequest, title, children } = this.props;
    
        return (
            <Modal animationType="fade" visible={visible} transparent={true} >
                <View style={styles.background}>
                    <View style={styles.popup}>

                        <TouchableOpacity onPress={() => onCloseRequest()} style={styles.close}>
                            <Icon.Ionicons name="ios-close" size={28} color={Colors.tintColor} />
                        </TouchableOpacity>

                        {title && <Text style={styles.title}>{title}</Text>}

                        <ScrollView contentContainerStyle={styles.childrenWrapper}>
                            {children}
                        </ScrollView>

                    </View>
                </View>
            </Modal>
        );

    }
}

const styles = StyleSheet.create({
    background: {
        backgroundColor:'rgba(0,0,0,.7)', 
        flex:1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    popup: {
        backgroundColor:'#fff', 
        width: '80%', 
        height: '80%', 
        maxHeight: 400, 
        padding: 25, 
        paddingTop: 15,
        borderRadius: 5,
    },
    close: {
        position: 'absolute',
        top:8,
        right:18,
    },
    title: {
        fontSize:20,
        textAlign:'center',
        fontWeight: 'bold',
        paddingLeft: 30,
        paddingRight: 30,
        marginBottom: 10,
    },
    childrenWrapper: {
        flex:1, 
        justifyContent: 'center', 
        alignItems: 'center',
    }
});
