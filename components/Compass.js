import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Permissions, Icon } from 'expo';
import geolib from 'geolib';

import CompassPin from './CompassPin';
import { finalBearing } from '../constants/helpers';

export default class Compass extends React.Component {

    constructor() {
        super();
        this.state = {
            heading: null,
            northRotationAngle: 0,
        };
    }
    
    componentDidMount() {
        this._getLocationAsync();
    };

    _getLocationAsync = async () => {
        // ask for location permissions if needed
        await Permissions.askAsync(Permissions.LOCATION);

        // on device "heading" rotation change
        Expo.Location.watchHeadingAsync((obj) => {
            this.setState({ heading: obj.magHeading }, () => {
                this._calculateNortRotationAngle();
            })
        })
    }

    _calculateNortRotationAngle() {
        const { northRotationAngle, heading } = this.state;
        let start = JSON.stringify(northRotationAngle);
        let headingVal = Math.round(heading);
        let rot = +start;
        let rotM = rot % 360;
        rot += (headingVal - rotM);

        this.setState({ northRotationAngle: 360 - rot });
        this.props.onCompassNorthChange(360 - rot);
    }

    render() {   
        const { posLat, posLng, markerLat, markerLng, mapRotation } = this.props;
        const { northRotationAngle } = this.state;

        const devideHeadToMarkerAngle = Math.round(finalBearing(posLat, posLng, markerLat, markerLng));

        const deviceHeadToMapNorthAngle = Math.round(finalBearing(posLat, posLng, 90, 0)); // map north

        const distanceToMarker = geolib.getDistanceSimple(
            {latitude: posLat, longitude: posLng},
            {latitude: markerLat, longitude: markerLng},
        );

        return (
            <View style={styles.wrapper}>
                <View style={styles.compassWrapper}>

                    <CompassPin name="devide head" color="red" rotation="0deg" outline />
                    <CompassPin name="north" color="blue" rotation={northRotationAngle+'deg'} label="N" />
                    <CompassPin name="marker direction" color="green" rotation={(devideHeadToMarkerAngle + mapRotation) + 'deg'} label={'Marker '+distanceToMarker+' m'} />
                    <CompassPin name="north pole" color="aqua" rotation={(deviceHeadToMapNorthAngle + mapRotation) + 'deg'} label="N" />    

                    <View style={styles.userLocation}>
                        <Icon.Ionicons
                            name="ios-body"
                            size={22}
                            color={'blue'}
                        />
                    </View>

                </View>

                <View style={styles.debugWrapper} >
                    <Text style={{color:'blue'}}>Devide north pin rotation angle: {northRotationAngle}°</Text>
                    <Text style={{color:'green'}}>Anggle from device head to marker: {devideHeadToMarkerAngle - mapRotation}°</Text>
                    <Text style={{color:'red'}}>Distance to marker: {distanceToMarker}m</Text>
                    <Text >Anggle from device head to map north (north pole): {deviceHeadToMapNorthAngle}°</Text>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    compassWrapper: {
        width: 300,
        height: 300,
        position: 'absolute',
        top: '50%',
        left: '50%',
        borderWidth: 1,
        borderColor: 'red',
        borderStyle: 'dashed',
        borderRadius: 150,
        transform: [
            { translateX: -150 },
            { translateY: -150 }
        ]
    },
    debugWrapper: {
        position: 'absolute',
        bottom:20,
        left: 20,
    },
    userLocation: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: '50%',
        left: '50%',
        borderWidth: 2,
        borderColor: 'red',
        borderStyle: 'solid',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        transform: [
            { translateX: -15 },
            { translateY: -15 }
        ]
    }
});