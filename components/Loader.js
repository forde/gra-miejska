import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default props => {
    return(
        <View>
            <ActivityIndicator size="large" style={{marginBottom:10}} />
            {props.description && <Text>{props.description}</Text>}
        </View>
    );
}