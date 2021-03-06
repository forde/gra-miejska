import React from 'react';
import { View, Text, StyleSheet, SegmentedControlIOS, TouchableOpacity } from 'react-native';
import { MapView, Location, Permissions } from 'expo';
import * as firebase from 'firebase';

import Compass from '../components/Compass';
import Loader from '../components/Loader';
import Popup from '../components/Popup';
import Button from '../components/Button';

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
            popupVisible: false,
        };
    }

    componentDidMount() {
        this._getLocationAsync();
        this._getGame();
    }

    _getLocationAsync = async () => {
        await Permissions.askAsync(Permissions.LOCATION);
        Location.watchPositionAsync({ 
            enableHighAccuracy: true,
            distanceInterval: .2, // in meters
        }, location => {
            this.setState({ location });
        });
    }

    _mapStyles() {
        return { height: 650, width: 650, transform: [ {rotate: this.state.mapRotation + 'deg'} ] }
    }

    _mapRegion() {
        return {
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001
        }
    }

    _getGame() {
        firebase.database().ref('/games').once('value').then(snapshot => {
            console.log(snapshot);
        });
    }

    render() {
        const { location, selectedMarker, markers, mapRotation, popupVisible } = this.state;

        const marker = markers[selectedMarker];
    
        return (
            <View style={styles.wrapper}>

                {!location && <Loader description="Ustalanie lokalizacji" />}

                {location &&
                    <React.Fragment>

                        <MapView style={this._mapStyles()} region={this._mapRegion()} >
                            {marker && <MapView.Marker coordinate={marker} /> }
                        </MapView>
                            
                        {marker &&
                            <Compass 
                                posLat={location.coords.latitude}
                                posLng={location.coords.longitude}
                                markerLat={marker.latitude}
                                markerLng={marker.longitude}
                                mapRotation={mapRotation}
                                setMapRotation={mapRotation => this.setState({ mapRotation })}
                            />
                        }

                        <Popup visible={popupVisible} title="Gratulacje!" onCloseRequest={() => this.setState({ popupVisible: false }) } >
                            <Text>Odblokowałeś kolejny marker!</Text>
                        </Popup>

                    </React.Fragment>
                }

                <Button onPress={() => this.setState({ popupVisible: true })} style={{position:'absolute', bottom:20, right: 20 }}>Popup</Button>

                <SegmentedControlIOS
                    style={{position:'absolute', top:20, left: 35, width:300 }}
                    values={['SkatePark', 'Mieszkanie', 'Galeria']}
                    selectedIndex={selectedMarker}
                    onChange={(event) => {
                        this.setState({selectedMarker: event.nativeEvent.selectedSegmentIndex});
                    }}
                />

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
