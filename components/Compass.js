import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Permissions, Icon } from 'expo';
import geolib from 'geolib';

import CompassPin from './CompassPin';
import Colors from '../constants/Colors';
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
        const { posLat, posLng } = this.props;
        let start = JSON.stringify(northRotationAngle);
        let headingVal = Math.round(heading);
        let rot = +start;
        let rotM = rot % 360;
        rot += (headingVal - rotM);

        this.setState({ northRotationAngle: 360 - rot });

        // emit map rotation angle
        {
            const northPole = Math.round(finalBearing(posLat, posLng, 90, 0));
            const mapRotation = (360 - rot) - northPole + northPole;
            this.props.setMapRotation(mapRotation);
        }
    }

    render() {   
        const { posLat, posLng, markerLat, markerLng, mapRotation } = this.props;
        const { northRotationAngle } = this.state;

        const devideHeadToMarkerAngle = Math.round(finalBearing(posLat, posLng, markerLat, markerLng)) + mapRotation;

        //const deviceHeadToMapNorthAngle = Math.round(finalBearing(posLat, posLng, 90, 0)); // map north

        const distanceToMarker = geolib.getDistanceSimple(
            {latitude: posLat, longitude: posLng},
            {latitude: markerLat, longitude: markerLng},
        );

        const onCourse = (devideHeadToMarkerAngle - 360) >= -8 && (devideHeadToMarkerAngle - 360) <= 8;

        return (
            <View style={styles.wrapper}>
                <View style={styles.compassWrapper}>

                    <CompassPin name="devide head" color={onCourse ? Colors.red : Colors.tintColor} rotation="0deg" outline />
                    <CompassPin name="north" color={Colors.tintColor} rotation={northRotationAngle+'deg'} label="N" noArm noDot />
                    <CompassPin name="marker direction" color={Colors.red} rotation={devideHeadToMarkerAngle + 'deg'} noArm label={''+distanceToMarker+' m'} />
                    {/*<CompassPin name="north pole" color="aqua" rotation={(deviceHeadToMapNorthAngle + mapRotation) + 'deg'} noArm noDot label="N" /> */}   

                    <View style={[styles.userLocation, { borderColor: onCourse ? Colors.red : Colors.tintColor } ]} animation="rotate" iterationCount="infinite" duration={800}>
                        <Icon.Ionicons
                            name="ios-body"
                            size={22}
                            color={onCourse ? Colors.red : Colors.tintColor}
                        />
                    </View>

                </View>

                {/*<View style={styles.debugWrapper} >
                    <Text style={{color:'blue'}}>Devide north pin rotation angle: {northRotationAngle}°</Text>
                    <Text style={{color:'green'}}>Anggle from device head to marker: {devideHeadToMarkerAngle}°</Text>
                    <Text style={{color:'red'}}>Distance to marker: {distanceToMarker}m</Text>
                    <Text >Anggle from device head to map north (north pole): {devideHeadToMarkerAngle - 360}°</Text>
                </View>*/}

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
        borderColor: 'rgba(0, 122, 255, 0.3)',
        borderStyle: 'solid',
        borderRadius: 150,
        backgroundColor: 'rgba(0, 122, 255, 0.05)',
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
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F5ED',
        transform: [
            { translateX: -15 },
            { translateY: -15 }
        ]
    }
});