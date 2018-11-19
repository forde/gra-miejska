import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SegmentedControlIOS } from 'react-native';
import { MapView, Location, Permissions } from 'expo';

import Compass from '../components/Compass';
import { finalBearing } from '../constants/helpers';

export default class MapScreen extends React.Component {

    static navigationOptions = {
        title: 'Mapa',
    };

    constructor() {
        super();

        this.state = {
            location: null,
            selectedMarker: 1,
            markers: [
                {
                    latitude: 51.202791, 
                    longitude: 16.168848,
                },
                {
                    latitude: 51.208703,  
                    longitude: 16.165254,
                },
                {
                    latitude: 51.209255,  
                    longitude: 16.164590,
                }
            ],
            mapRotation: 0,
        };
    }

    componentDidMount() {
        this._getLocationAsync();
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        Location.watchPositionAsync({ 
            enableHighAccuracy: true,
            distanceInterval: .2, // in meters
        }, location => {
            this.setState({ location });
        });
    }

    _onCompassNorthChange(compassNortDeg) {
        const northPole = Math.round(finalBearing(this.state.location.coords.latitude, this.state.location.coords.longitude, 90, 0));
        const rot = compassNortDeg - northPole + northPole;
        this.setState({ mapRotation: rot })
        //console.log('map rotation: ', rot);
    }

    render() {
        const { location, selectedMarker, markers, mapRotation } = this.state;

        const marker = markers[selectedMarker];
    
        return (
            <View style={styles.wrapper}>

                {!location &&
                    <View>
                        <ActivityIndicator size="large" style={{marginBottom:10}} />
                        <Text>Ustalanie lokalizacji</Text>
                    </View>
                }

                {location &&
                    <React.Fragment>
                        <MapView
                            style={{ 
                                height: 650, 
                                width: 650,  
                                transform: [ {rotate: mapRotation + 'deg'} ] 
                            }}
                            region={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                latitudeDelta: 0.001,
                                longitudeDelta: 0.001
                            }}
                        >
                            {/* user location 
                            <MapView.Marker coordinate={location.coords} />*/}
                                
                            {marker && <MapView.Marker coordinate={marker} /> }

                        </MapView>
                            
                        {marker &&
                            <Compass 
                                posLat={location.coords.latitude}
                                posLng={location.coords.longitude}
                                markerLat={marker.latitude}
                                markerLng={marker.longitude}
                                onCompassNorthChange={this._onCompassNorthChange.bind(this)}
                                mapRotation={mapRotation}
                            />
                        }

                        <SegmentedControlIOS
                            style={{position:'absolute', top:20, left: 35, width:300 }}
                            values={['SkatePark', 'Mieszkanie', 'Galeria']}
                            selectedIndex={selectedMarker}
                            onChange={(event) => {
                                this.setState({selectedMarker: event.nativeEvent.selectedSegmentIndex});
                            }}
                        />

                    </React.Fragment>
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
});
